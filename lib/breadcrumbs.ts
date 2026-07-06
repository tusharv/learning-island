import type { ActivityIconName, Subject, Topic } from "../types/learning";

const ABCD_TOPIC_ID = "abcd";
const ABCD_SMALL_TOPIC_ID = "abcd-small";
const SIGHT_WORDS_TOPIC_ID = "sight-words";
const READING_TOPIC_ID = "reading";
const DEVANAGARI_HUB_TOPIC_IDS = ["swar", "vyanjan", "akshar"] as const;

function mapPath(): string {
  return "/";
}

function subjectPath(subjectId: string): string {
  return `/${subjectId}`;
}

function topicPath(subjectId: string, topicId: string): string {
  return `/${subjectId}/${topicId}`;
}

export type BreadcrumbSegment = {
  label: string;
  href?: string;
  icon?: ActivityIconName | "home";
  current?: boolean;
};

export type AppChromeBack = {
  label: string;
  href: string;
};

export type AppChromeContext = {
  crumbs: BreadcrumbSegment[];
  back: AppChromeBack | null;
};

export type AppChromePage =
  | "map"
  | "subject"
  | "hub"
  | "learn"
  | "quiz";

function isHubTopicId(topicId: string): boolean {
  return (
    topicId === ABCD_TOPIC_ID ||
    topicId === ABCD_SMALL_TOPIC_ID ||
    topicId === SIGHT_WORDS_TOPIC_ID ||
    topicId === READING_TOPIC_ID ||
    (DEVANAGARI_HUB_TOPIC_IDS as readonly string[]).includes(topicId)
  );
}

function homeCrumb(): BreadcrumbSegment {
  return {
    label: "Home",
    href: mapPath(),
    icon: "home",
  };
}

function quizTailLabel(topicId: string): string {
  return isHubTopicId(topicId) ? "Test" : "Quiz";
}

export function buildAppChromeContext(options: {
  page: AppChromePage;
  subject?: Subject;
  topic?: Topic;
}): AppChromeContext {
  const { page, subject, topic } = options;

  if (page === "map") {
    return {
      crumbs: [{ label: "Learning Island", icon: "home", current: true }],
      back: null,
    };
  }

  if (!subject) {
    return {
      crumbs: [{ label: "Learning Island", icon: "home", current: true }],
      back: { label: "Back", href: mapPath() },
    };
  }

  if (page === "subject") {
    return {
      crumbs: [
        homeCrumb(),
        {
          label: subject.title,
          icon: subject.icon,
          current: true,
        },
      ],
      back: { label: "Back", href: mapPath() },
    };
  }

  if (!topic) {
    return {
      crumbs: [
        homeCrumb(),
        { label: subject.title, href: subjectPath(subject.id), icon: subject.icon },
        { label: "Topic", current: true },
      ],
      back: { label: subject.title, href: subjectPath(subject.id) },
    };
  }

  const topicHref = topicPath(subject.id, topic.id);

  if (page === "hub") {
    return {
      crumbs: [
        homeCrumb(),
        {
          label: subject.title,
          href: subjectPath(subject.id),
          icon: subject.icon,
        },
        {
          label: topic.title,
          icon: topic.icon,
          current: true,
        },
      ],
      back: { label: subject.title, href: subjectPath(subject.id) },
    };
  }

  if (page === "learn") {
    return {
      crumbs: [
        homeCrumb(),
        {
          label: subject.title,
          href: subjectPath(subject.id),
          icon: subject.icon,
        },
        {
          label: topic.title,
          href: topicHref,
          icon: topic.icon,
        },
        { label: "Learn", current: true },
      ],
      back: { label: topic.title, href: topicHref },
    };
  }

  const quizLabel = quizTailLabel(topic.id);

  return {
    crumbs: [
      homeCrumb(),
      {
        label: subject.title,
        href: subjectPath(subject.id),
        icon: subject.icon,
      },
      {
        label: topic.title,
        href: isHubTopicId(topic.id) ? topicHref : subjectPath(subject.id),
        icon: topic.icon,
      },
      { label: quizLabel, current: true },
    ],
    back: {
      label: topic.title,
      href: isHubTopicId(topic.id) ? topicHref : subjectPath(subject.id),
    },
  };
}
