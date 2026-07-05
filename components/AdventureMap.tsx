import type { Progress, Subject } from "../types/learning";
import { buildAppChromeContext } from "@/lib/breadcrumbs";
import { AppChrome } from "./AppChrome";
import { ProgressBadge } from "./ProgressBadge";
import { SubjectIsland } from "./SubjectIsland";

type AdventureMapProps = {
  subjects: Subject[];
  focusedIndex: number;
  progress: Progress;
  onFocusSubject: (index: number) => void;
  onSelectSubject: (index: number) => void;
};

export function AdventureMap({
  subjects,
  focusedIndex,
  progress,
  onFocusSubject,
  onSelectSubject,
}: AdventureMapProps) {
  const chrome = buildAppChromeContext({ page: "map" });

  return (
    <main className="app-screen adventure-screen" aria-labelledby="map-title">
      <AppChrome
        crumbs={chrome.crumbs}
        back={chrome.back}
        heading={{
          eyebrow: "ICSE Class 1",
          subtitle: "Choose a subject island and collect stars.",
          titleId: "map-title",
        }}
        status={<ProgressBadge progress={progress} />}
      />

      <div className="app-screen__body">
        <section
          className="island-map"
          aria-label="Subject islands"
          data-focused-index={focusedIndex}
        >
          <div className="map-water" aria-hidden="true" />
          {subjects.map((subject, index) => (
            <SubjectIsland
              key={subject.id}
              subject={subject}
              index={index}
              isFocused={focusedIndex === index}
              progress={progress}
              onFocus={onFocusSubject}
              onSelect={onSelectSubject}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
