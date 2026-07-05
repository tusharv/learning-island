# ICSE Class 1 Learning Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Next.js Adventure Map learning site with five subject quizzes, Samsung remote-friendly navigation, Devanagari transliteration helpers, and local progress.

**Architecture:** Keep `app/page.tsx` as a small server component that renders a client-side `LearningAdventureApp`. Put reusable behavior into pure modules for data, progress, and focus movement so it can be tested with Node's built-in test runner. Use Tailwind/global CSS for a TV-first layout with large targets and strong focus states.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Node 24 built-in `node:test`, `localStorage`.

---

## File Structure

- Create `types/learning.ts`: shared `SubjectId`, `QuizQuestion`, `Subject`, and `Progress` types.
- Create `data/subjects.ts`: five subjects with five starter questions each.
- Create `lib/progress.ts`: default progress, safe parsing, merging, saving, completion updates.
- Create `lib/remoteNavigation.ts`: pure focus movement helpers for map and answer grids.
- Create `tests/learning-data.test.ts`: tests subject count, question counts, Devanagari/transliteration coverage.
- Create `tests/progress.test.ts`: tests local progress parsing and update behavior.
- Create `tests/remote-navigation.test.ts`: tests arrow-key focus behavior.
- Create `components/LearningAdventureApp.tsx`: client app that owns active subject, quiz state, feedback, and local progress.
- Create `components/AdventureMap.tsx`: subject island map.
- Create `components/SubjectIsland.tsx`: one focusable subject island.
- Create `components/QuizGame.tsx`: question, answers, feedback, completion screen.
- Create `components/ProgressBadge.tsx`: star and completion summary.
- Modify `app/page.tsx`: render the learning app instead of the starter screen.
- Modify `app/layout.tsx`: update metadata and remove external Google font dependency.
- Modify `app/globals.css`: add TV-first global styling and a multi-color adventure palette.
- Modify `package.json`: add a `test` script using bundled Node-compatible TypeScript stripping.

## Task 1: Test Harness And Learning Data

**Files:**
- Create: `types/learning.ts`
- Create: `data/subjects.ts`
- Create: `tests/learning-data.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Add the test script**

Add this script to `package.json`:

```json
"test": "node --test --experimental-strip-types tests/*.test.ts"
```

- [ ] **Step 2: Write the failing data test**

Create `tests/learning-data.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { subjects } from "../data/subjects.ts";

test("includes five ICSE Class 1 subjects with five questions each", () => {
  assert.deepEqual(
    subjects.map((subject) => subject.id),
    ["english", "hindi", "marathi", "maths", "evs"],
  );

  for (const subject of subjects) {
    assert.equal(subject.questions.length, 5, `${subject.title} question count`);
  }
});

test("Hindi and Marathi questions include Devanagari text with transliteration helpers", () => {
  const devanagari = /[\u0900-\u097F]/;
  const languageSubjects = subjects.filter((subject) =>
    ["hindi", "marathi"].includes(subject.id),
  );

  for (const subject of languageSubjects) {
    for (const question of subject.questions) {
      assert.match(question.prompt, devanagari);
      assert.ok(question.transliteration);
      assert.equal(question.optionTransliterations?.length, question.options.length);
    }
  }
});

test("every question has a valid answer index and encouragement", () => {
  for (const subject of subjects) {
    for (const question of subject.questions) {
      assert.ok(question.id.startsWith(`${subject.id}-`));
      assert.ok(question.options.length >= 3);
      assert.ok(question.answerIndex >= 0);
      assert.ok(question.answerIndex < question.options.length);
      assert.ok(question.encouragement.length > 0);
    }
  }
});
```

- [ ] **Step 3: Run the test and verify RED**

Run:

```bash
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm test
```

Expected: FAIL because `data/subjects.ts` does not exist.

- [ ] **Step 4: Add the typed subject data**

Create `types/learning.ts` and `data/subjects.ts` with `SubjectId`, `QuizQuestion`, `Subject`, `Progress`, and five subjects matching the design.

- [ ] **Step 5: Run the test and verify GREEN**

Run the same `npm test` command.

Expected: PASS for `learning-data.test.ts`.

## Task 2: Local Progress Logic

**Files:**
- Create: `lib/progress.ts`
- Create: `tests/progress.test.ts`

- [ ] **Step 1: Write the failing progress tests**

Create `tests/progress.test.ts`:

```ts
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
      lastPlayedSubject: "maths",
    }),
  );

  assert.equal(progress.starsBySubject.english, 3);
  assert.equal(progress.starsBySubject.maths, 2);
  assert.equal(progress.starsBySubject.hindi, 0);
  assert.deepEqual(progress.completedSubjects, ["english"]);
  assert.equal(progress.lastPlayedSubject, "maths");
});

