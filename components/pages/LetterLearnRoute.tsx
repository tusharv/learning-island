"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LetterLearnPage } from "@/components/LetterLearnPage";
import { topicPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";
import { useSound } from "@/components/SoundProvider";

type LetterLearnRouteProps = {
  subject: Subject;
  topicId: string;
};

export function LetterLearnRoute({ subject, topicId }: LetterLearnRouteProps) {
  const router = useRouter();
  const { playSound } = useSound();

  const returnToHub = useCallback(() => {
    playSound("select");
    router.push(topicPath(subject.id, topicId));
  }, [playSound, router, subject.id, topicId]);

  return (
    <LetterLearnPage subject={subject} topicId={topicId} onBack={returnToHub} />
  );
}
