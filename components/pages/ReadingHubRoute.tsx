"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ReadingHubPage } from "@/components/ReadingHubPage";
import { READING_TOPIC_ID } from "@/data/readingWords";
import { topicLearnPath, topicQuizPath, subjectPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";
import { useSound } from "@/components/SoundProvider";

type ReadingHubRouteProps = {
  subject: Subject;
};

export function ReadingHubRoute({ subject }: ReadingHubRouteProps) {
  const router = useRouter();
  const { playSound } = useSound();
  const [focusedReadingModeIndex, setFocusedReadingModeIndex] = useState(0);

  const returnToSubject = useCallback(() => {
    playSound("select");
    router.push(subjectPath(subject.id));
  }, [playSound, router, subject.id]);

  const openReadingLearn = useCallback(() => {
    playSound("select");
    router.push(topicLearnPath(subject.id, READING_TOPIC_ID));
  }, [playSound, router, subject.id]);

  const startReadingTest = useCallback(() => {
    playSound("select");
    router.push(topicQuizPath(subject.id, READING_TOPIC_ID));
  }, [playSound, router, subject.id]);

  return (
    <ReadingHubPage
      subject={subject}
      focusedIndex={focusedReadingModeIndex}
      onFocusMode={setFocusedReadingModeIndex}
      onSelectLearn={openReadingLearn}
      onSelectPlay={startReadingTest}
      onBack={returnToSubject}
    />
  );
}
