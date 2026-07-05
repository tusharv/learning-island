export function mapPath(): string {
  return "/";
}

export function subjectPath(subjectId: string): string {
  return `/${subjectId}`;
}

export function topicPath(subjectId: string, topicId: string): string {
  return `/${subjectId}/${topicId}`;
}

export function topicLearnPath(subjectId: string, topicId: string): string {
  return `/${subjectId}/${topicId}/learn`;
}

export function topicQuizPath(subjectId: string, topicId: string): string {
  return `/${subjectId}/${topicId}/quiz`;
}
