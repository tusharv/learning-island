"use client";

import { sightWordLessons } from "../data/sightWords";
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
  return (
    <WordLearnScreen
      subject={subject}
      lessons={sightWordLessons}
      layout="sight-words"
      stripSize={10}
      titleId="sight-word-title"
      onBack={onBack}
    />
  );
}
