"use client";

import {
  countActiveFilters,
  cycleDifficulty,
  cycleLetter,
  cycleSort,
  getAvailableLetters,
  getDifficultyFilterLabel,
  getLetterFilterLabel,
  getSortLabel,
  WORD_DIFFICULTY_OPTIONS,
  WORD_SORT_OPTIONS,
  type IndexedWord,
  type WordBrowseFilters,
} from "../lib/wordListBrowse";

type WordBrowseControlsProps<T extends { word: string; emoji: string }> = {
  filters: WordBrowseFilters;
  indexedLessons: IndexedWord<T>[];
  filteredLessons: IndexedWord<T>[];
  filteredCount: number;
  totalCount: number;
  pickerOpen: boolean;
  activeSheetIndex: number;
  filterFocusIndex: number;
  pickerFocusIndex?: number;
  remoteZone?: "filters" | "words" | "picker" | "nav";
  onFilterFocus: (index: number) => void;
  onFiltersChange: (filters: WordBrowseFilters) => void;
  onTogglePicker: () => void;
  onSelectWord: (sheetIndex: number) => void;
  onResetFilters: () => void;
};

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="word-filter-icon">
      <path d="M4 6h12M4 12h8M4 18h4" />
      <path d="M18 8l3 3-3 3M21 11h-6" />
    </svg>
  );
}

function LevelIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="word-filter-icon">
      <rect x="4" y="14" width="4" height="6" rx="1" />
      <rect x="10" y="10" width="4" height="10" rx="1" />
      <rect x="16" y="6" width="4" height="14" rx="1" />
    </svg>
  );
}

function LetterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="word-filter-icon">
      <path d="M7 18V6l5 8 5-8v12" />
    </svg>
  );
}

function PickIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="word-filter-icon">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="word-filter-icon">
      <path d="M6 7h12a4 4 0 0 1 0 8H9" />
      <path d="M9 4 6 7l3 3" />
    </svg>
  );
}

