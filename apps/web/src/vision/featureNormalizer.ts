import { Landmark } from "@/types";

export class FeatureNormalizer {
  /**
   * Normalizes 21 hand landmarks:
   * 1. Translates so wrist (landmark 0) is at origin (0, 0, 0)
   * 2. Scales by maximum Euclidean distance (usually wrist to middle finger tip or MCP)
   * 3. Retains relative 3D spatial geometry invariant to hand distance from camera
   */
  public static normalizeHandLandmarks(landmarks: Landmark[]): Float32Array {
    const featureVector = new Float32Array(21 * 3);
    if (!landmarks || landmarks.length !== 21) {
      return featureVector; // zero filled
    }

    const wrist = landmarks[0];

    // Find scale factor (distance between wrist and middle finger MCP [9])
    const mcp = landmarks[9];
    const dx = mcp.x - wrist.x;
    const dy = mcp.y - wrist.y;
    const dz = mcp.z - wrist.z;
    let scale = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (scale < 0.0001) scale = 1.0;

    for (let i = 0; i < 21; i++) {
      const lm = landmarks[i];
      const idx = i * 3;
      featureVector[idx] = (lm.x - wrist.x) / scale;
      featureVector[idx + 1] = (lm.y - wrist.y) / scale;
      featureVector[idx + 2] = (lm.z - wrist.z) / scale;
    }

    return featureVector;
  }

  /**
   * Normalizes upper body pose keypoints:
   * Origin at midpoint of shoulders.
   * Scaled by shoulder width.
   */
  public static normalizePoseKeypoints(
    keypoints: (Landmark | undefined)[]
  ): Float32Array {
    const featureVector = new Float32Array(keypoints.length * 3);
    const leftShoulder = keypoints[1];
    const rightShoulder = keypoints[2];

    let originX = 0.5;
    let originY = 0.5;
    let originZ = 0;
    let scale = 1.0;

    if (leftShoulder && rightShoulder) {
      originX = (leftShoulder.x + rightShoulder.x) / 2;
      originY = (leftShoulder.y + rightShoulder.y) / 2;
      originZ = (leftShoulder.z + rightShoulder.z) / 2;
      const sdx = leftShoulder.x - rightShoulder.x;
      const sdy = leftShoulder.y - rightShoulder.y;
      scale = Math.max(Math.sqrt(sdx * sdx + sdy * sdy), 0.05);
    }

    for (let i = 0; i < keypoints.length; i++) {
      const kp = keypoints[i];
      const idx = i * 3;
      if (kp) {
        featureVector[idx] = (kp.x - originX) / scale;
        featureVector[idx + 1] = (kp.y - originY) / scale;
        featureVector[idx + 2] = (kp.z - originZ) / scale;
      } else {
        featureVector[idx] = 0;
        featureVector[idx + 1] = 0;
        featureVector[idx + 2] = 0;
      }
    }

    return featureVector;
  }
}
