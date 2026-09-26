"use client";

import React from "react";
import { BookOpen, Video, ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="border-b border-zinc-200/80 bg-zinc-50/50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white text-xs font-mono text-zinc-700 mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amethyst_smoke-400 animate-pulse" />
            <span>Dual-Purpose Muted &amp; Learner Ecosystem</span>
          </div>

          {/* Clean bold heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-950 mb-6 leading-tight">
            Universal Sign Language &amp; Gestural Communication.
          </h1>

          {/* Action Jump Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="#learner"
              className="group p-5 bg-white border border-zinc-200 rounded-xl hover:border-amethyst_smoke-400 hover:shadow-md transition-all flex flex-col justify-between shadow-xs cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-800 group-hover:bg-amethyst_smoke-400 group-hover:text-white transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-lg font-bold text-zinc-900 mb-1">Learner Practice Hub</h2>
                <p className="text-sm text-zinc-500 leading-normal">
                  Alphabet drills, core vocabulary ...
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-semibold text-zinc-900 gap-1 group-hover:translate-x-1 transition-transform">
                Start Learning Drills <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="#translation"
              className="group p-5 bg-white border border-zinc-200 rounded-xl hover:border-amethyst_smoke-400 hover:shadow-md transition-all flex flex-col justify-between shadow-xs cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-center text-zinc-800 group-hover:bg-amethyst_smoke-400 group-hover:text-white transition-colors">
                    <Video className="w-5 h-5" />
                  </div>
                </div>
                <h2 className="text-lg font-bold text-zinc-900 mb-1">Translation &amp; Video Studio</h2>
                <p className="text-sm text-zinc-500 leading-normal">
                  Real-time video gesture-to-speech &amp; text-to-sign
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center text-xs font-semibold text-zinc-900 gap-1 group-hover:translate-x-1 transition-transform">
                Launch Live Translation <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
