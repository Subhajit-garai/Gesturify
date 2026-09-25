import { VisionFrameResult } from "@/types";
import { FeatureNormalizer } from "./featureNormalizer";

export const FEATURES_PER_FRAME = 21 * 3 + 21 * 3 + 7 * 3; // 147 dimensions

export class LandmarkProcessor {
  /**
   * Processes raw VisionFrameResult into a deterministic 147-dim feature vector:
   * [LeftHand(63), RightHand(63), PoseUpperBody(21)]
   */
  public static processFrame(result: VisionFrameResult | null): Float32Array {
    const combinedVector = new Float32Array(FEATURES_PER_FRAME);
    if (!result) return combinedVector;

    let leftHandLm: any = null;
    let rightHandLm: any = null;

    for (const hand of result.hands) {
      if (hand.handedness === "Left" && !leftHandLm) {
        leftHandLm = hand.landmarks;
      } else if (hand.handedness === "Right" && !rightHandLm) {
        rightHandLm = hand.landmarks;
      }
    }

    // If only one hand was detected and its label wasn't paired, assign appropriately
    if (!leftHandLm && !rightHandLm && result.hands.length > 0) {
      rightHandLm = result.hands[0].landmarks;
    }

    const leftNormalized = FeatureNormalizer.normalizeHandLandmarks(leftHandLm);
    const rightNormalized = FeatureNormalizer.normalizeHandLandmarks(rightHandLm);

    // Key pose points: nose(0), leftShoulder(11), rightShoulder(12), leftElbow(13), rightElbow(14), leftWrist(15), rightWrist(16)
    const poseKeypoints = result.pose
      ? [
          result.pose.nose,
          result.pose.leftShoulder,
          result.pose.rightShoulder,
          result.pose.leftElbow,
          result.pose.rightElbow,
          result.pose.leftWrist,
          result.pose.rightWrist,
        ]
      : [];
    const poseNormalized = FeatureNormalizer.normalizePoseKeypoints(poseKeypoints);

    // Pack into combinedVector
    combinedVector.set(leftNormalized, 0); // 0..62
    combinedVector.set(rightNormalized, 63); // 63..125
    combinedVector.set(poseNormalized, 126); // 126..146

    return combinedVector;
  }
}
