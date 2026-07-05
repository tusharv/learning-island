import { notFound } from "next/navigation";
import { SightWordsHubRoute } from "@/components/pages/SightWordsHubRoute";
import { TopicQuizPage } from "@/components/pages/TopicQuizPage";
import { SIGHT_WORDS_TOPIC_ID } from "@/data/sightWords";
import { getSubjectById, getTopicById, subjects } from "@/data/subjects";

type TopicRouteProps = {
  params: Promise<{ subjectId: string; topicId: string }>;
};

export function generateStaticParams() {
  return subjects.flatMap((subject) =>
    subject.topics.map((topic) => ({
      subjectId: subject.id,
      topicId: topic.id,
    })),
  );
}

export default async function TopicRoute({ params }: TopicRouteProps) {
  const { subjectId, topicId } = await params;
  const subject = getSubjectById(subjectId);
  const topic = getTopicById(subjectId, topicId);

  if (!subject || !topic) {
    notFound();
  }

  if (topicId === SIGHT_WORDS_TOPIC_ID) {
    return <SightWordsHubRoute subject={subject} />;
  }

  return <TopicQuizPage subject={subject} topic={topic} />;
}
