"use client";

import React, { useState } from "react";
import { Hand, Contrast, ShieldCheck, Menu, X } from "lucide-react";

interface HeaderProps {
  onOpenAuth: () => void;
  onToggleContrast: () => void;
  onFontIncrease?: () => void;
  onFontDecrease?: () => void;
  isDark?: boolean;
}

export default function Header({
  onOpenAuth,
  onToggleContrast,
  onFontIncrease,
  onFontDecrease,
  isDark,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-zinc-900 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-amethyst_smoke-400 flex items-center justify-center text-white shadow-xs">
            <Hand className="w-4 h-4" />
          </div>
          <div className="flex items-baseline">
            <span className="font-bold text-lg tracking-tight font-mono text-zinc-900">
              Gesturify
            </span>
            <span className="hidden sm:inline-block text-[10px] text-zinc-500 font-mono tracking-widest uppercase ml-2 border-l border-zinc-200 pl-2">
              Accessible Core
            </span>
          </div>
        </a>

        {/* Primary Nav Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          <button
            onClick={() => scrollTo("learner")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors"
          >
            Learner Hub
          </button>
          <button
            onClick={() => scrollTo("translation")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors"
          >
            Translation Studio
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors"
          >
            Contact
          </button>
        </nav>

        {/* Right Actions: Accessibility & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Accessibility Controls */}
          <div className="flex items-center border border-zinc-200 rounded-md p-0.5 bg-zinc-50/80">
            {onFontDecrease && (
              <button
                type="button"
                onClick={onFontDecrease}
                title="Decrease font size"
                className="px-2 py-1 text-xs font-mono font-medium text-zinc-600 hover:text-zinc-950 hover:bg-white rounded transition-all"
              >
                A-
              </button>
            )}
            {onFontIncrease && (
              <button
                type="button"
                onClick={onFontIncrease}
                title="Increase font size"
                className="px-2 py-1 text-xs font-mono font-medium text-zinc-600 hover:text-zinc-950 hover:bg-white rounded transition-all"
              >
                A+
              </button>
            )}
            <button
              id="toggle-contrast"
              type="button"
              onClick={onToggleContrast}
              title="Toggle contrast mode"
              className="p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-white rounded transition-all"
            >
              <Contrast className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Auth Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="btn-primary text-xs sm:text-sm font-medium py-1.5 px-4 rounded-lg inline-flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Login / Signup</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-md"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => scrollTo("learner")}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Learner Hub
          </button>
          <button
            onClick={() => scrollTo("translation")}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Translation Studio
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
          >
            About Gesturify
          </button>
          <button
            onClick={() => scrollTo("contact")}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
}
