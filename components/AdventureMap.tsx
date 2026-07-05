import type { Progress, Subject } from "../types/learning";
import { SoundToggle } from "./SoundToggle";
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
  return (
    <main className="adventure-screen" aria-labelledby="map-title">
      <header className="map-header">
        <div>
          <p className="eyebrow">ICSE Class 1</p>
          <h1 id="map-title">Learning Island</h1>
          <p className="map-subtitle">
            Choose a subject island and collect stars with quick practice games.
          </p>
        </div>
        <div className="header-actions">
          <SoundToggle />
          <ProgressBadge progress={progress} />
        </div>
      </header>

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
    </main>
  );
}
