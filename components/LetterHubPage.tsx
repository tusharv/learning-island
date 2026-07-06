"use client";

import { useEffect } from "react";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import { getLetterHubConfig, getLetterHubItemLabel } from "@/lib/letterHubTopics";
import { isBackKey, isSelectKey } from "@/lib/remoteNavigation";
import type { Subject } from "@/types/learning";
import { ActivityIcon } from "./ActivityIcon";
import { AppChrome } from "./AppChrome";
import { useSound } from "./SoundProvider";

type LetterHubPageProps = {
  subject: Subject;
  topicId: string;
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
    subtitle: "",
    action: "Open learn",
  },
  {
    id: "play",
    title: "Test",
    subtitle: "Check what you know",
    action: "Start test",
  },
] as const;

export function LetterHubPage({
  subject,
  topicId,
  focusedIndex,
  onFocusMode,
  onSelectLearn,
  onSelectPlay,
  onBack,
}: LetterHubPageProps) {
  const { playSound } = useSound();
  const topic = subject.topics.find((item) => item.id === topicId);
  const config = getLetterHubConfig(subject.id, topicId);

  if (!config) {
    return null;
  }

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
        heading={{ subtitle: config.headingSubtitle }}
        status={
          <div className="subject-progress-chip">
            <span className="progress-label">{config.statusLabel}</span>
            <strong>{getLetterHubItemLabel(subject.id, topicId)}</strong>
          </div>
        }
      />

      <div className="app-screen__body">
        <section
          className="sight-words-mode-grid"
          aria-label={config.ariaLabel}
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
              aria-label={`${mode.title}, ${
                index === 0 ? config.learnSubtitle : mode.subtitle
              }`}
            >
              <ActivityIcon
                icon={index === 0 ? config.learnIcon : "words"}
                className="mode-icon"
              />
              <span className="sight-words-mode-title">{mode.title}</span>
              <span className="sight-words-mode-subtitle">
                {index === 0 ? config.learnSubtitle : mode.subtitle}
              </span>
              <span className="sight-words-mode-action">{mode.action}</span>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
}
