import { SIGN_VOCABULARY } from "@/config/signVocabulary";
import { Prediction } from "@/types";
import { FEATURES_PER_FRAME } from "@/vision/landmarkProcessor";

export class GeometricSignClassifier {
  /**
   * Analyzes 30-frame temporal buffer [30 * 147] to detect physical ISL gestures
   * using scale- and rotation-invariant 3D Euclidean distance ratios.
   */
  public static classify(sequence: Float32Array): Prediction {
    const totalFrames = 30;
    const featuresPerFrame = FEATURES_PER_FRAME;

    if (sequence.length < featuresPerFrame) {
      return {
        label: "SEARCHING",
        confidence: 0.1,
        timestamp: Date.now(),
        debugInfo: "Buffering frames...",
      };
    }

    // Extract latest frame features (frame 29)
    const latestFrameOffset = (totalFrames - 1) * featuresPerFrame;
    const latestFrame = sequence.subarray(
      latestFrameOffset,
      latestFrameOffset + featuresPerFrame
    );

    // Left hand: [0..62], Right hand: [63..125], Pose: [126..146]
    const leftHand = latestFrame.subarray(0, 63);
    const rightHand = latestFrame.subarray(63, 126);
    const pose = latestFrame.subarray(126, 147);

    // Detect if hands are active (non-zero landmark magnitudes)
    const leftActive = this.getHandEnergy(leftHand) > 0.05;
    const rightActive = this.getHandEnergy(rightHand) > 0.05;

    if (!leftActive && !rightActive) {
      return {
        label: "NO HANDS DETECTED",
        confidence: 0,
        timestamp: Date.now(),
        debugInfo: "Hold hands in camera view",
      };
    }

    const primaryHand = rightActive ? rightHand : leftHand;
    const secondaryHand = rightActive ? leftHand : rightHand;
    const isTwoHanded = leftActive && rightActive;

    // Check finger states using rotation- and scale-invariant 3D Euclidean ratios:
    // Landmarks: 0: Wrist, 4: ThumbTip, 8: IndexTip, 12: MiddleTip, 16: RingTip, 20: PinkyTip
    // PIP joints: 3: ThumbIP, 6: IndexPIP, 10: MiddlePIP, 14: RingPIP, 18: PinkyPIP
    const thumbExt = this.isThumbExtended(primaryHand);
    const indexExt = this.isFingerExtended(primaryHand, 8, 6);
    const middleExt = this.isFingerExtended(primaryHand, 12, 10);
    const ringExt = this.isFingerExtended(primaryHand, 16, 14);
    const pinkyExt = this.isFingerExtended(primaryHand, 20, 18);

    const indexCurl = this.isFingerCurled(primaryHand, 8, 6);
    const middleCurl = this.isFingerCurled(primaryHand, 12, 10);
    const ringCurl = this.isFingerCurled(primaryHand, 16, 14);
    const pinkyCurl = this.isFingerCurled(primaryHand, 20, 18);
    const thumbCurl = this.isThumbCurled(primaryHand);

    const extendedCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;
    const curledCount = [indexCurl, middleCurl, ringCurl, pinkyCurl].filter(Boolean).length;

    // Calculate motion dynamics across the 30-frame sequence (wrist trajectory)
    const motion = this.calculateTrajectory(sequence, rightActive ? 63 : 0);

    const fingerSummary = `${rightActive ? "R" : "L"}: T:${thumbExt ? "✓" : "✗"} I:${indexExt ? "✓" : "✗"} M:${middleExt ? "✓" : "✗"} R:${ringExt ? "✓" : "✗"} P:${pinkyExt ? "✓" : "✗"}`;

    // Evaluate candidate gestures with strict priority and non-overlapping signatures
    const candidates: { label: string; score: number; reason: string }[] = [];

    // --- TWO-HANDED GESTURES ---
    if (isTwoHanded) {
      const handDist = this.getHandDistance(leftHand, rightHand);

      // Secondary hand finger state
      const secIndexCurl = this.isFingerCurled(secondaryHand, 8, 6);
      const secMiddleCurl = this.isFingerCurled(secondaryHand, 12, 10);
      const isSecFist = secIndexCurl && secMiddleCurl;
      const isPrimaryFist = indexCurl && middleCurl;

      // 1. HELP (Fist resting on flat palm, moving upward together)
      if (handDist < 0.8 && (isPrimaryFist || isSecFist)) {
        if (motion.deltaY < -0.06 || motion.totalMovement > 0.15) {
          candidates.push({ label: "HELP", score: 0.95, reason: "Two-handed fist on palm lift" });
        } else {
          candidates.push({ label: "HELP", score: 0.88, reason: "Two-handed fist on palm" });
        }
      }

      // 2. STOP (One vertical hand striking/touching horizontal palm, or both hands flat forward)
      if (handDist < 0.7 && extendedCount >= 3) {
        candidates.push({ label: "STOP", score: 0.92, reason: "Two-handed stop barrier" });
      }

      // 3. WHERE (Both open palms facing upward, moving side-to-side)
      if (extendedCount >= 3 && (motion.oscillationX >= 1 || motion.totalMovement > 0.2)) {
        candidates.push({ label: "WHERE", score: 0.93, reason: "Two open palms questioning motion" });
      }
    }

    // --- SINGLE-HAND DISTINCT GESTURES ---

    // 4. GOOD / THUMBS UP (Thumb extended up, all 4 fingers curled)
    if (thumbExt && curledCount >= 3 && !indexExt && !middleExt) {
      // Check thumb tip is pointing upward (Y < -0.2 relative to wrist)
      const thumbTipY = primaryHand[4 * 3 + 1];
      if (thumbTipY < -0.2) {
        candidates.push({ label: "GOOD", score: 0.96, reason: "Clear thumbs up" });
      } else {
        candidates.push({ label: "GOOD", score: 0.88, reason: "Thumb out fist" });
      }
    }

    // 5. YES (Fist nodding: all 4 fingers curled, thumb folded/tucked)
    if (curledCount >= 3 && !indexExt && !middleExt && !ringExt && !pinkyExt) {
      if (motion.oscillationY >= 1 || Math.abs(motion.deltaY) > 0.1) {
        candidates.push({ label: "YES", score: 0.94, reason: "Nodding fist" });
      } else {
        candidates.push({ label: "YES", score: 0.86, reason: "Stationary fist" });
      }
    }

    // 6. WATER ('W' sign: Index, Middle, Ring extended; Pinky curled; Thumb tucked)
    if (indexExt && middleExt && ringExt && pinkyCurl) {
      candidates.push({ label: "WATER", score: 0.95, reason: "W-handshape (3 fingers up)" });
    }

    // 7. NO (Index and Middle extended, Ring and Pinky curled)
    if (indexExt && middleExt && ringCurl && pinkyCurl) {
      if (motion.oscillationX >= 1 || motion.totalMovement > 0.15) {
        candidates.push({ label: "NO", score: 0.94, reason: "2-finger horizontal shake" });
      } else {
        candidates.push({ label: "NO", score: 0.87, reason: "2 fingers extended" });
      }
    }

    // 8. FOOD (Bunched fingertips together near face)
    if (this.isBunchedFingers(primaryHand)) {
      candidates.push({ label: "FOOD", score: 0.93, reason: "Bunched fingertips tapping" });
    }

    // 9. I vs YOU (Pointing single Index finger)
    if (indexExt && middleCurl && ringCurl && pinkyCurl) {
      const tipZ = primaryHand[8 * 3 + 2];
      const tipY = primaryHand[8 * 3 + 1];

      // Pointing inward toward chest = "I"
      if (tipZ < -0.15 || tipY > 0.3) {
        candidates.push({ label: "I", score: 0.92, reason: "Index pointing inward to chest" });
      } else {
        // Pointing straight forward toward camera = "YOU"
        candidates.push({ label: "YOU", score: 0.91, reason: "Index pointing forward at partner" });
      }
    }

    // 10. HELLO vs THANK YOU vs PLEASE vs STOP (Open Flat Hand Shapes)
    if (extendedCount >= 3) {
      // A. THANK YOU: Flat hand moving forward/downward away from chin
      if (motion.deltaZ < -0.12 || motion.deltaY > 0.14) {
        candidates.push({ label: "THANK YOU", score: 0.93, reason: "Open hand moving forward from chin" });
      }
      // B. PLEASE: Flat hand circling on chest
      else if (motion.oscillationX >= 1 && motion.oscillationY >= 1) {
        candidates.push({ label: "PLEASE", score: 0.91, reason: "Circular chest rubbing motion" });
      }
      // C. HELLO: Waving or raised open palm near temple/head
      else if (motion.oscillationX >= 1 || motion.totalMovement > 0.2) {
        candidates.push({ label: "HELLO", score: 0.95, reason: "Open palm waving" });
      }
      // D. STOP: Firm vertical stationary open palm
      else if (motion.totalMovement < 0.15) {
        candidates.push({ label: "STOP", score: 0.89, reason: "Stationary vertical open palm" });
      }
      // E. Default open palm fallback: HELLO
      else {
        candidates.push({ label: "HELLO", score: 0.86, reason: "Open raised palm" });
      }
    }

    // Sort by confidence score descending
    if (candidates.length > 0) {
      candidates.sort((a, b) => b.score - a.score);
      const top = candidates[0];
      const signMeta = SIGN_VOCABULARY.find((s) => s.label === top.label);

      return {
        label: top.label,
        confidence: top.score,
        hindiLabel: signMeta?.hindiLabel,
        category: signMeta?.category,
        timestamp: Date.now(),
        debugInfo: `${fingerSummary} | ${top.reason}`,
      };
    }

    return {
      label: "ANALYZING...",
      confidence: 0.5,
      timestamp: Date.now(),
      debugInfo: `${fingerSummary} | Adjusting pose...`,
    };
  }

