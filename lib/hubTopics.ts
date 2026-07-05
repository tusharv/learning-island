import { READING_TOPIC_ID } from "@/data/readingWords";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";

const HUB_TOPIC_IDS = [SIGHT_WORDS_TOPIC_ID, READING_TOPIC_ID] as const;

export type HubTopicId = (typeof HUB_TOPIC_IDS)[number];

export function isHubTopic(topicId: string): topicId is HubTopicId {
  return (HUB_TOPIC_IDS as readonly string[]).includes(topicId);
}

export function hubTopicLabel(topicId: HubTopicId): string {
  return topicId === SIGHT_WORDS_TOPIC_ID ? "Sight Words" : "Reading";
}

export function hubTopicWordCount(topicId: HubTopicId): number {
  return topicId === SIGHT_WORDS_TOPIC_ID ? 100 : 154;
}
