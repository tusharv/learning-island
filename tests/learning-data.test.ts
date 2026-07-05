import assert from "node:assert/strict";
import test from "node:test";
import { subjects } from "../data/subjects.ts";

test("includes five ICSE Class 1 subjects with five topics each", () => {
  assert.deepEqual(
    subjects.map((subject) => subject.id),
    ["english", "hindi", "marathi", "maths", "evs"],
  );

  for (const subject of subjects) {
    const expectedTopics = subject.id === "english" ? 6 : 5;
    assert.equal(subject.topics.length, expectedTopics, `${subject.title} topic count`);

    for (const topic of subject.topics) {
      const expectedQuestions = topic.id === "sight-words" ? 100 : 25;
      assert.equal(
        topic.questions.length,
        expectedQuestions,
        `${subject.title} ${topic.title} question count`,
      );
    }
  }
});

test("English includes ABCD, abcd, Vowels, and Sight Words topics", () => {
  const english = subjects.find((subject) => subject.id === "english");

  assert.ok(english);
  assert.deepEqual(
    english.topics.map((topic) => topic.title),
    ["ABCD", "abcd", "Vowels", "Rhyming", "Words", "Sight Words"],
  );
});

test("English sight words include words from the class word list", () => {
  const english = subjects.find((subject) => subject.id === "english");
  const sightWords = english?.topics.find((topic) => topic.id === "sight-words");

  assert.ok(sightWords);
  assert.equal(sightWords.questions.length, 100);
  assert.ok(sightWords.questions.some((question) => question.prompt.includes("the")));
  assert.ok(sightWords.questions.some((question) => question.options.includes("because")));
  assert.ok(sightWords.questions.some((question) => question.options.includes("I'm")));
});

test("Hindi and Marathi questions include Devanagari text with transliteration helpers", () => {
  const devanagari = /[\u0900-\u097F]/;
  const languageSubjects = subjects.filter((subject) =>
    ["hindi", "marathi"].includes(subject.id),
  );

  for (const subject of languageSubjects) {
    for (const topic of subject.topics) {
      for (const question of topic.questions) {
        assert.match(question.prompt, devanagari);
        assert.ok(question.transliteration);
        assert.equal(
          question.optionTransliterations?.length,
          question.options.length,
        );
      }
    }
  }
});

test("every question has a valid answer index and encouragement", () => {
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      for (const question of topic.questions) {
        assert.ok(question.id.startsWith(`${subject.id}-${topic.id}-`));
        assert.ok(question.options.length >= 3);
        assert.ok(question.answerIndex >= 0);
        assert.ok(question.answerIndex < question.options.length);
        assert.ok(question.encouragement.length > 0);
      }
    }
  }
});
