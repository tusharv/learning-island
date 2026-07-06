import type { Progress, Subject } from "../types/learning";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import { AppChrome } from "./AppChrome";
import { TopicCard } from "./TopicCard";

type SubjectPageProps = {
  subject: Subject;
  focusedIndex: number;
  showRemoteFocus?: boolean;
  progress: Progress;
  onFocusTopic: (index: number) => void;
  onSelectTopic: (index: number) => void;
  onBack: () => void;
};

export function SubjectPage({
  subject,
  focusedIndex,
  showRemoteFocus = false,
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
        heading={{ subtitle: subject.subtitle }}
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
              showRemoteFocus={showRemoteFocus}
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
