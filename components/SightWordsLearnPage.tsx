"use client";

import { sightWordLessons, SIGHT_WORDS_TOPIC_ID } from "../data/sightWords";
import type { Subject } from "../types/learning";
import { WordLearnScreen } from "./WordLearnScreen";

type SightWordsLearnPageProps = {
  subject: Subject;
  onBack: () => void;
};

export function SightWordsLearnPage({
  subject,
  onBack,
}: SightWordsLearnPageProps) {
  const topic = subject.topics.find((item) => item.id === SIGHT_WORDS_TOPIC_ID);

  if (!topic) {
    return null;
  }

  return (
    <WordLearnScreen
      subject={subject}
      topic={topic}
      lessons={sightWordLessons}
      layout="sight-words"
      stripSize={10}
      titleId="sight-word-title"
      onBack={onBack}
    />
  );
}
