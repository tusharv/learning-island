# ICSE Class 1 Learning Adventure Site Design

## Summary

Build a Next.js learning site for an ICSE Class 1 child, designed for use on a Samsung TV through the TV browser and remote. The site will be hosted on Vercel. Version 1 focuses on playful subject-based practice games for English, Hindi, Marathi, Maths, and EVS.

The primary experience is an Adventure Map. Each subject appears as an island. The child moves around with the TV remote arrow keys, presses OK/Enter to select a subject, and plays a short quiz game. Correct answers earn stars, completed rounds earn subject completion, and progress is saved locally in the TV/browser with no login.

## Goals

- Provide a fun, child-friendly learning site for ICSE Class 1 practice.
- Work well in a Samsung TV browser with remote-first keyboard navigation.
- Host cleanly on Vercel as a Next.js app.
- Include starter questions for English, Hindi, Marathi, Maths, and EVS.
- Show Hindi and Marathi in Devanagari with a small transliteration helper.
- Save stars and completed subjects locally on the device.
- Keep the first version simple while leaving room for parent/admin features later.

## Non-Goals

- No parent login or account system in version 1.
- No backend database in version 1.
- No editable question admin screen in version 1.
- No video lessons in version 1.
- No Samsung Tizen native app packaging in version 1.

## Product Flow

1. The child opens the Vercel-hosted site in the Samsung TV browser.
2. The home screen shows a colorful Adventure Map with five subject islands:
   - English
   - Hindi
   - Marathi
   - Maths
   - EVS
3. Arrow keys move focus between islands.
4. OK/Enter opens the selected subject.
5. The subject opens a short quiz round with five starter questions.
6. The child chooses answers with arrow keys and OK/Enter.
7. The app gives immediate friendly feedback after each answer.
8. Correct answers award stars.
9. At the end of the round, the subject is marked complete.
10. Back/Escape returns from the quiz to the Adventure Map.

## Architecture

Use Next.js with the App Router. Version 1 should be mostly client-side because all content is bundled starter content and all progress is stored locally.

Suggested structure:

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  AdventureMap.tsx
  SubjectIsland.tsx
  QuizGame.tsx
  ProgressBadge.tsx
hooks/
  useRemoteNavigation.ts
lib/
  progress.ts
data/
  subjects.ts
types/
  learning.ts
```

`app/page.tsx` owns the top-level screen state: map view, selected subject, and active quiz. It passes subject data and progress into focused components.

## Data Model

Subject data should be stored in a typed local module so it is easy to edit later.

```ts
type SubjectId = "english" | "hindi" | "marathi" | "maths" | "evs";

type QuizQuestion = {
  id: string;
  prompt: string;
  transliteration?: string;
  options: string[];
  optionTransliterations?: string[];
  answerIndex: number;
  encouragement: string;
};

type Subject = {
  id: SubjectId;
  title: string;
  subtitle: string;
  color: string;
  questions: QuizQuestion[];
};

type Progress = {
  starsBySubject: Record<SubjectId, number>;
  completedSubjects: SubjectId[];
  lastPlayedSubject?: SubjectId;
};
```

Hindi and Marathi prompts and options use Devanagari for the main text. Transliteration appears as a smaller helper line when available.

## Remote Navigation

The app must support keyboard events that map naturally to Samsung remote behavior:

- `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`: move focus.
- `Enter`: select the focused island, answer, or continue button.
- `Escape`, `Backspace`, and common browser back behavior: return from quiz to map when possible.

Focus targets must be large, visible, and predictable. The app should also support mouse and touch clicks for laptop/mobile testing.

## Visual Direction

Use the Adventure Map direction approved during brainstorming.

The look should be playful but calm:

- Subject islands as large colorful destinations.
- Strong focus ring for the currently selected item.
- Stars and badges as simple rewards.
- Large text and buttons suitable for TV viewing.
- Friendly feedback after answers.
- No tiny controls or mouse-only interactions.

The layout must work at widescreen TV sizes and remain usable on laptop/mobile.

## Starter Content

Version 1 includes five starter questions per subject.

Content themes:

- English: alphabet recognition, simple words, beginning sounds.
- Hindi: simple Devanagari vocabulary with transliteration helpers.
- Marathi: simple Devanagari vocabulary with transliteration helpers.
- Maths: counting, shapes, addition, subtraction.
- EVS: plants, animals, body, home, surroundings.

The starter content is not a complete ICSE curriculum. It is a playable foundation that can be expanded later.

## Progress Storage

Use `localStorage` for version 1 progress.

Store:

- Stars earned per subject.
- Completed subjects.
- Last played subject.

If `localStorage` is unavailable or contains invalid data, the app should fall back to empty progress without breaking the learning flow.

## Error Handling

- Missing subject data should return the child to the map.
- Invalid progress data should be ignored and replaced with default progress.
- Browser storage failures should not block quiz play.
- Unknown keyboard events should be ignored.

## Testing And Verification

Verify the first implementation with:

- Next.js production build succeeds.
- Keyboard navigation works across map and quiz.
- Enter selects islands and answers.
- Escape/Backspace returns from quiz to map.
- Local progress persists after refresh.
- Hindi and Marathi Devanagari and transliteration helpers render clearly.
- Layout is readable at TV-style widescreen sizes and smaller desktop/mobile widths.

## Deployment

The app should be compatible with Vercel's normal Next.js deployment flow.

Version 1 does not require environment variables, database configuration, or server setup.

## Future Extensions

Possible future work:

- Parent-editable question files or admin screen.
- Daily mixed-subject learning path.
- More questions and levels per subject.
- Parent login and cross-device progress.
- Audio pronunciation for Hindi, Marathi, and English.
- Samsung Tizen native packaging if browser use becomes limiting.
