"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";

interface ConfidenceBarProps {
  confidence: number; // 0 to 1
  threshold?: number; // default 0.8
  label?: string;
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidence,
  threshold = 0.8,
  label = "Confidence",
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round(confidence * 100)));
  const isAboveThreshold = confidence >= threshold;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <span
          className={`font-mono font-bold ${
            isAboveThreshold ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {percentage}%
        </span>
      </div>

      <div className="relative">
        <Progress
          value={percentage}
          indicatorColor={
            isAboveThreshold
              ? "bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              : "bg-gradient-to-r from-amber-500 to-amber-400"
          }
        />
        {/* Threshold indicator tick */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400/60 pointer-events-none"
          style={{ left: `${threshold * 100}%` }}
          title={`Acceptance threshold (${threshold * 100}%)`}
        />
      </div>
    </div>
  );
};
