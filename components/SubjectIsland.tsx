import type { Progress, Subject } from "../types/learning";
import { ActivityIcon } from "./ActivityIcon";

type SubjectIslandProps = {
  subject: Subject;
  index: number;
  isFocused: boolean;
  progress: Progress;
  onFocus: (index: number) => void;
  onSelect: (index: number) => void;
};

export function SubjectIsland({
  subject,
  index,
  isFocused,
  progress,
  onFocus,
  onSelect,
}: SubjectIslandProps) {
  const stars = progress.starsBySubject[subject.id];
  const isCompleted = progress.completedSubjects.includes(subject.id);

  return (
    <button
      type="button"
      className="subject-island"
      data-color={subject.color}
      data-focused={isFocused}
      data-completed={isCompleted}
      onClick={() => onSelect(index)}
      onFocus={() => onFocus(index)}
      aria-label={`${subject.title}, ${subject.subtitle}, ${stars} stars${isCompleted ? ", completed" : ""}`}
    >
      <span className="island-shape" aria-hidden="true" />
      <span className="island-content">
        <ActivityIcon icon={subject.icon} className="island-icon" />
        <span className="island-title">{subject.title}</span>
        <span className="island-subtitle">{subject.subtitle}</span>
        <span className="island-status">
          <span>{stars} stars</span>
          {isCompleted ? <span>Complete</span> : <span>Play</span>}
        </span>
      </span>
    </button>
  );
}