test("completed progress keeps the best star count and records last played subject", () => {
  const first = buildCompletedProgress(createDefaultProgress(), "hindi", 3);
  const second = buildCompletedProgress(first, "hindi", 1);

  assert.equal(second.starsBySubject.hindi, 3);
  assert.deepEqual(second.completedSubjects, ["hindi"]);
  assert.equal(second.lastPlayedSubject, "hindi");
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm test
```

Expected: FAIL because `lib/progress.ts` does not exist.

- [ ] **Step 3: Implement minimal progress helpers**

Create `lib/progress.ts` with `createDefaultProgress`, `parseStoredProgress`, `serializeProgress`, `loadProgress`, `saveProgress`, and `buildCompletedProgress`.

- [ ] **Step 4: Run tests and verify GREEN**

Run the same `npm test` command.

Expected: PASS for data and progress tests.

## Task 3: Remote Navigation Logic

**Files:**
- Create: `lib/remoteNavigation.ts`
- Create: `tests/remote-navigation.test.ts`

- [ ] **Step 1: Write the failing remote navigation tests**

Create `tests/remote-navigation.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { moveFocus } from "../lib/remoteNavigation.ts";

test("horizontal map navigation wraps through five subject islands", () => {
  assert.equal(moveFocus(0, "ArrowLeft", 5, 5), 4);
  assert.equal(moveFocus(4, "ArrowRight", 5, 5), 0);
});

test("two-column answer navigation moves by row and clamps at edges", () => {
  assert.equal(moveFocus(0, "ArrowRight", 4, 2), 1);
  assert.equal(moveFocus(0, "ArrowDown", 4, 2), 2);
  assert.equal(moveFocus(3, "ArrowDown", 4, 2), 3);
  assert.equal(moveFocus(2, "ArrowLeft", 4, 2), 2);
});

test("unknown keys keep the current focus", () => {
  assert.equal(moveFocus(2, "KeyA", 5, 5), 2);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm test
```

Expected: FAIL because `lib/remoteNavigation.ts` does not exist.

- [ ] **Step 3: Implement minimal focus movement**

Create `lib/remoteNavigation.ts` with `moveFocus(currentIndex, key, itemCount, columns)` and `isSelectKey`.

- [ ] **Step 4: Run tests and verify GREEN**

Run the same `npm test` command.

Expected: PASS for all unit tests.

## Task 4: Adventure Map And Quiz UI

**Files:**
- Create: `components/LearningAdventureApp.tsx`
- Create: `components/AdventureMap.tsx`
- Create: `components/SubjectIsland.tsx`
- Create: `components/QuizGame.tsx`
- Create: `components/ProgressBadge.tsx`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing type/build check**

Run:

```bash
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm run build
```

Expected before implementation: the starter app builds but does not meet the spec. Continue only after Tasks 1-3 unit tests define the behavior contracts.

- [ ] **Step 2: Implement the client app and components**

Add the interactive client component using `"use client"`, local state, `useEffect` for storage hydration, keyboard listeners for remote keys, and the tested helpers for focus movement and progress updates.

- [ ] **Step 3: Replace the starter page and metadata**

Make `app/page.tsx` render `LearningAdventureApp`, update title/description in `app/layout.tsx`, and avoid remote font dependency for TV/browser reliability.

- [ ] **Step 4: Add TV-first global styles**

Update `app/globals.css` with a bright but balanced adventure theme, responsive TV layout, large focus rings, Devanagari-friendly font stack, and reduced-motion handling.

- [ ] **Step 5: Run tests, lint, and build**

Run:

```bash
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm test
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm run lint
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm run build
```

Expected: all commands exit 0.

## Task 5: Browser Verification

**Files:**
- No production file changes expected.

- [ ] **Step 1: Start the local dev server**

Run:

```bash
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm run dev -- --hostname 127.0.0.1
```

- [ ] **Step 2: Verify in browser**

Open the local URL and verify:

- Adventure Map appears on first screen.
- Five subject islands are visible.
- Arrow keys move focus.
- Enter opens a quiz.
- Hindi/Marathi show Devanagari and transliteration helper text.
- Completing a quiz saves stars and completion after refresh.
- Layout remains readable at desktop and mobile widths.

- [ ] **Step 3: Stop the dev server**

Stop the server after verification.

## Task 6: Final Review

**Files:**
- Review all modified files.

- [ ] **Step 1: Run final verification**

Run:

```bash
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm test
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm run lint
PATH=/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/tusharvagela/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin:$PATH npm run build
```

- [ ] **Step 2: Check Git status and summarize**

Run:

```bash
git status --short
```

Summarize changed files, verification results, and the local dev URL if the server remains running.
