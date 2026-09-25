import { SignItem } from "@/config/signVocabulary";

export interface QuizOption {
  id: string;
  label: string;
  hindiLabel: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  targetSign: SignItem;
  prompt: string;
  options: QuizOption[];
  correctSignId: string;
  explanation: string;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  correctOptionId: string;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOptionId: string | null;
  isAnswerSubmitted: boolean;
  score: number;
  streak: number;
  isComplete: boolean;
  history: UserAnswer[];
}
