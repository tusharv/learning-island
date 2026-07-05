import type { QuizQuestion } from "../types/learning";

export const QUESTIONS_PER_QUIZ = 5;

export function nextRoundStars(
  currentStars: number,
  selectedAnswerIndex: number | null,
  answerIndex: number,
): number {
  return selectedAnswerIndex === answerIndex ? currentStars + 1 : currentStars;
}

export function pickQuizQuestions(
  pool: QuizQuestion[],
  count: number = QUESTIONS_PER_QUIZ,
  random: () => number = Math.random,
): QuizQuestion[] {
  const shuffled = [...pool];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}
