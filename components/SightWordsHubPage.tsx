"use client";

import { useEffect } from "react";
import type { Subject } from "../types/learning";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import { hubTopicWordCount } from "@/lib/hubTopics";
import { isBackKey, isSelectKey } from "@/lib/remoteNavigation";
import { ActivityIcon } from "./ActivityIcon";
import { AppChrome } from "./AppChrome";
import { useSound } from "./SoundProvider";

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
    subtitle: "Study words one by one",
    action: "Open learn",
  },
  {
    id: "play",
    title: "Test",
    subtitle: "Check what you know",
    action: "Start test",
  },
] as const;

export function SightWordsHubPage({
  subject,
  focusedIndex,
  onFocusMode,
  onSelectLearn,
  onSelectPlay,
  onBack,
}: SightWordsHubPageProps) {
  const { playSound } = useSound();
  const topic = subject.topics.find((item) => item.id === "sight-words");
  const chrome = buildAppChromeContext({
    page: "hub",
    subject,
    topic,
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key.startsWith("Arrow") || isSelectKey(key) || isBackKey(key)) {
        event.preventDefault();
      }

      if (isBackKey(key)) {
        onBack();
        return;
      }

      if (key === "ArrowLeft" || key === "ArrowUp") {
        if (focusedIndex !== 0) {
          playSound("move");
        }
        onFocusMode(0);
        return;
      }

      if (key === "ArrowRight" || key === "ArrowDown") {
        if (focusedIndex !== 1) {
          playSound("move");
        }
        onFocusMode(1);
        return;
      }

      if (isSelectKey(key)) {
        if (focusedIndex === 0) {
          onSelectLearn();
        } else {
          onSelectPlay();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    focusedIndex,
    onBack,
    onFocusMode,
    onSelectLearn,
    onSelectPlay,
    playSound,
  ]);

  return (
    <main className="app-screen subject-screen sight-words-hub" data-color={subject.color}>
      <AppChrome
        crumbs={chrome.crumbs}
        back={chrome.back}
        onBack={onBack}
        heading={{
          icon: "sight-words",
          eyebrow: subject.title,
          subtitle: "Learn words or take a test.",
        }}
        status={
          <div className="subject-progress-chip">
            <span className="progress-label">Word list</span>
            <strong>{hubTopicWordCount("sight-words")} words</strong>
          </div>
        }
      />

      <div className="app-screen__body">
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
              <ActivityIcon
                icon={mode.id === "learn" ? "sight-words" : "words"}
                className="mode-icon"
              />
              <span className="sight-words-mode-title">{mode.title}</span>
              <span className="sight-words-mode-subtitle">{mode.subtitle}</span>
              <span className="sight-words-mode-action">{mode.action}</span>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
