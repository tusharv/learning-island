"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import {
  applyWordBrowseFilters,
  countActiveFilters,
  cycleDifficulty,
  cycleLetter,
  cycleSort,
  DEFAULT_WORD_BROWSE_FILTERS,
  getAvailableLetters,
  getDifficultyLabel,
  getFilterControlCount,
  getStripWindow,
  indexWordLessons,
  loadWordBrowseFilters,
  resolveFilteredIndex,
  saveWordBrowseFilters,
  type WordBrowseFilters,
  type WordBrowseLayout,
} from "../lib/wordListBrowse";
import { cancelSpeech } from "../lib/textToSpeech";
import { isBackKey, isSelectKey, moveFocus } from "../lib/remoteNavigation";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import type { Subject, Topic } from "../types/learning";
import { AppChrome } from "./AppChrome";
import { SpeakButton } from "./SpeakButton";
import { useSound } from "./SoundProvider";
import { WordBrowseControls } from "./WordBrowseControls";

export type WordLearnLesson = {
  word: string;
  emoji: string;
  meaning: string;
  usage: string;
  examples: { emoji: string; text: string }[];
};

type WordLearnScreenProps = {
  subject: Subject;
  topic: Topic;
  lessons: WordLearnLesson[];
  layout: WordBrowseLayout;
  stripSize: number;
  titleId: string;
  onBack: () => void;
};

type RemoteZone = "filters" | "words" | "picker" | "nav";

const PICKER_COLUMNS = 8;
const NAV_CONTROL_COUNT = 4;

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

