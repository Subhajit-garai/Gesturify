"use client";

import React, { useState } from "react";
import { ConstructedSentence } from "@/translation/sentenceBuilder";
import { SignSentenceItem } from "@/types";
import { ttsService } from "@/speech/textToSpeech";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Volume2,
  VolumeX,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  MessageSquare,
} from "lucide-react";

interface TranslationPanelProps {
  sentence: ConstructedSentence;
  tokens: SignSentenceItem[];
  onClear: () => void;
  onRemoveLastToken: () => void;
}

export const TranslationPanel: React.FC<TranslationPanelProps> = ({
  sentence,
  tokens,
  onClear,
  onRemoveLastToken,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    const textToSpeak = sentence.english || tokens.map((t) => t.token).join(" ");
    if (!textToSpeak) return;

    setIsSpeaking(true);
    ttsService.speak(textToSpeak, { rate: 0.95, lang: "en-IN" }, () => {
      setIsSpeaking(false);
    });
  };

  const handleStopSpeak = () => {
    ttsService.stop();
    setIsSpeaking(false);
  };

  const handleCopy = async () => {
    const content = sentence.english || tokens.map((t) => t.token).join(" ");
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  const hasTokens = tokens.length > 0;

  return (
    <div className="flex flex-col h-full rounded-3xl glass-panel-elevated border border-cyan-500/20 p-6 shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300">
            Translated Message
          </h3>
        </div>

        {/* Action Controls using shadcn Button */}
        <div className="flex items-center gap-1.5">
          {hasTokens && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveLastToken}
              className="h-8 px-2"
              title="Undo last recognized sign"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            disabled={!hasTokens}
            className="h-8 gap-1.5"
            title="Copy message to clipboard"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onClear}
            disabled={!hasTokens}
            className="h-8 gap-1"
            title="Clear all tokens"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Main Sentence Output Box */}
      <div className="flex-1 flex flex-col justify-center my-4 min-h-[120px] p-5 rounded-2xl bg-surface-darker/60 border border-slate-800">
        {hasTokens ? (
          <div className="space-y-2">
            <p className="text-xl sm:text-2xl font-semibold text-slate-100 leading-snug">
              &ldquo;{sentence.english}&rdquo;
            </p>
            {sentence.hindi && (
              <p className="text-sm font-medium text-cyan-300/90">
                {sentence.hindi}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600 animate-pulse" />
            <p className="text-sm">Signs you perform will automatically assemble into a sentence here</p>
          </div>
        )}
      </div>

      {/* Detected Token Sequence Breadcrumbs using shadcn Badge */}
      {hasTokens && (
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Sign Token Stream ({tokens.length})
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {tokens.map((item, idx) => (
              <Badge
                key={item.id || idx}
                variant="neon"
                className="gap-1.5 py-1 px-2.5 text-xs font-semibold"
              >
                <span>{item.token}</span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  {Math.round(item.confidence * 100)}%
                </span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Speak Button using shadcn Button with neon variant */}
      <div className="pt-2">
        <Button
          variant={!hasTokens ? "secondary" : isSpeaking ? "destructive" : "neon"}
          size="lg"
          onClick={isSpeaking ? handleStopSpeak : handleSpeak}
          disabled={!hasTokens}
          className="w-full gap-2 text-sm font-bold"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5 animate-bounce" />
              <span>Speaking Aloud (Tap to Stop)</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>Speak Sentence (Text-to-Speech)</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
