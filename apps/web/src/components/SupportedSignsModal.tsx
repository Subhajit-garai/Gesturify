"use client";

import React, { useState } from "react";
import { SIGN_VOCABULARY, SignItem } from "@/config/signVocabulary";
import { BookOpen, X, Search, CheckCircle2, Play, Info } from "lucide-react";

interface SupportedSignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestSign?: (signLabel: string) => void;
}

export const SupportedSignsModal: React.FC<SupportedSignsModalProps> = ({
  isOpen,
  onClose,
  onTestSign,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [activeSignGuide, setActiveSignGuide] = useState<SignItem | null>(null);

  if (!isOpen) return null;

  const categories = ["ALL", "GREETING", "EMERGENCY", "ESSENTIALS", "COMMON", "POLITE", "PRONOUNS", "QUESTIONS"];

  const filtered = SIGN_VOCABULARY.filter((item) => {
    const matchesSearch =
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hindiLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl glass-panel-elevated border border-cyan-500/30 overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700/60 bg-surface-darker/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Supported Indian Sign Language (ISL) Signs</h3>
              <p className="text-xs text-slate-400">
                Official hackathon MVP vocabulary ({SIGN_VOCABULARY.length} configured signs)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-surface-dark/40">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sign in English or Hindi (e.g. Water, Paani, Help, नमस्ते)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-darker border border-slate-700 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-surface-darker font-bold shadow-md shadow-cyan-500/20"
                    : "bg-surface-darker text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Signs Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>No matching sign found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-surface-darker/60 hover:bg-surface-dark/80 border border-slate-800/80 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-white text-base">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-semibold border border-slate-700">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-300 mt-1">
                      {item.hindiLabel}
                    </p>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <button
                      onClick={() => setActiveSignGuide(item)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Gesture Guide
                    </button>

                    {onTestSign && (
                      <button
                        onClick={() => {
                          onTestSign(item.label);
                          onClose();
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Demo Sign
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guide Popover Footer */}
        {activeSignGuide && (
          <div className="p-4 bg-cyan-950/40 border-t border-cyan-500/30 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-cyan-300">
                How to perform &ldquo;{activeSignGuide.label}&rdquo;:
              </span>
              <button
                onClick={() => setActiveSignGuide(null)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="text-slate-200">{activeSignGuide.gestureGuide}</p>
          </div>
        )}
      </div>
    </div>
  );
};
