import {
  ABCD_LETTER_COUNT,
  ABCD_SMALL_TOPIC_ID,
  ABCD_TOPIC_ID,
  abcdLetterLessons,
  abcdSmallLetterLessons,
  isAlphabetTopicId,
  type AlphabetTopicId,
} from "@/data/abcdLetters";
import {
  DEVANAGARI_HUB_TOPIC_IDS,
  getDevanagariLetterCount,
  getDevanagariLessons,
  isDevanagariHubTopicId,
  type DevanagariHubTopicId,
} from "@/data/devanagariLetters";
import type { LetterLesson } from "@/data/letterLessons";
import type { ActivityIconName } from "@/types/learning";

export type LetterHubSubjectId = "english" | "hindi" | "marathi";

export type LetterHubTopicId = AlphabetTopicId | DevanagariHubTopicId;

export type LetterHubKey =
  | "english:abcd"
  | "english:abcd-small"
  | "hindi:swar"
  | "hindi:vyanjan"
  | "hindi:akshar"
  | "marathi:swar"
  | "marathi:vyanjan"
  | "marathi:akshar";

const LETTER_HUB_SUBJECTS: LetterHubSubjectId[] = ["english", "hindi", "marathi"];

export function toLetterHubKey(
  subjectId: string,
  topicId: string,
): LetterHubKey | null {
  if (!LETTER_HUB_SUBJECTS.includes(subjectId as LetterHubSubjectId)) {
    return null;
  }

  if (subjectId === "english" && isAlphabetTopicId(topicId)) {
    return `${subjectId}:${topicId}` as LetterHubKey;
  }

  if (
    (subjectId === "hindi" || subjectId === "marathi") &&
    isDevanagariHubTopicId(topicId)
  ) {
    return `${subjectId}:${topicId}` as LetterHubKey;
  }

  return null;
}

export function isLetterHubTopic(subjectId: string, topicId: string): boolean {
  return toLetterHubKey(subjectId, topicId) !== null;
}

export function getLetterHubLessons(
  subjectId: string,
  topicId: string,
): LetterLesson[] | null {
  const key = toLetterHubKey(subjectId, topicId);

  if (!key) {
    return null;
  }

  if (key === "english:abcd") {
    return abcdLetterLessons;
  }

  if (key === "english:abcd-small") {
    return abcdSmallLetterLessons;
  }

  const language = key.startsWith("hindi:") ? "hindi" : "marathi";
  const devanagariTopicId = topicId as DevanagariHubTopicId;

  return getDevanagariLessons(devanagariTopicId, language);
}

export function getLetterHubCount(subjectId: string, topicId: string): number | null {
  const key = toLetterHubKey(subjectId, topicId);

  if (!key) {
    return null;
  }

  if (key.startsWith("english:")) {
    return ABCD_LETTER_COUNT;
  }

  return getDevanagariLetterCount(topicId as DevanagariHubTopicId);
}

type LetterHubConfig = {
  learnSubtitle: string;
  learnIcon: ActivityIconName;
  ariaLabel: string;
  statusLabel: string;
  headingSubtitle: string;
};

const LETTER_HUB_CONFIG: Record<LetterHubKey, LetterHubConfig> = {
  "english:abcd": {
    learnSubtitle: "Study capital letters A to Z",
    learnIcon: "capital-letters",
    ariaLabel: "ABCD activities",
    statusLabel: "Alphabet",
    headingSubtitle: "Learn letters or take a test.",
  },
  "english:abcd-small": {
    learnSubtitle: "Study small letters a to z",
    learnIcon: "small-letters",
    ariaLabel: "abcd activities",
    statusLabel: "Alphabet",
    headingSubtitle: "Learn letters or take a test.",
  },
  "hindi:swar": {
    learnSubtitle: "स्वर एक-एक करके सीखें",
    learnIcon: "vowels",
    ariaLabel: "Hindi vowel activities",
    statusLabel: "स्वर",
    headingSubtitle: "अक्षर सीखें या परीक्षा दें।",
  },
  "hindi:vyanjan": {
    learnSubtitle: "व्यंजन एक-एक करके सीखें",
    learnIcon: "devanagari",
    ariaLabel: "Hindi consonant activities",
    statusLabel: "व्यंजन",
    headingSubtitle: "अक्षर सीखें या परीक्षा दें।",
  },
  "hindi:akshar": {
    learnSubtitle: "सभी अक्षर एक-एक करके सीखें",
    learnIcon: "letters",
    ariaLabel: "Hindi letter activities",
    statusLabel: "अक्षर",
    headingSubtitle: "अक्षर सीखें या परीक्षा दें।",
  },
  "marathi:swar": {
    learnSubtitle: "स्वर एक-एक शिका",
    learnIcon: "vowels",
    ariaLabel: "Marathi vowel activities",
    statusLabel: "स्वर",
    headingSubtitle: "अक्षरे शिका किंवा चाचणी द्या.",
  },
  "marathi:vyanjan": {
    learnSubtitle: "व्यंजन एक-एक शिका",
    learnIcon: "devanagari",
    ariaLabel: "Marathi consonant activities",
    statusLabel: "व्यंजन",
    headingSubtitle: "अक्षरे शिका किंवा चाचणी द्या.",
  },
  "marathi:akshar": {
    learnSubtitle: "सर्व अक्षरे एक-एक शिका",
    learnIcon: "letters",
    ariaLabel: "Marathi letter activities",
    statusLabel: "अक्षर",
    headingSubtitle: "अक्षरे शिका किंवा चाचणी द्या.",
  },
};

export function getLetterHubConfig(
  subjectId: string,
  topicId: string,
): LetterHubConfig | null {
  const key = toLetterHubKey(subjectId, topicId);
  return key ? LETTER_HUB_CONFIG[key] : null;
}

export function getLetterHubItemLabel(subjectId: string, topicId: string): string {
  const count = getLetterHubCount(subjectId, topicId);

  if (count === null) {
    return "";
  }

  return `${count} letters`;
}

export { DEVANAGARI_HUB_TOPIC_IDS };