export function WordBrowseControls<T extends { word: string; emoji: string }>({
  filters,
  indexedLessons,
  filteredLessons,
  filteredCount,
  totalCount,
  pickerOpen,
  activeSheetIndex,
  filterFocusIndex,
  pickerFocusIndex = 0,
  remoteZone = "words",
  onFilterFocus,
  onFiltersChange,
  onTogglePicker,
  onSelectWord,
  onResetFilters,
}: WordBrowseControlsProps<T>) {
  const letters = getAvailableLetters(indexedLessons);
  const activeFilterCount = countActiveFilters(filters);
  const sortLabel =
    WORD_SORT_OPTIONS.find((option) => option.value === filters.sort)?.shortLabel ??
    getSortLabel(filters.sort);
  const levelLabel =
    WORD_DIFFICULTY_OPTIONS.find((option) => option.value === filters.difficulty)
      ?.shortLabel ?? getDifficultyFilterLabel(filters.difficulty);
  const letterLabel =
    filters.letter === "all" ? "Any" : filters.letter.toUpperCase();

  const cycleSortFilter = () => {
    onFiltersChange({ ...filters, sort: cycleSort(filters.sort) });
  };

  const cycleLevelFilter = () => {
    onFiltersChange({ ...filters, difficulty: cycleDifficulty(filters.difficulty) });
  };

  const cycleLetterFilter = () => {
    onFiltersChange({
      ...filters,
      letter: cycleLetter(filters.letter, letters),
    });
  };

  return (
    <section
      className="word-browse-panel"
      aria-label="Sort and filter words"
      data-focused-index={filterFocusIndex}
      data-remote-zone={remoteZone === "filters" ? "active" : undefined}
    >
      <div className="word-browse-toolbar" role="toolbar" aria-label="Word filters">
        <button
          type="button"
          className="word-filter-card"
          data-kind="sort"
          data-focused={remoteZone === "filters" && filterFocusIndex === 0}
          onClick={() => {
            onFilterFocus(0);
            cycleSortFilter();
          }}
          onFocus={() => onFilterFocus(0)}
          aria-label={`Sort, ${getSortLabel(filters.sort)}. Press to change.`}
        >
          <span className="word-filter-card-icon" aria-hidden="true">
            <SortIcon />
          </span>
          <span className="word-filter-card-copy">
            <span className="word-filter-card-label">Sort</span>
            <strong className="word-filter-card-value">{sortLabel}</strong>
          </span>
        </button>

        <button
          type="button"
          className="word-filter-card"
          data-kind="level"
          data-focused={remoteZone === "filters" && filterFocusIndex === 1}
          onClick={() => {
            onFilterFocus(1);
            cycleLevelFilter();
          }}
          onFocus={() => onFilterFocus(1)}
          aria-label={`Level, ${getDifficultyFilterLabel(filters.difficulty)}. Press to change.`}
        >
          <span className="word-filter-card-icon" aria-hidden="true">
            <LevelIcon />
          </span>
          <span className="word-filter-card-copy">
            <span className="word-filter-card-label">Level</span>
            <strong className="word-filter-card-value">{levelLabel}</strong>
          </span>
        </button>

        <button
          type="button"
          className="word-filter-card"
          data-kind="letter"
          data-focused={remoteZone === "filters" && filterFocusIndex === 2}
          onClick={() => {
            onFilterFocus(2);
            cycleLetterFilter();
          }}
          onFocus={() => onFilterFocus(2)}
          aria-label={`Starts with, ${getLetterFilterLabel(filters.letter)}. Press to change.`}
        >
          <span className="word-filter-card-icon" aria-hidden="true">
            <LetterIcon />
          </span>
          <span className="word-filter-card-copy">
            <span className="word-filter-card-label">Starts with</span>
            <strong className="word-filter-card-value">{letterLabel}</strong>
          </span>
        </button>

        <button
          type="button"
          className="word-filter-card word-filter-card-action"
          data-kind="pick"
          data-focused={remoteZone === "filters" && filterFocusIndex === 3}
          onClick={() => {
            onFilterFocus(3);
            onTogglePicker();
          }}
          onFocus={() => onFilterFocus(3)}
          aria-expanded={pickerOpen}
          aria-label={pickerOpen ? "Hide word list" : "Pick a word from the list"}
        >
          <span className="word-filter-card-icon" aria-hidden="true">
            <PickIcon />
          </span>
          <span className="word-filter-card-copy">
            <span className="word-filter-card-label">Words</span>
            <strong className="word-filter-card-value">
              {pickerOpen ? "Hide" : "Pick"}
            </strong>
          </span>
        </button>

        {activeFilterCount > 0 ? (
          <button
            type="button"
            className="word-filter-card word-filter-card-reset"
            data-kind="reset"
            data-focused={remoteZone === "filters" && filterFocusIndex === 4}
            onClick={() => {
              onFilterFocus(4);
              onResetFilters();
            }}
            onFocus={() => onFilterFocus(4)}
            aria-label="Reset all filters"
          >
            <span className="word-filter-card-icon" aria-hidden="true">
              <ResetIcon />
            </span>
            <span className="word-filter-card-copy">
              <span className="word-filter-card-label">Reset</span>
              <strong className="word-filter-card-value">Clear</strong>
            </span>
          </button>
        ) : null}
      </div>

      <p className="word-browse-summary">
        Showing <strong>{filteredCount}</strong> of {totalCount} words
        {activeFilterCount > 0 ? (
          <span className="word-browse-summary-note">
            {" "}
            · {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"} on
          </span>
        ) : null}
        <span className="word-browse-remote-hint">
          {" "}
          · ↑ filters · ← → words
        </span>
      </p>

      {pickerOpen ? (
        <div className="word-browse-grid-wrap">
          <div className="word-browse-grid" role="listbox" aria-label="Filtered words">
            {filteredLessons.length === 0 ? (
              <p className="word-browse-empty">
                No words match these filters. Try a wider search.
              </p>
            ) : (
              filteredLessons.map(({ lesson, meta }, index) => {
                const isActive = meta.sheetIndex === activeSheetIndex;
                const isFocused =
                  remoteZone === "picker" && pickerFocusIndex === index;

                return (
                  <button
                    key={`${lesson.word}-${meta.sheetIndex}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className="word-browse-chip"
                    data-active={isActive}
                    data-focused={isFocused}
                    data-level={meta.difficulty}
                    onClick={() => onSelectWord(meta.sheetIndex)}
                  >
                    <span aria-hidden="true">{lesson.emoji}</span>
                    <span>{lesson.word}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
