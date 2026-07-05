"use client";

import { useEffect } from "react";
import type { Subject } from "../types/learning";
import { isBackKey, isSelectKey, moveFocus } from "../lib/remoteNavigation";

type SightWordsHubPageProps = {
  subject: Subject;
  focusedIndex: number;
  onFocusMode: (index: number) => void;
  onSelectLearn: () => void;
  onSelectPlay: () => void;
  onBack: () => void;
};

const modes = [
  {
    id: "learn",
    title: "Learn",
    subtitle: "Read meanings, usage tips, and example sentences for all 100 words.",
    action: "Study",
  },
  {
    id: "play",
    title: "Play",
    subtitle: "Take a quick test with 5 random sight word questions.",
    action: "Test",
  },
] as const;

const modeColumns = 2;

export function SightWordsHubPage({
  subject,
  focusedIndex,
  onFocusMode,
  onSelectLearn,
  onSelectPlay,
  onBack,
}: SightWordsHubPageProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isBackKey(event.key)) {
        event.preventDefault();
        onBack();
        return;
      }

      if (event.key.startsWith("Arrow")) {
        event.preventDefault();
        onFocusMode(moveFocus(focusedIndex, event.key, modes.length, modeColumns));
        return;
      }

      if (isSelectKey(event.key)) {
        event.preventDefault();
        if (focusedIndex === 0) {
          onSelectLearn();
        } else {
          onSelectPlay();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, onBack, onFocusMode, onSelectLearn, onSelectPlay]);

  return (
    <main className="subject-screen sight-words-hub" data-color={subject.color}>
      <button type="button" className="back-button" onClick={onBack}>
        Back to topics
      </button>

      <header className="subject-header">
        <div>
          <p className="eyebrow">{subject.title}</p>
          <h1>Sight Words</h1>
          <p className="map-subtitle">
            Choose Learn to study words, or Play to take a test.
          </p>
        </div>
        <div className="subject-progress-chip">
          <span className="progress-label">Word list</span>
          <strong>100 words</strong>
        </div>
      </header>

      <section
        className="sight-words-mode-grid"
        aria-label="Sight words activities"
        data-focused-index={focusedIndex}
      >
        {modes.map((mode, index) => (
          <button
            key={mode.id}
            type="button"
            className="sight-words-mode-card"
            data-color={subject.color}
            data-focused={focusedIndex === index}
            onClick={() => (index === 0 ? onSelectLearn() : onSelectPlay())}
            onFocus={() => onFocusMode(index)}
            aria-label={`${mode.title}, ${mode.subtitle}`}
          >
            <span className="sight-words-mode-title">{mode.title}</span>
            <span className="sight-words-mode-subtitle">{mode.subtitle}</span>
            <span className="sight-words-mode-action">{mode.action}</span>
          </button>
        ))}
      </section>
    </main>
  );
}
