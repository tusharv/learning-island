"use client";

import { readingWordLessons } from "../data/readingWords";
import type { Subject } from "../types/learning";
import { WordLearnScreen } from "./WordLearnScreen";

type ReadingLearnPageProps = {
  subject: Subject;
  onBack: () => void;
};

export function ReadingLearnPage({ subject, onBack }: ReadingLearnPageProps) {
  return (
    <WordLearnScreen
      subject={subject}
      lessons={readingWordLessons}
      layout="reading"
      stripSize={7}
      titleId="reading-word-title"
      onBack={onBack}
    />
  );
}
