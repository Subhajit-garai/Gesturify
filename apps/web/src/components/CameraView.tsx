"use client";

import React, { useState } from "react";
import { CameraFacingMode, CameraStatus, VisionFrameResult } from "@/types";
import { LandmarkOverlay } from "./LandmarkOverlay";
import {
  Camera,
  AlertTriangle,
  RefreshCw,
  Eye,
  CheckCircle,
  Shield,
  Layers,
  Sparkles,
} from "lucide-react";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  errorMessage: string | null;
  facingMode: CameraFacingMode;
  frameResult: VisionFrameResult | null;
  onRetry: () => void;
  fps: number;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  status,
  errorMessage,
  facingMode,
  frameResult,
  onRetry,
  fps,
}) => {
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    setVideoDimensions({
      width: video.videoWidth || 640,
      height: video.videoHeight || 480,
    });
  };

  const handsCount = frameResult?.hands.length || 0;
  const isPoseDetected = !!frameResult?.pose;

  return (
    <div className="relative w-full aspect-video bg-surface-darker rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl group">
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={handleLoadedMetadata}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          facingMode === "user" ? "scale-x-[-1]" : "scale-x-100"
        }`}
      />

      {/* MediaPipe Neon Landmark Overlay */}
      {status === "active" && (
        <LandmarkOverlay
          frameResult={frameResult}
          videoWidth={videoDimensions.width}
          videoHeight={videoDimensions.height}
          facingMode={facingMode}
        />
      )}

      {/* Target Crosshair & Guide Frame */}
      {status === "active" && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Subtle bounding guide for optimal signing distance */}
          <div className="w-[85%] h-[80%] border border-cyan-500/15 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />
          </div>
        </div>
      )}

      {/* Top Floating Telemetry Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2">
          {/* Active Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium glass-panel border border-cyan-500/30 text-cyan-300">
            <span
              className={`w-2 h-2 rounded-full ${
                status === "active"
                  ? "bg-emerald-400 animate-pulse"
                  : "bg-amber-400 animate-ping"
              }`}
            />
            {status === "active" ? (
              <span className="uppercase tracking-wider font-semibold">
                LIVE {facingMode === "environment" ? "REAR CAM" : "FRONT CAM"}
              </span>
            ) : (
              <span>CONNECTING...</span>
            )}
          </div>

          {/* FPS Counter */}
          {status === "active" && (
            <div className="px-2.5 py-1 rounded-full text-xs font-mono glass-panel border border-slate-700/60 text-slate-300">
              {fps} FPS
            </div>
          )}
        </div>

        {/* Hands & Pose Tracker Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs glass-panel border border-slate-700/60">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">
              Hands:{" "}
              <strong className={handsCount > 0 ? "text-emerald-400" : "text-amber-400"}>
                {handsCount}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs glass-panel border border-slate-700/60 text-slate-400">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">100% On-Device</span>
          </div>
        </div>
      </div>

      {/* Guide prompt when hands aren't detected */}
      {status === "active" && handsCount === 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl glass-panel-elevated border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center gap-2 shadow-lg animate-pulse">
          <Eye className="w-4 h-4 text-amber-400" />
          <span>Keep your hands visible inside the frame to begin signing</span>
        </div>
      )}

      {/* Idle / Requesting Overlay */}
      {status === "requesting" && (
        <div className="absolute inset-0 bg-surface-darker/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <RefreshCw className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
          <h3 className="text-lg font-semibold text-white">Starting Camera Stream</h3>
          <p className="text-slate-400 text-sm max-w-sm mt-1">
            Requesting access to your {facingMode === "environment" ? "rear" : "front"} camera...
          </p>
        </div>
      )}

      {/* Error & Permission Denied States */}
      {(status === "denied" ||
        status === "not-found" ||
        status === "busy" ||
        status === "error" ||
        status === "unsupported") && (
        <div className="absolute inset-0 bg-surface-darker/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">Camera Unavailable</h3>
          <p className="text-slate-300 text-sm max-w-md mb-6 leading-relaxed">
            {errorMessage ||
              "Could not establish connection to device camera. Please verify camera permissions."}
          </p>

          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Camera Access
          </button>
        </div>
      )}

      {/* Initial Idle Splash */}
      {status === "idle" && (
        <div className="absolute inset-0 bg-gradient-to-br from-surface-dark via-surface-darker to-[#090d16] flex flex-col items-center justify-center p-6 text-center z-30">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400 shadow-inner">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Camera Initializing</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-6">
            SignBridge AI requires camera input to interpret sign language.
          </p>
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold text-sm transition-all shadow-lg cursor-pointer"
          >
            Start Camera Feed
          </button>
        </div>
      )}
    </div>
  );
};
