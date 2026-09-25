"use client";

import React, { useRef, useEffect } from "react";

interface OpenCvHudProps {
  targetChar?: string;
}

export default function OpenCvHud({ targetChar = "A" }: OpenCvHudProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animationFrameId: number;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark sleek background matching index.html/app.js
      ctx.fillStyle = "#191321";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle OpenCV grid lines
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

      // 21 Keypoints for Hand Skeletal Tracking
      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 15;
      const swayX = Math.sin(frame * 0.03) * 12;
      const swayY = Math.cos(frame * 0.02) * 8;

      const baseWrist = { x: cx + swayX, y: cy + 90 + swayY };

      const joints: Record<number, { x: number; y: number }> = {
        0: baseWrist,
        // Thumb
        1: { x: baseWrist.x - 35, y: baseWrist.y - 25 },
        2: { x: baseWrist.x - 55, y: baseWrist.y - 55 },
        3: { x: baseWrist.x - 65, y: baseWrist.y - 85 },
        4: { x: baseWrist.x - 70, y: baseWrist.y - 110 },
        // Index
        5: { x: baseWrist.x - 20, y: baseWrist.y - 65 },
        6: { x: baseWrist.x - 25, y: baseWrist.y - 110 },
        7: { x: baseWrist.x - 28, y: baseWrist.y - 145 },
        8: { x: baseWrist.x - 30, y: baseWrist.y - 175 },
        // Middle
        9: { x: baseWrist.x, y: baseWrist.y - 70 },
        10: { x: baseWrist.x, y: baseWrist.y - 120 },
        11: { x: baseWrist.x, y: baseWrist.y - 160 },
        12: { x: baseWrist.x, y: baseWrist.y - 195 },
        // Ring
        13: { x: baseWrist.x + 20, y: baseWrist.y - 65 },
        14: { x: baseWrist.x + 24, y: baseWrist.y - 110 },
        15: { x: baseWrist.x + 27, y: baseWrist.y - 145 },
        16: { x: baseWrist.x + 30, y: baseWrist.y - 175 },
        // Pinky
        17: { x: baseWrist.x + 38, y: baseWrist.y - 55 },
        18: { x: baseWrist.x + 48, y: baseWrist.y - 90 },
        19: { x: baseWrist.x + 55, y: baseWrist.y - 120 },
        20: { x: baseWrist.x + 60, y: baseWrist.y - 145 },
      };

      const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [5, 9], [9, 10], [10, 11], [11, 12],
        [9, 13], [13, 14], [14, 15], [15, 16],
        [13, 17], [17, 18], [18, 19], [19, 20],
        [0, 17],
      ];

      // Draw Bones in soft periwinkle
      ctx.strokeStyle = "rgba(184, 190, 221, 0.85)";
      ctx.lineWidth = 2.5;
      connections.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(joints[i].x, joints[i].y);
        ctx.lineTo(joints[j].x, joints[j].y);
        ctx.stroke();
      });

      // Draw Keypoint Nodes
      for (const id in joints) {
        const pt = joints[id];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, id === "0" || id === "4" || id === "8" || id === "12" ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = id === "0" || id === "4" || id === "8" || id === "12" ? "#f0a6ca" : "#efc3e6";
        ctx.fill();
        ctx.strokeStyle = "#3d3050";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw HUD Overlays: Bounding Box
      const bx = cx - 110;
      const by = cy - 130;
      const bw = 220;
      const bh = 260;

      ctx.strokeStyle = "rgba(184, 190, 221, 0.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(bx, by, bw, bh);
      ctx.setLineDash([]);

      // Corner brackets
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

      // Telemetry
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillText(`FPS: 60.0 | RES: ${canvas.width}x${canvas.height}`, 16, canvas.height - 16);
      ctx.fillText(`LANDMARKS: 21 DETECTED`, canvas.width - 150, canvas.height - 16);

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="border border-zinc-200 rounded-2xl p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amethyst_smoke-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold text-zinc-800">
            OpenCV Vision HUD
          </span>
        </div>
        <span className="badge-minimal">Pose: Letter {targetChar}</span>
      </div>

      {/* Canvas HUD Frame */}
      <div className="opencv-hud aspect-video w-full rounded-xl overflow-hidden mb-4 relative">
        <canvas ref={canvasRef} width={640} height={360} className="w-full h-full block" />
        <div className="opencv-badge">
          <div className="opencv-status-dot" />
          <span>CV2_LANDMARK_21</span>
        </div>
      </div>

      {/* HUD Specs & Telemetry */}
      <div className="space-y-3 font-mono text-xs text-zinc-600 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
        <div className="flex items-center justify-between">
          <span>Tracking Engine:</span>
          <span className="font-semibold text-zinc-900">OpenCV Mediapipe Hands</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Keypoints Detected:</span>
          <span className="font-semibold text-zinc-900">21 Coordinates (X, Y, Z)</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Pose Stability:</span>
          <span className="font-semibold text-zinc-900">98.4% Nominal</span>
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 pt-2">
          <span>Target Handshape:</span>
          <span className="font-semibold text-zinc-900">Right Hand (Dominant)</span>
        </div>
      </div>
    </div>
  );
}
