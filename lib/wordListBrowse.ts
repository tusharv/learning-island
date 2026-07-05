export type WordDifficulty = "easy" | "medium" | "tricky";

export type WordSortMode = "sheet" | "a-z" | "z-a" | "short" | "long";

export type WordBrowseLayout = "reading" | "sight-words";

export type WordBrowseFilters = {
  sort: WordSortMode;
  difficulty: WordDifficulty | "all";
  letter: string | "all";
};

export type WordLessonMeta = {
  sheetIndex: number;
  difficulty: WordDifficulty;
  firstLetter: string;
  length: number;
};

export type IndexedWord<T> = {
  lesson: T;
  meta: WordLessonMeta;
};

export const DEFAULT_WORD_BROWSE_FILTERS: WordBrowseFilters = {
  sort: "sheet",
  difficulty: "all",
  letter: "all",
};

export const WORD_SORT_OPTIONS: {
  value: WordSortMode;
  label: string;
  shortLabel: string;
}[] = [
  { value: "sheet", label: "Sheet order", shortLabel: "Sheet" },
  { value: "a-z", label: "A to Z", shortLabel: "A–Z" },
  { value: "z-a", label: "Z to A", shortLabel: "Z–A" },
  { value: "short", label: "Short words first", shortLabel: "Short" },
  { value: "long", label: "Long words first", shortLabel: "Long" },
];

export const WORD_DIFFICULTY_OPTIONS: {
  value: WordBrowseFilters["difficulty"];
  label: string;
  shortLabel: string;
}[] = [
  { value: "all", label: "All levels", shortLabel: "All" },
  { value: "easy", label: "Easy words", shortLabel: "Easy" },
  { value: "medium", label: "Medium words", shortLabel: "Medium" },
  { value: "tricky", label: "Tricky words", shortLabel: "Tricky" },
];

export function getWordDifficulty(word: string): WordDifficulty {
  const length = word.length;

  if (length <= 4) {
    return "easy";
  }

  if (length === 5) {
    return "medium";
  }

  return "tricky";
}

export function getFirstLetter(word: string): string {
  const match = word.match(/[a-z]/i);
  return match ? match[0].toLowerCase() : "a";
}

export function buildReadingWordMeta(sheetIndex: number): WordLessonMeta {
  return {
    sheetIndex,
    difficulty: "easy",
    firstLetter: "a",
    length: 0,
  };
}

export function buildSightWordMeta(sheetIndex: number): WordLessonMeta {
  return {
    sheetIndex,
    difficulty: "easy",
    firstLetter: "a",
    length: 0,
  };
}

export function indexWordLessons<T extends { word: string }>(
  lessons: T[],
  layout: WordBrowseLayout,
): IndexedWord<T>[] {
  return lessons.map((lesson, sheetIndex) => {
    const baseMeta =
      layout === "reading"
        ? buildReadingWordMeta(sheetIndex)
        : buildSightWordMeta(sheetIndex);

    return {
      lesson,
      meta: {
        ...baseMeta,
        difficulty: getWordDifficulty(lesson.word),
        firstLetter: getFirstLetter(lesson.word),
        length: lesson.word.length,
      },
    };
  });
}

function matchesDifficulty(
  meta: WordLessonMeta,
  difficulty: WordBrowseFilters["difficulty"],
): boolean {
  return difficulty === "all" || meta.difficulty === difficulty;
}

function matchesLetter(
  meta: WordLessonMeta,
  letter: WordBrowseFilters["letter"],
): boolean {
  return letter === "all" || meta.firstLetter === letter.toLowerCase();
}

function compareWords<T extends { word: string }>(
  a: IndexedWord<T>,
  b: IndexedWord<T>,
): number {
  return a.lesson.word.localeCompare(b.lesson.word, undefined, {
    sensitivity: "base",
  });
}

function sortIndexedWords<T extends { word: string }>(
  items: IndexedWord<T>[],
  sort: WordSortMode,
): IndexedWord<T>[] {
  const next = [...items];

  switch (sort) {
    case "sheet":
      next.sort((a, b) => a.meta.sheetIndex - b.meta.sheetIndex);
      break;
    case "a-z":
      next.sort(compareWords);
      break;
    case "z-a":
      next.sort((a, b) => compareWords(b, a));
      break;
    case "short":
      next.sort((a, b) => {
        const lengthDiff = a.meta.length - b.meta.length;
        return lengthDiff !== 0 ? lengthDiff : compareWords(a, b);
      });
      break;
    case "long":
      next.sort((a, b) => {
        const lengthDiff = b.meta.length - a.meta.length;
        return lengthDiff !== 0 ? lengthDiff : compareWords(a, b);
      });
      break;
  }

  return next;
}

export function applyWordBrowseFilters<T extends { word: string }>(
  indexedLessons: IndexedWord<T>[],
  filters: WordBrowseFilters,
): IndexedWord<T>[] {
  const filtered = indexedLessons.filter(
    ({ meta }) =>
      matchesDifficulty(meta, filters.difficulty) &&
      matchesLetter(meta, filters.letter),
  );

  return sortIndexedWords(filtered, filters.sort);
}

