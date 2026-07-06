"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { LetterLesson } from "@/data/letterLessons";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import { cancelSpeech } from "@/lib/textToSpeech";
import { isBackKey } from "@/lib/remoteNavigation";
import type { Subject, Topic } from "@/types/learning";
import { AppChrome } from "./AppChrome";
import { SpeakButton } from "./SpeakButton";
import { useSound } from "./SoundProvider";

type LetterLearnScreenProps = {
  subject: Subject;
  topic: Topic;
  lessons: LetterLesson[];
  titleId: string;
  onBack: () => void;
};

function highlightLetter(sentence: string, letter: string): ReactNode {
  const pattern = letter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${pattern})`, "u");
  const parts = sentence.split(regex);

  return parts.map((part, index) =>
    part === letter ? (
      <mark key={`${part}-${index}`} className="reading-learn-highlight">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export function LetterLearnScreen({
  subject,
  topic,
  lessons,
  titleId,
  onBack,
}: LetterLearnScreenProps) {
  const { playSound } = useSound();
  const chrome = buildAppChromeContext({ page: "learn", subject, topic });
  const [activeIndex, setActiveIndex] = useState(0);

  const lesson = lessons[activeIndex];
  const progressPercent =
    lessons.length > 0
      ? Math.round(((activeIndex + 1) / lessons.length) * 100)
      : 0;

  const stripLetters = useMemo(() => {
    const size = 13;
    const half = Math.floor(size / 2);
    let start = Math.max(0, activeIndex - half);
    const end = Math.min(lessons.length, start + size);
    start = Math.max(0, end - size);

    return lessons.slice(start, end).map((entry, offset) => ({
      entry,
      index: start + offset,
    }));
  }, [activeIndex, lessons]);

  const goToIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.min(Math.max(nextIndex, 0), lessons.length - 1);

      if (clamped !== activeIndex) {
        playSound("move");
      }

      setActiveIndex(clamped);
    },
    [activeIndex, lessons.length, playSound],
  );

  useEffect(() => {
    cancelSpeech();

    return () => {
      cancelSpeech();
    };
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key.startsWith("Arrow") || isBackKey(key)) {
        event.preventDefault();
      }

      if (isBackKey(key)) {
        onBack();
        return;
      }

      if (key === "ArrowLeft" || key === "ArrowUp") {
        goToIndex(activeIndex - 1);
        return;
      }

      if (key === "ArrowRight" || key === "ArrowDown") {
        goToIndex(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goToIndex, onBack]);

  useEffect(() => {
    document
      .querySelector(".alphabet-learn-strip-wrap .reading-learn-row-chip[data-active='true']")
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeIndex]);

  if (!lesson) {
    return null;
  }

  const showHeroEmoji = Boolean(lesson.emoji);
  const speechLang =
    subject.id === "marathi" ? "mr-IN" : subject.id === "hindi" ? "hi-IN" : "en-IN";

  return (
    <main className="reading-learn-screen alphabet-learn-screen" data-color={subject.color}>
      <AppChrome
        crumbs={chrome.crumbs}
        back={chrome.back}
        onBack={onBack}
        status={
          <>
            Letter <strong>{activeIndex + 1}</strong> of {lessons.length}
          </>
        }
      />

      <div className="reading-learn-body">
        <section className="reading-learn-hero" aria-labelledby={titleId}>
          {showHeroEmoji ? (
            <span className="reading-learn-hero-emoji" aria-hidden="true">
              {lesson.emoji}
            </span>
          ) : null}
          <div className="reading-learn-word-row">
            <h1 id={titleId} className="reading-learn-word">
              {lesson.word}
            </h1>
            <SpeakButton
              text={lesson.word}
              fallbackText={lesson.transliteration}
              lang={speechLang}
              label={`Listen to letter ${lesson.word}`}
              size="lg"
            />
          </div>
          {lesson.transliteration ? (
            <p className="reading-learn-transliteration">{lesson.transliteration}</p>
          ) : null}
          <p className="reading-learn-usage">{lesson.usage}</p>
          {lesson.usageTransliteration ? (
            <p className="reading-learn-transliteration">{lesson.usageTransliteration}</p>
          ) : null}
        </section>

        <section className="reading-learn-examples" aria-label="Letter examples">
          <h2 className="reading-learn-examples-label">Examples</h2>
          <div className="reading-learn-examples-grid">
            {lesson.examples.map((example, index) => (
              <article
                key={`${example.text}-${index}`}
                className="reading-learn-example-card"
              >
                <div className="reading-learn-example-top">
                  {example.emoji ? (
                    <span className="reading-learn-example-emoji" aria-hidden="true">
                      {example.emoji}
                    </span>
                  ) : null}
                  <SpeakButton
                    text={example.text}
                    fallbackText={example.transliteration}
                    lang={speechLang}
                    label={`Listen to example ${index + 1}`}
                    size="sm"
                  />
                </div>
                <p className="reading-learn-example-text">
                  {highlightLetter(example.text, lesson.word)}
                </p>
                {example.transliteration ? (
                  <p className="reading-learn-transliteration">{example.transliteration}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="reading-learn-footer">
        <div className="alphabet-learn-strip-wrap">
          <div className="alphabet-learn-strip" aria-label="Alphabet letters">
            {stripLetters.map(({ entry, index }) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={entry.word}
                  type="button"
                  className="reading-learn-row-chip"
                  data-active={isActive}
                  onClick={() => goToIndex(index)}
                >
                  <span className="reading-learn-row-chip-label">
                    {entry.emoji ? (
                      <span aria-hidden="true">{entry.emoji}</span>
                    ) : null}
                    {entry.word}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="reading-learn-nav" data-focused-index={1}>
          <button
            type="button"
            className="reading-learn-nav-button reading-learn-nav-button-edge"
            onClick={() => goToIndex(0)}
            disabled={activeIndex === 0}
            aria-label="First letter"
          >
            ⏮ First
          </button>
          <button
            type="button"
            className="reading-learn-nav-button"
            onClick={() => goToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous letter"
          >
            ◀ Prev
          </button>
          <div
            className="reading-learn-dots"
            aria-hidden="true"
            style={{ "--progress": `${progressPercent}%` } as CSSProperties}
          />
          <button
            type="button"
            className="reading-learn-nav-button reading-learn-nav-button-next"
            onClick={() => goToIndex(activeIndex + 1)}
            disabled={activeIndex >= lessons.length - 1}
            aria-label="Next letter"
          >
            Next ▶
          </button>
          <button
            type="button"
            className="reading-learn-nav-button reading-learn-nav-button-edge"
            onClick={() => goToIndex(lessons.length - 1)}
            disabled={activeIndex >= lessons.length - 1}
            aria-label="Last letter"
          >
            Last ⏭
          </button>
        </div>
      </footer>
    </main>
  );
}
