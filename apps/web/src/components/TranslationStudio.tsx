"use client";

import React, { useState, useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useMediaPipe } from "@/hooks/useMediaPipe";
import { useSignRecognition } from "@/hooks/useSignRecognition";
import { LandmarkOverlay } from "@/components/LandmarkOverlay";
import { ttsService } from "@/speech/textToSpeech";
import {
  PlayCircle,
  Camera,
  Sparkles,
  Play,
  Pause,
  Video,
  VideoOff,
  Volume2,
  Copy,
  Check,
  Hand,
  RotateCcw,
  Trash2,
  Delete,
} from "lucide-react";

interface TranslationStudioProps {
  initialText?: string;
  onOpenLearning?: () => void;
}

export default function TranslationStudio({
  initialText = "Hello, nice to meet you",
  onOpenLearning,
}: TranslationStudioProps) {
  const [activeMode, setActiveMode] = useState<"textToAnim" | "videoToText">("videoToText");
  const [textInput, setTextInput] = useState(initialText);
  const [animTokens, setAnimTokens] = useState<string[]>(["HELLO", "NICE", "MEET", "YOU"]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  // 1. Camera Hook
  const {
    videoRef,
    facingMode,
    status: cameraStatus,
    errorMessage: cameraError,
    resolution,
    startCamera,
    stopCamera,
    toggleFacingMode,
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

  // Fallback simulated transcript if camera isn't active yet
  const [fallbackTranscript, setFallbackTranscript] = useState("HELLO THANK YOU PLEASE");

  // Keep textInput synced if initialText prop changes
  useEffect(() => {
    if (initialText) {
      setTextInput(initialText);
      handleGenerateAnimation(initialText);
    }
  }, [initialText]);

  const handleGenerateAnimation = (text: string) => {
    const tokens = text
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    setAnimTokens(tokens.length ? tokens : ["HELLO"]);
    setSelectedTokenIndex(0);
  };

  // Playback timer for sequence animation
  useEffect(() => {
    if (!isPlayingSeq || animTokens.length === 0) return;
    const interval = setInterval(() => {
      setSelectedTokenIndex((prev) => (prev + 1) % animTokens.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlayingSeq, animTokens]);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    setVideoDimensions({
      width: v.videoWidth || 640,
      height: v.videoHeight || 480,
    });
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    if (cameraStatus === "active") {
      stopCamera();
    } else {
      startCamera(facingMode);
    }
  };

  // Active display transcript (real assembled sentence or fallback if not started)
  const assembledSentence = sentence.english?.trim();
  const currentSignLabel =
    currentPrediction?.label && currentPrediction.label !== "WAITING FOR GESTURE"
      ? currentPrediction.label
      : null;

  const displayTranscript =
    assembledSentence && assembledSentence.length > 0
      ? assembledSentence
      : sentenceTokens.length > 0
      ? sentenceTokens.map((t) => t.token).join(" ")
      : cameraStatus === "active"
      ? currentSignLabel
        ? `[Detecting: ${currentSignLabel}]`
        : "Waiting for gesture in camera view..."
      : fallbackTranscript;

  // Text-To-Speech
  const handleSpeak = () => {
    const textToSpeak =
      sentence.english ||
      (sentenceTokens.length > 0
        ? sentenceTokens.map((t) => t.token).join(" ")
        : fallbackTranscript);
    if (!textToSpeak) return;

    if (ttsService.isSupported()) {
      ttsService.speak(textToSpeak, { rate: 0.95 });
    } else if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    const textToCopy =
      sentence.english ||
      (sentenceTokens.length > 0
        ? sentenceTokens.map((t) => t.token).join(" ")
        : fallbackTranscript);
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Quick Demo Signs
  const demoSigns = ["HELLO", "THANK YOU", "PLEASE", "HELP", "YES", "NO", "WATER", "EMERGENCY"];

  const currentToken = animTokens[selectedTokenIndex] || "HELLO";
  const confidencePercent =
    currentPrediction && currentPrediction.confidence > 0
      ? Math.round(currentPrediction.confidence * 100)
      : 96.4;

  return (
    <section id="translation" className="py-16 border-b border-zinc-200 bg-zinc-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-200 gap-4">
          <div>
            <span className="section-tag">Module 02 // Neural Vision Interpreter</span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Translation &amp; Video Studio</h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
              Bidirectional communication: Real-time OpenCV &amp; MediaPipe gesture-to-speech transcription and text-to-gesture visualization.
            </p>
          </div>

          {/* Dual Mode Toggle */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200 flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveMode("videoToText")}
              className={`tab-btn ${activeMode === "videoToText" ? "active" : ""}`}
            >
              <Camera className="w-4 h-4" />
              <span>Real-Time Video to Text</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("textToAnim")}
              className={`tab-btn ${activeMode === "textToAnim" ? "active" : ""}`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Text to Animation</span>
            </button>
          </div>
        </div>

        {/* Translation View 1: Real-Time Video to Text (Synced with Backend Engine) */}
        {activeMode === "videoToText" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Live Webcam Stream HUD (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          cameraStatus === "active"
                            ? "bg-emerald-500 animate-ping"
                            : "bg-amethyst_smoke-400 animate-pulse"
                        }`}
                      />
                      <span className="font-mono text-xs uppercase font-bold text-zinc-800">
                        {cameraStatus === "active"
                          ? "LIVE WEBCAM ACTIVE • MEDIAPIPE TRACKING"
                          : cameraStatus === "requesting"
                          ? "INITIALIZING CAMERA..."
                          : "OPENCV VISION ENGINE READY"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {currentSignLabel ? (
                        <span className="badge-minimal">
                          Sign: {currentSignLabel} ({confidencePercent}%)
                        </span>
                      ) : (
                        <span className="badge-minimal">Confidence: {confidencePercent}%</span>
                      )}
                    </div>
                  </div>

                  {/* Video HUD Container */}
                  <div className="relative w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                    {/* Live Video Element */}
                    <video
                      ref={videoRef}
                      onLoadedMetadata={handleLoadedMetadata}
                      className={`w-full h-full object-cover ${
                        cameraStatus === "active"
                          ? facingMode === "user"
                            ? "-scale-x-100"
                            : "scale-x-100"
                          : "hidden"
                      }`}
                      autoPlay
                      playsInline
                      muted
                    />

                    {/* Real MediaPipe Landmark Canvas Overlay */}
                    {cameraStatus === "active" && (
                      <LandmarkOverlay
                        frameResult={latestFrame}
                        videoWidth={videoDimensions.width}
                        videoHeight={videoDimensions.height}
                        facingMode={facingMode}
                      />
                    )}

                    {/* Inactive Standby Screen */}
                    {cameraStatus !== "active" && (
                      <div className="text-center p-6 space-y-3 z-10">
                        <div className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 mx-auto flex items-center justify-center text-white">
                          <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-zinc-200">Real-Time Gesture Landmark Tracker</p>
                        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                          Click &quot;Start Real-Time Camera&quot; to begin instant client-side gesture recognition, or test with quick sign triggers below.
                        </p>
                        {cameraError && (
                          <p className="text-xs text-rose-400 font-mono bg-rose-950/60 p-2 rounded border border-rose-800/80">
                            {cameraError}
                          </p>
                        )}
                      </div>
                    )}

                    {/* HUD Bounding Box Guides */}
                    <div className="absolute inset-4 border border-zinc-500/20 rounded-lg pointer-events-none flex flex-col justify-between p-3 font-mono text-[10px] text-zinc-400 z-20">
                      <div className="flex justify-between">
                        <span className="bg-black/40 px-1.5 py-0.5 rounded">[ROI_TRACK_ACTIVE]</span>
                        <span className="bg-black/40 px-1.5 py-0.5 rounded">
                          {latestFrame?.hands.length
                            ? `${latestFrame.hands.length * 21}_LANDMARKS_DETECTED`
                            : "CALIBRATED_21_LANDMARKS"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="bg-black/40 px-1.5 py-0.5 rounded">
                          FPS: {metrics.fps || 60} | LATENCY: {metrics.visionLatencyMs || visionLatency}ms
                        </span>
                        <span className="bg-black/40 px-1.5 py-0.5 rounded">TARGET: UPPER BODY + HANDS</span>
                      </div>
                    </div>
                  </div>

                  {/* Camera Controls Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleCamera}
                        className="btn-primary text-xs sm:text-sm cursor-pointer"
                      >
                        {cameraStatus === "active" ? (
                          <VideoOff className="w-4 h-4" />
                        ) : (
                          <Video className="w-4 h-4" />
                        )}
                        <span>{cameraStatus === "active" ? "Stop Camera" : "Start Real-Time Camera"}</span>
                      </button>

                      {cameraStatus === "active" && (
                        <button
                          type="button"
                          onClick={toggleFacingMode}
                          className="btn-secondary text-xs py-2 px-3 cursor-pointer"
                          title="Flip Camera (Front/Rear)"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Flip ({facingMode})</span>
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Privacy: 100% Client-Side Processing</span>
                    </div>
                  </div>

                  {/* Quick Demo Toolbar (for easy instant verification) */}
                  <div className="mt-4 pt-4 border-t border-zinc-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono uppercase text-zinc-500 font-semibold">
                        Instant Sign Demo Simulator
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">Click to append gesture</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {demoSigns.map((sign) => (
                        <button
                          key={sign}
                          type="button"
                          onClick={() => {
                            forceDemoSign(sign);
                            setFallbackTranscript((prev) => `${prev} ${sign}`.trim());
                          }}
                          className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-zinc-100 hover:bg-amethyst_smoke-400 hover:text-white text-zinc-800 border border-zinc-200 transition-colors cursor-pointer"
                        >
                          +{sign}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Speech & Transcription Feed (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100">
                      <div>
                        <h3 className="font-bold text-zinc-900 text-base">Live Translated Transcript</h3>
                        <p className="text-xs text-zinc-500">Output Stream for Muted Voice</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {sentenceTokens.length > 0 && (
                          <button
                            type="button"
                            onClick={removeLastToken}
                            title="Backspace token"
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded cursor-pointer"
                          >
                            <Delete className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            clearSentence();
                            setFallbackTranscript("");
                          }}
                          title="Clear transcript"
                          className="p-1.5 text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-500 mb-3">
                      Recognized gestures are automatically converted into grammatical English text for listening peers.
                    </p>

                    {/* Live Transcript Display Box */}
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 min-h-[170px] flex flex-col justify-between mb-4">
                      <div className="font-mono text-sm text-zinc-900 leading-relaxed break-words">
                        {displayTranscript}
                      </div>

                      {sentenceTokens.length > 0 && (
                        <div className="pt-3 border-t border-zinc-200/60 mt-3 flex flex-wrap gap-1">
                          {sentenceTokens.map((tokenItem, idx) => (
                            <span
                              key={tokenItem.id || idx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-white font-semibold"
                            >
                              {tokenItem.token}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Audio Output & Copy Actions for Muted Individuals */}
                  <div className="space-y-3 pt-3 border-t border-zinc-100">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSpeak}
                        className="flex-1 btn-primary text-xs sm:text-sm cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Speak Aloud (TTS)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="btn-secondary text-xs sm:text-sm cursor-pointer"
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? "Copied!" : "Copy Text"}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-[11px] font-mono text-zinc-600 flex items-center justify-between">
                      <span>Model Engine: {modelType.toUpperCase()}</span>
                      <button
                        type="button"
                        onClick={() => switchModel(modelType === "heuristic" ? "onnx" : "heuristic")}
                        className="text-amethyst_smoke-400 hover:underline font-semibold cursor-pointer"
                      >
                        Switch to {modelType === "heuristic" ? "ONNX Model" : "Heuristic Model"}
                      </button>
                    </div>

                    <p className="text-[11px] text-zinc-400 text-center font-mono">
                      Text-To-Speech enables muted users to communicate vocally in real time without delays.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Translation View 2: Text to Animation */}
        {activeMode === "textToAnim" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Input & Phrase Controller (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <label
                    htmlFor="text-to-sign-input"
                    className="block text-xs font-mono uppercase text-zinc-500 mb-2 font-semibold"
                  >
                    Input Sentence or Phrase
                  </label>
                  <div className="space-y-3">
                    <textarea
                      id="text-to-sign-input"
                      rows={3}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="input-minimal"
                      placeholder="Type words to convert into animated gestures..."
                    />

                    <button
                      type="button"
                      onClick={() => handleGenerateAnimation(textInput)}
                      className="w-full btn-primary cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Sign Animation</span>
                    </button>
                  </div>
                </div>

                {/* Deconstructed Tokens Card */}
                <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-zinc-500 font-semibold">
                      Deconstructed Tokens
                    </span>
                    <span className="text-xs font-mono text-zinc-900 font-semibold">
                      {animTokens.length} Signs Generated
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {animTokens.map((token, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedTokenIndex(index)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded border text-xs font-mono transition-colors cursor-pointer ${
                          selectedTokenIndex === index
                            ? "bg-zinc-900 text-white border-zinc-900 font-semibold"
                            : "bg-white text-zinc-800 border-zinc-300 hover:border-zinc-500"
                        }`}
                      >
                        {index + 1}. {token}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Animated Sign Playback Canvas (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-900 text-base">Sign Token : {currentToken}</h3>
                      <p className="text-xs text-zinc-500">
                        Step {selectedTokenIndex + 1} of {animTokens.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPlayingSeq(!isPlayingSeq)}
                        className="btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                      >
                        {isPlayingSeq ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingSeq ? "Pause" : "Play Sequence"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Animated Display Screen */}
                  <div className="w-full bg-zinc-950 rounded-xl aspect-video flex flex-col items-center justify-center p-8 text-center relative overflow-hidden border border-zinc-800">
                    <div className="w-24 h-24 rounded-full border border-zinc-700 bg-zinc-900 flex items-center justify-center text-zinc-300 mb-4 animate-pulse shadow-md">
                      <Hand className="w-12 h-12 text-amethyst_smoke-400" />
                    </div>
                    <p className="text-white font-mono text-sm tracking-widest uppercase mb-1">
                      Gesture Motion Sequence
                    </p>
                    <p className="text-zinc-400 font-mono text-xs mb-3">
                      Token [{selectedTokenIndex + 1}/{animTokens.length}]: {currentToken}
                    </p>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Frame: 24 / 48</span>
                      <span>Target: Standard ISL/ASL Gloss</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-zinc-500 font-mono">
                    <span>Playback Speed: 1.0x (1.2s per sign)</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMode("videoToText");
                        if (cameraStatus !== "active") {
                          startCamera(facingMode);
                        }
                      }}
                      className="text-amethyst_smoke-400 hover:underline font-semibold cursor-pointer"
                    >
                      Verify this gesture with camera →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
