"use client";

import React, { useState } from "react";
import { X, Scan, ShieldCheck } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [manatoStatus, setManatoStatus] = useState("Hold custom sign gesture to authenticate");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSimulateManato = () => {
    setIsVerifying(true);
    setManatoStatus("Scanning sign landmark pattern...");

    setTimeout(() => {
      setManatoStatus("Landmarks Matched! Manato Identity Verified.");
      setTimeout(() => {
        setIsVerifying(false);
        setManatoStatus("Hold custom sign gesture to authenticate");
        onClose();
        alert("Authenticated successfully via Manato Gesture Technique.");
      }, 1200);
    }, 1500);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    alert("Logged in successfully!");
  };

  return (
    <div
      className="modal-backdrop open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-container p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
          <div>
            <h3 id="auth-modal-title" className="text-lg font-bold text-zinc-900">
              Authentication Portal
            </h3>
            <p className="text-xs font-mono text-zinc-500">Manato Optical Landmark Verification</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Manato Technique Verification Box */}
        <div className="p-5 border border-zinc-200 rounded-xl bg-zinc-50 mb-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-full border border-zinc-300 bg-white mx-auto flex items-center justify-center text-zinc-900 shadow-xs">
            <Scan className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-zinc-900">Manato Gestural Key Technique</h4>
          <p className="text-xs text-zinc-600 leading-normal max-w-xs mx-auto">
            Authenticate instantly by holding your personalized sign landmark passcode in front of the lens.
          </p>
          <div className="text-xs font-mono text-zinc-500 py-1">{manatoStatus}</div>
          <button
            type="button"
            onClick={handleSimulateManato}
            disabled={isVerifying}
            className="btn-primary w-full text-xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isVerifying ? "Verifying Landmark Key..." : "Simulate Manato Sign Verification"}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-white px-2 text-xs font-mono text-zinc-400 absolute">OR STANDARD PASSKEY</span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">Email or Passkey ID</label>
            <input type="text" required className="input-minimal" placeholder="user@gesturify.org" />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">Access Token</label>
            <input type="password" required className="input-minimal" placeholder="••••••••••••" />
          </div>
          <button type="submit" className="btn-secondary w-full text-xs sm:text-sm cursor-pointer">
            Continue with Credentials
          </button>
        </form>
      </div>
    </div>
  );
}
