import { SignRecognitionModel } from "./SignRecognitionModel";
import { Prediction } from "@/types";
import { GeometricSignClassifier } from "./GeometricSignClassifier";
import { SIGN_VOCABULARY } from "@/config/signVocabulary";

export class ONNXSignModel implements SignRecognitionModel {
  public name = "ISL-Temporal-ONNX-v1";
  public isLoaded = false;
  private session: any = null;
  private ort: any = null;
  private fallbackToGeometric = false;

  public async load(modelPath = "/models/isl_temporal_model.onnx"): Promise<void> {
    try {
      if (typeof window === "undefined") return;

      this.ort = await import("onnxruntime-web");

      // Configure ONNX runtime web assembly paths
      if (this.ort.env?.wasm) {
        this.ort.env.wasm.numThreads = 1;
        this.ort.env.wasm.simd = true;
      }

      try {
        this.session = await this.ort.InferenceSession.create(modelPath, {
          executionProviders: ["wasm"],
        });
        this.isLoaded = true;
        this.fallbackToGeometric = false;
        console.log("Successfully loaded ONNX sign recognition model:", modelPath);
      } catch (loadErr) {
        console.warn(
          "ONNX model file not found or failed to initialize, utilizing Geometric Temporal Classifier fallback:",
          loadErr
        );
        this.fallbackToGeometric = true;
        this.isLoaded = true;
      }
    } catch (err) {
      console.error("Failed to load onnxruntime-web:", err);
      this.fallbackToGeometric = true;
      this.isLoaded = true;
    }
  }

  public async predict(sequence: Float32Array): Promise<Prediction> {
    if (!this.isLoaded) {
      return {
        label: "INITIALIZING",
        confidence: 0,
        timestamp: Date.now(),
      };
    }

    if (this.fallbackToGeometric || !this.session) {
      const pred = GeometricSignClassifier.classify(sequence);
      return {
        ...pred,
        isStable: pred.confidence > 0.8,
      };
    }

    try {
      // Shape: [1, 30, 147]
      const inputTensor = new this.ort.Tensor("float32", sequence, [1, 30, 147]);
      const feeds: Record<string, any> = {};
      const inputName = this.session.inputNames[0] || "input";
      feeds[inputName] = inputTensor;

      const results = await this.session.run(feeds);
      const outputName = this.session.outputNames[0] || "output";
      const outputTensor = results[outputName];
      const data = outputTensor.data as Float32Array;

      // Softmax & Argmax
      let maxIdx = 0;
      let maxVal = -Infinity;
      for (let i = 0; i < data.length; i++) {
        if (data[i] > maxVal) {
          maxVal = data[i];
          maxIdx = i;
        }
      }

      // Calculate softmax confidence
      let expSum = 0;
      for (let i = 0; i < data.length; i++) {
        expSum += Math.exp(data[i] - maxVal);
      }
      const confidence = 1 / expSum;

      const vocabItem = SIGN_VOCABULARY[maxIdx % SIGN_VOCABULARY.length];

      return {
        label: vocabItem?.label || "UNKNOWN",
        confidence: Math.min(0.99, Math.max(0.1, confidence)),
        hindiLabel: vocabItem?.hindiLabel,
        category: vocabItem?.category,
        timestamp: Date.now(),
      };
    } catch (err) {
      console.warn("ONNX inference failed, using fallback classifier:", err);
      return GeometricSignClassifier.classify(sequence);
    }
  }

  public dispose(): void {
    this.session = null;
    this.isLoaded = false;
  }
}
