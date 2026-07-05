import type { Progress, SubjectId } from "../types/learning";

export const STORAGE_KEY = "icse-class-1-learning-progress";

export const SUBJECT_IDS: SubjectId[] = [
  "english",
  "hindi",
  "marathi",
  "maths",
  "evs",
];

const isSubjectId = (value: unknown): value is SubjectId =>
  typeof value === "string" && SUBJECT_IDS.includes(value as SubjectId);

export function createDefaultProgress(): Progress {
  return {
    starsBySubject: {
      english: 0,
      hindi: 0,
      marathi: 0,
      maths: 0,
      evs: 0,
    },
    completedSubjects: [],
    completedTopicsBySubject: {
      english: [],
      hindi: [],
      marathi: [],
      maths: [],
      evs: [],
    },
  };
}

export function parseStoredProgress(storedValue: string | null): Progress {
  if (!storedValue) {
    return createDefaultProgress();
  }

  try {
    const parsed = JSON.parse(storedValue) as Partial<Progress>;
    const defaults = createDefaultProgress();

    const starsBySubject = SUBJECT_IDS.reduce<Progress["starsBySubject"]>(
      (stars, subjectId) => {
        const storedStars = parsed.starsBySubject?.[subjectId];
        stars[subjectId] =
          typeof storedStars === "number" && Number.isFinite(storedStars)
            ? Math.max(0, storedStars)
            : defaults.starsBySubject[subjectId];
        return stars;
      },
      { ...defaults.starsBySubject },
    );

    const completedSubjects = Array.isArray(parsed.completedSubjects)
      ? parsed.completedSubjects.filter(isSubjectId)
      : defaults.completedSubjects;

    const completedTopicsBySubject = SUBJECT_IDS.reduce<
      Progress["completedTopicsBySubject"]
    >((topicsBySubject, subjectId) => {
      const storedTopics = parsed.completedTopicsBySubject?.[subjectId];
      topicsBySubject[subjectId] = Array.isArray(storedTopics)
        ? storedTopics.filter((topicId) => typeof topicId === "string")
        : defaults.completedTopicsBySubject[subjectId];
      return topicsBySubject;
    }, { ...defaults.completedTopicsBySubject });

    return {
      starsBySubject,
      completedSubjects: [...new Set(completedSubjects)],
      completedTopicsBySubject,
      ...(isSubjectId(parsed.lastPlayedSubject)
        ? { lastPlayedSubject: parsed.lastPlayedSubject }
        : {}),
    };
  } catch {
    return createDefaultProgress();
  }
}

export function serializeProgress(progress: Progress): string {
  return JSON.stringify(progress);
}

export function loadProgress(storage: Storage | undefined): Progress {
  if (!storage) {
    return createDefaultProgress();
  }

  try {
    return parseStoredProgress(storage.getItem(STORAGE_KEY));
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(
  storage: Storage | undefined,
  progress: Progress,
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, serializeProgress(progress));
  } catch {
    // Playing should continue even if the TV browser blocks storage.
  }
}

export function buildCompletedProgress(
  currentProgress: Progress,
  subjectId: SubjectId,
  topicId: string,
  stars: number,
  totalTopicCount: number,
): Progress {
  const bestStars = Math.max(
    currentProgress.starsBySubject[subjectId] ?? 0,
    Math.max(0, stars),
  );

  const completedTopics = Array.from(
    new Set([
      ...(currentProgress.completedTopicsBySubject[subjectId] ?? []),
      topicId,
    ]),
  );

  const completedSubjects =
    totalTopicCount > 0 && completedTopics.length >= totalTopicCount
      ? Array.from(new Set([...currentProgress.completedSubjects, subjectId]))
      : currentProgress.completedSubjects;

  return {
    starsBySubject: {
      ...currentProgress.starsBySubject,
      [subjectId]: bestStars,
    },
    completedSubjects,
    completedTopicsBySubject: {
      ...currentProgress.completedTopicsBySubject,
      [subjectId]: completedTopics,
    },
    lastPlayedSubject: subjectId,
  };
}
