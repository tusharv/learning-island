import assert from "node:assert/strict";
import test from "node:test";
import { readingWordLessons } from "../data/readingWords.ts";
import { sightWordLessons } from "../data/sightWords.ts";
import {
  applyWordBrowseFilters,
  countActiveFilters,
  cycleDifficulty,
  cycleLetter,
  cycleSort,
  getWordDifficulty,
  indexWordLessons,
  resolveFilteredIndex,
} from "../lib/wordListBrowse.ts";

test("word difficulty tiers match Class 1 length bands", () => {
  assert.equal(getWordDifficulty("cat"), "easy");
  assert.equal(getWordDifficulty("plant"), "medium");
  assert.equal(getWordDifficulty("school"), "tricky");
});

test("reading words can be sorted A to Z", () => {
  const indexed = indexWordLessons(readingWordLessons, "reading");
  const sorted = applyWordBrowseFilters(indexed, {
    sort: "a-z",
    difficulty: "all",
    letter: "all",
  });

  assert.equal(sorted.length, 154);
  assert.equal(sorted[0]?.lesson.word, "ask");
  assert.equal(sorted.at(-1)?.lesson.word, "wrong");
});

test("words can be filtered by difficulty and starting letter", () => {
  const indexed = indexWordLessons(readingWordLessons, "reading");
  const filtered = applyWordBrowseFilters(indexed, {
    sort: "sheet",
    difficulty: "easy",
    letter: "b",
  });

  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((entry) => entry.meta.difficulty === "easy"));
  assert.ok(filtered.every((entry) => entry.meta.firstLetter === "b"));
});

test("sight words can be filtered by difficulty", () => {
  const indexed = indexWordLessons(sightWordLessons, "sight-words");
  const easyWords = applyWordBrowseFilters(indexed, {
    sort: "sheet",
    difficulty: "easy",
    letter: "all",
  });

  assert.ok(easyWords.length > 0);
  assert.ok(easyWords.every((entry) => entry.meta.difficulty === "easy"));
});

test("filter cycles advance to the next option", () => {
  assert.equal(cycleSort("sheet"), "a-z");
  assert.equal(cycleDifficulty("all"), "easy");
  assert.equal(cycleLetter("all", ["a", "b"]), "a");
});

test("countActiveFilters ignores the default sheet order", () => {
  assert.equal(
    countActiveFilters({
      sort: "sheet",
      difficulty: "all",
      letter: "all",
    }),
    0,
  );

  assert.equal(
    countActiveFilters({
      sort: "a-z",
      difficulty: "easy",
      letter: "all",
    }),
    2,
  );
});

test("resolveFilteredIndex keeps the active word when still visible", () => {
  const indexed = indexWordLessons(readingWordLessons, "reading");
  const filtered = applyWordBrowseFilters(indexed, {
    sort: "a-z",
    difficulty: "all",
    letter: "all",
  });

  const smokeSheetIndex = indexed.find((entry) => entry.lesson.word === "smoke")
    ?.meta.sheetIndex;

  assert.ok(typeof smokeSheetIndex === "number");
  assert.ok(
    filtered.some((entry) => entry.meta.sheetIndex === smokeSheetIndex),
  );
  assert.equal(
    resolveFilteredIndex(filtered, smokeSheetIndex!),
    filtered.findIndex((entry) => entry.meta.sheetIndex === smokeSheetIndex),
  );
});
