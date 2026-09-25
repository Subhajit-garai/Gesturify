"use client";

import React from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface StatusIndicatorProps {
  cameraReady: boolean;
  visionReady: boolean;
  modelReady: boolean;
  stageMessage: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  cameraReady,
  visionReady,
  modelReady,
  stageMessage,
}) => {
  const steps = [
    { label: "Initializing camera", ready: cameraReady },
    { label: "Loading hand & pose detector", ready: visionReady },
    { label: "Loading sign recognition model", ready: modelReady },
  ];

  const allReady = cameraReady && visionReady && modelReady;

  return (
    <div className="flex flex-wrap items-center gap-4 py-2 px-4 rounded-xl glass-panel border border-cyan-500/20 text-xs">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-300">Pipeline:</span>
        {allReady ? (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Ready to Interpret
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold flex items-center gap-1 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            {stageMessage}
          </span>
        )}
      </div>

      <div className="hidden md:flex items-center gap-3 border-l border-slate-700/60 pl-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-slate-400">
            {step.ready ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-600" />
            )}
            <span className={step.ready ? "text-slate-200" : "text-slate-500"}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
