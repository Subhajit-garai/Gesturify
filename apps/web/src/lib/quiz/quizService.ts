import { SIGN_VOCABULARY, SignItem } from "@/config/signVocabulary";
import { QuizOption, QuizQuestion } from "@/types/quiz";

/**
 * Generates an MCQ quiz by picking target signs and 3 randomized distractors for each.
 */
export function generateQuiz(
  count: number = 5,
  categoryFilter?: string
): QuizQuestion[] {
  let pool = [...SIGN_VOCABULARY];

  if (categoryFilter && categoryFilter !== "ALL") {
    const filtered = pool.filter((item) => item.category === categoryFilter);
    if (filtered.length >= 4) {
      pool = filtered;
    }
  }

  // Shuffle pool to pick random target questions
  const shuffledPool = shuffleArray(pool);
  const selectedTargets = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

  return selectedTargets.map((target, index) => {
    // Pick 3 distractors from the rest of SIGN_VOCABULARY that are not this target
    const distractors = shuffleArray(
      SIGN_VOCABULARY.filter((item) => item.id !== target.id)
    ).slice(0, 3);

    // Combine target + 3 distractors into 4 options and shuffle them
    const rawOptions: QuizOption[] = [
      {
        id: target.id,
        label: target.label,
        hindiLabel: target.hindiLabel,
        category: target.category,
      },
      ...distractors.map((d) => ({
        id: d.id,
        label: d.label,
        hindiLabel: d.hindiLabel,
        category: d.category,
      })),
    ];

    const shuffledOptions = shuffleArray(rawOptions);

    return {
      id: `quiz-q-${index + 1}-${target.id}`,
      targetSign: target,
      prompt: "Which Indian Sign Language (ISL) gesture matches this movement?",
      options: shuffledOptions,
      correctSignId: target.id,
      explanation: target.gestureGuide,
    };
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
