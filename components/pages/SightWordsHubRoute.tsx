"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SightWordsHubPage } from "@/components/SightWordsHubPage";
import { topicLearnPath, topicQuizPath, subjectPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";

type SightWordsHubRouteProps = {
  subject: Subject;
};

export function SightWordsHubRoute({ subject }: SightWordsHubRouteProps) {
  const router = useRouter();
  const [focusedSightWordsModeIndex, setFocusedSightWordsModeIndex] =
    useState(0);

  const returnToSubject = useCallback(() => {
    router.push(subjectPath(subject.id));
  }, [router, subject.id]);

  const openSightWordsLearn = useCallback(() => {
    router.push(topicLearnPath(subject.id, "sight-words"));
  }, [router, subject.id]);

  const startTopicQuiz = useCallback(() => {
    router.push(topicQuizPath(subject.id, "sight-words"));
  }, [router, subject.id]);

  return (
    <SightWordsHubPage
      subject={subject}
      focusedIndex={focusedSightWordsModeIndex}
      onFocusMode={setFocusedSightWordsModeIndex}
      onSelectLearn={openSightWordsLearn}
      onSelectPlay={startTopicQuiz}
      onBack={returnToSubject}
    />
  );
}
