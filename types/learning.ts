export type SubjectId = "english" | "hindi" | "marathi" | "maths" | "evs";

export type QuizQuestion = {
  id: string;
  prompt: string;
  transliteration?: string;
  options: string[];
  optionTransliterations?: string[];
  answerIndex: number;
  encouragement: string;
};

export type Topic = {
  id: string;
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
};

export type Subject = {
  id: SubjectId;
  title: string;
  subtitle: string;
  color: string;
  topics: Topic[];
};

export type Progress = {
  starsBySubject: Record<SubjectId, number>;
  completedSubjects: SubjectId[];
  completedTopicsBySubject: Record<SubjectId, string[]>;
  lastPlayedSubject?: SubjectId;
};