export function getAvailableLetters<T>(
  indexedLessons: IndexedWord<T>[],
): string[] {
  const letters = new Set<string>();

  for (const { meta } of indexedLessons) {
    letters.add(meta.firstLetter);
  }

  return [...letters].sort();
}

export function resolveFilteredIndex<T>(
  filteredLessons: IndexedWord<T>[],
  sheetIndex: number,
): number {
  const match = filteredLessons.findIndex(
    (entry) => entry.meta.sheetIndex === sheetIndex,
  );

  return match >= 0 ? match : 0;
}

export function getStripWindow<T>(
  filteredLessons: IndexedWord<T>[],
  filteredIndex: number,
  size: number,
): { entry: IndexedWord<T>; filteredIndex: number }[] {
  if (filteredLessons.length === 0) {
    return [];
  }

  const clampedIndex = Math.min(
    Math.max(filteredIndex, 0),
    filteredLessons.length - 1,
  );
  const half = Math.floor(size / 2);
  let start = Math.max(0, clampedIndex - half);
  let end = Math.min(filteredLessons.length, start + size);

  if (end - start < size) {
    start = Math.max(0, end - size);
  }

  return filteredLessons.slice(start, end).map((entry, offset) => ({
    entry,
    filteredIndex: start + offset,
  }));
}

export function getBrowseStorageKey(layout: WordBrowseLayout): string {
  return `icse-word-browse-${layout}`;
}

export function loadWordBrowseFilters(
  layout: WordBrowseLayout,
  storage: Storage | undefined,
): WordBrowseFilters {
  if (!storage) {
    return { ...DEFAULT_WORD_BROWSE_FILTERS };
  }

  try {
    const stored = storage.getItem(getBrowseStorageKey(layout));
    if (!stored) {
      return { ...DEFAULT_WORD_BROWSE_FILTERS };
    }

    const parsed = JSON.parse(stored) as Partial<
      WordBrowseFilters & { group?: unknown }
    >;

    return {
      sort: parsed.sort ?? DEFAULT_WORD_BROWSE_FILTERS.sort,
      difficulty: parsed.difficulty ?? DEFAULT_WORD_BROWSE_FILTERS.difficulty,
      letter: parsed.letter ?? DEFAULT_WORD_BROWSE_FILTERS.letter,
    };
  } catch {
    return { ...DEFAULT_WORD_BROWSE_FILTERS };
  }
}

export function saveWordBrowseFilters(
  layout: WordBrowseLayout,
  filters: WordBrowseFilters,
  storage: Storage | undefined,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(getBrowseStorageKey(layout), JSON.stringify(filters));
  } catch {
    // Ignore storage failures on classroom TVs.
  }
}

export function getDifficultyLabel(difficulty: WordDifficulty): string {
  if (difficulty === "easy") {
    return "Easy";
  }

  if (difficulty === "medium") {
    return "Medium";
  }

  return "Tricky";
}

export function getSortLabel(sort: WordSortMode): string {
  return WORD_SORT_OPTIONS.find((option) => option.value === sort)?.label ?? sort;
}

export function getDifficultyFilterLabel(
  difficulty: WordBrowseFilters["difficulty"],
): string {
  return (
    WORD_DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.label ??
    difficulty
  );
}

export function getLetterFilterLabel(letter: WordBrowseFilters["letter"]): string {
  return letter === "all" ? "Any letter" : `Letter ${letter.toUpperCase()}`;
}

export function countActiveFilters(filters: WordBrowseFilters): number {
  let count = 0;

  if (filters.sort !== "sheet") {
    count += 1;
  }

  if (filters.difficulty !== "all") {
    count += 1;
  }

  if (filters.letter !== "all") {
    count += 1;
  }

  return count;
}

export function cycleSort(current: WordSortMode): WordSortMode {
  const index = WORD_SORT_OPTIONS.findIndex((option) => option.value === current);
  const nextIndex = index >= 0 ? (index + 1) % WORD_SORT_OPTIONS.length : 0;
  return WORD_SORT_OPTIONS[nextIndex].value;
}

export function cycleDifficulty(
  current: WordBrowseFilters["difficulty"],
): WordBrowseFilters["difficulty"] {
  const index = WORD_DIFFICULTY_OPTIONS.findIndex(
    (option) => option.value === current,
  );
  const nextIndex = index >= 0 ? (index + 1) % WORD_DIFFICULTY_OPTIONS.length : 0;
  return WORD_DIFFICULTY_OPTIONS[nextIndex].value;
}

export function cycleLetter(
  current: WordBrowseFilters["letter"],
  availableLetters: string[],
): WordBrowseFilters["letter"] {
  const options: WordBrowseFilters["letter"][] = ["all", ...availableLetters];

  const index = options.findIndex(
    (option) => option.toLowerCase() === current.toLowerCase(),
  );
  const nextIndex = index >= 0 ? (index + 1) % options.length : 0;
  return options[nextIndex];
}

export function getFilterControlCount(hasActiveFilters: boolean): number {
  return hasActiveFilters ? 5 : 4;
}
