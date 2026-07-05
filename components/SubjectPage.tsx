import type { Progress, Subject } from "../types/learning";
import { TopicCard } from "./TopicCard";

type SubjectPageProps = {
  subject: Subject;
  focusedIndex: number;
  progress: Progress;
  onFocusTopic: (index: number) => void;
  onSelectTopic: (index: number) => void;
  onBack: () => void;
};

export function SubjectPage({
  subject,
  focusedIndex,
  progress,
  onFocusTopic,
  onSelectTopic,
  onBack,
}: SubjectPageProps) {
  const completedCount = progress.completedTopicsBySubject[subject.id].length;
  const totalTopics = subject.topics.length;

  return (
    <main className="subject-screen" data-color={subject.color}>
      <button type="button" className="back-button" onClick={onBack}>
        Back to map
      </button>

      <header className="subject-header">
        <div>
          <p className="eyebrow">ICSE Class 1</p>
          <h1>{subject.title}</h1>
          <p className="map-subtitle">{subject.subtitle}</p>
        </div>
        <div className="subject-progress-chip">
          <span className="progress-label">Topics done</span>
          <strong>
            {completedCount} / {totalTopics}
          </strong>
        </div>
      </header>

      <section
        className="topic-grid"
        aria-label={`${subject.title} topics`}
        data-focused-index={focusedIndex}
      >
        {subject.topics.map((topic, index) => (
          <TopicCard
            key={topic.id}
            subject={subject}
            topic={topic}
            index={index}
            isFocused={focusedIndex === index}
            progress={progress}
            onFocus={onFocusTopic}
            onSelect={onSelectTopic}
          />
        ))}
      </section>
    </main>
  );
}
