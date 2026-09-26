import { HandPose21, JointOffset } from "@/data/alphabetPoses";

export interface MorphConfig {
  durationMs: number; // Duration of active morphing transition (default: 280ms)
  idleFps: number;    // Frame rate during idle resting state (default: 15 FPS)
}

export class HandMorphEngine {
  /**
   * Easing function: Cubic ease-in-out for natural muscle acceleration and deceleration
   */
  public static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * Linear Interpolation (LERP) between two numbers
   */
  public static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Interpolates all 21 keypoints from startPose to targetPose at progress t (0.0 to 1.0)
   */
  public static interpolate(
    startPose: HandPose21,
    targetPose: HandPose21,
    rawProgress: number
  ): HandPose21 {
    const clamped = Math.max(0, Math.min(1, rawProgress));
    const easedT = this.easeInOutCubic(clamped);

    const result: HandPose21 = {};

    for (let id = 0; id <= 20; id++) {
      const p1 = startPose[id] || { x: 0, y: 0 };
      const p2 = targetPose[id] || p1;

      result[id] = {
        x: this.lerp(p1.x, p2.x, easedT),
        y: this.lerp(p1.y, p2.y, easedT),
      };
    }

    return result;
  }

  /**
   * Calculates subtle organic idle breathing offsets to make the hand feel alive
   * without heavy per-joint trigonometric operations.
   */
  public static getIdleOffset(frame: number): JointOffset {
    return {
      x: Math.sin(frame * 0.04) * 4,
      y: Math.cos(frame * 0.03) * 3,
    };
  }
}
