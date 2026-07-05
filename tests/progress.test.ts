import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCompletedProgress,
  createDefaultProgress,
  parseStoredProgress,
} from "../lib/progress.ts";

test("default progress starts every subject at zero stars", () => {
  assert.deepEqual(createDefaultProgress(), {
    starsBySubject: {
      english: 0,
      hindi: 0,
      marathi: 0,
      maths: 0,
      evs: 0,
    },
    completedSubjects: [],
    completedTopicsBySubject: {
      english: [],
      hindi: [],
      marathi: [],
      maths: [],
      evs: [],
    },
  });
});

test("invalid stored progress falls back to defaults", () => {
  assert.deepEqual(parseStoredProgress("not-json"), createDefaultProgress());
  assert.deepEqual(parseStoredProgress(null), createDefaultProgress());
});

test("stored progress is normalized to known subjects only", () => {
  const progress = parseStoredProgress(
    JSON.stringify({
      starsBySubject: { english: 3, maths: 2, unknown: 99 },
      completedSubjects: ["english", "unknown"],
      completedTopicsBySubject: {
        english: ["abcd", "unknown"],
        maths: ["numbers"],
      },
      lastPlayedSubject: "maths",
    }),
  );

  assert.equal(progress.starsBySubject.english, 3);
  assert.equal(progress.starsBySubject.maths, 2);
  assert.equal(progress.starsBySubject.hindi, 0);
  assert.deepEqual(progress.completedSubjects, ["english"]);
  assert.deepEqual(progress.completedTopicsBySubject.english, [
    "abcd",
    "unknown",
  ]);
  assert.deepEqual(progress.completedTopicsBySubject.maths, ["numbers"]);
  assert.equal(progress.lastPlayedSubject, "maths");
});

test("completed progress keeps the best star count and records topic completion", () => {
  const first = buildCompletedProgress(
    createDefaultProgress(),
    "hindi",
    "swar",
    3,
    5,
  );
  const second = buildCompletedProgress(first, "hindi", "swar", 1, 5);

  assert.equal(second.starsBySubject.hindi, 3);
  assert.deepEqual(second.completedTopicsBySubject.hindi, ["swar"]);
  assert.deepEqual(second.completedSubjects, []);
  assert.equal(second.lastPlayedSubject, "hindi");
});

test("subject completes only after every topic is finished", () => {
  let progress = createDefaultProgress();

  for (const topicId of [
    "abcd",
    "abcd-small",
    "vowels",
    "rhyming",
    "words",
  ]) {
    progress = buildCompletedProgress(progress, "english", topicId, 2, 6);
    assert.deepEqual(progress.completedSubjects, []);
  }

  progress = buildCompletedProgress(progress, "english", "sight-words", 3, 6);

  assert.deepEqual(progress.completedSubjects, ["english"]);
  assert.deepEqual(progress.completedTopicsBySubject.english, [
    "abcd",
    "abcd-small",
    "vowels",
    "rhyming",
    "words",
    "sight-words",
  ]);
});
