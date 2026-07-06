"use client";

import { getLetterHubLessons } from "@/lib/letterHubTopics";
import type { Subject } from "@/types/learning";
import { LetterLearnScreen } from "./LetterLearnScreen";

type LetterLearnPageProps = {
  subject: Subject;
  topicId: string;
  onBack: () => void;
};

export function LetterLearnPage({
  subject,
  topicId,
  onBack,
}: LetterLearnPageProps) {
  const topic = subject.topics.find((item) => item.id === topicId);
  const lessons = getLetterHubLessons(subject.id, topicId);

  if (!topic || !lessons) {
    return null;
  }

  return (
    <LetterLearnScreen
      subject={subject}
      topic={topic}
      lessons={lessons}
      titleId={`${subject.id}-${topicId}-letter-title`}
      onBack={onBack}
    />
  );
}
