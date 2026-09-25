"use client";

import React, { useState, useEffect } from "react";
import { generateQuiz } from "@/lib/quiz/quizService";
import { QuizQuestion, UserAnswer } from "@/types/quiz";
import { AnimatedGestureCard } from "./AnimatedGestureCard";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  Camera,
  Sparkles,
  Flame,
  Award,
} from "lucide-react";

interface SignQuizSectionProps {
  onPracticeOnCamera?: (signId?: string) => void;
  onBackToVideos?: () => void;
  initialCategory?: string;
}

export const SignQuizSection: React.FC<SignQuizSectionProps> = ({
  onPracticeOnCamera,
  onBackToVideos,
  initialCategory = "ALL",
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [history, setHistory] = useState<UserAnswer[]>([]);

  // Start a fresh quiz
  const startNewQuiz = () => {
    const qs = generateQuiz(5, initialCategory);
    setQuestions(qs);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setIsComplete(false);
    setHistory([]);
  };

  useEffect(() => {
    startNewQuiz();
  }, [initialCategory]);

  const currentQ = questions[currentIndex];

  // Handle option click
  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return; // Prevent changing after submission

    setSelectedOptionId(optionId);
    setIsAnswerSubmitted(true);

    const isCorrect = optionId === currentQ.correctSignId;

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    setHistory((prev) => [
      ...prev,
      {
        questionId: currentQ.id,
        selectedOptionId: optionId,
        isCorrect,
        correctOptionId: currentQ.correctSignId,
      },
    ]);
  };

  // Next question or finish
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((idx) => idx + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsComplete(true);
      // Trigger confetti if scored 3 or more!
      if (score >= 2) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore if canvas-confetti in SSR
        }
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        Generating quiz questions...
      </div>
    );
  }

  // 1. QUIZ COMPLETED SCREEN
  if (isComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="max-w-2xl mx-auto p-6 rounded-3xl glass-panel border border-cyan-500/30 text-center space-y-6 shadow-2xl animate-fade-in">
        <div className="w-16 h-16 rounded-2xl mx-auto bg-gradient-to-tr from-amber-500/20 to-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-amber-400 shadow-lg">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Assessment Complete
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            {passed ? "Terrific Job! You Know Your Signs!" : "Keep Practicing!"}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
            You scored {score} out of {questions.length} questions correctly ({percentage}%).
          </p>
        </div>

        {/* Score metrics */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="p-3 rounded-xl bg-surface-darker/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Score
            </span>
            <span className="text-xl font-black text-emerald-400">
              {score}/{questions.length}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-surface-darker/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Accuracy
            </span>
            <span className="text-xl font-black text-cyan-400">{percentage}%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={startNewQuiz}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-dark hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>

          {onPracticeOnCamera && (
            <button
              onClick={() => onPracticeOnCamera()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-surface-darker font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Verify with Live Camera</span>
            </button>
          )}

          {onBackToVideos && (
            <button
              onClick={onBackToVideos}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
            >
              <span>Back to Videos</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 2. ACTIVE QUESTION SCREEN
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top Header & Score Progress */}
      <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          {streak > 1 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px] animate-pulse">
              <Flame className="w-3 h-3 text-amber-400 fill-current" />
              <span>{streak} Streak!</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Score: <strong className="text-emerald-400">{score}</strong>
          </span>

          {onBackToVideos && (
            <button
              onClick={onBackToVideos}
              className="text-slate-400 hover:text-white text-[11px] underline cursor-pointer"
            >
              Exit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-surface-darker overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Layout Grid: Left Gesture Card, Right MCQ Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left 6 Columns: Animated Gesture Visualizer */}
        <div className="md:col-span-6 space-y-3">
          <AnimatedGestureCard
            sign={currentQ.targetSign}
            showAnswer={isAnswerSubmitted}
          />
        </div>

        {/* Right 6 Columns: MCQ Choice Buttons */}
        <div className="md:col-span-6 space-y-3">
          <div className="p-3 rounded-xl bg-surface-darker/60 border border-slate-800 text-xs text-slate-300 font-medium">
            <p className="flex items-center gap-1.5 text-white font-semibold">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              {currentQ.prompt}
            </p>
          </div>

          {/* 4 Multiple Choice Option Buttons */}
          <div className="space-y-2">
            {currentQ.options.map((opt, i) => {
              const letter = ["A", "B", "C", "D"][i];
              const isSelected = selectedOptionId === opt.id;
              const isCorrectAnswer = opt.id === currentQ.correctSignId;

              let btnStyle =
                "bg-surface-dark/80 hover:bg-surface-dark border-slate-800 text-slate-200 hover:border-cyan-500/40";

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle =
                    "bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10";
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300 line-through";
                } else {
                  btnStyle = "bg-surface-dark/40 border-slate-900 text-slate-500 opacity-60";
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isAnswerSubmitted}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer disabled:cursor-default ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-surface-darker flex items-center justify-center font-mono font-bold text-[10px] text-cyan-300 border border-slate-800">
                      {letter}
                    </span>
                    <div>
                      <span className="font-bold block text-sm">{opt.label}</span>
                      <span className="text-[11px] text-slate-400">{opt.hindiLabel}</span>
                    </div>
                  </div>

                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Action Bar (Appears after selecting answer) */}
          {isAnswerSubmitted && (
            <div className="p-4 rounded-xl bg-surface-darker border border-cyan-500/30 space-y-3 animate-fade-in text-xs">
              <div>
                <strong className="text-cyan-300 block mb-0.5">
                  How this gesture is performed:
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 gap-2">
                {onPracticeOnCamera && (
                  <button
                    onClick={() => onPracticeOnCamera(currentQ.correctSignId)}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Practice on Camera</span>
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <span>
                    {currentIndex < questions.length - 1
                      ? "Next Question"
                      : "See Final Score"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
