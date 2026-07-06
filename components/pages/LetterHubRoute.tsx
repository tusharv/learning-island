"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { LetterHubPage } from "@/components/LetterHubPage";
import { topicLearnPath, topicQuizPath, subjectPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";
import { useSound } from "@/components/SoundProvider";

type LetterHubRouteProps = {
  subject: Subject;
  topicId: string;
};

export function LetterHubRoute({ subject, topicId }: LetterHubRouteProps) {
  const router = useRouter();
  const { playSound } = useSound();
  const [focusedModeIndex, setFocusedModeIndex] = useState(0);

  const returnToSubject = useCallback(() => {
    playSound("select");
    router.push(subjectPath(subject.id));
  }, [playSound, router, subject.id]);

  const openLearn = useCallback(() => {
    playSound("select");
    router.push(topicLearnPath(subject.id, topicId));
  }, [playSound, router, subject.id, topicId]);

  const startTest = useCallback(() => {
    playSound("select");
    router.push(topicQuizPath(subject.id, topicId));
  }, [playSound, router, subject.id, topicId]);

  return (
    <LetterHubPage
      subject={subject}
      topicId={topicId}
      focusedIndex={focusedModeIndex}
      onFocusMode={setFocusedModeIndex}
      onSelectLearn={openLearn}
      onSelectPlay={startTest}
      onBack={returnToSubject}
    />
  );
}
