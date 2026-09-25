import { SignRecognitionModel } from "./SignRecognitionModel";
import { Prediction } from "@/types";
import { GeometricSignClassifier } from "./GeometricSignClassifier";

export class MockSignModel implements SignRecognitionModel {
  public name = "ISL-GeometricHeuristic-v1";
  public isLoaded = false;
  private forcedSign: string | null = null;

  public async load(): Promise<void> {
    // Simulate lightweight model load delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.isLoaded = true;
  }

  public setForcedSign(sign: string | null): void {
    this.forcedSign = sign;
  }

  public async predict(sequence: Float32Array): Promise<Prediction> {
    if (this.forcedSign) {
      return {
        label: this.forcedSign,
        confidence: 0.96,
        timestamp: Date.now(),
      };
    }

    return GeometricSignClassifier.classify(sequence);
  }

  public dispose(): void {
    this.isLoaded = false;
  }
}
