import type { Progress, Subject } from "../types/learning";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import { AppChrome } from "./AppChrome";
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
  const chrome = buildAppChromeContext({ page: "subject", subject });

  return (
    <main className="app-screen subject-screen" data-color={subject.color}>
      <AppChrome
        crumbs={chrome.crumbs}
        back={chrome.back}
        onBack={onBack}
        heading={{
          icon: subject.icon,
          eyebrow: "ICSE Class 1",
          subtitle: subject.subtitle,
        }}
        status={
          <div className="subject-progress-chip">
            <span className="progress-label">Topics done</span>
            <strong>
              {completedCount} / {totalTopics}
            </strong>
          </div>
        }
      />

      <div className="app-screen__body">
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
      </div>
    </main>
  );
}
