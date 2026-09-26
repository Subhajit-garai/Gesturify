"use client";

import React, { useState } from "react";
import { Type, LayoutGrid, GitCommit, CheckCheck, ArrowRight } from "lucide-react";
import {
  ALPHABETS,
  WORDS,
  SENTENCE_TEMPLATES,
  GRAMMAR_RULES,
  AlphabetItem,
  WordItem,
  SentenceTemplate,
} from "@/data/gestures";
import OpenCvHud from "./OpenCvHud";
import WordTrajectoryHud from "./WordTrajectoryHud";
import SentencePlayerHud from "./SentencePlayerHud";

interface LearnerHubProps {
  onSelectSentenceForAnimation?: (sentence: SentenceTemplate) => void;
}

export default function LearnerHub({ onSelectSentenceForAnimation }: LearnerHubProps) {
  const [activeTab, setActiveTab] = useState<"alphabet" | "words" | "sentence" | "grammar">("alphabet");
  const [selectedAlphabet, setSelectedAlphabet] = useState<AlphabetItem>(ALPHABETS[0]);
  const [selectedWord, setSelectedWord] = useState<WordItem>(WORDS[0]);
  const [selectedSentence, setSelectedSentence] = useState<SentenceTemplate>(SENTENCE_TEMPLATES[0]);

  return (
    <section id="learner" className="py-16 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-200 gap-4">
          <div>
            <span className="section-tag">Module 01 // Interactive Practice</span>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Sign Language Learner Studio</h2>
            <p className="text-sm text-zinc-500 mt-1 max-w-2xl">
              From fingerspelling the alphabet to building complete sentences with OpenCV spatial landmarks.
            </p>
          </div>

          {/* Subtabs Controller */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200 flex-wrap gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("alphabet")}
              className={`tab-btn ${activeTab === "alphabet" ? "active" : ""}`}
            >
              <Type className="w-4 h-4" />
              <span>Alphabet</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("words")}
              className={`tab-btn ${activeTab === "words" ? "active" : ""}`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Words</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sentence")}
              className={`tab-btn ${activeTab === "sentence" ? "active" : ""}`}
            >
              <GitCommit className="w-4 h-4" />
              <span>Sentence Formation</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("grammar")}
              className={`tab-btn ${activeTab === "grammar" ? "active" : ""}`}
            >
              <CheckCheck className="w-4 h-4" />
              <span>Grammar Fixing</span>
            </button>
          </div>
        </div>

        {/* Main Learner Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 7 Cols */}
          <div className="lg:col-span-7">
            {/* View 1: Alphabet */}
            {activeTab === "alphabet" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-zinc-900">Fingerspelling Dictionary (A to Z)</h3>
                  <span className="text-xs font-mono text-zinc-400">Select a character</span>
                </div>

                {/* Interactive A-Z Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
                  {ALPHABETS.map((item) => (
                    <button
                      key={item.char}
                      type="button"
                      onClick={() => setSelectedAlphabet(item)}
                      className={`sign-card ${selectedAlphabet.char === item.char ? "active" : ""}`}
                    >
                      <span className="text-2xl font-bold font-mono text-zinc-900">{item.char}</span>
                      <span className="text-[10px] text-zinc-400 mt-1 uppercase tracking-wider font-mono">Sign</span>
                    </button>
                  ))}
                </div>

                {/* Selected Letter Detail Card */}
                <div className="p-6 border border-zinc-200 rounded-xl bg-zinc-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-16 h-16 rounded-xl bg-white border border-zinc-300 flex items-center justify-center text-3xl font-mono font-bold text-zinc-900 shadow-sm shrink-0">
                      {selectedAlphabet.char}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-base text-zinc-900">{selectedAlphabet.name}</h4>
                        <span className="badge-minimal">Alphabet Pose</span>
                      </div>
                      <p className="text-sm text-zinc-600 mb-2 leading-relaxed">{selectedAlphabet.desc}</p>
                      <p className="text-xs font-mono text-zinc-500">
                        <span className="font-semibold text-zinc-700">Motor Cue:</span> {selectedAlphabet.cues}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Words */}
            {activeTab === "words" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-zinc-900">Essential Everyday Vocabulary</h3>
                  <span className="text-xs font-mono text-zinc-400">Click a card to inspect</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {WORDS.map((w) => (
                    <div
                      key={w.word}
                      onClick={() => setSelectedWord(w)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all bg-white ${
                        selectedWord.word === w.word
                          ? "border-amethyst_smoke-400 ring-2 ring-amethyst_smoke-400/20"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-zinc-900 text-base">{w.word}</span>
                        <span className="text-xs font-mono uppercase bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                          {w.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-3">{w.desc}</p>
                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100">
                        <span>Avg Speed: {w.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border border-zinc-200 rounded-xl bg-zinc-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Selected: {selectedWord.word}</h4>
                    <p className="text-xs text-zinc-500">{selectedWord.desc}</p>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">Category: {selectedWord.category}</span>
                </div>
              </div>
            )}

            {/* View 3: Sentence Formation */}
            {activeTab === "sentence" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-1">Sentence Formation &amp; Sign Syntax</h3>
                  <p className="text-xs text-zinc-500">
                    Sign language follows topic-comment and directional grammar. Explore standard sentence structures below:
                  </p>
                </div>

                <div className="space-y-4">
                  {SENTENCE_TEMPLATES.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSentence(item)}
                      className={`p-5 border rounded-xl bg-white space-y-3 shadow-xs cursor-pointer transition-all ${
                        selectedSentence.spoken === item.spoken
                          ? "border-amethyst_smoke-400 ring-2 ring-amethyst_smoke-400/20"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                            Spoken English
                          </span>
                          {selectedSentence.spoken === item.spoken && (
                            <span className="badge-minimal">Active in Sequencer</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectSentenceForAnimation) onSelectSentenceForAnimation(item);
                          }}
                          className="btn-secondary text-xs py-1 px-3 self-start sm:self-auto cursor-pointer"
                        >
                          <span>Try in Translation Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-zinc-900 italic">"{item.spoken}"</p>

                      <div className="pt-2 border-t border-zinc-100">
                        <span className="text-xs font-mono uppercase text-amethyst_smoke-400 font-semibold block mb-1.5">
                          Sign Syntax (ASL/ISL Gloss)
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tokens.map((token, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded bg-zinc-900 text-white font-mono text-xs font-semibold"
                            >
                              {token}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 font-mono bg-zinc-50 p-2.5 rounded border border-zinc-200/60">
                        Rule: {item.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 4: Grammar Fixing */}
            {activeTab === "grammar" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 mb-1">
                    Grammar Rules &amp; Structural Syntax Assistant
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Understand the foundational structural differences between spoken language and gestural grammar:
                  </p>
                </div>

                <div className="space-y-4">
                  {GRAMMAR_RULES.map((rule, idx) => (
                    <div key={idx} className="p-5 border border-zinc-200 rounded-xl bg-white space-y-2 shadow-xs">
                      <h4 className="font-bold text-sm text-zinc-900">{rule.title}</h4>
                      <p className="text-xs text-zinc-600 leading-relaxed">{rule.explanation}</p>
                      <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 font-mono text-xs text-zinc-800">
                        {rule.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Vision HUD (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            {activeTab === "words" ? (
              <WordTrajectoryHud targetWord={selectedWord.word} />
            ) : activeTab === "sentence" ? (
              <SentencePlayerHud sentence={selectedSentence} />
            ) : (
              <OpenCvHud targetChar={selectedAlphabet.char} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
