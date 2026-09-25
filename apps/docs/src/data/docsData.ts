export interface FunctionDoc {
  name: string;
  signature: string;
  description: string;
  parameters?: { name: string; type: string; desc: string }[];
  returns: string;
}

export interface FileDoc {
  path: string;
  module: "vision" | "models" | "translation" | "speech" | "hooks" | "components" | "config";
  purpose: string;
  functions: FunctionDoc[];
  dependencies: string[];
}

export interface FlowStep {
  step: number;
  title: string;
  sourceFile: string;
  targetFile: string;
  description: string;
  dataTransferred: string;
}

export const ARCHITECTURE_FLOW: FlowStep[] = [
  {
    step: 1,
    title: "Camera Stream Capture",
    sourceFile: "apps/web/src/vision/camera.ts",
    targetFile: "apps/web/src/hooks/useCamera.ts",
    description: "Invokes navigator.mediaDevices.getUserMedia() requesting facingMode: 'environment' (rear camera) at 1280x720, mounting stream onto HTMLVideoElement.",
    dataTransferred: "MediaStream track with active video stream"
  },
  {
    step: 2,
    title: "MediaPipe Vision Landmark Extraction",
    sourceFile: "apps/web/src/vision/mediaPipe.ts",
    targetFile: "apps/web/src/hooks/useMediaPipe.ts",
    description: "Executes detectForVideo() inside requestAnimationFrame loop using MediaPipe FilesetResolver WASM runtime to extract 21 hand landmarks per hand and upper-body pose landmarks.",
    dataTransferred: "VisionFrameResult { timestamp, hands: HandDetection[], pose: PoseDetection }"
  },
  {
    step: 3,
    title: "Landmark Normalization",
    sourceFile: "apps/web/src/vision/featureNormalizer.ts",
    targetFile: "apps/web/src/vision/landmarkProcessor.ts",
    description: "Translates hand landmarks relative to wrist origin (0,0,0) and scales by wrist-to-middle-finger Euclidean distance. Translates upper pose relative to shoulder midpoint.",
    dataTransferred: "Normalized Left Hand (63 floats), Right Hand (63 floats), Upper Pose (21 floats)"
  },
  {
    step: 4,
    title: "Sequence Buffering",
    sourceFile: "apps/web/src/vision/landmarkProcessor.ts",
    targetFile: "apps/web/src/vision/sequenceBuffer.ts",
    description: "Pushes deterministic 147-dimensional float vector into rolling 30-frame FIFO queue, outputting [30, 147] tensor (4,410 floats).",
    dataTransferred: "Float32Array of size 4,410 representing temporal motion"
  },
  {
    step: 5,
    title: "Temporal Sign Recognition Model",
    sourceFile: "apps/web/src/vision/sequenceBuffer.ts",
    targetFile: "apps/web/src/models/ONNXSignModel.ts & GeometricSignClassifier.ts",
    description: "Passes sequence to ONNX Runtime Web session or Geometric heuristic analyzer (evaluating finger extensions, distance to face, and wrist trajectory).",
    dataTransferred: "Prediction { label: string, confidence: number, hindiLabel, category }"
  },
  {
    step: 6,
    title: "Prediction Smoothing & Temporal Lock",
    sourceFile: "apps/web/src/models/SignRecognitionModel.ts",
    targetFile: "apps/web/src/translation/predictionSmoother.ts",
    description: "Applies confidence threshold (>0.80), rolling window majority voting (8 frames), agreement count (>=5), and cooldown (1400ms) to eliminate prediction flickering.",
    dataTransferred: "Accepted stable sign token string + confidence"
  },
  {
    step: 7,
    title: "Sentence Construction",
    sourceFile: "apps/web/src/translation/predictionSmoother.ts",
    targetFile: "apps/web/src/translation/sentenceBuilder.ts",
    description: "Assembles sequence of accepted sign tokens into grammatically fluent English and Hindi sentences respecting ISL Subject-Object-Verb conventions.",
    dataTransferred: "ConstructedSentence { english, hindi, tokens: string[] }"
  },
  {
    step: 8,
    title: "Text-to-Speech (TTS)",
    sourceFile: "apps/web/src/translation/sentenceBuilder.ts",
    targetFile: "apps/web/src/speech/textToSpeech.ts",
    description: "Synthesizes constructed sentence aloud via Web Speech API speechSynthesis with selectable Indian English/Hindi accent and pitch control.",
    dataTransferred: "SpeechSynthesisUtterance spoken audio output"
  }
];

