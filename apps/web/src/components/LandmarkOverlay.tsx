"use client";

import React, { useRef, useEffect } from "react";
import { HandDetection, PoseDetection, VisionFrameResult } from "@/types";

interface LandmarkOverlayProps {
  frameResult: VisionFrameResult | null;
  videoWidth: number;
  videoHeight: number;
  facingMode: "user" | "environment";
}

// MediaPipe Hand 21 Connections
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm Base
  [5, 9], [9, 13], [13, 17],
];

export const LandmarkOverlay: React.FC<LandmarkOverlayProps> = ({
  frameResult,
  videoWidth,
  videoHeight,
  facingMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!frameResult) return;

    const { hands, pose } = frameResult;
    const w = canvas.width;
    const h = canvas.height;

    // Helper to get mirrored coordinate if front camera
    const transformX = (x: number) => {
      // If user camera, mirror X so it matches the mirrored preview
      return facingMode === "user" ? (1 - x) * w : x * w;
    };
    const transformY = (y: number) => y * h;

    // 1. Draw Pose Upper-Body Connections
    if (pose) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(139, 92, 246, 0.6)"; // Violet
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#8b5cf6";

      const drawPoseLine = (p1?: { x: number; y: number }, p2?: { x: number; y: number }) => {
        if (!p1 || !p2) return;
        ctx.beginPath();
        ctx.moveTo(transformX(p1.x), transformY(p1.y));
        ctx.lineTo(transformX(p2.x), transformY(p2.y));
        ctx.stroke();
      };

      // Shoulder to shoulder
      drawPoseLine(pose.leftShoulder, pose.rightShoulder);
      // Arms
      drawPoseLine(pose.leftShoulder, pose.leftElbow);
      drawPoseLine(pose.leftElbow, pose.leftWrist);
      drawPoseLine(pose.rightShoulder, pose.rightElbow);
      drawPoseLine(pose.rightElbow, pose.rightWrist);

      // Draw Key Pose Nodes
      const posePoints = [
        pose.nose,
        pose.leftShoulder,
        pose.rightShoulder,
        pose.leftElbow,
        pose.rightElbow,
      ];
      ctx.fillStyle = "#c084fc";
      for (const pt of posePoints) {
        if (pt) {
          ctx.beginPath();
          ctx.arc(transformX(pt.x), transformY(pt.y), 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    // 2. Draw Hand Landmarks & Skeletons
    for (const hand of hands) {
      const isRight = hand.handedness === "Right";
      const strokeColor = isRight ? "#10b981" : "#06b6d4"; // Emerald for right, Cyan for left
      const shadowColor = isRight ? "rgba(16, 185, 129, 0.8)" : "rgba(6, 182, 212, 0.8)";

      ctx.save();
      ctx.lineWidth = 3;
      ctx.strokeStyle = strokeColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = shadowColor;

      // Draw skeleton lines
      for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
        const p1 = hand.landmarks[startIdx];
        const p2 = hand.landmarks[endIdx];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(transformX(p1.x), transformY(p1.y));
          ctx.lineTo(transformX(p2.x), transformY(p2.y));
          ctx.stroke();
        }
      }

      // Draw Joint points
      for (let i = 0; i < hand.landmarks.length; i++) {
        const pt = hand.landmarks[i];
        const isFingertip = [4, 8, 12, 16, 20].includes(i);
        const radius = isFingertip ? 6 : 4;

        ctx.beginPath();
        ctx.arc(transformX(pt.x), transformY(pt.y), radius, 0, 2 * Math.PI);
        ctx.fillStyle = isFingertip ? "#ffffff" : strokeColor;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Handedness Badge above wrist
      const wrist = hand.landmarks[0];
      if (wrist) {
        const wx = transformX(wrist.x);
        const wy = transformY(wrist.y) + 24;

        ctx.font = "bold 11px system-ui, sans-serif";
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        const label = `${hand.handedness} Hand (${Math.round(hand.score * 100)}%)`;
        const textWidth = ctx.measureText(label).width;

        ctx.fillRect(wx - textWidth / 2 - 6, wy - 12, textWidth + 12, 18);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(wx - textWidth / 2 - 6, wy - 12, textWidth + 12, 18);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText(label, wx, wy + 2);
      }

      ctx.restore();
    }
  }, [frameResult, facingMode]);

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth || 640}
      height={videoHeight || 480}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
