"use client";

import React, { useState } from "react";
import { TechnicalMetrics } from "@/types";
import { Activity, Cpu, ShieldCheck, ChevronDown, ChevronUp, Zap, Clock } from "lucide-react";

interface MetricsHUDProps {
  metrics: TechnicalMetrics;
}

export const MetricsHUD: React.FC<MetricsHUDProps> = ({ metrics }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl glass-panel border border-cyan-500/20 text-xs overflow-hidden transition-all shadow-md">
      {/* Header bar / Mini summary */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-darker/60 hover:bg-surface-dark/80 transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
            Technical AI Metrics
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="hidden sm:inline-block text-slate-400 font-mono">
            {metrics.fps} FPS · {metrics.inferenceLatencyMs}ms Inference
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            Local WASM
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded detailed grid */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-darker/90 border-t border-slate-800">
          <div className="p-2.5 rounded-xl bg-surface-dark/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Frame Rate</span>
            <div className="flex items-baseline gap-1 font-mono text-base font-bold text-cyan-400">
              {metrics.fps} <span className="text-[10px] text-slate-500">FPS</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-dark/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Inference Latency</span>
            <div className="flex items-baseline gap-1 font-mono text-base font-bold text-emerald-400">
              {metrics.inferenceLatencyMs} <span className="text-[10px] text-slate-500">ms</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-dark/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Vision Pipeline</span>
            <div className="flex items-baseline gap-1 font-mono text-base font-bold text-violet-400">
              {metrics.visionLatencyMs} <span className="text-[10px] text-slate-500">ms</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-dark/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Temporal Buffer</span>
            <div className="flex items-baseline gap-1 font-mono text-base font-bold text-slate-200">
              {metrics.sequenceBufferFill} <span className="text-[10px] text-slate-500">/ 30 frames</span>
            </div>
          </div>

          <div className="col-span-2 p-2.5 rounded-xl bg-surface-dark/60 border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-0.5">Active Model Architecture</span>
            <span className="font-mono text-xs text-slate-200 truncate block">
              {metrics.modelName}
            </span>
          </div>

          <div className="col-span-2 p-2.5 rounded-xl bg-surface-dark/60 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 block mb-0.5">Privacy & Inference</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% In-Browser Execution
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {metrics.resolution}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
