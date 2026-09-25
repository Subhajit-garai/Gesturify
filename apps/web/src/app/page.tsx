"use client";

import React, { useState, useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { useSignRecognition } from "@/hooks/useSignRecognition";
import { CameraView } from "@/components/CameraView";
import { CameraControls } from "@/components/CameraControls";
import { PredictionCard } from "@/components/PredictionCard";
import { TranslationPanel } from "@/components/TranslationPanel";
import { MetricsHUD } from "@/components/MetricsHUD";
import { StatusIndicator } from "@/components/StatusIndicator";
import { SupportedSignsModal } from "@/components/SupportedSignsModal";
import { ReverseAvatarMode } from "@/components/ReverseAvatarMode";
import { DemoModeBar } from "@/components/DemoModeBar";
import { AppMode } from "@/types";
import {
  Hand,
  Volume2,
  Mic,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Info,
  HelpCircle,
} from "lucide-react";

export default function SignBridgeApp() {
  const [activeMode, setActiveMode] = useState<AppMode>("sign-to-speech");
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);

  // 1. Camera Hook
  const {
    videoRef,
    facingMode,
    status: cameraStatus,
    errorMessage: cameraError,
    devices,
    activeDeviceId,
    resolution,
    startCamera,
    stopCamera,
    toggleFacingMode,
    selectDevice,
  } = useCamera();

  // 2. MediaPipe Vision Hook
  const {
    isModelReady: isVisionReady,
    loadingStage,
    visionLatency,
    latestFrame,
  } = useMediaPipe(videoRef, cameraStatus === "active");

  // 3. Sign Recognition Hook
  const {
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
  } = useSignRecognition(latestFrame, visionLatency, resolution);

  // Auto-start rear camera on mount if in sign-to-speech mode
  useEffect(() => {
    if (activeMode === "sign-to-speech" && cameraStatus === "idle") {
      startCamera("environment");
    }
  }, [activeMode, cameraStatus, startCamera]);

  const handleToggleStream = () => {
    if (cameraStatus === "active") {
      stopCamera();
    } else {
      startCamera(facingMode);
    }
  };

  return (
    <main className="min-h-screen bg-[#060913] text-slate-100 flex flex-col pb-8">
      {/* Top Futuristic Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#060913]/90 backdrop-blur-xl border-b border-cyan-500/20 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Hand className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">
                  SignBridge <span className="text-cyan-400">AI</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  ISL EDITION
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Real-Time Indian Sign Language Interpreter
              </p>
            </div>
          </div>

          {/* Mode Navigation Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-dark border border-slate-700/80">
            <button
              onClick={() => setActiveMode("sign-to-speech")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMode === "sign-to-speech"
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-surface-darker font-bold shadow-md shadow-cyan-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Hand className="w-3.5 h-3.5" />
              <span>Sign → Speech</span>
            </button>

            <button
              onClick={() => {
                setActiveMode("speech-to-sign");
                stopCamera();
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeMode === "speech-to-sign"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-surface-darker font-bold shadow-md shadow-emerald-500/25"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Speech → Sign Avatar</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDictionaryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-panel border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Supported Signs</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4 flex-1 space-y-4">
        {/* Status Pipeline Checklist */}
        <StatusIndicator
          cameraReady={cameraStatus === "active"}
          visionReady={isVisionReady}
          modelReady={true}
          stageMessage={loadingStage}
        />

        {/* Demo Mode Quick Toolbar */}
        <DemoModeBar
          onTriggerSign={forceDemoSign}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
        />

        {/* Mode 1: Sign Language -> Speech (Camera Mode) */}
        {activeMode === "sign-to-speech" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left 7 Columns: Camera Feed, Skeletons & Controls */}
            <div className="lg:col-span-7 space-y-3.5">
              <CameraView
                videoRef={videoRef}
                status={cameraStatus}
                errorMessage={cameraError}
                facingMode={facingMode}
                frameResult={latestFrame}
                onRetry={() => startCamera(facingMode)}
                fps={metrics.fps}
              />

              {/* Camera Controls */}
              <CameraControls
                status={cameraStatus}
                facingMode={facingMode}
                devices={devices}
                activeDeviceId={activeDeviceId}
                modelType={modelType}
                onToggleFacingMode={toggleFacingMode}
                onSelectDevice={selectDevice}
                onToggleStream={handleToggleStream}
                onSwitchModel={switchModel}
              />

              {/* Technical Metrics HUD */}
              <MetricsHUD metrics={metrics} />
            </div>

            {/* Right 5 Columns: Real-Time Prediction & Translation Panel */}
            <div className="lg:col-span-5 space-y-4 flex flex-col">
              {/* Current Sign Live Card */}
              <PredictionCard
                prediction={currentPrediction}
                stabilityRatio={stabilityRatio}
              />

              {/* Sentence Assembler & Speech Synthesizer */}
              <div className="flex-1">
                <TranslationPanel
                  sentence={sentence}
                  tokens={sentenceTokens}
                  onClear={clearSentence}
                  onRemoveLastToken={removeLastToken}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mode 2: Reverse Speech-to-Sign Avatar Mode */}
        {activeMode === "speech-to-sign" && <ReverseAvatarMode />}

        {/* Privacy & Technical Disclosure Banner */}
        <footer className="pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-400/90 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              Privacy Guaranteed: Your camera video is processed 100% locally in your browser. Video is never uploaded or saved to any cloud server.
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span>ISL-Spec v1.0</span>
            <span>•</span>
            <span>MediaPipe Tasks Vision</span>
            <span>•</span>
            <span>ONNX Runtime Web</span>
          </div>
        </footer>
      </div>

      {/* Supported Signs Modal */}
      <SupportedSignsModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        onTestSign={(sign) => {
          forceDemoSign(sign);
        }}
      />
    </main>
  );
}
