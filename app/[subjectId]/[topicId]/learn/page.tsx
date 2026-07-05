import { notFound } from "next/navigation";
import { SightWordsLearnRoute } from "@/components/pages/SightWordsLearnRoute";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";
import { getSubjectById, getTopicById } from "@/data/subjects";

type SightWordsLearnRouteProps = {
  params: Promise<{ subjectId: string; topicId: string }>;
};

export function generateStaticParams() {
  return [{ subjectId: "english", topicId: SIGHT_WORDS_TOPIC_ID }];
}

export default async function SightWordsLearnPageRoute({
  params,
}: SightWordsLearnRouteProps) {
  const { subjectId, topicId } = await params;
  const subject = getSubjectById(subjectId);
  const topic = getTopicById(subjectId, topicId);

  if (!subject || !topic || topicId !== SIGHT_WORDS_TOPIC_ID) {
    notFound();
  }

  return <SightWordsLearnRoute subject={subject} />;
}
