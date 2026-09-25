"use client";

import React, { useState, useRef, useEffect } from "react";
import { PlayCircle, Camera, Sparkles, Play, Pause, Video, VideoOff, Volume2, Copy, Check, Hand } from "lucide-react";

interface TranslationStudioProps {
  initialText?: string;
}

export default function TranslationStudio({ initialText = "Hello, nice to meet you" }: TranslationStudioProps) {
  const [activeMode, setActiveMode] = useState<"textToAnim" | "videoToText">("textToAnim");
  const [textInput, setTextInput] = useState(initialText);
  const [animTokens, setAnimTokens] = useState<string[]>(["HELLO", "NICE", "MEET", "YOU"]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);

  // Video to text state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [transcript, setTranscript] = useState("HELLO THANK YOU PLEASE");
  const [confidence, setConfidence] = useState(96.4);
  const [isCopied, setIsCopied] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Update text when initialText prop changes
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

  // Playback timer
  useEffect(() => {
    if (!isPlayingSeq || animTokens.length === 0) return;
    const interval = setInterval(() => {
      setSelectedTokenIndex((prev) => (prev + 1) % animTokens.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isPlayingSeq, animTokens]);

  // Camera toggle
  const toggleCamera = async () => {
    if (!isCameraActive) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } },
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setIsCameraActive(true);
        }
      } catch {
        alert("Camera permission denied or camera unavailable. Running simulated OpenCV landmark recognition.");
        setIsCameraActive(true);
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    }
  };

  // Simulated detection loop when camera is active
  useEffect(() => {
    if (!isCameraActive) return;
    const sampleWords = ["HELLO", "THANK YOU", "PLEASE", "YES", "HELP ME"];
    let step = 0;
    const interval = setInterval(() => {
      const nextWord = sampleWords[step % sampleWords.length];
      setTranscript((prev) => `${prev} ${nextWord}`.trim());
      setConfidence(Number((92 + Math.random() * 6).toFixed(1)));
      step++;
    }, 4000);
    return () => clearInterval(interval);
  }, [isCameraActive]);

  // TTS
  const handleSpeak = () => {
    if ("speechSynthesis" in window && transcript) {
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy
  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const currentToken = animTokens[selectedTokenIndex] || "HELLO";

  return (
    <section id="translation" className="py-16 border-b border-zinc-200 bg-zinc-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-200 gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Translation &amp; Video Studio</h2>
          </div>

          {/* Dual Mode Toggle */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200">
            <button
              type="button"
              onClick={() => setActiveMode("textToAnim")}
              className={`tab-btn ${activeMode === "textToAnim" ? "active" : ""}`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Text to Animation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("videoToText")}
              className={`tab-btn ${activeMode === "videoToText" ? "active" : ""}`}
            >
              <Camera className="w-4 h-4" />
              <span>Real-Time Video to Text</span>
            </button>
          </div>
        </div>

        {/* Translation View 1: Text to Animation */}
        {activeMode === "textToAnim" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Input & Phrase Controller (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <label htmlFor="text-to-sign-input" className="block text-xs font-mono uppercase text-zinc-500 mb-2">
                    Input Sentence or Phrase
                  </label>
                  <div className="space-y-3">
                    <textarea
                      id="text-to-sign-input"
                      rows={3}
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="input-minimal"
                      placeholder="Input text"
                    />

                    <button
                      type="button"
                      onClick={() => handleGenerateAnimation(textInput)}
                      className="w-full btn-primary"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Sign Animation</span>
                    </button>
                  </div>
                </div>

                {/* Kinematic Info Card */}
                <div className="p-5 bg-white border border-zinc-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-zinc-500">Deconstructed Tokens</span>
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
                        className={`flex-shrink-0 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
                          selectedTokenIndex === index
                            ? "bg-zinc-900 text-white border-zinc-900"
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
                      <h3 className="font-bold text-zinc-900 text-base">Sign : {currentToken}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPlayingSeq(!isPlayingSeq)}
                        className="btn-secondary text-xs py-1 px-3"
                      >
                        {isPlayingSeq ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingSeq ? "Pause" : "Play Sequence"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Animated Display Screen */}
                  <div className="w-full bg-zinc-950 rounded-xl aspect-video flex flex-col items-center justify-center p-8 text-center relative overflow-hidden border border-zinc-800">
                    <div className="w-24 h-24 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-300 mb-4 animate-pulse">
                      <Hand className="w-12 h-12" />
                    </div>
                    <p className="text-white font-mono text-sm tracking-widest uppercase mb-1">
                      Gesture Motion Sequence
                    </p>
                    <p className="text-zinc-400 font-mono text-xs mb-3">
                      Token [{selectedTokenIndex + 1}/{animTokens.length}]: {currentToken}
                    </p>
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Frame: 24 / 48</span>
                      <span>Target: Standard ASL Gloss</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-zinc-500 font-mono">
                    <span>Playback Speed: 1.0x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Translation View 2: Real-Time Video to Text */}
        {activeMode === "videoToText" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Video & Camera Stream HUD (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-zinc-900 animate-ping" />
                      <span className="font-mono text-xs uppercase font-bold text-zinc-800">
                        {isCameraActive ? "LIVE WEBCAM ACTIVE" : "OPENCV ENGINE READY"}
                      </span>
                    </div>
                    <span className="badge-minimal">Confidence: {confidence}%</span>
                  </div>

                  {/* Video HUD Container */}
                  <div className="relative w-full aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                    <video
                      ref={videoRef}
                      className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
                      autoPlay
                      playsInline
                      muted
                    />

                    {!isCameraActive && (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-12 h-12 rounded-full border border-zinc-700 bg-zinc-900 mx-auto flex items-center justify-center text-white">
                          <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-zinc-200">Real-Time Gesture Landmark Tracker</p>
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                          Click below to activate your webcam or run the simulated sign detection engine.
                        </p>
                      </div>
                    )}

                    {/* Overlay Bounding Box HUD */}
                    <div className="absolute inset-4 border border-zinc-500/30 rounded-lg pointer-events-none flex flex-col justify-between p-3 font-mono text-[10px] text-zinc-400">
                      <div className="flex justify-between">
                        <span>[ROI_TRACK_ACTIVE]</span>
                        <span>21_LANDMARKS_CALIBRATED</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ISO_AUTO | 60FPS</span>
                        <span>TARGET: UPPER BODY + HANDS</span>
                      </div>
                    </div>
                  </div>

                  {/* Camera Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={toggleCamera}
                      className="btn-primary text-xs sm:text-sm"
                    >
                      {isCameraActive ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      <span>{isCameraActive ? "Stop Camera" : "Start Real-Time Camera"}</span>
                    </button>

                    <div className="text-xs text-zinc-500 font-mono">
                      Privacy: Local client-side processing
                    </div>
                  </div>
                </div>
              </div>

              {/* Speech & Transcription Feed (5 Cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-100">
                      <h3 className="font-bold text-zinc-900 text-base">Live Translated Transcript</h3>
                      <span className="text-xs font-mono text-zinc-400">Output Stream</span>
                    </div>

                    <p className="text-xs text-zinc-500 mb-4">
                      Recognized gestures are automatically converted into readable English text for listening peers.
                    </p>

                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 min-h-[160px] font-mono text-sm text-zinc-900 leading-relaxed mb-4">
                      {transcript}
                    </div>
                  </div>

                  {/* Audio Output for Muted Individuals */}
                  <div className="space-y-3 pt-3 border-t border-zinc-100">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSpeak}
                        className="flex-1 btn-primary text-xs sm:text-sm"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Speak Aloud (TTS)</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="btn-secondary text-xs sm:text-sm"
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{isCopied ? "Copied!" : "Copy Text"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-400 text-center font-mono">
                      Text-To-Speech enables muted users to communicate vocally in real time.
                    </p>
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
