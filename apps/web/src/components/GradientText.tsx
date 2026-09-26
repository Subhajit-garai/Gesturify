"use client";

import React, { useState, useEffect, useRef, type ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  animationSpeed = 8,
  showBorder = false,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) {
  const [isPaused, setIsPaused] = useState(false);
  const textRef = useRef<HTMLDivElement | null>(null);
  const borderRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const animationDuration = animationSpeed * 1000;

  useEffect(() => {
    let lastElapsed = 0;

    const loop = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      if (!isPaused) {
        lastElapsed = (timestamp - startTimeRef.current) % (yoyo ? animationDuration * 2 : animationDuration);
        let progress = 0;

        if (yoyo) {
          if (lastElapsed < animationDuration) {
            progress = (lastElapsed / animationDuration) * 100;
          } else {
            progress = 100 - ((lastElapsed - animationDuration) / animationDuration) * 100;
          }
        } else {
          progress = (lastElapsed / animationDuration) * 100;
        }

        let bgPos = `${progress}% 50%`;
        if (direction === "vertical") bgPos = `50% ${progress}%`;

        if (textRef.current) {
          textRef.current.style.backgroundPosition = bgPos;
        }
        if (borderRef.current) {
          borderRef.current.style.backgroundPosition = bgPos;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animationDuration, direction, isPaused, yoyo]);

  const gradientAngle =
    direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "to bottom right";
  const gradientColors = [...colors, colors[0]].join(", ");

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize: direction === "horizontal" ? "300% 100%" : direction === "vertical" ? "100% 300%" : "300% 300%",
    backgroundRepeat: "repeat",
  };

  return (
    <div
      className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${
        showBorder ? "py-1 px-2" : ""
      } ${className}`}
      onMouseEnter={() => {
        if (pauseOnHover) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setIsPaused(false);
      }}
    >
      {showBorder && (
        <div
          ref={borderRef}
          className="absolute inset-0 z-0 pointer-events-none rounded-[1.25rem]"
          style={gradientStyle}
        >
          <div
            className="absolute bg-black rounded-[1.25rem] z-[-1]"
            style={{
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
      )}
      <div
        ref={textRef}
        className="inline-block relative z-2 text-transparent bg-clip-text"
        style={{ ...gradientStyle, WebkitBackgroundClip: "text" }}
      >
        {children}
      </div>
    </div>
  );
}
