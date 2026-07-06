"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdventureMap } from "@/components/AdventureMap";
import { subjects } from "@/data/subjects";
import { isSelectKey, moveFocus } from "@/lib/remoteNavigation";
import { subjectPath } from "@/lib/paths";
import { useProgress } from "@/components/ProgressProvider";
import { useSound } from "@/components/SoundProvider";

const TABLET_MAP_QUERY = "(max-width: 900px)";
const MOBILE_MAP_QUERY = "(max-width: 640px)";

function useMapColumns(itemCount: number) {
  const [columns, setColumns] = useState(itemCount);

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_MAP_QUERY);
    const tabletQuery = window.matchMedia(TABLET_MAP_QUERY);

    const syncColumns = () => {
      if (mobileQuery.matches) {
        setColumns(1);
        return;
      }

      if (tabletQuery.matches) {
        setColumns(2);
        return;
      }

      setColumns(itemCount);
    };

    syncColumns();
    mobileQuery.addEventListener("change", syncColumns);
    tabletQuery.addEventListener("change", syncColumns);
    return () => {
      mobileQuery.removeEventListener("change", syncColumns);
      tabletQuery.removeEventListener("change", syncColumns);
    };
  }, [itemCount]);

  return columns;
}

export function AdventureMapPage() {
  const router = useRouter();
  const { progress } = useProgress();
  const { playSound } = useSound();
  const [focusedSubjectIndex, setFocusedSubjectIndex] = useState(0);
  const mapColumns = useMapColumns(subjects.length);

  const openSubject = useCallback(
    (index: number) => {
      const subject = subjects[index];

      if (!subject) {
        return;
      }

      setFocusedSubjectIndex(index);
      playSound("select");
      router.push(subjectPath(subject.id));
    },
    [playSound, router],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key.startsWith("Arrow") || isSelectKey(key)) {
        event.preventDefault();
      }

      if (key.startsWith("Arrow")) {
        let navKey = key;
        if (mapColumns === 1) {
          if (key === "ArrowLeft") {
            navKey = "ArrowUp";
          } else if (key === "ArrowRight") {
            navKey = "ArrowDown";
          }
        }

        const nextIndex = moveFocus(
          focusedSubjectIndex,
          navKey,
          subjects.length,
          mapColumns,
        );

        if (nextIndex !== focusedSubjectIndex) {
          playSound("move");
          setFocusedSubjectIndex(nextIndex);
        }

        return;
      }

      if (isSelectKey(key)) {
        openSubject(focusedSubjectIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedSubjectIndex, mapColumns, openSubject, playSound]);

  useEffect(() => {
    document
      .querySelector(".subject-island[data-focused='true']")
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedSubjectIndex]);

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
