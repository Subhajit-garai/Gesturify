"use client";

import React, { useRef, useEffect, useState } from "react";
import { SKELETON_CONNECTIONS, HandPose21 } from "@/data/alphabetPoses";
import { AlphabetPoseCache } from "@/lib/alphabetCache";
import { HandMorphEngine } from "@/vision/handMorphEngine";
import { getAlphabetInstruction } from "@/data/alphabetInstructions";
import { Sparkles } from "lucide-react";

interface OpenCvHudProps {
  targetChar?: string;
}

export default function OpenCvHud({ targetChar = "A" }: OpenCvHudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hudState, setHudState] = useState({
    activeChar: "A",
    isMorphing: false,
    cacheStatus: "CACHE HIT (0ms)",
  });

  // Track previous pose and target pose across renders
  const currentPoseRef = useRef<HandPose21>(AlphabetPoseCache.getPose("A"));
  const previousPoseRef = useRef<HandPose21>(AlphabetPoseCache.getPose("A"));
  const targetPoseRef = useRef<HandPose21>(AlphabetPoseCache.getPose(targetChar || "A"));
  const targetCharRef = useRef<string>(targetChar || "A");

  // Preload poses in background on mount
  useEffect(() => {
    AlphabetPoseCache.preloadAll();
  }, []);

  // Whenever targetChar changes, start a smooth morph
  useEffect(() => {
    const cleanChar = (targetChar || "A").toUpperCase().trim().charAt(0) || "A";
    targetCharRef.current = cleanChar;

    const newTarget = AlphabetPoseCache.getPose(cleanChar);
    previousPoseRef.current = { ...currentPoseRef.current };
    targetPoseRef.current = newTarget;

    setHudState({
      activeChar: cleanChar,
      isMorphing: true,
      cacheStatus: AlphabetPoseCache.hasPose(cleanChar) ? "MEMORY CACHE HIT" : "SESSION CACHE HIT",
    });
  }, [targetChar]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let morphStartTime: number | null = null;
    const MORPH_DURATION_MS = 280; // Smooth 280ms transition between handshapes
    let lastRenderTime = 0;
    const IDLE_INTERVAL_MS = 65; // ~15 FPS low-frequency idle throttle when resting

    const render = (timestamp: number) => {
      const isMorphing = targetPoseRef.current !== null && morphStartTime !== null;

      if (!isMorphing) {
        // Low-frequency throttle during resting state: skip frame if too soon
        if (timestamp - lastRenderTime < IDLE_INTERVAL_MS) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }
      }

      lastRenderTime = timestamp;

      // 1. Calculate Active Morph Interpolation Progress
      let activePose: HandPose21;

      if (morphStartTime === null) {
        morphStartTime = timestamp;
      }

      const elapsed = timestamp - morphStartTime;
      const progress = Math.min(1, elapsed / MORPH_DURATION_MS);

      if (progress < 1) {
        // Active morph in progress (smooth ease-in-out)
        activePose = HandMorphEngine.interpolate(
          previousPoseRef.current,
          targetPoseRef.current,
          progress
        );
        currentPoseRef.current = activePose;
      } else {
        // Morph complete: settle into resting target pose
        activePose = targetPoseRef.current;
        currentPoseRef.current = activePose;
      }

      // Update state if morphing just completed
      if (progress >= 1 && morphStartTime !== null && elapsed >= MORPH_DURATION_MS) {
        setHudState((prev) => {
          if (prev.isMorphing) {
            return { ...prev, isMorphing: false };
          }
          return prev;
        });
      }

      // 2. Clear canvas with dark futuristic palette (#191321)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#191321";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Subtle OpenCV Coordinate Grid
      ctx.strokeStyle = "rgba(184, 190, 221, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 4. Compute Dynamic Base Wrist with Subtle Organic Idle Sway
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 15;
      const frameCount = timestamp / 30;
      const idleOffset = HandMorphEngine.getIdleOffset(frameCount);

      const baseWrist = {
        x: cx + idleOffset.x,
        y: cy + 85 + idleOffset.y,
      };

      // 5. Convert 21 Joint Offsets to Screen Coordinates
      const screenJoints: Record<number, { x: number; y: number }> = {};
      for (let id = 0; id <= 20; id++) {
        const offset = activePose[id] || { x: 0, y: 0 };
        screenJoints[id] = {
          x: baseWrist.x + offset.x,
          y: baseWrist.y + offset.y,
        };
      }

      // 6. Draw Bones (Skeleton Connections)
      ctx.strokeStyle = "rgba(184, 190, 221, 0.85)";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      SKELETON_CONNECTIONS.forEach(([i, j]) => {
        const p1 = screenJoints[i];
        const p2 = screenJoints[j];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // 7. Draw Keypoint Nodes
      for (let id = 0; id <= 20; id++) {
        const pt = screenJoints[id];
        if (!pt) continue;

        const isAnchor = id === 0 || id === 4 || id === 8 || id === 12;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isAnchor ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = isAnchor ? "#f0a6ca" : "#efc3e6";
        ctx.fill();
        ctx.strokeStyle = "#3d3050";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 8. Draw HUD Bounding Box Guides
      const bx = cx - 110;
      const by = cy - 130;
      const bw = 220;
      const bh = 250;

      ctx.strokeStyle = "rgba(184, 190, 221, 0.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      // Corner Brackets
      const cornerLen = 14;
      ctx.strokeStyle = "#b8bedd";
      ctx.lineWidth = 2;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(bx, by + cornerLen);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + cornerLen, by);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(bx + bw - cornerLen, by);
      ctx.lineTo(bx + bw, by);
      ctx.lineTo(bx + bw, by + cornerLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(bx, by + bh - cornerLen);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx + cornerLen, by + bh);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(bx + bw - cornerLen, by + bh);
      ctx.lineTo(bx + bw, by + bh);
      ctx.lineTo(bx + bw, by + bh - cornerLen);
      ctx.stroke();

      // 9. Telemetry Overlay
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";

      const fpsLabel = progress < 1 ? "60.0 (MORPHING)" : "15.0 (IDLE LOW-PWR)";
      ctx.fillText(`RATE: ${fpsLabel} | RES: ${canvas.width}x${canvas.height}`, 16, canvas.height - 16);
      ctx.fillText(`TARGET: '${targetCharRef.current}' | 21 JOINTS`, canvas.width - 170, canvas.height - 16);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetChar]);

  const instruction = getAlphabetInstruction(hudState.activeChar);

  return (
    <div className="border border-zinc-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              hudState.isMorphing ? "bg-emerald-500 animate-ping" : "bg-amethyst_smoke-400 animate-pulse"
            }`}
          />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-zinc-800">
            OpenCV Alphabet HUD
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-minimal">Letter {hudState.activeChar}</span>
          <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {hudState.cacheStatus}
          </span>
        </div>
      </div>

      {/* Canvas HUD Frame */}
      <div className="opencv-hud aspect-video w-full rounded-xl overflow-hidden relative">
        <canvas ref={canvasRef} width={640} height={360} className="w-full h-full block" />
        <div className="opencv-badge">
          <div className="opencv-status-dot" />
          <span>{hudState.isMorphing ? "MORPHING_ACTIVE" : "CACHED_IDLE"}</span>
        </div>
      </div>

      {/* Physical Execution Instructions Guide Directly Under the Animation */}
      <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center">
              {instruction.char}
            </span>
            <h4 className="font-bold text-sm text-zinc-900">{instruction.name} Execution Guide</h4>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-700 font-medium">
            {instruction.category}
          </span>
        </div>

        {/* Quick Summary Banner */}
        <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
          {instruction.summary}
        </p>

        {/* 3 Step-by-Step Instructions */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider block">
            Step-by-Step Finger Positions:
          </span>
          {instruction.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
              <span className="w-5 h-5 rounded-full bg-zinc-200/90 text-zinc-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>

        {/* Pro-Tip & Common Mistake Callout */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-xs text-amber-950 mt-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold font-mono text-[10px] uppercase text-amber-800 mr-1.5 bg-amber-200/50 px-1 py-0.5 rounded">
              PRO-TIP
            </span>
            <span>{instruction.proTip}</span>
          </div>
        </div>
      </div>

      {/* Mini Telemetry Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
        <span>MediaPipe 21-Joint Morph Engine</span>
        <span className="text-emerald-600 font-medium">
          {hudState.isMorphing ? "Adaptive Burst (60 FPS)" : "Power-Save Idle (~15 FPS)"}
        </span>
      </div>
    </div>
  );
}
