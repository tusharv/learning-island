import type { Progress, Subject, Topic } from "../types/learning";
import { SIGHT_WORDS_TOPIC_ID } from "../data/sightWords";

type TopicCardProps = {
  subject: Subject;
  topic: Topic;
  index: number;
  isFocused: boolean;
  progress: Progress;
  onFocus: (index: number) => void;
  onSelect: (index: number) => void;
};

export function TopicCard({
  subject,
  topic,
  index,
  isFocused,
  progress,
  onFocus,
  onSelect,
}: TopicCardProps) {
  const isCompleted = progress.completedTopicsBySubject[subject.id].includes(
    topic.id,
  );

  const isSightWords = topic.id === SIGHT_WORDS_TOPIC_ID;
  const actionLabel = isCompleted ? "Done" : isSightWords ? "Open" : "Play";

  return (
    <button
      type="button"
      className="topic-card"
      data-color={subject.color}
      data-focused={isFocused}
      data-completed={isCompleted}
      onClick={() => onSelect(index)}
      onFocus={() => onFocus(index)}
      aria-label={`${topic.title}, ${topic.subtitle}, ${topic.questions.length} questions${isCompleted ? ", completed" : ""}`}
    >
      <span className="topic-title">{topic.title}</span>
      <span className="topic-subtitle">{topic.subtitle}</span>
      <span className="topic-meta">
        <span>{isSightWords ? "100 words" : `${topic.questions.length} questions`}</span>
        <span>{actionLabel}</span>
      </span>
    </button>
  );
}