export function WordLearnScreen({
  subject,
  topic,
  lessons,
  layout,
  stripSize,
  titleId,
  onBack,
}: WordLearnScreenProps) {
  const { playSound } = useSound();
  const chrome = buildAppChromeContext({ page: "learn", subject, topic });
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);
  const [filters, setFilters] = useState<WordBrowseFilters>(
    DEFAULT_WORD_BROWSE_FILTERS,
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [filtersReady, setFiltersReady] = useState(false);
  const [remoteZone, setRemoteZone] = useState<RemoteZone>("words");
  const [filterFocusIndex, setFilterFocusIndex] = useState(0);
  const [pickerFocusIndex, setPickerFocusIndex] = useState(0);
  const [navFocusIndex, setNavFocusIndex] = useState(1);

  const indexedLessons = useMemo(
    () => indexWordLessons(lessons, layout),
    [lessons, layout],
  );

  const filteredLessons = useMemo(
    () => applyWordBrowseFilters(indexedLessons, filters),
    [filters, indexedLessons],
  );

  const filteredIndex = resolveFilteredIndex(filteredLessons, activeSheetIndex);
  const currentEntry = filteredLessons[filteredIndex];
  const lesson = currentEntry?.lesson;
  const meta = currentEntry?.meta;
  const availableLetters = useMemo(
    () => getAvailableLetters(indexedLessons),
    [indexedLessons],
  );
  const filterControlCount = getFilterControlCount(countActiveFilters(filters) > 0);

  const stripWords = useMemo(
    () => getStripWindow(filteredLessons, filteredIndex, stripSize),
    [filteredIndex, filteredLessons, stripSize],
  );

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      setFilters(loadWordBrowseFilters(layout, window.localStorage));
      setFiltersReady(true);
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [layout]);

  useEffect(() => {
    if (!filtersReady) {
      return;
    }

    saveWordBrowseFilters(layout, filters, window.localStorage);
  }, [filters, filtersReady, layout]);

  useEffect(() => {
    if (filteredLessons.length === 0) {
      return;
    }

    const stillVisible = filteredLessons.some(
      (entry) => entry.meta.sheetIndex === activeSheetIndex,
    );

    if (!stillVisible) {
      const activeTimer = window.setTimeout(() => {
        setActiveSheetIndex(filteredLessons[0].meta.sheetIndex);
      }, 0);

      return () => window.clearTimeout(activeTimer);
    }

    return undefined;
  }, [activeSheetIndex, filteredLessons]);

  useEffect(() => {
    if (!pickerOpen) {
      return;
    }

    const pickerTimer = window.setTimeout(() => {
      setPickerFocusIndex(filteredIndex);
      setRemoteZone("picker");
    }, 0);

    return () => window.clearTimeout(pickerTimer);
  }, [filteredIndex, pickerOpen]);

  const selectWord = useCallback(
    (sheetIndex: number) => {
      if (sheetIndex !== activeSheetIndex) {
        playSound("select");
      }

      setActiveSheetIndex(sheetIndex);
    },
    [activeSheetIndex, playSound],
  );

  const goToFilteredIndex = useCallback(
    (nextIndex: number) => {
      if (filteredLessons.length === 0) {
        return;
      }

      const clampedIndex = Math.min(
        Math.max(nextIndex, 0),
        filteredLessons.length - 1,
      );
      const nextSheetIndex = filteredLessons[clampedIndex].meta.sheetIndex;

      if (nextSheetIndex !== activeSheetIndex) {
        playSound("move");
      }

      setActiveSheetIndex(nextSheetIndex);
    },
    [activeSheetIndex, filteredLessons, playSound],
  );

  const goFirst = useCallback(() => {
    goToFilteredIndex(0);
  }, [goToFilteredIndex]);

  const goPrevious = useCallback(() => {
    goToFilteredIndex(filteredIndex - 1);
  }, [filteredIndex, goToFilteredIndex]);

  const goNext = useCallback(() => {
    goToFilteredIndex(filteredIndex + 1);
  }, [filteredIndex, goToFilteredIndex]);

  const goLast = useCallback(() => {
    goToFilteredIndex(filteredLessons.length - 1);
  }, [filteredLessons.length, goToFilteredIndex]);

  const runNavAction = useCallback(
    (index: number) => {
      if (index === 0) {
        goFirst();
        return;
      }

      if (index === 1) {
        goPrevious();
        return;
      }

      if (index === 2) {
        goNext();
        return;
      }

      goLast();
    },
    [goFirst, goLast, goNext, goPrevious],
  );

  const handleFiltersChange = useCallback((nextFilters: WordBrowseFilters) => {
    setFilters(nextFilters);
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_WORD_BROWSE_FILTERS });
    playSound("select");
  }, [playSound]);

  const activateFilterControl = useCallback(
    (index: number) => {
      if (index === 0) {
        handleFiltersChange({ ...filters, sort: cycleSort(filters.sort) });
        return;
      }

      if (index === 1) {
        handleFiltersChange({
          ...filters,
          difficulty: cycleDifficulty(filters.difficulty),
        });
        return;
      }

      if (index === 2) {
        handleFiltersChange({
          ...filters,
          letter: cycleLetter(filters.letter, availableLetters),
        });
        return;
      }

      if (index === 3) {
        setPickerOpen((open) => !open);
        playSound("select");
        return;
      }

      handleResetFilters();
    },
    [availableLetters, filters, handleFiltersChange, handleResetFilters, playSound],
  );

  useEffect(() => {
    cancelSpeech();

    return () => {
      cancelSpeech();
    };
  }, [activeSheetIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isBackKey(event.key)) {
        event.preventDefault();

        if (remoteZone === "picker") {
          setPickerOpen(false);
          setRemoteZone("filters");
          return;
        }

        if (remoteZone === "filters" || remoteZone === "nav") {
          setRemoteZone("words");
          return;
        }

        onBack();
        return;
      }

      if (remoteZone === "filters") {
        if (event.key.startsWith("Arrow")) {
          event.preventDefault();
          const nextIndex = moveFocus(
            filterFocusIndex,
            event.key,
            filterControlCount,
            filterControlCount,
          );

          if (nextIndex !== filterFocusIndex) {
            playSound("move");
          }

          setFilterFocusIndex(nextIndex);
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          setRemoteZone("words");
          return;
        }

        if (isSelectKey(event.key)) {
          event.preventDefault();
          activateFilterControl(filterFocusIndex);
          return;
        }
      }

      if (remoteZone === "picker") {
        if (event.key.startsWith("Arrow")) {
          event.preventDefault();
          const nextIndex = moveFocus(
            pickerFocusIndex,
            event.key,
            filteredLessons.length,
            PICKER_COLUMNS,
          );

          if (nextIndex !== pickerFocusIndex) {
            playSound("move");
          }

          setPickerFocusIndex(nextIndex);
          return;
        }

        if (isSelectKey(event.key)) {
          event.preventDefault();
          const entry = filteredLessons[pickerFocusIndex];
          if (entry) {
            selectWord(entry.meta.sheetIndex);
            setPickerOpen(false);
            setRemoteZone("words");
          }
        }

        return;
      }

      if (remoteZone === "nav") {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          const nextIndex = Math.max(0, navFocusIndex - 1);
          if (nextIndex !== navFocusIndex) {
            playSound("move");
          }
          setNavFocusIndex(nextIndex);
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          const nextIndex = Math.min(NAV_CONTROL_COUNT - 1, navFocusIndex + 1);
          if (nextIndex !== navFocusIndex) {
            playSound("move");
          }
          setNavFocusIndex(nextIndex);
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          setRemoteZone("filters");
          return;
        }

        if (isSelectKey(event.key)) {
          event.preventDefault();
          runNavAction(navFocusIndex);
        }

        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setRemoteZone("filters");
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setRemoteZone("nav");
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        goFirst();
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        goLast();
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
  }, [
    activateFilterControl,
    filterControlCount,
    filterFocusIndex,
    filteredLessons,
    goFirst,
    goLast,
    goNext,
    goPrevious,
    navFocusIndex,
    onBack,
    pickerFocusIndex,
    playSound,
    remoteZone,
    runNavAction,
    selectWord,
  ]);

  if (!lesson || !meta) {
    return (
      <main className="reading-learn-screen" data-color={subject.color}>
        <AppChrome
          crumbs={chrome.crumbs}
          back={chrome.back}
          onBack={onBack}
          status={<>No words match your filters</>}
        />
        <WordBrowseControls
          filters={filters}
          indexedLessons={indexedLessons}
          filteredLessons={filteredLessons}
          filteredCount={filteredLessons.length}
          totalCount={lessons.length}
          pickerOpen={pickerOpen}
          activeSheetIndex={activeSheetIndex}
          filterFocusIndex={filterFocusIndex}
          pickerFocusIndex={pickerFocusIndex}
          remoteZone={remoteZone}
          onFilterFocus={setFilterFocusIndex}
          onFiltersChange={handleFiltersChange}
          onTogglePicker={() => setPickerOpen((open) => !open)}
          onSelectWord={selectWord}
          onResetFilters={handleResetFilters}
        />
        <div className="reading-learn-body">
          <p className="word-browse-empty word-browse-empty-main">
            No words match these filters. Try resetting or choosing a wider search.
          </p>
        </div>
      </main>
    );
  }

  const progressPercent =
    filteredLessons.length > 0
      ? Math.round(((filteredIndex + 1) / filteredLessons.length) * 100)
      : 0;

  return (
    <main
      className="reading-learn-screen"
      data-color={subject.color}
      data-remote-zone={remoteZone}
    >
      <AppChrome
        crumbs={chrome.crumbs}
        back={chrome.back}
        onBack={onBack}
        status={
          <>
            Word <strong>{filteredIndex + 1}</strong> of {filteredLessons.length}
            <span className="reading-learn-progress-row">
              {" "}
              · {getDifficultyLabel(meta.difficulty)}
            </span>
          </>
        }
      />

      <WordBrowseControls
        filters={filters}
        indexedLessons={indexedLessons}
        filteredLessons={filteredLessons}
        filteredCount={filteredLessons.length}
        totalCount={lessons.length}
        pickerOpen={pickerOpen}
        activeSheetIndex={activeSheetIndex}
        filterFocusIndex={filterFocusIndex}
        onFilterFocus={(index) => {
          setFilterFocusIndex(index);
          setRemoteZone("filters");
        }}
        onFiltersChange={handleFiltersChange}
        onTogglePicker={() => {
          setPickerOpen((open) => !open);
          setRemoteZone("filters");
        }}
        onSelectWord={(sheetIndex) => {
          selectWord(sheetIndex);
          setPickerOpen(false);
          setRemoteZone("words");
        }}
        onResetFilters={handleResetFilters}
      />

      <div className="reading-learn-body">
        <section className="reading-learn-hero" aria-labelledby={titleId}>
          <span className="reading-learn-hero-emoji" aria-hidden="true">
            {lesson.emoji}
          </span>
          <div className="reading-learn-word-row">
            <h1 id={titleId} className="reading-learn-word">
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
          data-cols={stripSize}
          aria-label="Nearby words in your list"
        >
          {stripWords.map(({ entry }) => {
            const isActive = entry.meta.sheetIndex === activeSheetIndex;

            return (
              <button
                key={`${entry.lesson.word}-${entry.meta.sheetIndex}`}
                type="button"
                className="reading-learn-row-chip"
                data-active={isActive}
                onClick={() => selectWord(entry.meta.sheetIndex)}
              >
                <span className="reading-learn-row-chip-label">
                  <span aria-hidden="true">{entry.lesson.emoji}</span>
                  {entry.lesson.word}
                </span>
                <SpeakButton
                  text={entry.lesson.word}
                  label={`Listen to ${entry.lesson.word}`}
                  size="sm"
                />
              </button>
            );
          })}
        </div>

        <div
          className="reading-learn-nav"
          data-focused-index={navFocusIndex}
          data-remote-zone={remoteZone === "nav" ? "active" : undefined}
        >
          <button
            type="button"
            className="reading-learn-nav-button reading-learn-nav-button-edge"
            data-focused={remoteZone === "nav" && navFocusIndex === 0}
            onClick={goFirst}
            onFocus={() => {
              setRemoteZone("nav");
              setNavFocusIndex(0);
            }}
            disabled={filteredIndex === 0}
            aria-label="First word"
          >
            ⏮ First
          </button>
          <button
            type="button"
            className="reading-learn-nav-button"
            data-focused={remoteZone === "nav" && navFocusIndex === 1}
            onClick={goPrevious}
            onFocus={() => {
              setRemoteZone("nav");
              setNavFocusIndex(1);
            }}
            disabled={filteredIndex === 0}
            aria-label="Previous word"
          >
            ◀ Prev
          </button>
          <div
            className="reading-learn-dots"
            aria-hidden="true"
            style={
              {
                "--progress": `${progressPercent}%`,
              } as CSSProperties
            }
          />
          <button
            type="button"
            className="reading-learn-nav-button reading-learn-nav-button-next"
            data-focused={remoteZone === "nav" && navFocusIndex === 2}
            onClick={goNext}
            onFocus={() => {
              setRemoteZone("nav");
              setNavFocusIndex(2);
            }}
            disabled={filteredIndex >= filteredLessons.length - 1}
            aria-label="Next word"
          >
            Next ▶
          </button>
          <button
            type="button"
            className="reading-learn-nav-button reading-learn-nav-button-edge"
            data-focused={remoteZone === "nav" && navFocusIndex === 3}
            onClick={goLast}
            onFocus={() => {
              setRemoteZone("nav");
              setNavFocusIndex(3);
            }}
            disabled={filteredIndex >= filteredLessons.length - 1}
            aria-label="Last word"
          >
            Last ⏭
          </button>
        </div>
      </footer>
    </main>
  );
}
