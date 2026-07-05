"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdventureMap } from "@/components/AdventureMap";
import { subjects } from "@/data/subjects";
import { isSelectKey, moveFocus } from "@/lib/remoteNavigation";
import { subjectPath } from "@/lib/paths";
import { useProgress } from "@/components/ProgressProvider";

export function AdventureMapPage() {
  const router = useRouter();
  const { progress } = useProgress();
  const [focusedSubjectIndex, setFocusedSubjectIndex] = useState(0);

  const openSubject = useCallback(
    (index: number) => {
      const subject = subjects[index];

      if (!subject) {
        return;
      }

      setFocusedSubjectIndex(index);
      router.push(subjectPath(subject.id));
    },
    [router],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key.startsWith("Arrow") || isSelectKey(key)) {
        event.preventDefault();
      }

      if (key.startsWith("Arrow")) {
        setFocusedSubjectIndex((index) =>
          moveFocus(index, key, subjects.length, subjects.length),
        );
        return;
      }

      if (isSelectKey(key)) {
        openSubject(focusedSubjectIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSubjectIndex, openSubject]);

  return (
    <AdventureMap
      subjects={subjects}
      focusedIndex={focusedSubjectIndex}
      progress={progress}
      onFocusSubject={setFocusedSubjectIndex}
      onSelectSubject={openSubject}
    />
  );
}
