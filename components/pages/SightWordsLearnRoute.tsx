"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { SightWordsLearnPage } from "@/components/SightWordsLearnPage";
import { topicPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";

type SightWordsLearnRouteProps = {
  subject: Subject;
};

export function SightWordsLearnRoute({ subject }: SightWordsLearnRouteProps) {
  const router = useRouter();

  const returnToSightWordsHub = useCallback(() => {
    router.push(topicPath(subject.id, "sight-words"));
  }, [router, subject.id]);

  return (
    <SightWordsLearnPage subject={subject} onBack={returnToSightWordsHub} />
  );
}
