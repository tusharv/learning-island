import assert from "node:assert/strict";
import test from "node:test";
import {
  QUESTIONS_PER_QUIZ,
  formatStarsCollected,
  nextRoundStars,
  pickQuizQuestions,
} from "../lib/quizScoring.ts";
import type { QuizQuestion } from "../types/learning.ts";

test("adds one star for a correct answer", () => {
  assert.equal(nextRoundStars(4, 1, 1), 5);
});

test("formats collected stars with the right singular and plural wording", () => {
  assert.equal(formatStarsCollected(1), "You collected 1 star!");
  assert.equal(formatStarsCollected(2), "You collected 2 stars!");
});

test("keeps the same star count for an incorrect answer", () => {
  assert.equal(nextRoundStars(4, 0, 1), 4);
});

test("keeps the same star count when no answer has been selected", () => {
  assert.equal(nextRoundStars(4, null, 1), 4);
});

const buildPool = (count: number): QuizQuestion[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `q-${index}`,
    prompt: `Question ${index}`,
    options: ["a", "b", "c"],
    answerIndex: 0,
    encouragement: "Nice!",
  }));

test("asks five questions per quiz", () => {
  assert.equal(QUESTIONS_PER_QUIZ, 5);
});

test("picks five questions from a larger pool", () => {
  const pool = buildPool(25);
  const picked = pickQuizQuestions(pool);

  assert.equal(picked.length, 5);
});

test("only picks questions that exist in the pool with no duplicates", () => {
  const pool = buildPool(25);
  const picked = pickQuizQuestions(pool);
  const ids = picked.map((question) => question.id);

  assert.equal(new Set(ids).size, picked.length);
  for (const question of picked) {
    assert.ok(pool.includes(question));
  }
});

test("returns all questions when the pool is smaller than the quiz size", () => {
  const pool = buildPool(3);
  const picked = pickQuizQuestions(pool);

  assert.equal(picked.length, 3);
});

test("accepts a custom random source for deterministic selection", () => {
  const pool = buildPool(10);
  const picked = pickQuizQuestions(pool, 3, () => 0);

  assert.equal(picked.length, 3);
});
