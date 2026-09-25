"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
  Terminal,
  Activity,
  Cpu,
  Video,
  RefreshCw,
  Search,
  Filter,
  Download,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
  component: "CAMERA" | "VISION" | "MODEL" | "SPEECH" | "SYSTEM";
  message: string;
  details?: string;
  affectedUserAgent: string;
}

interface ComponentSummary {
  component: string;
  status: "HEALTHY" | "DEGRADED" | "ATTENTION";
  totalEvents: number;
  errorCount: number;
  description: string;
  activePath: string;
  commonErrors: { error: string; count: number; resolution: string }[];
}

const INITIAL_LOG_SUMMARIES: ComponentSummary[] = [
  {
    component: "Camera & MediaStream API",
    status: "ATTENTION",
    totalEvents: 4210,
    errorCount: 68,
    activePath: "apps/web/src/vision/camera.ts",
    description: "Captures 1280x720 video feed. Uses facingMode: 'environment' (rear camera) with fallback to front camera.",
    commonErrors: [
      {
        error: "NotAllowedError / PermissionDeniedError",
        count: 52,
        resolution: "User denied browser camera prompt. Display in-app permission banner prompting settings unlock."
      },
      {
        error: "NotFoundError (No environment camera found)",
        count: 14,
        resolution: "Occurs on laptops without rear cameras. Successfully fell back to default front camera."
      },
      {
        error: "TrackStartError / DeviceBusy",
        count: 2,
        resolution: "Camera occupied by Zoom/Teams. Prompt user to close other apps."
      }
    ]
  },
  {
    component: "MediaPipe Vision Landmark Detector",
    status: "HEALTHY",
    totalEvents: 18450,
    errorCount: 12,
    activePath: "apps/web/src/vision/mediaPipe.ts",
    description: "Processes 21 hand landmarks per hand and 7 upper pose points using WebAssembly FilesetResolver.",
    commonErrors: [
      {
        error: "GPU Delegate WebGL Context Creation Warning",
        count: 12,
        resolution: "Low-end mobile GPU lacked FP16 precision. Automatically fell back to CPU WASM delegate without crashing."
      }
    ]
  },
  {
    component: "ONNX Runtime & Temporal Recognizer",
    status: "HEALTHY",
    totalEvents: 8920,
    errorCount: 5,
    activePath: "apps/web/src/models/ONNXSignModel.ts",
    description: "Executes 30-frame temporal gesture sequence [30, 147]. Falls back to GeometricHeuristicClassifier if model file isn't uploaded.",
    commonErrors: [
      {
        error: "Default ONNX weights 404 (File not found)",
        count: 5,
        resolution: "Custom user ONNX file not yet placed in public/models/. Seamlessly switched to Geometric Classifier."
      }
    ]
  },
  {
    component: "Web Speech API (TTS & STT)",
    status: "HEALTHY",
    totalEvents: 1320,
    errorCount: 3,
    activePath: "apps/web/src/speech/textToSpeech.ts",
    description: "SpeechSynthesis for voice output and webkitSpeechRecognition for reverse communication avatar.",
    commonErrors: [
      {
        error: "SpeechSynthesis interrupted (rapid speak trigger)",
        count: 3,
        resolution: "Added window.speechSynthesis.cancel() before each utterance to prevent queue collision."
      }
    ]
  }
];

const RAW_LOGS: LogEntry[] = [
  {
    id: "LOG-1049",
    timestamp: "2026-09-25 15:48:12",
    level: "SUCCESS",
    component: "VISION",
    message: "MediaPipe HandLandmarker initialized with GPU delegate (21 landmarks, 2 hands active)",
    affectedUserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
  },
  {
    id: "LOG-1048",
    timestamp: "2026-09-25 15:47:58",
    level: "INFO",
    component: "CAMERA",
    message: "Rear camera stream started with resolution 1280x720 @ 30 FPS",
    affectedUserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
  },
  {
    id: "LOG-1047",
    timestamp: "2026-09-25 15:46:33",
    level: "WARN",
    component: "MODEL",
    message: "Optional ONNX model weights not present at /models/isl_temporal_model.onnx. Utilizing Geometric Heuristic Classifier.",
    details: "Geometric Classifier active with 16 ISL vocabulary gestures and 30-frame sequence trajectory.",
    affectedUserAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
  },
  {
    id: "LOG-1046",
    timestamp: "2026-09-25 15:45:10",
    level: "ERROR",
    component: "CAMERA",
    message: "NotAllowedError: Camera permission was denied by user",
    details: "User clicked 'Block' on browser camera prompt. Triggered in-app permission diagnostic banner.",
    affectedUserAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15",
  },
  {
    id: "LOG-1045",
    timestamp: "2026-09-25 15:44:02",
    level: "SUCCESS",
    component: "SPEECH",
    message: "Text-to-Speech synthesized 'I need drinking water.' using en-IN Indian English voice",
    affectedUserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0",
  },
  {
    id: "LOG-1044",
    timestamp: "2026-09-25 15:42:19",
    level: "INFO",
    component: "VISION",
    message: "Sign confirmed: WATER (Confidence: 94%, Stability Lock: 100%)",
    affectedUserAgent: "Mozilla/5.0 (Android 14; Mobile) Chrome/129.0.0.0",
  }
];

