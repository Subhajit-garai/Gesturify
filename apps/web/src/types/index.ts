export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface HandDetection {
  landmarks: Landmark[];
  handedness: "Left" | "Right";
  score: number;
}

export interface PoseDetection {
  landmarks: Landmark[];
  // Key upper body indices
  leftShoulder?: Landmark;
  rightShoulder?: Landmark;
  leftElbow?: Landmark;
  rightElbow?: Landmark;
  leftWrist?: Landmark;
  rightWrist?: Landmark;
  nose?: Landmark;
}

export interface VisionFrameResult {
  timestamp: number;
  hands: HandDetection[];
  pose: PoseDetection | null;
  processingTimeMs: number;
}

export interface Prediction {
  label: string;
  confidence: number;
  hindiLabel?: string;
  category?: string;
  timestamp: number;
  isStable?: boolean;
}

export interface SignSentenceItem {
  id: string;
  token: string;
  confidence: number;
  timestamp: number;
}

export type CameraFacingMode = "user" | "environment";

export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "paused"
  | "denied"
  | "not-found"
  | "busy"
  | "unsupported"
  | "error";

export interface TechnicalMetrics {
  fps: number;
  visionLatencyMs: number;
  inferenceLatencyMs: number;
  handsDetected: number;
  poseDetected: boolean;
  sequenceBufferFill: number; // 0 to 30
  modelName: string;
  executionProvider: "WASM-SIMD" | "WebGL" | "Local-Pipeline";
  resolution: string;
}

export interface SmoothingConfig {
  confidenceThreshold: number; // e.g. 0.70
  windowSize: number; // e.g. 8 frames
  minAgreementCount: number; // e.g. 5
  cooldownMs: number; // e.g. 1200ms
}

export type AppMode = "sign-to-speech" | "speech-to-sign" | "sign-dictionary" | "video-learning";
