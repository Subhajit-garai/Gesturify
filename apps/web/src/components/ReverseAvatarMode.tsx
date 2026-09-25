"use client";

import React, { useState, useEffect } from "react";
import { sttService } from "@/speech/speechToText";
import { SIGN_VOCABULARY, SignItem } from "@/config/signVocabulary";
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export const ReverseAvatarMode: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [matchedSigns, setMatchedSigns] = useState<SignItem[]>([]);
  const [activeSignIndex, setActiveSignIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Match words from transcript to sign vocabulary
  useEffect(() => {
    if (!transcript) {
      setMatchedSigns([]);
      return;
    }

    const words = transcript.toLowerCase().split(/\s+/);
    const matches: SignItem[] = [];

    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, "");
      const found = SIGN_VOCABULARY.find(
        (item) =>
          item.label.toLowerCase() === cleanWord ||
          item.keywords.some((k) => k.toLowerCase() === cleanWord)
      );
      if (found && !matches.some((m) => m.id === found.id)) {
        matches.push(found);
      }
    }

    setMatchedSigns(matches);
    setActiveSignIndex(0);
  }, [transcript]);

  // Cycle through matched signs animation preview
  useEffect(() => {
    if (matchedSigns.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSignIndex((prev) => (prev + 1) % matchedSigns.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [matchedSigns]);

  const toggleListening = () => {
    if (isListening) {
      sttService.stopListening();
      setIsListening(false);
    } else {
      setErrorMessage(null);
      const ok = sttService.startListening(
        {
          onResult: (text, isFinal) => {
            setTranscript(text);
          },
          onError: (err) => {
            setErrorMessage(err);
            setIsListening(false);
          },
          onEnd: () => {
            setIsListening(false);
          },
        },
        "en-IN"
      );
      setIsListening(ok);
    }
  };

  const activeSign = matchedSigns[activeSignIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
      {/* Left Column: Voice Input & Transcription */}
      <div className="lg:col-span-6 space-y-4">
        <div className="p-6 rounded-3xl glass-panel-elevated border border-emerald-500/20 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Hearing Person Speech Input
                </h3>
                <p className="text-xs text-slate-400">
                  Speak clearly into microphone for reverse sign conversion
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isListening
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {isListening ? "Listening..." : "Microphone Idle"}
            </span>
          </div>

          {/* Microphone Action Button */}
          <div className="flex justify-center py-6">
            <button
              onClick={toggleListening}
              className={`relative group p-6 rounded-full transition-all duration-300 cursor-pointer ${
                isListening
                  ? "bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.6)] animate-pulse"
                  : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]"
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 text-white" />
              ) : (
                <Mic className="w-10 h-10 text-surface-darker" />
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 text-center">
              {errorMessage}
            </div>
          )}

          {/* Live Transcript Display */}
          <div className="p-4 rounded-2xl bg-surface-darker/70 border border-slate-800 min-h-[110px] flex flex-col justify-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
              Recognized Speech Transcript
            </span>
            <p className="text-base text-slate-200 italic">
              {transcript ? (
                `"${transcript}"`
              ) : (
                <span className="text-slate-500 not-italic">
                  Click the microphone button and say something like: &ldquo;Hello, do you need water or food?&rdquo;
                </span>
              )}
            </p>
          </div>

          {/* Sample quick prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Quick test phrases:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Hello, thank you!",
                "Do you need water?",
                "Please help me find hospital",
                "Yes, food is ready",
              ].map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => setTranscript(phrase)}
                  className="px-3 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700/60 transition-colors cursor-pointer"
                >
                  &ldquo;{phrase}&rdquo;
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Sign Avatar Representation */}
      <div className="lg:col-span-6 space-y-4">
        <div className="p-6 rounded-3xl glass-panel-elevated border border-cyan-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                Visual Sign Representation
              </h3>
            </div>
            {matchedSigns.length > 0 && (
              <span className="text-xs text-cyan-300 font-mono">
                Sign {activeSignIndex + 1} of {matchedSigns.length}
              </span>
            )}
          </div>

          {/* Active Visual Sign Card / Graphic Avatar */}
          {activeSign ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-surface-dark to-slate-900 border border-cyan-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">
                    {activeSign.category}
                  </span>
                  <h2 className="text-3xl font-black text-white mt-0.5">
                    {activeSign.label}
                  </h2>
                  <p className="text-sm text-slate-300 font-medium">
                    {activeSign.hindiLabel}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-2xl shadow-inner">
                  {activeSign.label.charAt(0)}
                </div>
              </div>

              {/* Graphic ISL Gesture Avatar Visualization */}
              <div className="relative aspect-video rounded-xl bg-surface-darker/90 border border-cyan-500/20 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-400/60 flex items-center justify-center mb-3 animate-spin duration-1000">
                  <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs">
                    ISL
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-200 max-w-sm">
                  {activeSign.description}
                </p>

                <div className="mt-3 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  Movement: {activeSign.movementType.replace("_", " ")}
                </div>
              </div>

              {/* Gesture Execution Instructions */}
              <div className="p-3.5 rounded-xl bg-surface-darker/80 border border-slate-800 text-xs text-slate-300">
                <strong className="text-cyan-300 block mb-1">
                  How the Deaf person reads this sign:
                </strong>
                {activeSign.gestureGuide}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Layers className="w-12 h-12 mx-auto mb-3 text-slate-600 animate-pulse" />
              <p className="text-sm font-medium">
                No sign keywords detected in speech yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Say words like &ldquo;hello&rdquo;, &ldquo;water&rdquo;, &ldquo;food&rdquo;, &ldquo;help&rdquo;, &ldquo;hospital&rdquo; to trigger the sign avatar.
              </p>
            </div>
          )}

          {/* Sequence of matched signs chips */}
          {matchedSigns.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Visualized Sign Sequence:
              </span>
              <div className="flex flex-wrap gap-2">
                {matchedSigns.map((sign, idx) => (
                  <button
                    key={sign.id}
                    onClick={() => setActiveSignIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      idx === activeSignIndex
                        ? "bg-cyan-500 text-surface-darker shadow-md shadow-cyan-500/30 scale-105"
                        : "bg-surface-darker text-slate-400 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {idx + 1}. {sign.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
