import sightWordLessonsData from "./sightWords.json" with { type: "json" };

export const SIGHT_WORDS_TOPIC_ID = "sight-words";

export type SightWordExample = {
  emoji: string;
  text: string;
};

export type SightWordLesson = {
  word: string;
  emoji: string;
  meaning: string;
  usage: string;
  examples: SightWordExample[];
};

export const sightWordLessons = sightWordLessonsData as SightWordLesson[];

export const SIGHT_WORDS = sightWordLessons.map((lesson) => lesson.word);

export const SIGHT_WORD_SENTENCES: Record<string, string> = Object.fromEntries(
  sightWordLessons.map((lesson) => {
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
