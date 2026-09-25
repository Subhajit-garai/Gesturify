import { SIGN_VOCABULARY } from "@/config/signVocabulary";
import { Prediction } from "@/types";
import { FEATURES_PER_FRAME } from "@/vision/landmarkProcessor";

export class GeometricSignClassifier {
  /**
   * Analyzes 30-frame temporal buffer [30 * 147] to detect physical ISL gestures
   */
  public static classify(sequence: Float32Array): Prediction {
    const totalFrames = 30;
    const featuresPerFrame = FEATURES_PER_FRAME;

    if (sequence.length < featuresPerFrame) {
      return {
        label: "SEARCHING",
        confidence: 0.1,
        timestamp: Date.now(),
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
      };
    }

    const primaryHand = rightActive ? rightHand : leftHand;
    const isTwoHanded = leftActive && rightActive;

    // Check finger states for primary hand:
    // Landmarks: 0: Wrist, 4: ThumbTip, 8: IndexTip, 12: MiddleTip, 16: RingTip, 20: PinkyTip
    // MCP joints: 2: ThumbMCP, 5: IndexMCP, 9: MiddleMCP, 13: RingMCP, 17: PinkyMCP
    const indexExt = this.isFingerExtended(primaryHand, 8, 5);
    const middleExt = this.isFingerExtended(primaryHand, 12, 9);
    const ringExt = this.isFingerExtended(primaryHand, 16, 13);
    const pinkyExt = this.isFingerExtended(primaryHand, 20, 17);
    const thumbExt = this.isThumbExtended(primaryHand);

    // Calculate motion dynamics across the 30-frame sequence (wrist trajectory)
    const motion = this.calculateTrajectory(sequence, rightActive ? 63 : 0);

    // Evaluate rules with confidence scores
    const candidates: { label: string; score: number }[] = [];

    // 1. HELP (Two-handed: one fist resting on horizontal palm, moving upward together)
    if (isTwoHanded) {
      const dist = this.getHandDistance(leftHand, rightHand);
      if (dist < 0.6 && motion.deltaY < -0.1) {
        candidates.push({ label: "HELP", score: 0.92 });
      }
      // STOP (Two hands: one vertical striking horizontal, or open hands forward)
      if (dist < 0.7 && !indexExt && !middleExt) {
        candidates.push({ label: "STOP", score: 0.88 });
      }
      // WHERE (Both open palms face up, moving side-to-side)
      if (motion.deltaX > 0.25 || motion.oscillationX > 2) {
        candidates.push({ label: "WHERE", score: 0.89 });
      }
    }

    // 2. HELLO (Open palm waving or moving outward near forehead/chest)
    if (indexExt && middleExt && ringExt && pinkyExt) {
      if (motion.oscillationX >= 2 || motion.totalMovement > 0.3) {
        candidates.push({ label: "HELLO", score: 0.94 });
      } else {
        candidates.push({ label: "HELLO", score: 0.82 });
      }
    }

    // 3. GOOD (Thumbs up: thumb extended, other 4 fingers curled)
    if (thumbExt && !indexExt && !middleExt && !ringExt && !pinkyExt) {
      candidates.push({ label: "GOOD", score: 0.95 });
    }

    // 4. WATER ('W' sign: 3 fingers extended: index, middle, ring, pinky curled, thumb tucked)
    if (indexExt && middleExt && ringExt && !pinkyExt) {
      candidates.push({ label: "WATER", score: 0.93 });
    }

    // 5. YES (Fist nodding: all fingers curled, vertical oscillation)
    if (!indexExt && !middleExt && !ringExt && !pinkyExt && !thumbExt) {
      if (motion.oscillationY >= 2 || Math.abs(motion.deltaY) > 0.15) {
        candidates.push({ label: "YES", score: 0.91 });
      } else {
        candidates.push({ label: "YES", score: 0.75 });
      }
    }

    // 6. NO (Index and middle extended, pinching or waving horizontally)
    if (indexExt && middleExt && !ringExt && !pinkyExt) {
      if (motion.oscillationX >= 1 || motion.totalMovement > 0.2) {
        candidates.push({ label: "NO", score: 0.92 });
      } else {
        candidates.push({ label: "NO", score: 0.84 });
      }
    }

    // 7. I (Index finger pointing at chest)
    if (indexExt && !middleExt && !ringExt && !pinkyExt) {
      const tipZ = primaryHand[8 * 3 + 2];
      if (tipZ < -0.1 || !thumbExt) {
        candidates.push({ label: "I", score: 0.89 });
      } else {
        candidates.push({ label: "YOU", score: 0.87 });
      }
    }

    // 8. FOOD (Bunch fingertips together, bunched distance < 0.25)
    if (this.isBunchedFingers(primaryHand)) {
      candidates.push({ label: "FOOD", score: 0.90 });
    }

    // 9. THANK YOU / PLEASE (Flat palm touching chest or chin moving forward)
    if (indexExt && middleExt && ringExt) {
      if (motion.deltaZ < -0.15 || motion.deltaY > 0.1) {
        candidates.push({ label: "THANK YOU", score: 0.89 });
      } else {
        candidates.push({ label: "PLEASE", score: 0.81 });
      }
    }

    // Pick top candidate
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
      };
    }

    return {
      label: "ANALYZING...",
      confidence: 0.45,
      timestamp: Date.now(),
    };
  }

  private static getHandEnergy(hand: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < hand.length; i++) {
      sum += Math.abs(hand[i]);
    }
    return sum;
  }

  private static isFingerExtended(
    hand: Float32Array,
    tipIdx: number,
    mcpIdx: number
  ): boolean {
    const tipY = hand[tipIdx * 3 + 1];
    const mcpY = hand[mcpIdx * 3 + 1];
    // In normalized coords, negative Y is upward towards head
    return tipY < mcpY - 0.2;
  }

  private static isThumbExtended(hand: Float32Array): boolean {
    const tipX = hand[4 * 3];
    const mcpX = hand[2 * 3];
    return Math.abs(tipX - mcpX) > 0.35;
  }

  private static isBunchedFingers(hand: Float32Array): boolean {
    const tX = hand[4 * 3], tY = hand[4 * 3 + 1];
    const iX = hand[8 * 3], iY = hand[8 * 3 + 1];
    const mX = hand[12 * 3], mY = hand[12 * 3 + 1];
    const rX = hand[16 * 3], rY = hand[16 * 3 + 1];

    const d1 = Math.hypot(tX - iX, tY - iY);
    const d2 = Math.hypot(tX - mX, tY - mY);
    const d3 = Math.hypot(tX - rX, tY - rY);

    return d1 < 0.25 && d2 < 0.25 && d3 < 0.3;
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
      const curr = (f * stride) + wristOffset;
      const prev = ((f - 1) * stride) + wristOffset;

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
