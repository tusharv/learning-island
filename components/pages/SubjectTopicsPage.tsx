"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SubjectPage } from "@/components/SubjectPage";
import { useProgress } from "@/components/ProgressProvider";
import { isBackKey, isSelectKey, moveFocus } from "@/lib/remoteNavigation";
import { useRemoteFocusRing } from "@/lib/useRemoteFocusRing";
import { mapPath, topicPath } from "@/lib/paths";
import type { Subject } from "@/types/learning";
import { useSound } from "@/components/SoundProvider";

const topicColumns = 2;

type SubjectTopicsPageProps = {
  subject: Subject;
};

export function SubjectTopicsPage({ subject }: SubjectTopicsPageProps) {
  const router = useRouter();
  const { progress } = useProgress();
  const { playSound } = useSound();
  const [focusedTopicIndex, setFocusedTopicIndex] = useState(0);
  const { active: showRemoteFocus, activate: activateRemoteFocus } =
    useRemoteFocusRing();

  const returnToMap = useCallback(() => {
    playSound("select");
    router.push(mapPath());
  }, [playSound, router]);

  const openTopic = useCallback(
    (index: number) => {
      const topic = subject.topics[index];

      if (!topic) {
        return;
      }

      setFocusedTopicIndex(index);
      playSound("select");
      router.push(topicPath(subject.id, topic.id));
    },
    [playSound, router, subject],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      const topicCount = subject.topics.length;

      if (key.startsWith("Arrow") || isSelectKey(key) || isBackKey(key)) {
        event.preventDefault();
      }

      if (key.startsWith("Arrow") || isSelectKey(key)) {
        activateRemoteFocus();
      }

      if (isBackKey(key)) {
        returnToMap();
        return;
      }

      if (key.startsWith("Arrow")) {
        const nextIndex = moveFocus(
          focusedTopicIndex,
          key,
          topicCount,
          topicColumns,
        );

        if (nextIndex !== focusedTopicIndex) {
          playSound("move");
        }

        setFocusedTopicIndex(nextIndex);
        return;
      }

      if (isSelectKey(key)) {
        openTopic(focusedTopicIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    focusedTopicIndex,
    openTopic,
    playSound,
    returnToMap,
    activateRemoteFocus,
    subject.topics.length,
  ]);

  useEffect(() => {
    if (!showRemoteFocus) {
      return;
    }

    const card = document.querySelector<HTMLElement>(
      `.topic-grid .topic-card[data-focused="true"]`,
    );

    card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedTopicIndex, showRemoteFocus]);

  return (
    <SubjectPage
      subject={subject}
      focusedIndex={focusedTopicIndex}
      showRemoteFocus={showRemoteFocus}
      progress={progress}
      onFocusTopic={setFocusedTopicIndex}
      onSelectTopic={openTopic}
      onBack={returnToMap}
    />
  );
}
