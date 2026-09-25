"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Prediction,
  SignSentenceItem,
  TechnicalMetrics,
  VisionFrameResult,
} from "@/types";
import { LandmarkProcessor } from "@/vision/landmarkProcessor";
import { SequenceBuffer } from "@/vision/sequenceBuffer";
import { PredictionSmoother } from "@/translation/predictionSmoother";
import { SentenceBuilder, ConstructedSentence } from "@/translation/sentenceBuilder";
import { SignRecognitionModel } from "@/models/SignRecognitionModel";
import { ONNXSignModel } from "@/models/ONNXSignModel";
import { MockSignModel } from "@/models/MockSignModel";
import confetti from "canvas-confetti";

export function useSignRecognition(
  latestFrame: VisionFrameResult | null,
  visionLatency: number,
  resolution: string
) {
  const [modelType, setModelType] = useState<"onnx" | "heuristic">("onnx");
  const [currentPrediction, setCurrentPrediction] = useState<Prediction>({
    label: "WAITING FOR GESTURE",
    confidence: 0,
    timestamp: Date.now(),
  });
  const [stabilityRatio, setStabilityRatio] = useState<number>(0);
  const [sentenceTokens, setSentenceTokens] = useState<SignSentenceItem[]>([]);
  const [sentence, setSentence] = useState<ConstructedSentence>({
    english: "",
    hindi: "",
    tokens: [],
  });
  const [metrics, setMetrics] = useState<TechnicalMetrics>({
    fps: 0,
    visionLatencyMs: 0,
    inferenceLatencyMs: 0,
    handsDetected: 0,
    poseDetected: false,
    sequenceBufferFill: 0,
    modelName: "ISL-Temporal-ONNX-v1",
    executionProvider: "WASM-SIMD",
    resolution: "1280x720",
  });

  // Keep references to internal state
  const sequenceBufferRef = useRef<SequenceBuffer>(new SequenceBuffer(30));
  const smootherRef = useRef<PredictionSmoother>(new PredictionSmoother());
  const onnxModelRef = useRef<ONNXSignModel>(new ONNXSignModel());
  const mockModelRef = useRef<MockSignModel>(new MockSignModel());
  const activeModelRef = useRef<SignRecognitionModel>(onnxModelRef.current);

  const fpsFramesRef = useRef<number[]>([]);
  const lastInferenceTimeRef = useRef<number>(0);

  // Initialize models
  useEffect(() => {
    let active = true;

    async function initModels() {
      await mockModelRef.current.load();
      await onnxModelRef.current.load();
      if (active) {
        activeModelRef.current =
          modelType === "onnx" ? onnxModelRef.current : mockModelRef.current;
      }
    }

    initModels();

    return () => {
      active = false;
      onnxModelRef.current.dispose();
      mockModelRef.current.dispose();
    };
  }, [modelType]);

  const switchModel = useCallback((type: "onnx" | "heuristic") => {
    setModelType(type);
    activeModelRef.current =
      type === "onnx" ? onnxModelRef.current : mockModelRef.current;
  }, []);

  const addSignToken = useCallback((sign: string, confidence: number) => {
    setSentenceTokens((prev) => {
      const newItem: SignSentenceItem = {
        id: `${sign}_${Date.now()}`,
        token: sign,
        confidence,
        timestamp: Date.now(),
      };
      const updated = [...prev, newItem];
      setSentence(SentenceBuilder.buildSentence(updated));
      return updated;
    });

    // Subtle celebration for positive feedback
    try {
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.8 },
        colors: ["#06b6d4", "#10b981", "#8b5cf6"],
      });
    } catch (e) {
      // non-critical
    }
  }, []);

  const clearSentence = useCallback(() => {
    setSentenceTokens([]);
    setSentence({ english: "", hindi: "", tokens: [] });
    smootherRef.current.reset();
  }, []);

  const removeLastToken = useCallback(() => {
    setSentenceTokens((prev) => {
      const updated = prev.slice(0, -1);
      setSentence(SentenceBuilder.buildSentence(updated));
      return updated;
    });
  }, []);

  const forceDemoSign = useCallback(
    (sign: string) => {
      mockModelRef.current.setForcedSign(sign);
      setTimeout(() => {
        mockModelRef.current.setForcedSign(null);
      }, 1500);
    },
    []
  );

  // Process frames
  useEffect(() => {
    if (!latestFrame) return;

    // Track FPS
    const now = performance.now();
    fpsFramesRef.current.push(now);
    const oneSecAgo = now - 1000;
    fpsFramesRef.current = fpsFramesRef.current.filter((t) => t > oneSecAgo);
    const currentFps = fpsFramesRef.current.length;

    // 1. Process Landmarks into 147-feature vector
    const frameFeatures = LandmarkProcessor.processFrame(latestFrame);

    // 2. Push into rolling sequence buffer
    sequenceBufferRef.current.push(frameFeatures);

    // 3. Throttle inference to every ~60ms (approx 15-20 inference runs per sec)
    if (now - lastInferenceTimeRef.current > 60) {
      lastInferenceTimeRef.current = now;
      const sequence = sequenceBufferRef.current.getFlattenedSequence();

      const inferStart = performance.now();
      activeModelRef.current.predict(sequence).then((pred) => {
        const inferLatency = Math.round(performance.now() - inferStart);

        setCurrentPrediction(pred);

        // 4. Smooth prediction
        const smoothResult = smootherRef.current.process(pred, (acceptedSign, conf) => {
          addSignToken(acceptedSign, conf);
        });

        setStabilityRatio(smoothResult.stabilityRatio);

        // 5. Update Technical Metrics
        setMetrics({
          fps: currentFps,
          visionLatencyMs: visionLatency,
          inferenceLatencyMs: inferLatency,
          handsDetected: latestFrame.hands.length,
          poseDetected: !!latestFrame.pose,
          sequenceBufferFill: sequenceBufferRef.current.getLength(),
          modelName: activeModelRef.current.name,
          executionProvider: modelType === "onnx" ? "WASM-SIMD" : "Local-Pipeline",
          resolution,
        });
      });
    }
  }, [latestFrame, visionLatency, resolution, modelType, addSignToken]);

  return {
    modelType,
    switchModel,
    currentPrediction,
    stabilityRatio,
    sentenceTokens,
    sentence,
    metrics,
    clearSentence,
    removeLastToken,
    forceDemoSign,
  };
}
