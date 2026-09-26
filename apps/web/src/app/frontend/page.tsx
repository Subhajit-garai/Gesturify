"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LearnerHub from "@/components/LearnerHub";
import TranslationStudio from "@/components/TranslationStudio";
import About from "@/components/About";
import Contact from "@/components/Contact";
import AuthModal from "@/components/AuthModal";
import { SentenceTemplate } from "@/data/gestures";

export default function FrontendPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(0); // -1, 0, 1, 2
  const [initialTransText, setInitialTransText] = useState("Hello, nice to meet you");

  const toggleContrast = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        document.body.classList.toggle("high-contrast", next);
        document.body.classList.toggle("dark-mode", next);
      }
      return next;
    });
  };

  const handleFontIncrease = () => {
    setFontSizeLevel((prev) => Math.min(prev + 1, 2));
  };

  const handleFontDecrease = () => {
    setFontSizeLevel((prev) => Math.max(prev - 1, -1));
  };

  const handleSelectSentenceForAnimation = (sentence: SentenceTemplate) => {
    setInitialTransText(sentence.spoken);
    const transElement = document.getElementById("translation");
    if (transElement) {
      transElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fontSizeClass =
    fontSizeLevel === 1 ? "text-[104%]" : fontSizeLevel === 2 ? "text-[108%]" : fontSizeLevel === -1 ? "text-[96%]" : "";

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${fontSizeClass}`}
    >
      {/* Navigation Header */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleContrast={toggleContrast}
        onFontIncrease={handleFontIncrease}
        onFontDecrease={handleFontDecrease}
        isDark={isDarkMode}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <LearnerHub onSelectSentenceForAnimation={handleSelectSentenceForAnimation} />
        <TranslationStudio initialText={initialTransText} />
        <About />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900 font-mono">Gesturify</span>
            <span>© 2026. Minimalist Assistive Communication.</span>
          </div>
          <div className="flex gap-4">
            <a href="#learner" className="hover:underline">
              Practice Hub
            </a>
            <a href="#translation" className="hover:underline">
              Translation
            </a>
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal Overlay */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
