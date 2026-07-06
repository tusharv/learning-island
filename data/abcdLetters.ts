import type { LetterLesson, LetterLessonExample } from "./letterLessons";

export const ABCD_TOPIC_ID = "abcd";
export const ABCD_SMALL_TOPIC_ID = "abcd-small";

export const ALPHABET_TOPIC_IDS = [ABCD_TOPIC_ID, ABCD_SMALL_TOPIC_ID] as const;
export type AlphabetTopicId = (typeof ALPHABET_TOPIC_IDS)[number];

export type { LetterLesson, LetterLessonExample };

const LETTER_WORDS = [
  { letter: "A", emoji: "🍎", word: "Apple", emoji2: "🐜", word2: "Ant" },
  { letter: "B", emoji: "⚽", word: "Ball", emoji2: "🐻", word2: "Bear" },
  { letter: "C", emoji: "🐱", word: "Cat", emoji2: "🍰", word2: "Cake" },
  { letter: "D", emoji: "🐕", word: "Dog", emoji2: "🦆", word2: "Duck" },
  { letter: "E", emoji: "🥚", word: "Egg", emoji2: "🐘", word2: "Elephant" },
  { letter: "F", emoji: "🐟", word: "Fish", emoji2: "🌸", word2: "Flower" },
  { letter: "G", emoji: "🍇", word: "Grapes", emoji2: "🦒", word2: "Giraffe" },
  { letter: "H", emoji: "🏠", word: "House", emoji2: "🎩", word2: "Hat" },
  { letter: "I", emoji: "🍦", word: "Ice cream", emoji2: "🏔️", word2: "Igloo" },
  { letter: "J", emoji: "🤹", word: "Juggler", emoji2: "🧃", word2: "Juice" },
  { letter: "K", emoji: "🪁", word: "Kite", emoji2: "🦘", word2: "Kangaroo" },
  { letter: "L", emoji: "🦁", word: "Lion", emoji2: "🍃", word2: "Leaf" },
  { letter: "M", emoji: "🐒", word: "Monkey", emoji2: "🌙", word2: "Moon" },
  { letter: "N", emoji: "👃", word: "Nose", emoji2: "🪺", word2: "Nest" },
  { letter: "O", emoji: "🍊", word: "Orange", emoji2: "🦉", word2: "Owl" },
  { letter: "P", emoji: "🐧", word: "Penguin", emoji2: "🐷", word2: "Pig" },
  { letter: "Q", emoji: "👑", word: "Queen", emoji2: "🛏️", word2: "Quilt" },
  { letter: "R", emoji: "🌈", word: "Rainbow", emoji2: "🐰", word2: "Rabbit" },
  { letter: "S", emoji: "☀️", word: "Sun", emoji2: "⭐", word2: "Star" },
  { letter: "T", emoji: "🌳", word: "Tree", emoji2: "🐯", word2: "Tiger" },
  { letter: "U", emoji: "☂️", word: "Umbrella", emoji2: "🦄", word2: "Unicorn" },
  { letter: "V", emoji: "🎻", word: "Violin", emoji2: "🚐", word2: "Van" },
  { letter: "W", emoji: "🐋", word: "Whale", emoji2: "🍉", word2: "Watermelon" },
  { letter: "X", emoji: "🎄", word: "Xmas tree", emoji2: "🎵", word2: "Xylophone" },
  { letter: "Y", emoji: "🪀", word: "Yo-yo", emoji2: "💛", word2: "Yellow" },
  { letter: "Z", emoji: "🦓", word: "Zebra", emoji2: "🏞️", word2: "Zoo" },
] as const;

function formatLetterWord(value: string, letterCase: "upper" | "lower"): string {
  return letterCase === "upper" ? value : value.toLowerCase();
}

function buildExamples(
  letter: string,
  emoji: string,
  word: string,
  emoji2: string,
  word2: string,
): LetterLessonExample[] {
  return [
    { emoji, text: `${letter} is for ${word}.` },
    { emoji: emoji2, text: `${letter} is for ${word2}.` },
  ];
}

function buildLetterLessons(letterCase: "upper" | "lower"): LetterLesson[] {
  return LETTER_WORDS.map(({ letter, emoji, word, emoji2, word2 }) => {
    const displayLetter = formatLetterWord(letter, letterCase);
    const displayWord = formatLetterWord(word, letterCase);
    const displayWord2 = formatLetterWord(word2, letterCase);

    return {
      word: displayLetter,
      emoji,
      usage: `${displayLetter} is for ${displayWord}.`,
      examples: buildExamples(
        displayLetter,
        emoji,
        displayWord,
        emoji2,
        displayWord2,
      ),
    };
  });
}

export const abcdLetterLessons = buildLetterLessons("upper");
export const abcdSmallLetterLessons = buildLetterLessons("lower");
export const ABCD_LETTER_COUNT = abcdLetterLessons.length;

export function isAlphabetTopicId(topicId: string): topicId is AlphabetTopicId {
  return (ALPHABET_TOPIC_IDS as readonly string[]).includes(topicId);
}

export function getAlphabetLessons(topicId: AlphabetTopicId): LetterLesson[] {
  return topicId === ABCD_TOPIC_ID ? abcdLetterLessons : abcdSmallLetterLessons;
}
