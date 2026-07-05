export type SubjectId = "english" | "hindi" | "marathi" | "maths" | "evs";

export type ActivityIconName =
  | "abc"
  | "devanagari"
  | "numbers"
  | "nature"
  | "capital-letters"
  | "small-letters"
  | "vowels"
  | "rhyming"
  | "words"
  | "sight-words"
  | "reading"
  | "letters"
  | "meaning"
  | "addition"
  | "subtraction"
  | "shapes"
  | "compare"
  | "animals"
  | "body"
  | "plants"
  | "clean"
  | "food";

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
  icon: ActivityIconName;
  questions: QuizQuestion[];
};

export type Subject = {
  id: SubjectId;
  title: string;
  subtitle: string;
  color: string;
  icon: ActivityIconName;
  topics: Topic[];
};

export type Progress = {
  starsBySubject: Record<SubjectId, number>;
  completedSubjects: SubjectId[];
  completedTopicsBySubject: Record<SubjectId, string[]>;
  lastPlayedSubject?: SubjectId;
};
