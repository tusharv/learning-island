"use client";

import { readingWordLessons, READING_TOPIC_ID } from "../data/readingWords";
import type { Subject } from "../types/learning";
import { WordLearnScreen } from "./WordLearnScreen";

type ReadingLearnPageProps = {
  subject: Subject;
  onBack: () => void;
};

export function ReadingLearnPage({ subject, onBack }: ReadingLearnPageProps) {
  const topic = subject.topics.find((item) => item.id === READING_TOPIC_ID);

  if (!topic) {
    return null;
  }

  return (
    <WordLearnScreen
      subject={subject}
      topic={topic}
      lessons={readingWordLessons}
      layout="reading"
      stripSize={7}
      titleId="reading-word-title"
      onBack={onBack}
    />
  );
}
