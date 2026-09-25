import { FilesetResolver, HandLandmarker, PoseLandmarker } from "@mediapipe/tasks-vision";
import { HandDetection, Landmark, PoseDetection, VisionFrameResult } from "@/types";

const HAND_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const POSE_MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
const WASM_CDN_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

export class MediaPipeVisionService {
  private handLandmarker: HandLandmarker | null = null;
  private poseLandmarker: PoseLandmarker | null = null;
  private isInitializing = false;
  private isReady = false;
  private lastVideoTime = -1;

  public async initialize(onProgress?: (stage: string) => void): Promise<boolean> {
    if (this.isReady) return true;
    if (this.isInitializing) return false;
    this.isInitializing = true;

    try {
      onProgress?.("Loading MediaPipe WASM runtime...");
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN_URL);

      onProgress?.("Initializing Hand Landmarker...");
      try {
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.5,
          minHandPresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      } catch (gpuErr) {
        console.warn("GPU delegate failed for HandLandmarker, falling back to CPU:", gpuErr);
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: HAND_MODEL_URL,
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
        });
      }

      onProgress?.("Initializing Pose Landmarker...");
      try {
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: POSE_MODEL_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      } catch (gpuErr) {
        console.warn("GPU delegate failed for PoseLandmarker, falling back to CPU:", gpuErr);
        this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: POSE_MODEL_URL,
            delegate: "CPU",
          },
          runningMode: "VIDEO",
        });
      }

      this.isReady = true;
      this.isInitializing = false;
      onProgress?.("Vision models ready");
      return true;
    } catch (error) {
      console.error("Failed to initialize MediaPipe:", error);
      this.isInitializing = false;
      return false;
    }
  }

  public detect(video: HTMLVideoElement, timestampMs: number): VisionFrameResult | null {
    if (!this.isReady || !this.handLandmarker || !video || video.readyState < 2) {
      return null;
    }

    // MediaPipe requires monotonically increasing timestamps
    const currentVideoTime = video.currentTime;
    if (currentVideoTime === this.lastVideoTime) {
      return null;
    }
    this.lastVideoTime = currentVideoTime;

    const startTime = performance.now();
    const hands: HandDetection[] = [];
    let pose: PoseDetection | null = null;

    try {
      // Hand detection
      const handResult = this.handLandmarker.detectForVideo(video, timestampMs);
      if (handResult && handResult.landmarks) {
        for (let i = 0; i < handResult.landmarks.length; i++) {
          const rawLandmarks = handResult.landmarks[i];
          const handednessCategory = handResult.handednesses[i]?.[0];
          const handedness = (handednessCategory?.categoryName === "Left" ? "Left" : "Right") as "Left" | "Right";
          const score = handednessCategory?.score ?? 0.8;

          hands.push({
            landmarks: rawLandmarks.map((pt) => ({
              x: pt.x,
              y: pt.y,
              z: pt.z ?? 0,
              visibility: (pt as any).visibility ?? 1.0,
            })),
            handedness,
            score,
          });
        }
      }

      // Pose detection
      if (this.poseLandmarker) {
        const poseResult = this.poseLandmarker.detectForVideo(video, timestampMs);
        if (poseResult && poseResult.landmarks && poseResult.landmarks.length > 0) {
          const p = poseResult.landmarks[0];
          const toLm = (idx: number): Landmark | undefined => {
            const pt = p[idx];
            return pt ? { x: pt.x, y: pt.y, z: pt.z ?? 0, visibility: (pt as any).visibility ?? 1.0 } : undefined;
          };

          // Pose landmark indices:
          // 0: nose, 11: left shoulder, 12: right shoulder, 13: left elbow, 14: right elbow, 15: left wrist, 16: right wrist
          pose = {
            landmarks: p.map((pt) => ({
              x: pt.x,
              y: pt.y,
              z: pt.z ?? 0,
              visibility: (pt as any).visibility ?? 1.0,
            })),
            nose: toLm(0),
            leftShoulder: toLm(11),
            rightShoulder: toLm(12),
            leftElbow: toLm(13),
            rightElbow: toLm(14),
            leftWrist: toLm(15),
            rightWrist: toLm(16),
          };
        }
      }

      const processingTimeMs = Math.round(performance.now() - startTime);

      return {
        timestamp: timestampMs,
        hands,
        pose,
        processingTimeMs,
      };
    } catch (err) {
      console.warn("MediaPipe inference error:", err);
      return null;
    }
  }

  public getReadyState(): boolean {
    return this.isReady;
  }

  public dispose(): void {
    if (this.handLandmarker) {
      this.handLandmarker.close();
      this.handLandmarker = null;
    }
    if (this.poseLandmarker) {
      this.poseLandmarker.close();
      this.poseLandmarker = null;
    }
    this.isReady = false;
  }
}

export const mediaPipeVisionService = new MediaPipeVisionService();
