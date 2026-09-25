"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { mediaPipeVisionService } from "@/vision/mediaPipe";
import { VisionFrameResult } from "@/types";

export function useMediaPipe(videoRef: React.RefObject<HTMLVideoElement | null>, isActive: boolean) {
  const [isModelReady, setIsModelReady] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("Initializing vision runtime...");
  const [visionLatency, setVisionLatency] = useState(0);
  const [latestFrame, setLatestFrame] = useState<VisionFrameResult | null>(null);

  const animFrameId = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function init() {
      setLoadingStage("Loading MediaPipe Hand & Pose Landmarkers...");
      const success = await mediaPipeVisionService.initialize((stage) => {
        if (mounted) setLoadingStage(stage);
      });
      if (mounted) {
        setIsModelReady(success);
        if (success) {
          setLoadingStage("Ready to interpret");
        } else {
          setLoadingStage("Failed to load vision models");
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Frame detection loop
  const runDetectionLoop = useCallback(() => {
    if (!isRunningRef.current) return;

    const video = videoRef.current;
    if (video && video.readyState >= 2 && !video.paused) {
      const now = performance.now();
      const result = mediaPipeVisionService.detect(video, now);
      if (result) {
        setLatestFrame(result);
        setVisionLatency(result.processingTimeMs);
      }
    }

    animFrameId.current = requestAnimationFrame(runDetectionLoop);
  }, [videoRef]);

  useEffect(() => {
    if (isActive && isModelReady) {
      isRunningRef.current = true;
      animFrameId.current = requestAnimationFrame(runDetectionLoop);
    } else {
      isRunningRef.current = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
    }

    return () => {
      isRunningRef.current = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isActive, isModelReady, runDetectionLoop]);

  return {
    isModelReady,
    loadingStage,
    visionLatency,
    latestFrame,
  };
}
