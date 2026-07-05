"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ReadingLearnPage } from "@/components/ReadingLearnPage";
import { READING_TOPIC_ID } from "@/data/readingWords";
import { topicPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";
import { useSound } from "@/components/SoundProvider";

type ReadingLearnRouteProps = {
  subject: Subject;
};

export function ReadingLearnRoute({ subject }: ReadingLearnRouteProps) {
  const router = useRouter();
  const { playSound } = useSound();

  const returnToReadingHub = useCallback(() => {
    playSound("select");
    router.push(topicPath(subject.id, READING_TOPIC_ID));
  }, [playSound, router, subject.id]);

  return (
    <ReadingLearnPage subject={subject} onBack={returnToReadingHub} />
  );
}
