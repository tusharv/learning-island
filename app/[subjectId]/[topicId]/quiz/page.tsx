import { notFound } from "next/navigation";
import { TopicQuizPage } from "@/components/pages/TopicQuizPage";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";
import { getSubjectById, getTopicById } from "@/data/subjects";

type TopicQuizRouteProps = {
  params: Promise<{ subjectId: string; topicId: string }>;
};

export function generateStaticParams() {
  return [{ subjectId: "english", topicId: SIGHT_WORDS_TOPIC_ID }];
}

export default async function TopicQuizRoute({ params }: TopicQuizRouteProps) {
  const { subjectId, topicId } = await params;
  const subject = getSubjectById(subjectId);
  const topic = getTopicById(subjectId, topicId);

  if (!subject || !topic || topicId !== SIGHT_WORDS_TOPIC_ID) {
    notFound();
  }

  return <TopicQuizPage subject={subject} topic={topic} />;
}
