"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { sightWordLessons } from "../data/sightWords";
import type { Subject } from "../types/learning";
import { isBackKey } from "../lib/remoteNavigation";

type SightWordsLearnPageProps = {
  subject: Subject;
  onBack: () => void;
};

function highlightWord(sentence: string, word: string) {
  const pattern = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(\\b${pattern}\\b)`, "i");
  const parts = sentence.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="sight-word-highlight">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export function SightWordsLearnPage({
  subject,
  onBack,
}: SightWordsLearnPageProps) {
  const [wordIndex, setWordIndex] = useState(0);

  const lesson = sightWordLessons[wordIndex];
  const totalWords = sightWordLessons.length;

  const groupStart = Math.floor(wordIndex / 20) * 20;
  const visibleWords = useMemo(
    () => sightWordLessons.slice(groupStart, groupStart + 20),
    [groupStart],
  );

  const goPrevious = useCallback(() => {
    setWordIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setWordIndex((index) => Math.min(totalWords - 1, index + 1));
  }, [totalWords]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isBackKey(event.key)) {
        event.preventDefault();
        onBack();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious, onBack]);

  if (!lesson) {
    return null;
  }

  return (
    <main className="learn-screen" data-color={subject.color}>
      <button type="button" className="back-button" onClick={onBack}>
        Back to Sight Words
      </button>

      <header className="learn-header">
        <div>
          <p className="eyebrow">{subject.title} · Learn</p>
          <h1>Sight Words</h1>
          <p className="map-subtitle">
            Learn what each word means and how to use it in a sentence.
          </p>
        </div>
        <div className="learn-progress-chip">
          <span className="progress-label">Word</span>
          <strong>
            {wordIndex + 1} / {totalWords}
          </strong>
        </div>
      </header>

      <section className="sight-word-stage" aria-labelledby="sight-word-title">
        <p className="sight-word-label">Today&apos;s sight word</p>
        <h2 id="sight-word-title" className="sight-word-display">
          {lesson.word}
        </h2>

        <div className="learn-panels">
          <article className="learn-panel">
            <h3>What it means</h3>
            <p>{lesson.meaning}</p>
          </article>

          <article className="learn-panel">
            <h3>How to use it</h3>
            <p>{lesson.usage}</p>
          </article>

          <article className="learn-panel learn-panel-wide">
            <h3>Read it in a sentence</h3>
            <p className="sight-word-example">
              {highlightWord(lesson.example, lesson.word)}
            </p>
          </article>
        </div>
      </section>

      <section className="sight-word-picker" aria-label="Sight word list">
        <p className="sight-word-picker-label">
          Words {groupStart + 1}–{Math.min(groupStart + 20, totalWords)}
        </p>
        <div className="sight-word-chip-grid">
          {visibleWords.map((item, index) => {
            const absoluteIndex = groupStart + index;
            const isActive = absoluteIndex === wordIndex;

            return (
              <button
                key={item.word}
                type="button"
                className="sight-word-chip"
                data-active={isActive}
                onClick={() => {
                  setWordIndex(absoluteIndex);
                }}
              >
                {item.word}
              </button>
            );
          })}
        </div>
      </section>

      <div className="learn-actions">
        <button
          type="button"
          className="learn-nav-button"
          onClick={goPrevious}
          disabled={wordIndex === 0}
        >
          Previous
        </button>
        <button
          type="button"
          className="learn-nav-button"
          onClick={goNext}
          disabled={wordIndex === totalWords - 1}
        >
          Next
        </button>
      </div>
    </main>
  );
}
