import { Prediction } from "@/types";

export interface SignRecognitionModel {
  name: string;
  isLoaded: boolean;
  load(modelPath?: string): Promise<void>;
  predict(sequence: Float32Array): Promise<Prediction>;
  dispose(): void;
}
