"use client";

import React from "react";
import { Sparkles, BookOpen, Layers } from "lucide-react";

interface DemoModeBarProps {
  onTriggerSign: (sign: string) => void;
  onOpenDictionary: () => void;
}

export const DemoModeBar: React.FC<DemoModeBarProps> = ({
  onTriggerSign,
  onOpenDictionary,
}) => {
  const quickSigns = [
    "HELLO",
    "WATER",
    "HELP",
    "THANK YOU",
    "YES",
    "NO",
    "FOOD",
    "HOSPITAL",
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-cyan-500/20 bg-surface-darker/60 text-xs">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-200">Hackathon Demo Mode:</span>
          <span className="text-slate-400 ml-1.5 hidden sm:inline">
            Quickly simulate signs or test camera recognition
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {quickSigns.map((sign) => (
          <button
            key={sign}
            onClick={() => onTriggerSign(sign)}
            className="px-2.5 py-1 rounded-lg bg-surface-dark hover:bg-cyan-950/80 text-cyan-300 hover:text-white border border-slate-700/80 hover:border-cyan-500/40 font-mono font-medium transition-all shadow-sm cursor-pointer active:scale-95"
          >
            {sign}
          </button>
        ))}

        <button
          onClick={onOpenDictionary}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-200 hover:text-white border border-cyan-500/40 font-semibold transition-all ml-1 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>ISL Dictionary</span>
        </button>
      </div>
    </div>
  );
};
