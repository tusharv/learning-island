import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/pages/TopicQuizPage";
import { ABCD_SMALL_TOPIC_ID, ABCD_TOPIC_ID } from "@/data/abcdLetters";
import { DEVANAGARI_HUB_TOPIC_IDS } from "@/data/devanagariLetters";
import { READING_TOPIC_ID } from "@/data/readingWords";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";
import { isHubTopic } from "@/lib/hubTopics";
import { getSubjectById, getTopicById } from "@/data/subjects";

type TopicQuizRouteProps = {
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

export default async function TopicQuizRoute({ params }: TopicQuizRouteProps) {
  const { subjectId, topicId } = await params;
  const subject = getSubjectById(subjectId);
  const topic = getTopicById(subjectId, topicId);

  if (!subject || !topic || !isHubTopic(topicId)) {
    notFound();
  }

  return <TopicQuizPage subject={subject} topic={topic} />;
}
