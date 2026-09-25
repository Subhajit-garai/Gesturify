"use client";

import React from "react";
import { Prediction } from "@/types";
import { ConfidenceBar } from "./ConfidenceBar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PredictionCardProps {
  prediction: Prediction;
  stabilityRatio: number;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  stabilityRatio,
}) => {
  const isEmergency = prediction.category === "EMERGENCY";
  const isRecognized =
    prediction.label &&
    !["WAITING FOR GESTURE", "NO HANDS DETECTED", "SEARCHING", "ANALYZING..."].includes(
      prediction.label
    );

  return (
    <Card
      className={`transition-all duration-300 ${
        isEmergency
          ? "bg-rose-950/30 border-2 border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.25)]"
          : "glass-panel-elevated border border-cyan-500/30"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isRecognized ? "bg-emerald-400 animate-ping" : "bg-cyan-500/40"
              }`}
            />
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Current Detected Sign
            </span>
          </div>

          {prediction.category && (
            <Badge
              variant={isEmergency ? "destructive" : "neon"}
              className="text-[11px] uppercase tracking-wide font-bold"
            >
              {prediction.category}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Main Sign Display */}
        <div className="my-2 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
            <h2
              className={`text-3xl sm:text-4xl font-black tracking-tight ${
                isEmergency
                  ? "text-rose-400"
                  : isRecognized
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-300"
                  : "text-slate-500 font-mono text-xl sm:text-2xl"
              }`}
            >
              {prediction.label}
            </h2>

            {prediction.hindiLabel && (
              <span className="text-sm font-medium text-slate-300/80 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                {prediction.hindiLabel}
              </span>
            )}
          </div>
        </div>

        {/* Confidence & Temporal Stability Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-700/40">
          <ConfidenceBar confidence={prediction.confidence} threshold={0.8} />

          {/* Temporal Stability progress */}
          <div className="w-full space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Temporal Lock</span>
              <span className="font-mono text-cyan-400">
                {Math.round(stabilityRatio * 100)}%
              </span>
            </div>
            <Progress
              value={Math.round(stabilityRatio * 100)}
              indicatorColor="bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
