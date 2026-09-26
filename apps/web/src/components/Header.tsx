"use client";

import React, { useState } from "react";
import { Hand, Contrast, ShieldCheck, Menu, X, Video, LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth/client";

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
  const { data: session, isPending } = authClient.useSession();

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
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
            type="button"
            onClick={() => scrollTo("learner")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            Learner Hub
          </button>
          <button
            type="button"
            onClick={() => scrollTo("translation")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            Translation Studio
          </button>
          <button
            type="button"
            onClick={() => scrollTo("video-learning")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            Video Modules
          </button>
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="nav-link px-3.5 py-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
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
                className="px-2 py-1 text-xs font-mono font-medium text-zinc-600 hover:text-zinc-950 hover:bg-white rounded transition-all cursor-pointer"
              >
                A-
              </button>
            )}
            {onFontIncrease && (
              <button
                type="button"
                onClick={onFontIncrease}
                title="Increase font size"
                className="px-2 py-1 text-xs font-mono font-medium text-zinc-600 hover:text-zinc-950 hover:bg-white rounded transition-all cursor-pointer"
              >
                A+
              </button>
            )}
          </div>

          {/* High Contrast / Dark Toggle */}
          <button
            type="button"
            onClick={onToggleContrast}
            title="Toggle contrast mode"
            className="p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors cursor-pointer"
            aria-label="Toggle contrast mode"
          >
            <Contrast className="w-4 h-4" />
          </button>

          {/* Neon Auth Controls */}
          <div className="hidden sm:flex items-center gap-2">
            {!isPending && session?.user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-50 rounded-md border border-zinc-200">
                  <div className="w-5 h-5 rounded-full bg-amethyst_smoke-400 text-white flex items-center justify-center text-[10px] font-bold">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-mono text-zinc-800 max-w-[120px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a
                  href="/sign-in"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-mono font-medium text-zinc-700 border border-zinc-300 hover:border-zinc-900 rounded-md bg-white hover:bg-zinc-50 transition-all cursor-pointer shadow-xs"
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-mono font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-all cursor-pointer shadow-xs"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => scrollTo("learner")}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-md"
          >
            Learner Hub
          </button>
          <button
            type="button"
            onClick={() => scrollTo("translation")}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-md"
          >
            Translation Studio
          </button>
          <button
            type="button"
            onClick={() => scrollTo("video-learning")}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-md"
          >
            Video Modules
          </button>
          <button
            type="button"
            onClick={() => scrollTo("about")}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-md"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="block w-full text-left px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-md"
          >
            Contact
          </button>
          <div className="pt-2 border-t border-zinc-100 space-y-2">
            {!isPending && session?.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 rounded-md border border-zinc-200">
                  <div className="w-6 h-6 rounded-full bg-amethyst_smoke-400 text-white flex items-center justify-center text-xs font-bold">
                    {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-mono text-zinc-800 truncate">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-mono font-medium text-red-600 border border-red-200 rounded-md bg-white hover:bg-red-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <a
                  href="/sign-in"
                  className="flex-1 py-2 text-xs font-mono font-medium text-center text-zinc-800 border border-zinc-300 rounded-md bg-white"
                >
                  Sign In
                </a>
                <a
                  href="/sign-up"
                  className="flex-1 py-2 text-xs font-mono font-medium text-center text-white bg-zinc-900 rounded-md"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
