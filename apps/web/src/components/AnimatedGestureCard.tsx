"use client";

import React, { useState } from "react";
import { SignItem } from "@/config/signVocabulary";
import { Hand, Waves, MoveRight, ArrowDownUp, Users, RefreshCw } from "lucide-react";

interface AnimatedGestureCardProps {
  sign: SignItem;
  showAnswer?: boolean;
}

export const AnimatedGestureCard: React.FC<AnimatedGestureCardProps> = ({
  sign,
  showAnswer = false,
}) => {
  const [animationKey, setAnimationKey] = useState(0);

  const replay = () => setAnimationKey((k) => k + 1);

  // Determine movement icon and visual helper
  const getMovementMetadata = () => {
    switch (sign.movementType) {
      case "DYNAMIC_WAVE":
        return {
          label: "Waving Motion",
          icon: <Waves className="w-3.5 h-3.5 text-cyan-400" />,
          animationClass: "animate-bounce duration-1000",
        };
      case "DYNAMIC_SWIPE":
        return {
          label: "Sweeping Forward",
          icon: <MoveRight className="w-3.5 h-3.5 text-amber-400" />,
          animationClass: "animate-pulse duration-700",
        };
      case "DYNAMIC_TAP":
        return {
          label: "Tapping Motion",
          icon: <ArrowDownUp className="w-3.5 h-3.5 text-emerald-400" />,
          animationClass: "animate-ping duration-1000",
        };
      case "TWO_HANDED":
        return {
          label: "Two-Handed Gesture",
          icon: <Users className="w-3.5 h-3.5 text-purple-400" />,
          animationClass: "animate-pulse duration-1000",
        };
      default:
        return {
          label: "Static Handshape",
          icon: <Hand className="w-3.5 h-3.5 text-cyan-400" />,
          animationClass: "animate-none",
        };
    }
  };

  const meta = getMovementMetadata();

  return (
    <div
      key={animationKey}
      className="p-5 rounded-2xl bg-gradient-to-br from-surface-darker via-surface-dark to-[#070b14] border border-cyan-500/30 shadow-xl flex flex-col items-center text-center relative overflow-hidden"
    >
      {/* Top Movement Badge & Replay Button */}
      <div className="w-full flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-mono text-[11px]">
          {meta.icon}
          <span>{meta.label}</span>
        </div>

        <button
          onClick={replay}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          title="Replay animation"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Replay</span>
        </button>
      </div>

      {/* Main Animated Hand Avatar Canvas / SVG Render */}
      <div className="py-6 flex flex-col items-center justify-center">
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer glowing ripple ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-30" />

          {/* Core circular hand stage */}
          <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Hand
              className={`w-12 h-12 text-cyan-300 transition-transform ${
                sign.movementType === "DYNAMIC_WAVE"
                  ? "animate-[wiggle_1s_ease-in-out_infinite]"
                  : sign.movementType === "DYNAMIC_SWIPE"
                  ? "translate-x-1 duration-700"
                  : "scale-105"
              }`}
            />
          </div>

          {/* Movement Directional Arrow Helper */}
          {sign.movementType === "DYNAMIC_SWIPE" && (
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              <MoveRight className="w-4 h-4" />
            </div>
          )}
          {sign.movementType === "DYNAMIC_TAP" && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 p-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-bounce">
              <ArrowDownUp className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Gesture Movement Clue (Physical Description without revealing the name) */}
      <div className="p-3 rounded-xl bg-surface-darker/80 border border-slate-800 text-xs text-slate-300 max-w-md w-full">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
          Observed Hand Form & Movement:
        </span>
        <p className="italic text-slate-200">{sign.description}</p>
      </div>

      {/* If answer is revealed */}
      {showAnswer && (
        <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs w-full text-center">
          <strong>{sign.label}</strong> — {sign.hindiLabel}
        </div>
      )}
    </div>
  );
};
