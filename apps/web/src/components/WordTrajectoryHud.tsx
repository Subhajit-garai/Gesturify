"use client";

import React, { useRef, useEffect, useState } from "react";
import { SKELETON_CONNECTIONS, HandPose21, JointOffset } from "@/data/alphabetPoses";
import { HandMorphEngine } from "@/vision/handMorphEngine";
import { getWordTrajectory, WordTrajectory } from "@/data/wordTrajectories";
import { Sparkles, MapPin } from "lucide-react";

interface WordTrajectoryHudProps {
  targetWord?: string;
}

export default function WordTrajectoryHud({ targetWord = "Hello" }: WordTrajectoryHudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeTrajectoryRef = useRef<WordTrajectory>(getWordTrajectory(targetWord));
  const [activeWordLabel, setActiveWordLabel] = useState(targetWord);

  useEffect(() => {
    const traj = getWordTrajectory(targetWord);
    activeTrajectoryRef.current = traj;
    setActiveWordLabel(traj.word);
  }, [targetWord]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let wordStartTime: number | null = null;

    const render = (timestamp: number) => {
      // Clear background
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#191321";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // OpenCV Coordinate Grid
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

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 15;

      // 1. Upper-Body Wireframe Ghost
      ctx.strokeStyle = "rgba(184, 190, 221, 0.16)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      // Head silhouette
      ctx.beginPath();
      ctx.ellipse(cx, cy - 85, 30, 38, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Neck
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 47);
      ctx.lineTo(cx - 10, cy - 25);
      ctx.moveTo(cx + 10, cy - 47);
      ctx.lineTo(cx + 10, cy - 25);
      ctx.stroke();

      // Shoulders
      ctx.beginPath();
      ctx.moveTo(cx - 85, cy - 10);
      ctx.lineTo(cx - 15, cy - 22);
      ctx.lineTo(cx + 15, cy - 22);
      ctx.lineTo(cx + 85, cy - 10);
      ctx.stroke();

      // Torso
      ctx.beginPath();
      ctx.moveTo(cx - 75, cy - 10);
      ctx.lineTo(cx - 65, cy + 120);
      ctx.moveTo(cx + 75, cy - 10);
      ctx.lineTo(cx + 65, cy + 120);
      ctx.stroke();

      ctx.setLineDash([]);

      // 2. Trajectory Playback with Anti-Jank Settle & Return
      const traj = activeTrajectoryRef.current;
      if (wordStartTime === null) wordStartTime = timestamp;

      const baseDuration = traj.durationMs || 1500;
      const PAUSE_DURATION = 350; // Pause at end to let user absorb completed pose
      const RETURN_DURATION = 420; // Smooth cubic glide back to starting pose (anti-jank)
      const totalCycle = baseDuration + PAUSE_DURATION + RETURN_DURATION;
      const cycleElapsed = (timestamp - wordStartTime) % totalCycle;

      // Spatial Body Anchor Glow
      const anchor = {
        x: cx + traj.anchorOffset.x,
        y: cy + traj.anchorOffset.y,
      };

      const pulse = Math.sin(timestamp * 0.008) * 3;
      ctx.beginPath();
      ctx.arc(anchor.x, anchor.y, 7 + pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
      ctx.fill();
      ctx.strokeStyle = "rgba(16, 185, 129, 0.8)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
      ctx.fillText(`ANCHOR: ${traj.bodyAnchor}`, anchor.x + 12, anchor.y + 3);

      const kfs = traj.keyframes;
      const startKf = kfs[0];
      const endKf = kfs[kfs.length - 1];

      let rightWrist: JointOffset;
      let rightPose: HandPose21;
      let leftWrist: JointOffset | undefined;
      let leftPose: HandPose21 | undefined;

      if (cycleElapsed <= baseDuration) {
        // Phase A: Forward Trajectory Execution
        const progress = cycleElapsed / baseDuration;
        let k1 = kfs[0];
        let k2 = kfs[kfs.length - 1];

        for (let i = 0; i < kfs.length - 1; i++) {
          if (progress >= kfs[i].progress && progress <= kfs[i + 1].progress) {
            k1 = kfs[i];
            k2 = kfs[i + 1];
            break;
          }
        }

        const segmentSpan = Math.max(0.001, k2.progress - k1.progress);
        const segmentProgress = Math.min(1, Math.max(0, (progress - k1.progress) / segmentSpan));
        const easedProgress = HandMorphEngine.easeInOutCubic(segmentProgress);

        rightWrist = {
          x: cx + HandMorphEngine.lerp(k1.rightWrist.x, k2.rightWrist.x, easedProgress),
          y: cy + HandMorphEngine.lerp(k1.rightWrist.y, k2.rightWrist.y, easedProgress),
        };
        rightPose = HandMorphEngine.interpolate(k1.rightPose, k2.rightPose, easedProgress);

        if (traj.isTwoHanded && k1.leftWrist && k2.leftWrist && k1.leftPose && k2.leftPose) {
          leftWrist = {
            x: cx + HandMorphEngine.lerp(k1.leftWrist.x, k2.leftWrist.x, easedProgress),
            y: cy + HandMorphEngine.lerp(k1.leftWrist.y, k2.leftWrist.y, easedProgress),
          };
          leftPose = HandMorphEngine.interpolate(k1.leftPose, k2.leftPose, easedProgress);
        }
      } else if (cycleElapsed <= baseDuration + PAUSE_DURATION) {
        // Phase B: Settle at Completed Pose (350ms)
        rightWrist = { x: cx + endKf.rightWrist.x, y: cy + endKf.rightWrist.y };
        rightPose = endKf.rightPose;
        if (traj.isTwoHanded && endKf.leftWrist && endKf.leftPose) {
          leftWrist = { x: cx + endKf.leftWrist.x, y: cy + endKf.leftWrist.y };
          leftPose = endKf.leftPose;
        }
      } else {
        // Phase C: Smooth Anti-Jank Glide back to Starting Pose
        const returnElapsed = cycleElapsed - baseDuration - PAUSE_DURATION;
        const returnProgress = Math.min(1, returnElapsed / RETURN_DURATION);
        const easedReturn = HandMorphEngine.easeInOutCubic(returnProgress);

        rightWrist = {
          x: cx + HandMorphEngine.lerp(endKf.rightWrist.x, startKf.rightWrist.x, easedReturn),
          y: cy + HandMorphEngine.lerp(endKf.rightWrist.y, startKf.rightWrist.y, easedReturn),
        };
        rightPose = HandMorphEngine.interpolate(endKf.rightPose, startKf.rightPose, easedReturn);

        if (traj.isTwoHanded && endKf.leftWrist && startKf.leftWrist && endKf.leftPose && startKf.leftPose) {
          leftWrist = {
            x: cx + HandMorphEngine.lerp(endKf.leftWrist.x, startKf.leftWrist.x, easedReturn),
            y: cy + HandMorphEngine.lerp(endKf.leftWrist.y, startKf.leftWrist.y, easedReturn),
          };
          leftPose = HandMorphEngine.interpolate(endKf.leftPose, startKf.leftPose, easedReturn);
        }
      }

      // Render Left hand first (underneath), then Right hand on top (natural depth)
      if (traj.isTwoHanded && leftWrist && leftPose) {
        renderHand(ctx, leftWrist, leftPose, true);
      }
      renderHand(ctx, rightWrist, rightPose, false);

      // Motion Trail
      ctx.strokeStyle = "rgba(184, 190, 221, 0.25)";
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      kfs.forEach((kf, idx) => {
        const px = cx + kf.rightWrist.x;
        const py = cy + kf.rightWrist.y;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Corner Brackets
      drawCornerBrackets(ctx, cx - 115, cy - 130, 230, 255);

      // Telemetry
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillText("MODE: WORD TRAJECTORY (ANTI-JANK)", 16, canvas.height - 16);
      ctx.fillText(`WORD: '${traj.word}'`, canvas.width - 160, canvas.height - 16);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetWord]);

  function renderHand(
    ctx: CanvasRenderingContext2D,
    wrist: JointOffset,
    pose: HandPose21,
    isLeftHand: boolean
  ) {
    const HAND_SCALE = 0.52; // Scale anatomically proportional to upper body
    const screenJoints: Record<number, { x: number; y: number }> = {};
    for (let id = 0; id <= 20; id++) {
      const offset = pose[id] || { x: 0, y: 0 };
      screenJoints[id] = {
        x: wrist.x + offset.x * HAND_SCALE,
        y: wrist.y + offset.y * HAND_SCALE,
      };
    }

    ctx.strokeStyle = isLeftHand ? "rgba(167, 139, 250, 0.85)" : "rgba(184, 190, 221, 0.85)";
    ctx.lineWidth = 2.0;
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

    for (let id = 0; id <= 20; id++) {
      const pt = screenJoints[id];
      if (!pt) continue;
      const isAnchor = id === 0 || id === 4 || id === 8 || id === 12;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isAnchor ? 4 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isLeftHand
        ? isAnchor ? "#c084fc" : "#e9d5ff"
        : isAnchor ? "#f0a6ca" : "#efc3e6";
      ctx.fill();
      ctx.strokeStyle = "#3d3050";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  function drawCornerBrackets(
    ctx: CanvasRenderingContext2D,
    bx: number,
    by: number,
    bw: number,
    bh: number
  ) {
    const cornerLen = 14;
    ctx.strokeStyle = "#b8bedd";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, by + cornerLen);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + cornerLen, by);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by);
    ctx.lineTo(bx + bw, by);
    ctx.lineTo(bx + bw, by + cornerLen);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx, by + bh - cornerLen);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + cornerLen, by + bh);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by + bh - cornerLen);
    ctx.stroke();
  }

  const wordTraj = getWordTrajectory(targetWord);

  return (
    <div className="border border-zinc-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-zinc-800">
            Word Trajectory Visualizer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-minimal">Word: {wordTraj.word}</span>
          <span className="font-mono text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            TRAJECTORY CACHED
          </span>
        </div>
      </div>

      {/* Canvas HUD Frame */}
      <div className="opencv-hud aspect-video w-full rounded-xl overflow-hidden relative">
        <canvas ref={canvasRef} width={640} height={360} className="w-full h-full block" />
        <div className="opencv-badge">
          <div className="opencv-status-dot" />
          <span>TRAJECTORY_LOOP</span>
        </div>
      </div>

      {/* Physical Instructions Guide for Word */}
      <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center">
              {wordTraj.word.charAt(0)}
            </span>
            <h4 className="font-bold text-sm text-zinc-900">{wordTraj.word} Sign Motion</h4>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-200/80 text-zinc-700 font-medium">
            {wordTraj.category} • {wordTraj.bodyAnchor}
          </span>
        </div>

        {/* Summary Banner */}
        <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
          {wordTraj.summary}
        </p>

        {/* Step-by-Step Instructions */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider block">
            Motion &amp; Anchor Steps:
          </span>
          {wordTraj.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
              <span className="w-5 h-5 rounded-full bg-zinc-200/90 text-zinc-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug">{step}</span>
            </div>
          ))}
        </div>

        {/* Pro-Tip Callout */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2 text-xs text-amber-950 mt-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold font-mono text-[10px] uppercase text-amber-800 mr-1.5 bg-amber-200/50 px-1 py-0.5 rounded">
              PRO-TIP
            </span>
            <span>{wordTraj.proTip}</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1">
        <span>Upper-Body Spatiotemporal Engine</span>
        <span className="text-emerald-600 font-medium">
          {wordTraj.isTwoHanded ? "Two-Handed Dynamic" : "Single-Hand Dynamic"}
        </span>
      </div>
    </div>
  );
}
