"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubjectPage } from "@/components/SubjectPage";
import { useProgress } from "@/components/ProgressProvider";
import { isBackKey, isSelectKey, moveFocus } from "@/lib/remoteNavigation";
import { mapPath, topicPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";

const topicColumns = 2;

type SubjectTopicsPageProps = {
  subject: Subject;
};

export function SubjectTopicsPage({ subject }: SubjectTopicsPageProps) {
  const router = useRouter();
  const { progress } = useProgress();
  const [focusedTopicIndex, setFocusedTopicIndex] = useState(0);

  const returnToMap = useCallback(() => {
    router.push(mapPath());
  }, [router]);

  const openTopic = useCallback(
    (index: number) => {
      const topic = subject.topics[index];

      if (!topic) {
        return;
      }

      setFocusedTopicIndex(index);
      router.push(topicPath(subject.id, topic.id));
    },
    [router, subject],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const topicCount = subject.topics.length;

      if (key.startsWith("Arrow") || isSelectKey(key) || isBackKey(key)) {
        event.preventDefault();
      }

      if (isBackKey(key)) {
        returnToMap();
        return;
      }

      if (key.startsWith("Arrow")) {
        setFocusedTopicIndex((index) =>
          moveFocus(index, key, topicCount, topicColumns),
        );
        return;
      }

      if (isSelectKey(key)) {
        openTopic(focusedTopicIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedTopicIndex, openTopic, returnToMap, subject.topics.length]);

  return (
    <SubjectPage
      subject={subject}
      focusedIndex={focusedTopicIndex}
      progress={progress}
      onFocusTopic={setFocusedTopicIndex}
      onSelectTopic={openTopic}
      onBack={returnToMap}
    />
  );
}
