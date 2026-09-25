"use client";

import React, { useState } from "react";
import {
  ARCHITECTURE_FLOW,
  FILES_DOCUMENTATION,
  FileDoc,
  FlowStep,
} from "@/data/docsData";
import {
  BookOpen,
  Layers,
  Code2,
  Cpu,
  ArrowRight,
  Search,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Shield,
  Eye,
  FileCode,
  Terminal,
} from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"flow" | "files" | "models">(
    "flow",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");

  const modules = ["ALL", "vision", "models", "translation", "speech"];

  const filteredFiles = FILES_DOCUMENTATION.filter((file) => {
    const matchesModule =
      selectedModule === "ALL" || file.module === selectedModule;
    const matchesSearch =
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.functions.some((fn) =>
        fn.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesModule && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col">
      {/* Docs Header */}
      <header className="sticky top-0 z-30 bg-[#060913]/90 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                Gesturify AI{" "}
                <span className="text-cyan-400">Documentation</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  MONOREPO DOCS
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                End-to-End Execution Flow, System Architecture & Function
                Catalog
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Launch Web App (:3000)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium glass-panel border border-emerald-500/30 text-emerald-300 hover:text-white transition-all"
            >
              <span>Admin Dashboard (:3002)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("flow")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "flow"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "glass-panel text-slate-400 hover:text-white"
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Execution Pipeline Flow</span>
            </button>

            <button
              onClick={() => setActiveTab("files")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "files"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "glass-panel text-slate-400 hover:text-white"
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Files & Function APIs</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Target: apps/web/src/
          </div>
        </div>

        {/* Tab 1: Execution Pipeline Flow */}
        {activeTab === "flow" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Real-Time Dataflow & Execution Lifecycle
              </h2>
              <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                The web interpreter operates in an autonomous real-time loop.
                Camera frames are processed directly by browser WebAssembly
                workers and passed through normalizers and sequence buffers
                before temporal classification and natural language synthesis.
              </p>
            </div>

            {/* Step-by-Step Flow Cards */}
            <div className="space-y-4">
              {ARCHITECTURE_FLOW.map((step) => (
                <div
                  key={step.step}
                  className="p-5 rounded-2xl glass-panel hover:border-cyan-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm shrink-0">
                      0{step.step}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-white text-base">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-cyan-400/90">
                        <span className="text-slate-400">Source:</span>
                        <code className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {step.sourceFile}
                        </code>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-400">Target:</span>
                        <code className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {step.targetFile}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-dark/80 border border-slate-800 text-xs w-full md:w-64 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Data Payload
                    </span>
                    <span className="text-slate-200 font-mono text-[11px]">
                      {step.dataTransferred}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Files & Functions Catalog */}
        {activeTab === "files" && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search file, class, or function..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {modules.map((mod) => (
                  <button
                    key={mod}
                    onClick={() => setSelectedModule(mod)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all cursor-pointer ${
                      selectedModule === mod
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    {mod}
                  </button>
                ))}
              </div>
            </div>

            {/* Files Grid */}
            <div className="space-y-6">
              {filteredFiles.map((file) => (
                <div
                  key={file.path}
                  className="p-6 rounded-3xl glass-panel border border-cyan-500/20 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-cyan-400" />
                      <code className="text-sm font-bold text-white font-mono">
                        {file.path}
                      </code>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                      {file.module}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{file.purpose}</p>

                  {/* Function APIs List */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Exposed Methods & APIs:
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {file.functions.map((fn) => (
                        <div
                          key={fn.name}
                          className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-400">
                              {fn.name}
                            </span>
                            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                              Returns: {fn.returns}
                            </span>
                          </div>
                          <code className="block text-[11px] font-mono text-slate-400 bg-black/40 p-2 rounded border border-slate-800/80 overflow-x-auto">
                            {fn.signature}
                          </code>
                          <p className="text-xs text-slate-300">
                            {fn.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
