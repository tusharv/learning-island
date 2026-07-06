export type LetterLessonExample = {
  emoji: string;
  text: string;
  transliteration?: string;
};

export type LetterLesson = {
  word: string;
  transliteration?: string;
  emoji: string;
  usage: string;
  usageTransliteration?: string;
  examples: LetterLessonExample[];
};
