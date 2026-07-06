import { notFound } from "next/navigation";
import { LetterLearnRoute } from "@/components/pages/LetterLearnRoute";
import { ReadingLearnRoute } from "@/components/pages/ReadingLearnRoute";
import { SightWordsLearnRoute } from "@/components/pages/SightWordsLearnRoute";
import { ABCD_SMALL_TOPIC_ID, ABCD_TOPIC_ID } from "@/data/abcdLetters";
import { DEVANAGARI_HUB_TOPIC_IDS } from "@/data/devanagariLetters";
import { READING_TOPIC_ID } from "@/data/readingWords";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";
import { getSubjectById, getTopicById } from "@/data/subjects";
import { isLetterHubTopic } from "@/lib/letterHubTopics";

type SightWordsLearnRouteProps = {
  params: Promise<{ subjectId: string; topicId: string }>;
};

export function generateStaticParams() {
  const letterHubParams = [
    { subjectId: "english", topicId: ABCD_TOPIC_ID },
    { subjectId: "english", topicId: ABCD_SMALL_TOPIC_ID },
    ...DEVANAGARI_HUB_TOPIC_IDS.flatMap((topicId) => [
      { subjectId: "hindi", topicId },
      { subjectId: "marathi", topicId },
    ]),
  ];

  return [
    ...letterHubParams,
    { subjectId: "english", topicId: SIGHT_WORDS_TOPIC_ID },
    { subjectId: "english", topicId: READING_TOPIC_ID },
  ];
}

export default async function SightWordsLearnPageRoute({
  params,
}: SightWordsLearnRouteProps) {
  const { subjectId, topicId } = await params;
  const subject = getSubjectById(subjectId);
  const topic = getTopicById(subjectId, topicId);

  if (!subject || !topic) {
    notFound();
  }

  if (isLetterHubTopic(subjectId, topicId)) {
    return <LetterLearnRoute subject={subject} topicId={topicId} />;
  }

  if (topicId === SIGHT_WORDS_TOPIC_ID) {
    return <SightWordsLearnRoute subject={subject} />;
  }

  if (topicId === READING_TOPIC_ID) {
    return <ReadingLearnRoute subject={subject} />;
  }

  notFound();
}
