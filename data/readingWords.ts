import readingWordLessonsData from "./readingWords.json" with { type: "json" };

export const READING_TOPIC_ID = "reading";

export type ReadingWordExample = {
  emoji: string;
  text: string;
};

export type ReadingWordLesson = {
  word: string;
  emoji: string;
  meaning: string;
  usage: string;
  examples: ReadingWordExample[];
};

export const readingWordLessons = readingWordLessonsData as ReadingWordLesson[];

export const READING_WORDS = readingWordLessons.map((lesson) => lesson.word);

export const READING_WORD_SENTENCES: Record<string, string> = Object.fromEntries(
  readingWordLessons.map((lesson) => {
    const primary = lesson.examples[0]?.text ?? lesson.word;
    return [
      lesson.word,
      primary.replace(new RegExp(`\\b${escapeRegExp(lesson.word)}\\b`, "i"), "___"),
    ];
  }),
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
