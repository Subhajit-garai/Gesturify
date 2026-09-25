"use client";

import React, { useState, useEffect, useRef } from "react";
import { StudyModule, TranscriptCue, YouTubeTranscriptResponse } from "@/types/youtube";
import {
  Video,
  Play,
  ChevronDown,
  ChevronUp,
  Search,
  Clock,
  Sparkles,
  BookOpen,
  AlertCircle,
  Loader2,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { SignQuizSection } from "./SignQuizSection";

interface VideoLearningSectionProps {
  onPracticeSign?: (signId?: string) => void;
}

export const VideoLearningSection: React.FC<VideoLearningSectionProps> = ({
  onPracticeSign,
}) => {
  const [modules, setModules] = useState<StudyModule[]>([]);
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  // Tracks which module is currently expanded/enlarged (null = all collapsed)
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Quiz Mode State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizCategory, setQuizCategory] = useState("ALL");

  // Cached transcripts per videoId { [videoId]: { loading, data, error } }
  const [transcripts, setTranscripts] = useState<
    Record<string, { loading: boolean; data?: YouTubeTranscriptResponse; error?: string }>
  >({});

  // Custom YouTube URL tester state
  const [customUrl, setCustomUrl] = useState("");
  const [customVideoId, setCustomVideoId] = useState<string | null>(null);

  // Active search query to filter transcript cues
  const [filterText, setFilterText] = useState("");

  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  // 1. Fetch lightweight modules list on mount (ZERO video preloading)
  useEffect(() => {
    async function loadModules() {
      try {
        setIsLoadingModules(true);
        const res = await fetch("/api/youtube/modules");
        const json = await res.json();
        if (json.success && json.modules) {
          setModules(json.modules);
        }
      } catch (err) {
        console.error("Failed to load study modules:", err);
      } finally {
        setIsLoadingModules(false);
      }
    }
    loadModules();
  }, []);

  // 2. Fetch transcript on-demand ONLY when a module is expanded
  const handleToggleModule = async (moduleId: string, videoId: string) => {
    if (expandedModuleId === moduleId) {
      // Collapse if already open
      setExpandedModuleId(null);
      return;
    }

    setExpandedModuleId(moduleId);
    setFilterText("");

    // If transcript for this video is not yet fetched, fetch it now
    if (!transcripts[videoId] || (!transcripts[videoId].data && !transcripts[videoId].loading)) {
      setTranscripts((prev) => ({
        ...prev,
        [videoId]: { loading: true },
      }));

      try {
        const res = await fetch(`/api/youtube/transcript?v=${encodeURIComponent(videoId)}`);
        const json: YouTubeTranscriptResponse = await res.json();
        if (json.success) {
          setTranscripts((prev) => ({
            ...prev,
            [videoId]: { loading: false, data: json },
          }));
        } else {
          setTranscripts((prev) => ({
            ...prev,
            [videoId]: { loading: false, error: json.error || "No captions available" },
          }));
        }
      } catch (err: any) {
        setTranscripts((prev) => ({
          ...prev,
          [videoId]: { loading: false, error: err.message || "Failed to load transcript" },
        }));
      }
    }
  };

  // 3. Handle custom URL submission
  const handleLoadCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    // Expand the custom tester section
    const match = customUrl.match(/(?:youtu\.be\/|watch\?v=|\/embed\/|\/shorts\/|^)([a-zA-Z0-9_-]{11})/i);
    const vid = match ? match[1] : customUrl.trim();

    setCustomVideoId(vid);
    setExpandedModuleId("custom-module");

    // Fetch transcript for custom video
    handleToggleModule("custom-module", vid);
  };

  // 4. Seek YouTube iframe video to a specific timestamp
  const seekVideo = (videoId: string, seconds: number) => {
    const iframe = iframeRefs.current[videoId];
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [seconds, true],
        }),
        "*"
      );
    }
  };

  if (isQuizActive) {
    return (
      <div className="py-2">
        <SignQuizSection
          initialCategory={quizCategory}
          onBackToVideos={() => setIsQuizActive(false)}
          onPracticeOnCamera={(id) => onPracticeSign?.(id)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header Info */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              ISL Video Learning Modules & Interactive Transcripts
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any module to enlarge. Videos and transcripts load strictly on-demand.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Take Quiz Button */}
          <button
            onClick={() => {
              setQuizCategory("ALL");
              setIsQuizActive(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white font-bold text-xs transition-all shadow-md shadow-rose-500/20 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Take MCQ Quiz</span>
          </button>

          {/* Custom YouTube URL Tester */}
          <form onSubmit={handleLoadCustomUrl} className="flex items-center gap-2">
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste YouTube Link..."
              className="px-3 py-1.5 rounded-xl bg-surface-dark border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-all shrink-0 cursor-pointer"
            >
              Load
            </button>
          </form>
        </div>
      </div>

      {/* Loading state for module catalog */}
      {isLoadingModules && (
        <div className="flex items-center justify-center p-12 text-slate-400 text-xs gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Loading module directory...</span>
        </div>
      )}

      {/* Custom Video Expanded Section if user loaded one */}
      {customVideoId && expandedModuleId === "custom-module" && (
        <div className="rounded-2xl glass-panel border border-cyan-500/40 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-300">Custom Video: {customVideoId}</h3>
            <button
              onClick={() => setExpandedModuleId(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Video Player */}
            <div className="lg:col-span-7 aspect-video rounded-xl overflow-hidden bg-black border border-slate-800">
              <iframe
                ref={(el) => {
                  iframeRefs.current[customVideoId] = el;
                }}
                src={`https://www.youtube.com/embed/${customVideoId}?enablejsapi=1&autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Transcript Panel */}
            <div className="lg:col-span-5 flex flex-col h-80 bg-surface-darker/80 rounded-xl border border-slate-800 p-3">
              <TranscriptView
                state={transcripts[customVideoId]}
                filterText={filterText}
                onSeek={(sec) => seekVideo(customVideoId, sec)}
                onPracticeSign={onPracticeSign}
              />
            </div>
          </div>
        </div>
      )}

      {/* List of Study Modules (Collapsed by default, zero video preloading) */}
      <div className="space-y-4">
        {modules.map((mod, index) => {
          const isExpanded = expandedModuleId === mod.id;
          const transcriptState = transcripts[mod.videoId];

          return (
            <div
              key={mod.id}
              className={`rounded-2xl transition-all border ${
                isExpanded
                  ? "glass-panel border-cyan-500/40 shadow-xl shadow-cyan-500/5 p-5 space-y-4"
                  : "bg-surface-dark/60 hover:bg-surface-dark border-slate-800/80 p-4"
              }`}
            >
              {/* Header / Summary Bar (Always Visible) */}
              <div
                onClick={() => handleToggleModule(mod.id, mod.videoId)}
                className="flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400">
                    0{index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                        {mod.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {mod.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mod.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{mod.videoDuration}</span>
                  </div>

                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isExpanded
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                        : "bg-surface-darker text-slate-300 border border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <span>{isExpanded ? "Collapse" : "Enlarge Lesson"}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* ENLARGED VIEW: Video & Transcript only load when expanded */}
              {isExpanded && (
                <div className="pt-2 border-t border-slate-800/80 space-y-4">
                  <p className="text-xs text-slate-300">{mod.description}</p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    {/* Lazy-loaded YouTube Video Player */}
                    <div className="lg:col-span-7 aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                      <iframe
                        ref={(el) => {
                          iframeRefs.current[mod.videoId] = el;
                        }}
                        src={`https://www.youtube.com/embed/${mod.videoId}?enablejsapi=1&autoplay=1`}
                        title={mod.videoTitle}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Synchronized Transcript Reference Feed */}
                    <div className="lg:col-span-5 flex flex-col h-[360px] bg-[#070b14] rounded-xl border border-cyan-500/20 p-3 shadow-inner">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Video Transcript Reference</span>
                        </div>

                        {transcriptState?.data?.cues && (
                          <span className="text-[10px] text-slate-400">
                            {transcriptState.data.cues.length} Cues
                          </span>
                        )}
                      </div>

                      {/* Filter Input */}
                      <div className="py-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Search transcript words..."
                            className="w-full pl-8 pr-3 py-1.5 bg-surface-darker rounded-lg border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      {/* Transcript Cues List */}
                      <div className="flex-1 overflow-y-auto pr-1">
                        <TranscriptView
                          state={transcriptState}
                          filterText={filterText}
                          onSeek={(sec) => seekVideo(mod.videoId, sec)}
                          onPracticeSign={onPracticeSign}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Minimal sub-component to render the cues list
 */
function TranscriptView({
  state,
  filterText,
  onSeek,
  onPracticeSign,
}: {
  state?: { loading: boolean; data?: YouTubeTranscriptResponse; error?: string };
  filterText: string;
  onSeek: (seconds: number) => void;
  onPracticeSign?: (signId: string) => void;
}) {
  if (!state || state.loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 py-8">
        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
        <span>Loading synchronized transcript...</span>
      </div>
    );
  }

  if (state.error || !state.data?.cues || state.data.cues.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs gap-2 p-4 text-center">
        <AlertCircle className="w-5 h-5 text-amber-400" />
        <span>{state.error || "No transcript available for this video."}</span>
      </div>
    );
  }

  const cues = state.data.cues.filter((cue) =>
    cue.text.toLowerCase().includes(filterText.toLowerCase())
  );

  if (cues.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 text-xs">
        No cues found matching "{filterText}".
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <div className="space-y-2 py-1">
      {cues.map((cue) => (
        <div
          key={cue.id}
          className="p-2.5 rounded-lg bg-surface-dark/70 hover:bg-surface-dark border border-slate-800/80 hover:border-cyan-500/30 transition-all text-xs group"
        >
          <div className="flex items-start gap-2">
            {/* Click-to-Seek timestamp button */}
            <button
              onClick={() => onSeek(cue.start)}
              className="px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[10px] shrink-0 flex items-center gap-1 cursor-pointer"
              title={`Jump video to ${formatTime(cue.start)}`}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>{formatTime(cue.start)}</span>
            </button>

            {/* Cue text */}
            <p className="text-slate-300 leading-relaxed flex-1 select-text">
              {cue.text}
            </p>
          </div>

          {/* Matched ISL Sign tokens */}
          {cue.matchedSigns && cue.matchedSigns.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-2 border-t border-slate-800/60">
              <span className="text-[10px] text-slate-500">ISL Signs:</span>
              {cue.matchedSigns.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => onPracticeSign?.(sign.id)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center gap-1 cursor-pointer"
                  title={`Practice ${sign.label} in Gesturify`}
                >
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{sign.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
