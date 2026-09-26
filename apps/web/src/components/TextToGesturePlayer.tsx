"use client";

import React, { useRef, useEffect } from "react";
import { SKELETON_CONNECTIONS, HandPose21, JointOffset, ALPHABET_POSES } from "@/data/alphabetPoses";
import { HandMorphEngine } from "@/vision/handMorphEngine";
import { getWordTrajectory, WordTrajectory } from "@/data/wordTrajectories";

interface TextToGesturePlayerProps {
  tokens: string[];
  activeTokenIndex: number;
  onTokenChange: (idx: number) => void;
  isPlaying: boolean;
  speedMultiplier?: number;
}

export default function TextToGesturePlayer({
  tokens,
  activeTokenIndex,
  onTokenChange,
  isPlaying,
  speedMultiplier = 1.0,
}: TextToGesturePlayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // References to keep animation loop synchronized with props
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const speedRef = useRef(speedMultiplier);
  speedRef.current = speedMultiplier;

  const activeTokenIdxRef = useRef(activeTokenIndex);
  activeTokenIdxRef.current = activeTokenIndex;

  const tokensRef = useRef(tokens);
  tokensRef.current = tokens;

  const onTokenChangeRef = useRef(onTokenChange);
  onTokenChangeRef.current = onTokenChange;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let wordStartTime: number | null = null;
    let isTransitioning = false;
    let transitionStartTime: number | null = null;
    const TRANSITION_DURATION_MS = 320; // Smooth 320ms glide between signs

    // Store ending pose of previous word for smooth glide
    let lastRightWrist: JointOffset = { x: 0, y: 35 };
    let lastRightPose: HandPose21 = {};
    let lastLeftWrist: JointOffset | undefined;
    let lastLeftPose: HandPose21 | undefined;

    const render = (timestamp: number) => {
      // 1. Clear background (zero visual ghosting or overlapping residue)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#191321";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // OpenCV Grid
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

      // Exact Centering Origin
      const cx = canvas.width / 2; // 320
      const cy = canvas.height / 2 + 10; // 190

      // ==========================================
      // 2. UPPER-BODY WIREFRAME GHOST
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
      // 3. TRAJECTORY INTERPOLATOR & SEQUENCER
      // ==========================================
      const currentTokenList = tokensRef.current;
      const currentIdx = activeTokenIdxRef.current;
      const currentToken = currentTokenList[currentIdx] || "HELLO";
      const traj = getWordTrajectory(currentToken);

      const baseDuration = (traj.durationMs || 1400) / speedRef.current;

      // Body Anchor Point
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

        // Smoothly interpolate left wrist if either sign uses left hand
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

        // Left Hand (underneath) if two-handed
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

        // Right Hand (on top)
        const rightWrist = {
          x: cx + HandMorphEngine.lerp(k1.rightWrist.x, k2.rightWrist.x, easedProgress),
          y: cy + HandMorphEngine.lerp(k1.rightWrist.y, k2.rightWrist.y, easedProgress),
        };
        const rightPose = HandMorphEngine.interpolate(k1.rightPose, k2.rightPose, easedProgress);

        lastRightWrist = { x: rightWrist.x - cx, y: rightWrist.y - cy };
        lastRightPose = rightPose;

        renderHandSkeleton(ctx, rightWrist, rightPose, false);

        // Motion Trail Path
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

        // Advance to next token upon completion
        if (progress >= 1 && isPlayingRef.current) {
          const nextIdx = (activeTokenIdxRef.current + 1) % currentTokenList.length;
          activeTokenIdxRef.current = nextIdx;
          onTokenChangeRef.current(nextIdx);

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
      ctx.fillText(
        `TOKEN: ${currentIdx + 1}/${currentTokenList.length} [${currentToken}]`,
        16,
        canvas.height - 16
      );
      ctx.fillText(
        `SPEED: ${speedRef.current}x | PROCEDURAL 3D LERP`,
        canvas.width - 215,
        canvas.height - 16
      );

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
    const HAND_SCALE = 0.52; // Anatomic proportion scaling
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

  return (
    <div className="opencv-hud aspect-video w-full rounded-xl overflow-hidden relative shadow-inner">
      <canvas ref={canvasRef} width={640} height={360} className="w-full h-full block" />
      <div className="opencv-badge">
        <div className={`opencv-status-dot ${isPlaying ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
        <span>{isPlaying ? "TEXT_TO_SIGN_STREAMING" : "STREAM_PAUSED"}</span>
      </div>
    </div>
  );
}
