"use client";

import React from "react";
import { Eye, Cpu } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-16 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="section-tag">About Gesturify</span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
            Democratizing Communication for Silence and Speech
          </h2>
          <p className="text-base text-zinc-600 leading-relaxed mb-8">
            Gesturify was envisioned to bridge communication barriers for both the deaf &amp; muted community and eager learners. By combining computer vision landmark analysis with modern accessibility interfaces, we provide tools for spontaneous conversations, education, and mutual understanding.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 border border-zinc-200 rounded-xl bg-white shadow-xs">
              <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-900 mb-3">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm mb-1">Visual-First Design</h3>
              <p className="text-xs text-zinc-500 leading-normal">
                Minimalist, high-contrast monochrome and soft pastel design ensures maximum clarity for visual communicators without sensory overload.
              </p>
            </div>

            <div className="p-5 border border-zinc-200 rounded-xl bg-white shadow-xs">
              <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-zinc-900 mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm mb-1">Edge Computer Vision</h3>
              <p className="text-xs text-zinc-500 leading-normal">
                Instant joint coordinate tracking running locally in the browser to maintain privacy and guarantee low latency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