export default function AdminPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedComp, setSelectedComp] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = RAW_LOGS.filter((log) => {
    const matchesLevel = selectedLevel === "ALL" || log.level === selectedLevel;
    const matchesComp = selectedComp === "ALL" || log.component === selectedComp;
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLevel && matchesComp && matchesSearch;
  });

  const downloadReport = () => {
    const data = JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        summaries: INITIAL_LOG_SUMMARIES,
        logs: RAW_LOGS,
      },
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `signbridge-telemetry-report-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-[#060913]/90 backdrop-blur-xl border-b border-rose-500/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">
                  SignBridge AI <span className="text-rose-400">Admin Intelligence</span>
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono">
                  LOG SUMMARIES & DIAGNOSTICS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Log analysis, component health diagnostics, and error resolutions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={downloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>

            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20"
            >
              <span>Open Web App (:3000)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1 space-y-8">
        {/* KPI Scorecard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20">
            <span className="text-xs text-slate-400 block mb-1">Total Monitored Sessions</span>
            <div className="text-2xl font-bold font-mono text-cyan-400">32,900</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">99.7% Success Rate</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-rose-500/20">
            <span className="text-xs text-slate-400 block mb-1">Camera Permission Block Rate</span>
            <div className="text-2xl font-bold font-mono text-rose-400">1.6%</div>
            <span className="text-[11px] text-slate-400 mt-1 block">52 users blocked browser prompt</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-emerald-500/20">
            <span className="text-xs text-slate-400 block mb-1">Average Vision Latency</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">16 ms</div>
            <span className="text-[11px] text-slate-400 mt-1 block">MediaPipe WASM-SIMD</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-violet-500/20">
            <span className="text-xs text-slate-400 block mb-1">Active Model Pipeline</span>
            <div className="text-2xl font-bold font-mono text-violet-400">Hybrid</div>
            <span className="text-[11px] text-slate-400 mt-1 block">ONNX Web + Geometric Heuristic</span>
          </div>
        </div>

        {/* Section 1: Executive Log Summaries by Component */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Component Usage & Error Diagnosis Summaries
            </h2>
            <span className="text-xs text-slate-400">
              Clear understanding of which modules are functioning vs degraded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_LOG_SUMMARIES.map((comp) => {
              const isAttention = comp.status === "ATTENTION";
              return (
                <div
                  key={comp.component}
                  className={`p-6 rounded-3xl glass-panel border transition-all ${
                    isAttention ? "border-amber-500/30" : "border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white text-base">{comp.component}</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        comp.status === "HEALTHY"
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">{comp.description}</p>
                  <code className="text-[11px] text-cyan-400/90 font-mono block mb-4 bg-slate-900 p-1.5 rounded border border-slate-800">
                    {comp.activePath}
                  </code>

                  {/* Common Errors & Root Causes */}
                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Logged Exceptions & Resolutions:
                    </span>
                    {comp.commonErrors.map((errItem, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-rose-300 font-mono text-[11px]">
                          <span className="truncate">{errItem.error}</span>
                          <span className="bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/30">
                            {errItem.count} occurrences
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] pt-1">
                          <strong className="text-emerald-400">Fix / Mitigation:</strong>{" "}
                          {errItem.resolution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Real-Time Log Explorer */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-rose-400" />
              Live Telemetry Log Explorer
            </h2>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter logs by message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Levels</option>
                <option value="ERROR">Errors</option>
                <option value="WARN">Warnings</option>
                <option value="SUCCESS">Success</option>
                <option value="INFO">Info</option>
              </select>

              <select
                value={selectedComp}
                onChange={(e) => setSelectedComp(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Components</option>
                <option value="CAMERA">Camera</option>
                <option value="VISION">Vision</option>
                <option value="MODEL">Model</option>
                <option value="SPEECH">Speech</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-800">
              {filteredLogs.map((log) => {
                const isError = log.level === "ERROR";
                const isWarn = log.level === "WARN";
                const isSuccess = log.level === "SUCCESS";
                const isExpanded = expandedLog === log.id;

                return (
                  <div key={log.id} className="p-4 hover:bg-slate-900/50 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono border ${
                            isError
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : isWarn
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : isSuccess
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                          }`}
                        >
                          {log.level}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          {log.timestamp}
                        </span>

                        <span className="text-xs font-bold text-slate-200">
                          [{log.component}]
                        </span>

                        <span className="text-xs text-slate-200">
                          {log.message}
                        </span>
                      </div>

                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                        className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        <span className="font-mono text-[11px]">{log.id}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 p-3 rounded-xl bg-black/60 border border-slate-800 text-xs space-y-1 font-mono text-slate-300">
                        {log.details && (
                          <p className="text-cyan-300">
                            <strong>Details:</strong> {log.details}
                          </p>
                        )}
                        <p className="text-slate-400 text-[11px] truncate">
                          <strong>Client UA:</strong> {log.affectedUserAgent}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
