import type { Progress, Subject, Topic } from "../types/learning";
import { hubTopicItemLabel, isHubTopicForSubject } from "../lib/hubTopics";
import { ActivityIcon } from "./ActivityIcon";

type TopicCardProps = {
  subject: Subject;
  topic: Topic;
  index: number;
  isFocused: boolean;
  showRemoteFocus?: boolean;
  progress: Progress;
  onFocus: (index: number) => void;
  onSelect: (index: number) => void;
};

export function TopicCard({
  subject,
  topic,
  index,
  isFocused,
  showRemoteFocus = false,
  progress,
  onFocus,
  onSelect,
}: TopicCardProps) {
  const isCompleted = progress.completedTopicsBySubject[subject.id].includes(
    topic.id,
  );

  const isHub = isHubTopicForSubject(subject.id, topic.id);
  const actionLabel = isCompleted ? "Done" : isHub ? "Open" : "Play";

  return (
    <button
      type="button"
      className="topic-card"
      data-color={subject.color}
      data-focused={showRemoteFocus && isFocused}
      data-completed={isCompleted}
      onClick={() => onSelect(index)}
      onFocus={() => onFocus(index)}
      aria-label={`${topic.title}, ${topic.subtitle}, ${topic.questions.length} questions${isCompleted ? ", completed" : ""}`}
    >
      <ActivityIcon icon={topic.icon} className="topic-icon" />
      <span className="topic-title">{topic.title}</span>
      <span className="topic-subtitle">{topic.subtitle}</span>
      <span className="topic-meta">
        <span>
          {isHub
            ? hubTopicItemLabel(subject.id, topic.id)
            : `${topic.questions.length} questions`}
        </span>
        <span>{actionLabel}</span>
      </span>
    </button>
  );
}
