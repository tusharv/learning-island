import { notFound } from "next/navigation";
import { SubjectTopicsPage } from "@/components/pages/SubjectTopicsPage";
import { getSubjectById, subjectIds } from "@/data/subjects";

type SubjectRouteProps = {
  params: Promise<{ subjectId: string }>;
};

export function generateStaticParams() {
  return subjectIds.map((subjectId) => ({ subjectId }));
}

export default async function SubjectRoute({ params }: SubjectRouteProps) {
  const { subjectId } = await params;
  const subject = getSubjectById(subjectId);

  if (!subject) {
    notFound();
  }

  return <SubjectTopicsPage subject={subject} />;
}
