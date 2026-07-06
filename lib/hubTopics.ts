import {
  ABCD_LETTER_COUNT,
  ABCD_SMALL_TOPIC_ID,
  ABCD_TOPIC_ID,
} from "@/data/abcdLetters";
import {
  DEVANAGARI_HUB_TOPIC_IDS,
  getDevanagariLetterCount,
  isDevanagariHubTopicId,
} from "@/data/devanagariLetters";
import { READING_TOPIC_ID } from "@/data/readingWords";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";
import {
  getLetterHubItemLabel,
  isLetterHubTopic,
} from "@/lib/letterHubTopics";

const HUB_TOPIC_IDS = [
  ABCD_TOPIC_ID,
  ABCD_SMALL_TOPIC_ID,
  ...DEVANAGARI_HUB_TOPIC_IDS,
  SIGHT_WORDS_TOPIC_ID,
  READING_TOPIC_ID,
] as const;

export type HubTopicId = (typeof HUB_TOPIC_IDS)[number];

export function isHubTopic(topicId: string): topicId is HubTopicId {
  return (HUB_TOPIC_IDS as readonly string[]).includes(topicId);
}

export function isHubTopicForSubject(subjectId: string, topicId: string): boolean {
  if (isLetterHubTopic(subjectId, topicId)) {
    return true;
  }

  return topicId === SIGHT_WORDS_TOPIC_ID || topicId === READING_TOPIC_ID;
}

export function hubTopicLabel(topicId: HubTopicId): string {
  if (topicId === ABCD_TOPIC_ID) {
    return "ABCD";
  }

  if (topicId === ABCD_SMALL_TOPIC_ID) {
    return "abcd";
  }

  if (topicId === "swar") {
    return "स्वर";
  }

  if (topicId === "vyanjan") {
    return "व्यंजन";
  }

  if (topicId === "akshar") {
    return "अक्षर";
  }

  return topicId === SIGHT_WORDS_TOPIC_ID ? "Sight Words" : "Reading";
}

export function hubTopicWordCount(topicId: HubTopicId): number {
  if (topicId === ABCD_TOPIC_ID || topicId === ABCD_SMALL_TOPIC_ID) {
    return ABCD_LETTER_COUNT;
  }

  if (isDevanagariHubTopicId(topicId)) {
    return getDevanagariLetterCount(topicId);
  }

  return topicId === SIGHT_WORDS_TOPIC_ID ? 100 : 154;
}

export function hubTopicItemLabel(subjectId: string, topicId: string): string {
  if (isLetterHubTopic(subjectId, topicId)) {
    return getLetterHubItemLabel(subjectId, topicId);
  }

  if (isHubTopic(topicId)) {
    return `${hubTopicWordCount(topicId)} words`;
  }

  return "";
}
