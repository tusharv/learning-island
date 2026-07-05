"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { readingWordLessons } from "../data/readingWords";
import type { Subject } from "../types/learning";
import { cancelSpeech } from "../lib/textToSpeech";
import { isBackKey } from "../lib/remoteNavigation";
import { SoundToggle } from "./SoundToggle";
import { SpeakButton } from "./SpeakButton";
import { useSound } from "./SoundProvider";

type ReadingLearnPageProps = {
  subject: Subject;
  onBack: () => void;
};

const ROWS_PER_COLUMN = 22;
const COLUMNS = 7;

function highlightWord(sentence: string, word: string) {
  const pattern = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(\\b${pattern}\\b)`, "i");
  const parts = sentence.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === word.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="reading-learn-highlight">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export function ReadingLearnPage({ subject, onBack }: ReadingLearnPageProps) {
  const { playSound } = useSound();
  const [wordIndex, setWordIndex] = useState(0);

  const lesson = readingWordLessons[wordIndex];
  const totalWords = readingWordLessons.length;

  const rowWords = useMemo(() => {
    const row = wordIndex % ROWS_PER_COLUMN;

    return Array.from({ length: COLUMNS }, (_, column) => {
      const index = column * ROWS_PER_COLUMN + row;
      const item = readingWordLessons[index];
      return item ? { item, index } : null;
    }).filter(
      (
        entry,
      ): entry is { item: (typeof readingWordLessons)[number]; index: number } =>
        entry !== null,
    );
  }, [wordIndex]);

  const selectWord = useCallback(
    (index: number) => {
      if (index !== wordIndex) {
        playSound("select");
      }

      setWordIndex(index);
    },
    [playSound, wordIndex],
  );

  const goPrevious = useCallback(() => {
    const nextIndex = Math.max(0, wordIndex - 1);
    if (nextIndex !== wordIndex) {
      playSound("move");
    }
    setWordIndex(nextIndex);
  }, [playSound, wordIndex]);

  const goNext = useCallback(() => {
    const nextIndex = Math.min(totalWords - 1, wordIndex + 1);
    if (nextIndex !== wordIndex) {
      playSound("move");
    }
    setWordIndex(nextIndex);
  }, [playSound, totalWords, wordIndex]);

  useEffect(() => {
    cancelSpeech();

    return () => {
      cancelSpeech();
    };
  }, [wordIndex]);

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

  const rowNumber = (wordIndex % ROWS_PER_COLUMN) + 1;

  return (
    <main className="reading-learn-screen" data-color={subject.color}>
      <header className="reading-learn-top">
        <button type="button" className="reading-learn-back" onClick={onBack}>
          ← Back
        </button>
        <p className="reading-learn-progress">
          Word <strong>{wordIndex + 1}</strong> of {totalWords}
          <span className="reading-learn-progress-row"> · Row {rowNumber}</span>
        </p>
        <SoundToggle />
      </header>

      <div className="reading-learn-body">
        <section className="reading-learn-hero" aria-labelledby="reading-word-title">
          <span className="reading-learn-hero-emoji" aria-hidden="true">
            {lesson.emoji}
          </span>
          <div className="reading-learn-word-row">
            <h1 id="reading-word-title" className="reading-learn-word">
              {lesson.word}
            </h1>
            <SpeakButton
              text={lesson.word}
              label={`Listen to ${lesson.word}`}
              size="lg"
            />
          </div>
          <p className="reading-learn-meaning">{lesson.meaning}</p>
          <p className="reading-learn-usage">{lesson.usage}</p>
        </section>

        <section className="reading-learn-examples" aria-label="Example sentences">
          <h2 className="reading-learn-examples-label">Examples</h2>
          <div className="reading-learn-examples-grid">
            {lesson.examples.map((example, index) => (
              <article
                key={`${example.text}-${index}`}
                className="reading-learn-example-card"
              >
                <div className="reading-learn-example-top">
                  <span className="reading-learn-example-emoji" aria-hidden="true">
                    {example.emoji}
                  </span>
                  <SpeakButton
                    text={example.text}
                    label={`Listen to example ${index + 1}`}
                    size="sm"
                  />
                </div>
                <p className="reading-learn-example-text">
                  {highlightWord(example.text, lesson.word)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="reading-learn-footer">
        <div
          className="reading-learn-row-strip"
          aria-label={`Words in row ${rowNumber}`}
        >
          {rowWords.map(({ item, index }) => {
            const isActive = index === wordIndex;

            return (
              <button
                key={`${item.word}-${index}`}
                type="button"
                className="reading-learn-row-chip"
                data-active={isActive}
                onClick={() => selectWord(index)}
              >
                <span className="reading-learn-row-chip-label">
                  <span aria-hidden="true">{item.emoji}</span>
                  {item.word}
                </span>
                <SpeakButton
                  text={item.word}
                  label={`Listen to ${item.word}`}
                  size="sm"
                />
              </button>
            );
          })}
        </div>

        <div className="reading-learn-nav">
          <button
            type="button"
            className="reading-learn-nav-button"
            onClick={goPrevious}
            disabled={wordIndex === 0}
            aria-label="Previous word"
          >
            ◀ Prev
          </button>
          <div
            className="reading-learn-dots"
            aria-hidden="true"
            style={
              {
                "--progress": `${Math.round(((wordIndex + 1) / totalWords) * 100)}%`,
              } as CSSProperties
            }
          />
          <button
            type="button"
            className="reading-learn-nav-button reading-learn-nav-button-next"
            onClick={goNext}
            disabled={wordIndex === totalWords - 1}
            aria-label="Next word"
          >
            Next ▶
          </button>
        </div>
      </footer>
    </main>
  );
}
