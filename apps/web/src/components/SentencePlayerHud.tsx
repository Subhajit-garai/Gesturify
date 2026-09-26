"use client";

import React, { useRef, useEffect, useState } from "react";
import { SKELETON_CONNECTIONS, HandPose21, JointOffset, ALPHABET_POSES } from "@/data/alphabetPoses";
import { HandMorphEngine } from "@/vision/handMorphEngine";
import { getWordTrajectory, WordTrajectory } from "@/data/wordTrajectories";
import { SentenceTemplate } from "@/data/gestures";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Gauge,
  Sparkles,
  Layers,
} from "lucide-react";

interface SentencePlayerHudProps {
  sentence: SentenceTemplate;
}

export default function SentencePlayerHud({ sentence }: SentencePlayerHudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Clean tokens from sentence
  const tokens = sentence.tokens && sentence.tokens.length > 0
    ? sentence.tokens
    : ["PLEASE", "HELP", "YOU"];

  const [activeTokenIdx, setActiveTokenIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<0.75 | 1.0>(1.0);

  // Reset to token 0 when sentence changes
  useEffect(() => {
    setActiveTokenIdx(0);
    activeTokenIdxRef.current = 0;
    tokensRef.current = tokens;
  }, [sentence]);

  // References for animation state
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  const activeTokenIdxRef = useRef(activeTokenIdx);
  activeTokenIdxRef.current = activeTokenIdx;

  const tokensRef = useRef(tokens);
  tokensRef.current = tokens;

  // Jump to specific token
  const handleSelectToken = (idx: number) => {
    setActiveTokenIdx(idx);
    activeTokenIdxRef.current = idx;
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePrevToken = () => {
    setActiveTokenIdx((prev) => (prev > 0 ? prev - 1 : tokens.length - 1));
  };

  const handleNextToken = () => {
    setActiveTokenIdx((prev) => (prev < tokens.length - 1 ? prev + 1 : 0));
  };

  const handleRestart = () => {
    setActiveTokenIdx(0);
    setIsPlaying(true);
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let wordStartTime: number | null = null;
    let isTransitioning = false;
    let transitionStartTime: number | null = null;
    const TRANSITION_DURATION_MS = 320; // 320ms smooth anti-jank glide between words

    // Store ending pose of current word for smooth transition
    let lastRightWrist: JointOffset = { x: 0, y: 35 };
    let lastRightPose: HandPose21 = {};
    let lastLeftWrist: JointOffset | undefined;
    let lastLeftPose: HandPose21 | undefined;

    const render = (timestamp: number) => {
      // 1. Clear complete canvas (ensures zero ghosting or overlapping residue)
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

      // Precise Centering Coordinates
      const cx = canvas.width / 2; // Exactly 320
      const cy = canvas.height / 2 + 10; // Exactly 190

      // ==========================================
      // 2. UPPER-BODY WIREFRAME GHOST (BALANCED & CENTERED)
      // ==========================================
      ctx.strokeStyle = "rgba(184, 190, 221, 0.16)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      // Head
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

      // ==========================================
      // 3. SENTENCE TRAJECTORY SEQUENCER (ANTI-JANK)
      // ==========================================
      const currentTokenList = tokensRef.current;
      const currentIdx = activeTokenIdxRef.current;
      const currentToken = currentTokenList[currentIdx] || "HELLO";
      const traj = getWordTrajectory(currentToken);

      // Adjusted duration based on playback speed
      const baseDuration = (traj.durationMs || 1400) / speedRef.current;

      // Draw Spatial Anchor Point
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
      ctx.fillText(`SIGN: ${traj.word}`, anchor.x + 12, anchor.y + 3);

      // Handle Transitions vs Word Trajectory Playback
      const nextKf = traj.keyframes[0];
      const nextHasLeft = !!(traj.isTwoHanded && nextKf.leftWrist && nextKf.leftPose);
      const prevHasLeft = !!(lastLeftWrist && lastLeftPose);
      const NEUTRAL_LEFT_WRIST: JointOffset = { x: -60, y: 100 };
      const NEUTRAL_LEFT_POSE = ALPHABET_POSES["B"];

      if (isTransitioning) {
        if (transitionStartTime === null) transitionStartTime = timestamp;
        const transitionElapsed = timestamp - transitionStartTime;
        const transProgress = Math.min(1, transitionElapsed / TRANSITION_DURATION_MS);
        const easedTrans = HandMorphEngine.easeInOutCubic(transProgress);

        // Smoothly interpolate right wrist from last word end -> next word start
        const rightWrist = {
          x: cx + HandMorphEngine.lerp(lastRightWrist.x, nextKf.rightWrist.x, easedTrans),
          y: cy + HandMorphEngine.lerp(lastRightWrist.y, nextKf.rightWrist.y, easedTrans),
        };
        const rightPose = HandMorphEngine.interpolate(lastRightPose, nextKf.rightPose, easedTrans);

        // Smoothly interpolate left wrist if either word has left hand (prevents popping/disappearing)
        if (prevHasLeft || nextHasLeft) {
          const leftStartWrist = prevHasLeft ? lastLeftWrist! : NEUTRAL_LEFT_WRIST;
          const leftStartPose = prevHasLeft ? lastLeftPose! : NEUTRAL_LEFT_POSE;
          const leftEndWrist = nextHasLeft ? nextKf.leftWrist! : NEUTRAL_LEFT_WRIST;
          const leftEndPose = nextHasLeft ? nextKf.leftPose! : NEUTRAL_LEFT_POSE;

          const leftWrist = {
            x: cx + HandMorphEngine.lerp(leftStartWrist.x, leftEndWrist.x, easedTrans),
            y: cy + HandMorphEngine.lerp(leftStartWrist.y, leftEndWrist.y, easedTrans),
          };
          const leftPose = HandMorphEngine.interpolate(leftStartPose, leftEndPose, easedTrans);
          renderHandSkeleton(ctx, leftWrist, leftPose, true);
        }

        renderHandSkeleton(ctx, rightWrist, rightPose, false);

        if (transProgress >= 1) {
          isTransitioning = false;
          transitionStartTime = null;
          wordStartTime = timestamp;
          if (!nextHasLeft) {
            lastLeftWrist = undefined;
            lastLeftPose = undefined;
          }
        }
      } else {
        if (wordStartTime === null) wordStartTime = timestamp;
        const elapsed = timestamp - wordStartTime;
        const progress = Math.min(1, elapsed / baseDuration);

        // Interpolate through word keyframes
        const kfs = traj.keyframes;
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

        // Left Hand first (underneath) if two-handed
        if (traj.isTwoHanded && k1.leftWrist && k2.leftWrist && k1.leftPose && k2.leftPose) {
          const leftWrist = {
            x: cx + HandMorphEngine.lerp(k1.leftWrist.x, k2.leftWrist.x, easedProgress),
            y: cy + HandMorphEngine.lerp(k1.leftWrist.y, k2.leftWrist.y, easedProgress),
          };
          const leftPose = HandMorphEngine.interpolate(k1.leftPose, k2.leftPose, easedProgress);
          lastLeftWrist = { x: leftWrist.x - cx, y: leftWrist.y - cy };
          lastLeftPose = leftPose;
          renderHandSkeleton(ctx, leftWrist, leftPose, true);
        } else {
          lastLeftWrist = undefined;
          lastLeftPose = undefined;
        }

        // Right Hand Position & Pose on top
        const rightWrist = {
          x: cx + HandMorphEngine.lerp(k1.rightWrist.x, k2.rightWrist.x, easedProgress),
          y: cy + HandMorphEngine.lerp(k1.rightWrist.y, k2.rightWrist.y, easedProgress),
        };
        const rightPose = HandMorphEngine.interpolate(k1.rightPose, k2.rightPose, easedProgress);

        lastRightWrist = { x: rightWrist.x - cx, y: rightWrist.y - cy };
        lastRightPose = rightPose;

        renderHandSkeleton(ctx, rightWrist, rightPose, false);

        // Draw Motion Trail Path
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

        // Advance to next token when word completes (if playing)
        if (progress >= 1 && isPlayingRef.current) {
          const nextIdx = (activeTokenIdxRef.current + 1) % currentTokenList.length;
          activeTokenIdxRef.current = nextIdx;
          setActiveTokenIdx(nextIdx);

          isTransitioning = true;
          transitionStartTime = timestamp;
          wordStartTime = null;
        }
      }

      // Corner Brackets
      drawCornerBrackets(ctx, cx - 120, cy - 130, 240, 260);

      // Telemetry Overlay
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillText(`TOKEN: ${currentIdx + 1}/${currentTokenList.length} [${currentToken}]`, 16, canvas.height - 16);
      ctx.fillText(`SPEED: ${speedRef.current}x | LERP ANTI-JANK`, canvas.width - 200, canvas.height - 16);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  function renderHandSkeleton(
    ctx: CanvasRenderingContext2D,
    wrist: JointOffset,
    pose: HandPose21,
    isLeftHand: boolean
  ) {
    const HAND_SCALE = 0.52; // Scale hand to upper-body proportions (anti-clipping / anti-overlap)
    const screenJoints: Record<number, { x: number; y: number }> = {};
    for (let id = 0; id <= 20; id++) {
      const offset = pose[id] || { x: 0, y: 0 };
      screenJoints[id] = {
        x: wrist.x + offset.x * HAND_SCALE,
        y: wrist.y + offset.y * HAND_SCALE,
      };
    }

    ctx.strokeStyle = isLeftHand ? "rgba(167, 139, 250, 0.9)" : "rgba(184, 190, 221, 0.9)";
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

  const currentActiveToken = tokens[activeTokenIdx] || "HELLO";
  const activeWordTraj = getWordTrajectory(currentActiveToken);

  return (
    <div className="border border-zinc-200 rounded-2xl p-5 bg-white shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isPlaying ? "bg-emerald-500 animate-ping" : "bg-amber-400"
            }`}
          />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-zinc-800">
            Sentence Formation Sequencer
          </span>
        </div>
        <span className="badge-minimal">
          Token {activeTokenIdx + 1} of {tokens.length}
        </span>
      </div>

      {/* Interactive Token Progress Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 bg-zinc-100 rounded-xl border border-zinc-200">
        {tokens.map((token, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelectToken(idx)}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTokenIdx === idx
                ? "bg-zinc-900 text-white shadow-xs scale-105 ring-2 ring-emerald-500/40"
                : "bg-white text-zinc-600 hover:bg-zinc-200/80"
            }`}
          >
            {token}
          </button>
        ))}
      </div>

      {/* Canvas HUD Frame */}
      <div className="opencv-hud aspect-video w-full rounded-xl overflow-hidden relative">
        <canvas ref={canvasRef} width={640} height={360} className="w-full h-full block" />
        <div className="opencv-badge">
          <div className="opencv-status-dot" />
          <span>{isPlaying ? "SEQUENCER_PLAYING" : "SEQUENCER_PAUSED"}</span>
        </div>
      </div>

      {/* Playback Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevToken}
            className="p-2 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            title="Previous Sign"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 font-mono text-xs font-bold cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleNextToken}
            className="p-2 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            title="Next Sign"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
            title="Restart Sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Toggle */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold mr-1">
            Speed:
          </span>
          <button
            type="button"
            onClick={() => setSpeedMultiplier(0.75)}
            className={`px-2 py-1 rounded text-xs font-mono font-semibold cursor-pointer ${
              speedMultiplier === 0.75
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            0.75x Slow
          </button>
          <button
            type="button"
            onClick={() => setSpeedMultiplier(1.0)}
            className={`px-2 py-1 rounded text-xs font-mono font-semibold cursor-pointer ${
              speedMultiplier === 1.0
                ? "bg-zinc-900 text-white"
                : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            1.0x Normal
          </button>
        </div>
      </div>

      {/* Educational Syntax & Word Instruction Box */}
      <div className="space-y-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center">
              {activeTokenIdx + 1}
            </span>
            <h4 className="font-bold text-sm text-zinc-900">
              Active Sign: {activeWordTraj.word}
            </h4>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
            Anchor: {activeWordTraj.bodyAnchor}
          </span>
        </div>

        <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-white p-3 rounded-lg border border-zinc-200/80 shadow-2xs">
          {activeWordTraj.summary}
        </p>

        {/* Sentence Grammar Rule Banner */}
        <div className="p-3 bg-indigo-50/70 border border-indigo-200/60 rounded-lg text-xs text-indigo-950 space-y-1">
          <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase text-indigo-900">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Grammar &amp; Word Order Breakdown:</span>
          </div>
          <p className="text-zinc-600 leading-relaxed">{sentence.rule}</p>
        </div>
      </div>
    </div>
  );
}
