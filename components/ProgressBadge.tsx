import type { Progress } from "../types/learning";
import { SUBJECT_IDS } from "../lib/progress";

type ProgressBadgeProps = {
  progress: Progress;
};

export function ProgressBadge({ progress }: ProgressBadgeProps) {
  const totalStars = SUBJECT_IDS.reduce(
    (total, subjectId) => total + progress.starsBySubject[subjectId],
    0,
  );

  return (
    <aside className="progress-badge" aria-label="Learning progress">
      <div>
        <span className="progress-label">Stars</span>
        <strong>{totalStars}</strong>
      </div>
      <div>
        <span className="progress-label">Completed</span>
        <strong>{progress.completedSubjects.length}/5</strong>
      </div>
    </aside>
  );
}
