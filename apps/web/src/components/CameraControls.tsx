"use client";

import React from "react";
import { CameraFacingMode, CameraStatus } from "@/types";
import { SwitchCamera, Video, VideoOff, Cpu, RefreshCw } from "lucide-react";

interface CameraControlsProps {
  status: CameraStatus;
  facingMode: CameraFacingMode;
  devices: MediaDeviceInfo[];
  activeDeviceId?: string;
  modelType: "onnx" | "heuristic";
  onToggleFacingMode: () => void;
  onSelectDevice: (deviceId: string) => void;
  onToggleStream: () => void;
  onSwitchModel: (type: "onnx" | "heuristic") => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  status,
  facingMode,
  devices,
  activeDeviceId,
  modelType,
  onToggleFacingMode,
  onSelectDevice,
  onToggleStream,
  onSwitchModel,
}) => {
  const isRunning = status === "active";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border border-cyan-500/20 text-sm">
      {/* Left controls: Camera switch & toggles */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Toggle Stream (Start / Stop) */}
        <button
          onClick={onToggleStream}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all cursor-pointer ${
            isRunning
              ? "bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30"
              : "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30"
          }`}
          title={isRunning ? "Pause camera stream" : "Start camera stream"}
        >
          {isRunning ? (
            <>
              <VideoOff className="w-4 h-4 text-rose-400" />
              <span>Pause Camera</span>
            </>
          ) : (
            <>
              <Video className="w-4 h-4 text-emerald-400" />
              <span>Resume Camera</span>
            </>
          )}
        </button>

        {/* Switch Rear / Front camera */}
        <button
          onClick={onToggleFacingMode}
          disabled={!isRunning}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/30 text-cyan-200 hover:text-white hover:border-cyan-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          title="Switch between Rear and Front camera"
        >
          <SwitchCamera className="w-4 h-4 text-cyan-400" />
          <span>
            {facingMode === "environment"
              ? "Rear (ISL View)"
              : "Front (Selfie)"}
          </span>
        </button>

        {/* Multi-camera selector if available */}
        {devices.length > 1 && (
          <select
            value={activeDeviceId || ""}
            onChange={(e) => onSelectDevice(e.target.value)}
            disabled={!isRunning}
            className="px-3 py-2 rounded-xl bg-surface-dark border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {devices.map((device, i) => (
              <option key={device.deviceId || i} value={device.deviceId}>
                {device.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Right controls: AI Model Runtime Selector */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-surface-dark border border-slate-700/80">
          <button
            onClick={() => onSwitchModel("onnx")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              modelType === "onnx"
                ? "bg-cyan-500 text-surface-darker font-bold shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>ONNX Temporal</span>
          </button>

          <button
            onClick={() => onSwitchModel("heuristic")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              modelType === "heuristic"
                ? "bg-emerald-500 text-surface-darker font-bold shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Geometric Heuristic</span>
          </button>
        </div>
      </div>
    </div>
  );
};