export const FILES_DOCUMENTATION: FileDoc[] = [
  {
    path: "apps/web/src/vision/camera.ts",
    module: "vision",
    purpose: "Handles low-level browser camera media stream access, rear/front facing mode, device enumeration, and error classification.",
    dependencies: ["@/types"],
    functions: [
      {
        name: "CameraService.isSupported()",
        signature: "isSupported(): boolean",
        description: "Checks if navigator.mediaDevices and getUserMedia exist in browser.",
        returns: "boolean"
      },
      {
        name: "CameraService.getAvailableCameras()",
        signature: "getAvailableCameras(): Promise<MediaDeviceInfo[]>",
        description: "Enumerates all connected videoinput devices for camera selection.",
        returns: "Promise<MediaDeviceInfo[]>"
      },
      {
        name: "CameraService.startCamera()",
        signature: "startCamera(videoElement: HTMLVideoElement, config: CameraConfig): Promise<{ stream, status, error }>",
        description: "Requests media stream matching facingMode or deviceId with ideal 1280x720 resolution and attaches stream to videoElement.",
        returns: "Promise<{ stream: MediaStream, status: CameraStatus, error?: string }>"
      },
      {
        name: "CameraService.stopCamera()",
        signature: "stopCamera(): void",
        description: "Stops all active tracks in the media stream and releases hardware.",
        returns: "void"
      }
    ]
  },
  {
    path: "apps/web/src/vision/mediaPipe.ts",
    module: "vision",
    purpose: "Initializes Google MediaPipe Tasks Vision FilesetResolver, HandLandmarker, and PoseLandmarker with GPU/CPU fallbacks.",
    dependencies: ["@mediapipe/tasks-vision", "@/types"],
    functions: [
      {
        name: "MediaPipeVisionService.initialize()",
        signature: "initialize(onProgress?: (stage: string) => void): Promise<boolean>",
        description: "Downloads WASM binaries from CDN, instantiates HandLandmarker (numHands: 2) and PoseLandmarker with GPU delegate and CPU fallback.",
        returns: "Promise<boolean>"
      },
      {
        name: "MediaPipeVisionService.detect()",
        signature: "detect(video: HTMLVideoElement, timestampMs: number): VisionFrameResult | null",
        description: "Processes the current video frame and extracts 21 hand landmarks and 7 upper-body pose landmarks.",
        returns: "VisionFrameResult | null"
      }
    ]
  },
  {
    path: "apps/web/src/vision/featureNormalizer.ts",
    module: "vision",
    purpose: "Performs translation and scale invariant normalization on hand and pose coordinates.",
    dependencies: ["@/types"],
    functions: [
      {
        name: "FeatureNormalizer.normalizeHandLandmarks()",
        signature: "normalizeHandLandmarks(landmarks: Landmark[]): Float32Array",
        description: "Translates wrist to (0,0,0) and scales by wrist-to-middle-MCP distance. Produces 63 floats.",
        returns: "Float32Array (size 63)"
      },
      {
        name: "FeatureNormalizer.normalizePoseKeypoints()",
        signature: "normalizePoseKeypoints(keypoints: Landmark[]): Float32Array",
        description: "Translates to midpoint between shoulders and scales by shoulder width. Produces 21 floats.",
        returns: "Float32Array (size 21)"
      }
    ]
  },
  {
    path: "apps/web/src/vision/landmarkProcessor.ts",
    module: "vision",
    purpose: "Converts raw VisionFrameResult into a fixed 147-dimensional vector per frame.",
    dependencies: ["@/types", "./featureNormalizer"],
    functions: [
      {
        name: "LandmarkProcessor.processFrame()",
        signature: "processFrame(result: VisionFrameResult | null): Float32Array",
        description: "Packs [LeftHand(63), RightHand(63), UpperPose(21)] into unified vector.",
        returns: "Float32Array (size 147)"
      }
    ]
  },
  {
    path: "apps/web/src/vision/sequenceBuffer.ts",
    module: "vision",
    purpose: "Maintains a 30-frame FIFO queue for temporal sign recognition.",
    dependencies: ["./landmarkProcessor"],
    functions: [
      {
        name: "SequenceBuffer.push()",
        signature: "push(frameFeatures: Float32Array): void",
        description: "Appends latest 147-float frame features and shifts oldest when size exceeds targetLength.",
        returns: "void"
      },
      {
        name: "SequenceBuffer.getFlattenedSequence()",
        signature: "getFlattenedSequence(): Float32Array",
        description: "Returns flattened Float32Array of shape [30 * 147 = 4,410] with early-frame padding.",
        returns: "Float32Array (size 4,410)"
      }
    ]
  },
  {
    path: "apps/web/src/models/SignRecognitionModel.ts",
    module: "models",
    purpose: "Core interface abstraction allowing plug-and-play switching between ONNX and geometric heuristics.",
    dependencies: ["@/types"],
    functions: [
      {
        name: "SignRecognitionModel.load()",
        signature: "load(modelPath?: string): Promise<void>",
        description: "Loads model graph or initializes heuristics.",
        returns: "Promise<void>"
      },
      {
        name: "SignRecognitionModel.predict()",
        signature: "predict(sequence: Float32Array): Promise<Prediction>",
        description: "Computes probabilities over ISL vocabulary and returns top predicted sign.",
        returns: "Promise<Prediction>"
      }
    ]
  },
  {
    path: "apps/web/src/models/GeometricSignClassifier.ts",
    module: "models",
    purpose: "Analyzes real physical gesture geometry (finger curls, pinch, hand-face distance, trajectory).",
    dependencies: ["@/config/signVocabulary", "@/types"],
    functions: [
      {
        name: "GeometricSignClassifier.classify()",
        signature: "classify(sequence: Float32Array): Prediction",
        description: "Heuristic classifier evaluating physical gestures across 30 frames for HELLO, WATER, HELP, etc.",
        returns: "Prediction"
      }
    ]
  },
  {
    path: "apps/web/src/models/ONNXSignModel.ts",
    module: "models",
    purpose: "ONNX Runtime Web integration for executing exported LSTM/Transformer models.",
    dependencies: ["onnxruntime-web", "@/types", "./GeometricSignClassifier"],
    functions: [
      {
        name: "ONNXSignModel.load()",
        signature: "load(modelPath?: string): Promise<void>",
        description: "Loads ONNX model using onnxruntime-web InferenceSession with WASM backend.",
        returns: "Promise<void>"
      },
      {
        name: "ONNXSignModel.predict()",
        signature: "predict(sequence: Float32Array): Promise<Prediction>",
        description: "Runs session.run({ input: tensor[1, 30, 147] }) and computes softmax argmax.",
        returns: "Promise<Prediction>"
      }
    ]
  },
  {
    path: "apps/web/src/translation/predictionSmoother.ts",
    module: "translation",
    purpose: "Stabilizes fluctuating ML predictions using rolling window majority voting and cooldown.",
    dependencies: ["@/types"],
    functions: [
      {
        name: "PredictionSmoother.process()",
        signature: "process(prediction: Prediction, onSignAccepted: (sign, conf) => void): { isCandidateStable, stabilityRatio }",
        description: "Filters low confidence, tallies rolling votes, tracks consecutive stability, and triggers onSignAccepted.",
        returns: "{ isCandidateStable: boolean, stabilityRatio: number }"
      }
    ]
  },
  {
    path: "apps/web/src/translation/sentenceBuilder.ts",
    module: "translation",
    purpose: "Converts ordered sign token arrays into natural grammatical English and Hindi sentences.",
    dependencies: ["@/types"],
    functions: [
      {
        name: "SentenceBuilder.buildSentence()",
        signature: "buildSentence(tokens: SignSentenceItem[]): ConstructedSentence",
        description: "Matches token sequences against ISL grammatical templates (e.g. I + WATER -> 'I need drinking water').",
        returns: "ConstructedSentence { english, hindi, tokens }"
      }
    ]
  },
  {
    path: "apps/web/src/speech/textToSpeech.ts",
    module: "speech",
    purpose: "Browser Web Speech API synthesizer for vocalizing translated sentences.",
    dependencies: [],
    functions: [
      {
        name: "TextToSpeechService.speak()",
        signature: "speak(text: string, options?: TTSOptions, onEnd?: () => void): boolean",
        description: "Cancels active audio and speaks text using SpeechSynthesisUtterance with Indian English voice preference.",
        returns: "boolean"
      }
    ]
  },
  {
    path: "apps/web/src/speech/speechToText.ts",
    module: "speech",
    purpose: "Reverse communication microphone listener for hearing speech transcription.",
    dependencies: [],
    functions: [
      {
        name: "SpeechToTextService.startListening()",
        signature: "startListening(callbacks: STTCallbacks, lang?: string): boolean",
        description: "Starts webkitSpeechRecognition continuous listener and emits interim and final transcript strings.",
        returns: "boolean"
      }
    ]
  }
];