  private static getHandEnergy(hand: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < hand.length; i++) {
      sum += Math.abs(hand[i]);
    }
    return sum;
  }

  // 3D Euclidean distance from wrist (0, 0, 0)
  private static getWristDistance(hand: Float32Array, landmarkIdx: number): number {
    const x = hand[landmarkIdx * 3];
    const y = hand[landmarkIdx * 3 + 1];
    const z = hand[landmarkIdx * 3 + 2];
    return Math.sqrt(x * x + y * y + z * z);
  }

  // 3D Euclidean distance between two landmarks
  private static getPointDistance(
    hand: Float32Array,
    idxA: number,
    idxB: number
  ): number {
    const dx = hand[idxA * 3] - hand[idxB * 3];
    const dy = hand[idxA * 3 + 1] - hand[idxB * 3 + 1];
    const dz = hand[idxA * 3 + 2] - hand[idxB * 3 + 2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  // Finger is extended if tip is far beyond PIP knuckle
  private static isFingerExtended(
    hand: Float32Array,
    tipIdx: number,
    pipIdx: number
  ): boolean {
    const tipDist = this.getWristDistance(hand, tipIdx);
    const pipDist = this.getWristDistance(hand, pipIdx);
    return tipDist > pipDist * 1.22 && tipDist > 1.2;
  }

  // Finger is curled if tip folds back towards palm
  private static isFingerCurled(
    hand: Float32Array,
    tipIdx: number,
    pipIdx: number
  ): boolean {
    const tipDist = this.getWristDistance(hand, tipIdx);
    const pipDist = this.getWristDistance(hand, pipIdx);
    return tipDist < pipDist * 1.08 || tipDist < 1.1;
  }

  // Thumb extended if tip is far from Index MCP (5) and wrist
  private static isThumbExtended(hand: Float32Array): boolean {
    const tipWristDist = this.getWristDistance(hand, 4);
    const tipToMcpDist = this.getPointDistance(hand, 4, 5);
    return tipWristDist > 1.15 && tipToMcpDist > 0.75;
  }

  // Thumb curled / tucked against palm
  private static isThumbCurled(hand: Float32Array): boolean {
    const tipToMcpDist = this.getPointDistance(hand, 4, 5);
    return tipToMcpDist < 0.65;
  }

  // Bunched fingertips: all 5 fingertips meet together in a cluster
  private static isBunchedFingers(hand: Float32Array): boolean {
    const dThumbIndex = this.getPointDistance(hand, 4, 8);
    const dThumbMiddle = this.getPointDistance(hand, 4, 12);
    const dIndexMiddle = this.getPointDistance(hand, 8, 12);

    return dThumbIndex < 0.45 && dThumbMiddle < 0.45 && dIndexMiddle < 0.45;
  }

  private static getHandDistance(handA: Float32Array, handB: Float32Array): number {
    const ax = handA[0], ay = handA[1];
    const bx = handB[0], by = handB[1];
    return Math.hypot(ax - bx, ay - by);
  }

  private static calculateTrajectory(
    sequence: Float32Array,
    wristOffset: number
  ) {
    const frames = 30;
    const stride = FEATURES_PER_FRAME;
    let totalMovement = 0;
    let deltaX = 0;
    let deltaY = 0;
    let deltaZ = 0;
    let oscillationX = 0;
    let oscillationY = 0;

    let prevDx = 0;
    let prevDy = 0;

    for (let f = 1; f < frames; f++) {
      const curr = f * stride + wristOffset;
      const prev = (f - 1) * stride + wristOffset;

      const dx = sequence[curr] - sequence[prev];
      const dy = sequence[curr + 1] - sequence[prev + 1];
      const dz = sequence[curr + 2] - sequence[prev + 2];

      totalMovement += Math.hypot(dx, dy);
      deltaX += dx;
      deltaY += dy;
      deltaZ += dz;

      if (dx * prevDx < -0.005) oscillationX++;
      if (dy * prevDy < -0.005) oscillationY++;

      prevDx = dx;
      prevDy = dy;
    }

    return { totalMovement, deltaX, deltaY, deltaZ, oscillationX, oscillationY };
  }
}
