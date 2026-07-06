import type {
  ActivityIconName,
  QuizQuestion,
  Subject,
  Topic,
} from "../types/learning";
import {
  DEVANAGARI_AKSHAR,
  DEVANAGARI_SWAR,
  DEVANAGARI_VYANJAN,
} from "./devanagariLetters.ts";
import readingWordLessons from "./readingWords.json" with { type: "json" };
import sightWordLessons from "./sightWords.json" with { type: "json" };

const SIGHT_WORDS = sightWordLessons.map((lesson) => lesson.word);
const READING_WORDS = readingWordLessons.map((lesson) => lesson.word);

const SIGHT_WORD_SENTENCES: Record<string, string> = Object.fromEntries(
  sightWordLessons.map((lesson) => {
    const primary = lesson.examples?.[0]?.text ?? lesson.word;
    return [
      lesson.word,
      primary.replace(new RegExp(`\\b${escapeRegExp(lesson.word)}\\b`, "i"), "___"),
    ];
  }),
);

const READING_WORD_SENTENCES: Record<string, string> = Object.fromEntries(
  readingWordLessons.map((lesson) => {
    const primary = lesson.examples?.[0]?.text ?? lesson.word;
    return [
      lesson.word,
      primary.replace(new RegExp(`\\b${escapeRegExp(lesson.word)}\\b`, "i"), "___"),
    ];
  }),
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const QUESTIONS_PER_TOPIC = 25;

type RawQuestion = Omit<QuizQuestion, "id">;

function shuffleOptions(
  correct: string,
  distractors: string[],
  seed: number,
): { options: string[]; answerIndex: number } {
  const answerIndex = seed % 4;
  const pool = [...distractors];
  const options: string[] = [];

  for (let slot = 0; slot < 4; slot += 1) {
    if (slot === answerIndex) {
      options.push(correct);
    } else {
      options.push(pool.shift() ?? correct);
    }
  }

  return { options, answerIndex };
}

function topic(
  subjectId: string,
  id: string,
  title: string,
  subtitle: string,
  icon: ActivityIconName,
  questions: RawQuestion[],
  poolSize: number = QUESTIONS_PER_TOPIC,
): Topic {
  if (questions.length < QUESTIONS_PER_TOPIC) {
    throw new Error(
      `${subjectId}/${id} needs at least ${QUESTIONS_PER_TOPIC} questions, got ${questions.length}`,
    );
  }

  const size = Math.min(poolSize, questions.length);

  return {
    id,
    title,
    subtitle,
    icon,
    questions: questions.slice(0, size).map((question, index) => ({
      ...question,
      id: `${subjectId}-${id}-${index + 1}`,
    })),
  };
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const VOWELS = ["A", "E", "I", "O", "U"];

function englishCapitalQuestions(): RawQuestion[] {
  return ALPHABET.slice(0, QUESTIONS_PER_TOPIC).map((letter, index) => {
    const wrong = ALPHABET.filter((item) => item !== letter);
    const distractors = [
      wrong[index % wrong.length],
      wrong[(index + 5) % wrong.length],
      wrong[(index + 11) % wrong.length],
    ];
    const { options, answerIndex } = shuffleOptions(letter, distractors, index);
    return {
      prompt: `Which is the capital letter ${letter}?`,
      options,
      answerIndex,
      encouragement: `${letter} is a capital letter. Great!`,
    };
  });
}

function englishSmallQuestions(): RawQuestion[] {
  return ALPHABET.slice(0, QUESTIONS_PER_TOPIC).map((letter, index) => {
    const small = letter.toLowerCase();
    const wrong = ALPHABET.filter((item) => item !== letter).map((item) =>
      item.toLowerCase(),
    );
    const distractors = [
      wrong[index % wrong.length],
      wrong[(index + 7) % wrong.length],
      wrong[(index + 13) % wrong.length],
    ];
    const { options, answerIndex } = shuffleOptions(small, distractors, index + 1);
    return {
      prompt: `Choose the small letter for ${letter}.`,
      options,
      answerIndex,
      encouragement: `${letter} and ${small} are partners.`,
    };
  });
}

function englishVowelQuestions(): RawQuestion[] {
  return ALPHABET.slice(0, QUESTIONS_PER_TOPIC).map((letter, index) => {
    const isVowel = VOWELS.includes(letter);
    const correct = isVowel ? "Vowel" : "Not a vowel";
    const { options, answerIndex } = shuffleOptions(
      correct,
      isVowel
        ? ["Not a vowel", "Number", "Shape"]
        : ["Vowel", "Number", "Shape"],
      index + 2,
    );
    return {
      prompt: `Is the letter ${letter} a vowel?`,
      options,
      answerIndex,
      encouragement: isVowel
        ? `${letter} is one of A, E, I, O, U.`
        : `${letter} is a consonant.`,
    };
  });
}

const RHYME_SETS: Array<{ word: string; rhyme: string; others: string[] }> = [
  { word: "sun", rhyme: "run", others: ["red", "sit", "top"] },
  { word: "cat", rhyme: "hat", others: ["cup", "dog", "pen"] },
  { word: "ball", rhyme: "tall", others: ["book", "tree", "fish"] },
  { word: "dog", rhyme: "log", others: ["cat", "pen", "cup"] },
  { word: "star", rhyme: "car", others: ["moon", "sky", "cup"] },
  { word: "pen", rhyme: "hen", others: ["book", "map", "sun"] },
  { word: "man", rhyme: "fan", others: ["cup", "dog", "leg"] },
  { word: "cake", rhyme: "lake", others: ["milk", "corn", "peas"] },
  { word: "bee", rhyme: "tree", others: ["ant", "owl", "fox"] },
  { word: "mouse", rhyme: "house", others: ["dog", "cat", "cow"] },
  { word: "king", rhyme: "ring", others: ["cup", "hat", "box"] },
  { word: "night", rhyme: "light", others: ["day", "noon", "rain"] },
  { word: "boat", rhyme: "coat", others: ["ship", "raft", "car"] },
  { word: "snake", rhyme: "rake", others: ["frog", "bird", "goat"] },
  { word: "goat", rhyme: "boat", others: ["cow", "hen", "duck"] },
  { word: "bug", rhyme: "rug", others: ["ant", "fly", "bee"] },
  { word: "top", rhyme: "mop", others: ["cup", "pin", "hat"] },
  { word: "bell", rhyme: "shell", others: ["horn", "drum", "flute"] },
  { word: "duck", rhyme: "truck", others: ["swan", "crow", "owl"] },
  { word: "frog", rhyme: "log", others: ["toad", "fish", "newt"] },
  { word: "hand", rhyme: "band", others: ["foot", "arm", "leg"] },
  { word: "rain", rhyme: "train", others: ["snow", "wind", "sun"] },
  { word: "moon", rhyme: "spoon", others: ["star", "sky", "cloud"] },
  { word: "fox", rhyme: "box", others: ["cat", "dog", "pig"] },
  { word: "tree", rhyme: "knee", others: ["bush", "leaf", "twig"] },
];

function englishRhymeQuestions(): RawQuestion[] {
  return RHYME_SETS.map((set, index) => {
    const { options, answerIndex } = shuffleOptions(
      set.rhyme,
      set.others,
      index,
    );
    return {
      prompt: `Which word rhymes with ${set.word}?`,
      options,
      answerIndex,
      encouragement: `${set.word} and ${set.rhyme} rhyme nicely.`,
    };
  });
}

const WORD_SETS: Array<{ label: string; correct: string; others: string[] }> = [
  { label: "an animal", correct: "Tiger", others: ["Chair", "Book", "Moon"] },
  { label: "a colour", correct: "Red", others: ["Table", "Chair", "Pen"] },
  { label: "a fruit", correct: "Apple", others: ["Chair", "Truck", "Road"] },
  { label: "a vehicle", correct: "Bus", others: ["Apple", "Leaf", "Star"] },
  { label: "a body part", correct: "Hand", others: ["Cup", "Sky", "Rain"] },
  { label: "a bird", correct: "Parrot", others: ["Rock", "Chair", "Pen"] },
  { label: "a flower", correct: "Rose", others: ["Bus", "Cup", "Book"] },
  { label: "a drink", correct: "Milk", others: ["Chair", "Sky", "Rock"] },
  { label: "a toy", correct: "Ball", others: ["Cloud", "River", "Star"] },
  { label: "a fruit", correct: "Mango", others: ["Chair", "Truck", "Stone"] },
  { label: "an animal", correct: "Lion", others: ["Book", "Chair", "Cup"] },
  { label: "a colour", correct: "Blue", others: ["Table", "Pen", "Chair"] },
  { label: "a vehicle", correct: "Car", others: ["Apple", "Star", "Leaf"] },
  { label: "a body part", correct: "Nose", others: ["Cup", "Rain", "Sky"] },
  { label: "a bird", correct: "Crow", others: ["Rock", "Chair", "Pen"] },
  { label: "a flower", correct: "Lotus", others: ["Bus", "Cup", "Book"] },
  { label: "a drink", correct: "Juice", others: ["Chair", "Sky", "Rock"] },
  { label: "a toy", correct: "Kite", others: ["Cloud", "River", "Star"] },
  { label: "a fruit", correct: "Banana", others: ["Chair", "Truck", "Stone"] },
  { label: "an animal", correct: "Elephant", others: ["Book", "Chair", "Cup"] },
  { label: "a colour", correct: "Green", others: ["Table", "Pen", "Chair"] },
  { label: "a vehicle", correct: "Train", others: ["Apple", "Star", "Leaf"] },
  { label: "a body part", correct: "Foot", others: ["Cup", "Rain", "Sky"] },
  { label: "a bird", correct: "Peacock", others: ["Rock", "Chair", "Pen"] },
  { label: "a fruit", correct: "Orange", others: ["Chair", "Truck", "Stone"] },
];

function englishWordQuestions(): RawQuestion[] {
  return WORD_SETS.map((set, index) => {
    const { options, answerIndex } = shuffleOptions(set.correct, set.others, index);
    return {
      prompt: `Which word names ${set.label}?`,
      options,
      answerIndex,
      encouragement: `${set.correct} is ${set.label}. Well spotted.`,
    };
  });
}

function englishSightWordQuestions(): RawQuestion[] {
  return SIGHT_WORDS.map((word, index) => {
    const others = SIGHT_WORDS.filter((item) => item !== word);
    const distractors = [
      others[index % others.length],
      others[(index + 11) % others.length],
      others[(index + 37) % others.length],
    ];
    const { options, answerIndex } = shuffleOptions(word, distractors, index);

    const sentence = SIGHT_WORD_SENTENCES[word];
    if (sentence && index % 2 === 0) {
      return {
        prompt: `Which word completes the sentence? ${sentence}`,
        options,
        answerIndex,
        encouragement: `"${word}" fits perfectly. Nice reading!`,
      };
    }

    return {
      prompt: `Find the sight word: ${word}`,
      options,
      answerIndex,
      encouragement: `"${word}" is a sight word. Well done!`,
    };
  });
}

function englishReadingWordQuestions(): RawQuestion[] {
  return READING_WORDS.map((word, index) => {
    const others = READING_WORDS.filter((item) => item !== word);
    const distractors = [
      others[index % others.length],
      others[(index + 13) % others.length],
      others[(index + 41) % others.length],
    ];
    const { options, answerIndex } = shuffleOptions(word, distractors, index);

    const sentence = READING_WORD_SENTENCES[word];
    if (sentence && index % 2 === 0) {
      return {
        prompt: `Which word completes the sentence? ${sentence}`,
        options,
        answerIndex,
        encouragement: `"${word}" fits perfectly. Great reading!`,
      };
    }

    return {
      prompt: `Find the reading word: ${word}`,
      options,
      answerIndex,
      encouragement: `"${word}" is on your daily reading list. Well done!`,
    };
  });
}

const HINDI_LETTERS = DEVANAGARI_AKSHAR;
const HINDI_SWAR = DEVANAGARI_SWAR;
const HINDI_VYANJAN = DEVANAGARI_VYANJAN;

function devanagariRecognitionQuestions(
  letters: Array<{ char: string; tr: string }>,
  promptText: string,
  promptTr: string,
): RawQuestion[] {
  return Array.from({ length: QUESTIONS_PER_TOPIC }, (_, index) => {
    const letter = letters[index % letters.length];
    const others = letters.filter((item) => item.char !== letter.char);
    const distractors = [
      others[index % others.length],
      others[(index + 4) % others.length],
      others[(index + 9) % others.length],
    ];
    const answerIndex = index % 4;
    const optionLetters: Array<{ char: string; tr: string }> = [];
    const pool = [...distractors];

    for (let slot = 0; slot < 4; slot += 1) {
      if (slot === answerIndex) {
        optionLetters.push(letter);
      } else {
        optionLetters.push(pool.shift() ?? letter);
      }
    }

    return {
      prompt: `${promptText} ${letter.char}?`,
      transliteration: `${promptTr} ${letter.tr}?`,
      options: optionLetters.map((item) => item.char),
      optionTransliterations: optionLetters.map((item) => item.tr),
      answerIndex,
      encouragement: `${letter.char} (${letter.tr}) — शाबाश!`,
    };
  });
}

const HINDI_WORDS: Array<{
  word: string;
  tr: string;
  meaning: string;
  others: string[];
}> = [
  { word: "आम", tr: "aam", meaning: "Mango", others: ["Home", "Water", "Tree"] },
  { word: "घर", tr: "ghar", meaning: "Home", others: ["Mango", "Sun", "Milk"] },
  { word: "जल", tr: "jal", meaning: "Water", others: ["Tree", "Fire", "Book"] },
  { word: "कमल", tr: "kamal", meaning: "Lotus", others: ["Ball", "Road", "Cup"] },
  { word: "फल", tr: "phal", meaning: "Fruit", others: ["Fish", "Fire", "Fan"] },
  { word: "सूरज", tr: "sooraj", meaning: "Sun", others: ["Moon", "Star", "Cloud"] },
  { word: "पानी", tr: "paani", meaning: "Water", others: ["Sand", "Rock", "Wood"] },
  { word: "पुस्तक", tr: "pustak", meaning: "Book", others: ["Ball", "Bird", "Boat"] },
  { word: "नदी", tr: "nadi", meaning: "River", others: ["Road", "Rain", "Ring"] },
  { word: "फूल", tr: "phool", meaning: "Flower", others: ["Fruit", "Fish", "Fan"] },
  { word: "पेड़", tr: "ped", meaning: "Tree", others: ["Home", "Cup", "Pen"] },
  { word: "दूध", tr: "doodh", meaning: "Milk", others: ["Water", "Juice", "Tea"] },
  { word: "चाँद", tr: "chaand", meaning: "Moon", others: ["Sun", "Star", "Sky"] },
  { word: "तारा", tr: "taara", meaning: "Star", others: ["Moon", "Sun", "Cloud"] },
  { word: "हाथ", tr: "haath", meaning: "Hand", others: ["Foot", "Ear", "Nose"] },
  { word: "आँख", tr: "aankh", meaning: "Eye", others: ["Ear", "Nose", "Hand"] },
  { word: "किताब", tr: "kitaab", meaning: "Book", others: ["Bag", "Pen", "Cup"] },
  { word: "मछली", tr: "machhli", meaning: "Fish", others: ["Bird", "Cat", "Dog"] },
  { word: "पक्षी", tr: "pakshi", meaning: "Bird", others: ["Fish", "Frog", "Ant"] },
  { word: "बिल्ली", tr: "billi", meaning: "Cat", others: ["Dog", "Cow", "Goat"] },
  { word: "कुत्ता", tr: "kutta", meaning: "Dog", others: ["Cat", "Cow", "Fox"] },
  { word: "गाय", tr: "gaay", meaning: "Cow", others: ["Goat", "Dog", "Cat"] },
  { word: "बच्चा", tr: "bachcha", meaning: "Child", others: ["Tree", "Water", "Book"] },
  { word: "समुद्र", tr: "samudra", meaning: "Sea", others: ["Hill", "Road", "Sky"] },
  { word: "आकाश", tr: "aakash", meaning: "Sky", others: ["Sea", "Hill", "Road"] },
];

function hindiWordQuestions(offset = 0): RawQuestion[] {
  return HINDI_WORDS.map((entry, index) => {
    const { options, answerIndex } = shuffleOptions(
      entry.meaning,
      entry.others,
      index + offset,
    );
    return {
      prompt: `${entry.word} का अर्थ क्या है?`,
      transliteration: `${entry.tr} ka arth kya hai?`,
      options,
      optionTransliterations: options.map((option) => option.toLowerCase()),
      answerIndex,
      encouragement: `${entry.word} means ${entry.meaning}.`,
    };
  });
}

const MARATHI_WORDS: Array<{
  word: string;
  tr: string;
  meaning: string;
  others: string[];
}> = [
  { word: "आंबा", tr: "aamba", meaning: "Mango", others: ["Home", "Water", "Tree"] },
  { word: "घर", tr: "ghar", meaning: "Home", others: ["Mango", "Sun", "Milk"] },
  { word: "पाणी", tr: "paani", meaning: "Water", others: ["Tree", "Fire", "Book"] },
  { word: "कमळ", tr: "kamal", meaning: "Lotus", others: ["Ball", "Road", "Cup"] },
  { word: "फळ", tr: "phal", meaning: "Fruit", others: ["Fish", "Fire", "Fan"] },
  { word: "सूर्य", tr: "surya", meaning: "Sun", others: ["Moon", "Star", "Cloud"] },
  { word: "मासा", tr: "maasa", meaning: "Fish", others: ["Bird", "Cat", "Dog"] },
  { word: "पुस्तक", tr: "pustak", meaning: "Book", others: ["Ball", "Bird", "Boat"] },
  { word: "नदी", tr: "nadi", meaning: "River", others: ["Road", "Rain", "Ring"] },
  { word: "फूल", tr: "phool", meaning: "Flower", others: ["Fruit", "Fish", "Fan"] },
  { word: "झाड", tr: "jhaad", meaning: "Tree", others: ["Home", "Cup", "Pen"] },
  { word: "दूध", tr: "doodh", meaning: "Milk", others: ["Water", "Juice", "Tea"] },
  { word: "चंद्र", tr: "chandra", meaning: "Moon", others: ["Sun", "Star", "Sky"] },
  { word: "तारा", tr: "taara", meaning: "Star", others: ["Moon", "Sun", "Cloud"] },
  { word: "हात", tr: "haat", meaning: "Hand", others: ["Foot", "Ear", "Nose"] },
  { word: "डोळा", tr: "dola", meaning: "Eye", others: ["Ear", "Nose", "Hand"] },
  { word: "वही", tr: "vahi", meaning: "Notebook", others: ["Bag", "Pen", "Cup"] },
  { word: "पक्षी", tr: "pakshi", meaning: "Bird", others: ["Fish", "Frog", "Ant"] },
  { word: "मांजर", tr: "maanjar", meaning: "Cat", others: ["Dog", "Cow", "Goat"] },
  { word: "कुत्रा", tr: "kutra", meaning: "Dog", others: ["Cat", "Cow", "Fox"] },
  { word: "गाय", tr: "gaay", meaning: "Cow", others: ["Goat", "Dog", "Cat"] },
  { word: "मूल", tr: "mool", meaning: "Child", others: ["Tree", "Water", "Book"] },
  { word: "समुद्र", tr: "samudra", meaning: "Sea", others: ["Hill", "Road", "Sky"] },
  { word: "आकाश", tr: "aakash", meaning: "Sky", others: ["Sea", "Hill", "Road"] },
  { word: "डोंगर", tr: "dongar", meaning: "Hill", others: ["Sea", "Sky", "Road"] },
];

function marathiWordQuestions(offset = 0): RawQuestion[] {
  return MARATHI_WORDS.map((entry, index) => {
    const { options, answerIndex } = shuffleOptions(
      entry.meaning,
      entry.others,
      index + offset,
    );
    return {
      prompt: `${entry.word} म्हणजे काय?`,
      transliteration: `${entry.tr} mhanje kaay?`,
      options,
      optionTransliterations: options.map((option) => option.toLowerCase()),
      answerIndex,
      encouragement: `${entry.word} means ${entry.meaning}.`,
    };
  });
}

function numberToWords(value: number): string {
  return String(value);
}

function mathsNumberQuestions(): RawQuestion[] {
  return Array.from({ length: QUESTIONS_PER_TOPIC }, (_, index) => {
    const value = (index % 9) + 1;
    const after = value + 1;
    const distractors = [
      numberToWords(value),
      numberToWords(value + 2),
      numberToWords(value === 1 ? 9 : value - 1),
    ];
    const { options, answerIndex } = shuffleOptions(
      numberToWords(after),
      distractors,
      index,
    );
    return {
      prompt: `What comes after ${value}?`,
      options,
      answerIndex,
      encouragement: `After ${value} comes ${after}. Great counting.`,
    };
  });
}

function mathsAdditionQuestions(): RawQuestion[] {
  return Array.from({ length: QUESTIONS_PER_TOPIC }, (_, index) => {
    const a = (index % 5) + 1;
    const b = ((index + 2) % 5) + 1;
    const sum = a + b;
    const distractors = [
      numberToWords(sum + 1),
      numberToWords(Math.max(0, sum - 1)),
      numberToWords(sum + 2),
    ];
    const { options, answerIndex } = shuffleOptions(
      numberToWords(sum),
      distractors,
      index,
    );
    return {
      prompt: `What is ${a} + ${b}?`,
      options,
      answerIndex,
      encouragement: `${a} plus ${b} makes ${sum}.`,
    };
  });
}

function mathsSubtractionQuestions(): RawQuestion[] {
  return Array.from({ length: QUESTIONS_PER_TOPIC }, (_, index) => {
    const a = (index % 8) + 2;
    const b = (index % a) === 0 ? 1 : index % a;
    const diff = a - b;
    const distractors = [
      numberToWords(diff + 1),
      numberToWords(diff + 2),
      numberToWords(Math.max(0, diff - 1)),
    ];
    const { options, answerIndex } = shuffleOptions(
      numberToWords(diff),
      distractors,
      index,
    );
    return {
      prompt: `What is ${a} - ${b}?`,
      options,
      answerIndex,
      encouragement: `${a} minus ${b} leaves ${diff}.`,
    };
  });
}

const SHAPE_SETS: Array<{ prompt: string; correct: string; others: string[]; note: string }> = [
  { prompt: "Which shape has three sides?", correct: "Triangle", others: ["Circle", "Square", "Oval"], note: "A triangle has three sides." },
  { prompt: "Which shape has no corners?", correct: "Circle", others: ["Square", "Triangle", "Rectangle"], note: "A circle has no corners." },
  { prompt: "How many sides does a square have?", correct: "4", others: ["3", "5", "6"], note: "A square has 4 equal sides." },
  { prompt: "Which shape is round like a ball?", correct: "Circle", others: ["Square", "Triangle", "Rectangle"], note: "A circle is round." },
  { prompt: "Which shape has four equal sides?", correct: "Square", others: ["Triangle", "Circle", "Oval"], note: "A square has four equal sides." },
  { prompt: "How many sides does a triangle have?", correct: "3", others: ["2", "4", "5"], note: "A triangle has 3 sides." },
  { prompt: "Which shape looks like an egg?", correct: "Oval", others: ["Square", "Triangle", "Circle"], note: "An oval looks like an egg." },
  { prompt: "Which shape has four sides but is long?", correct: "Rectangle", others: ["Circle", "Triangle", "Square"], note: "A rectangle is a long four-sided shape." },
  { prompt: "How many corners does a square have?", correct: "4", others: ["3", "2", "5"], note: "A square has 4 corners." },
  { prompt: "Which shape has the most sides here?", correct: "Rectangle", others: ["Circle", "Triangle", "Line"], note: "A rectangle has four sides." },
  { prompt: "A wheel is shaped like a…", correct: "Circle", others: ["Square", "Triangle", "Oval"], note: "A wheel is a circle." },
  { prompt: "A slice of pizza looks like a…", correct: "Triangle", others: ["Circle", "Square", "Oval"], note: "A pizza slice is a triangle." },
  { prompt: "A window is often a…", correct: "Square", others: ["Circle", "Triangle", "Oval"], note: "A window is often a square." },
  { prompt: "How many sides does a circle have?", correct: "0", others: ["1", "3", "4"], note: "A circle has no straight sides." },
  { prompt: "Which shape has 3 corners?", correct: "Triangle", others: ["Square", "Circle", "Rectangle"], note: "A triangle has 3 corners." },
  { prompt: "A book cover looks like a…", correct: "Rectangle", others: ["Circle", "Triangle", "Oval"], note: "A book cover is a rectangle." },
  { prompt: "Which shape can roll?", correct: "Circle", others: ["Square", "Triangle", "Rectangle"], note: "A circle can roll." },
  { prompt: "How many sides does a rectangle have?", correct: "4", others: ["3", "5", "6"], note: "A rectangle has 4 sides." },
  { prompt: "Which shape is like the sun?", correct: "Circle", others: ["Square", "Triangle", "Rectangle"], note: "The sun looks like a circle." },
  { prompt: "Which shape is like a party hat?", correct: "Triangle", others: ["Circle", "Square", "Oval"], note: "A party hat is a triangle." },
  { prompt: "Which shape has equal sides and 4 corners?", correct: "Square", others: ["Circle", "Triangle", "Oval"], note: "A square has equal sides and 4 corners." },
  { prompt: "Which shape has curved edges?", correct: "Oval", others: ["Square", "Triangle", "Rectangle"], note: "An oval has curved edges." },
  { prompt: "How many corners does a triangle have?", correct: "3", others: ["2", "4", "5"], note: "A triangle has 3 corners." },
  { prompt: "A clock face is usually a…", correct: "Circle", others: ["Square", "Triangle", "Oval"], note: "A clock face is a circle." },
  { prompt: "A door is shaped like a…", correct: "Rectangle", others: ["Circle", "Triangle", "Oval"], note: "A door is a rectangle." },
];

function mathsShapeQuestions(): RawQuestion[] {
  return SHAPE_SETS.map((set, index) => {
    const { options, answerIndex } = shuffleOptions(set.correct, set.others, index);
    return {
      prompt: set.prompt,
      options,
      answerIndex,
      encouragement: set.note,
    };
  });
}

function mathsCompareQuestions(): RawQuestion[] {
  return Array.from({ length: QUESTIONS_PER_TOPIC }, (_, index) => {
    const a = (index % 9) + 1;
    const b = ((index + 4) % 9) + 1;
    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);
    if (a === b) {
      const { options, answerIndex } = shuffleOptions(
        "They are equal",
        [numberToWords(a), numberToWords(a + 1), "Neither"],
        index,
      );
      return {
        prompt: `Which is more: ${a} or ${b}?`,
        options,
        answerIndex,
        encouragement: `${a} and ${b} are equal.`,
      };
    }
    const { options, answerIndex } = shuffleOptions(
      numberToWords(bigger),
      [numberToWords(smaller), "They are equal", "Neither"],
      index,
    );
    return {
      prompt: `Which number is bigger: ${a} or ${b}?`,
      options,
      answerIndex,
      encouragement: `${bigger} is bigger than ${smaller}.`,
    };
  });
}

function factQuestions(
  facts: Array<{ prompt: string; correct: string; others: string[]; note: string }>,
): RawQuestion[] {
  return facts.map((fact, index) => {
    const { options, answerIndex } = shuffleOptions(fact.correct, fact.others, index);
    return {
      prompt: fact.prompt,
      options,
      answerIndex,
      encouragement: fact.note,
    };
  });
}

const EVS_ANIMALS = [
  { prompt: "Which animal gives us milk?", correct: "Cow", others: ["Lion", "Crow", "Fish"], note: "A cow gives us milk." },
  { prompt: "Which animal says moo?", correct: "Cow", others: ["Dog", "Cat", "Duck"], note: "A cow says moo." },
  { prompt: "Which animal can fly?", correct: "Bird", others: ["Fish", "Cow", "Frog"], note: "Birds can fly." },
  { prompt: "Which animal lives in water?", correct: "Fish", others: ["Cat", "Dog", "Cow"], note: "Fish live in water." },
  { prompt: "Which animal barks?", correct: "Dog", others: ["Cat", "Cow", "Hen"], note: "A dog barks." },
  { prompt: "Which animal says meow?", correct: "Cat", others: ["Dog", "Cow", "Duck"], note: "A cat says meow." },
  { prompt: "Which animal is the king of the jungle?", correct: "Lion", others: ["Rabbit", "Mouse", "Deer"], note: "The lion is the king of the jungle." },
  { prompt: "Which animal hops?", correct: "Rabbit", others: ["Cow", "Fish", "Snake"], note: "A rabbit hops." },
  { prompt: "Which animal gives us wool?", correct: "Sheep", others: ["Cow", "Hen", "Dog"], note: "Sheep give us wool." },
  { prompt: "Which animal lays eggs we eat?", correct: "Hen", others: ["Cow", "Goat", "Dog"], note: "A hen lays eggs." },
  { prompt: "Which animal has a long trunk?", correct: "Elephant", others: ["Lion", "Deer", "Goat"], note: "An elephant has a long trunk." },
  { prompt: "Which animal has a long neck?", correct: "Giraffe", others: ["Cow", "Cat", "Dog"], note: "A giraffe has a long neck." },
  { prompt: "Which animal carries its home?", correct: "Snail", others: ["Dog", "Cow", "Lion"], note: "A snail carries its shell home." },
  { prompt: "Which animal is very slow?", correct: "Tortoise", others: ["Cheetah", "Horse", "Deer"], note: "A tortoise is very slow." },
  { prompt: "Which animal roars?", correct: "Lion", others: ["Cat", "Hen", "Duck"], note: "A lion roars." },
  { prompt: "Which animal gives us honey?", correct: "Bee", others: ["Ant", "Fly", "Frog"], note: "Bees give us honey." },
  { prompt: "Which animal has stripes?", correct: "Zebra", others: ["Cow", "Dog", "Cat"], note: "A zebra has stripes." },
  { prompt: "Which animal loves bananas?", correct: "Monkey", others: ["Fish", "Cow", "Hen"], note: "Monkeys love bananas." },
  { prompt: "Which animal quacks?", correct: "Duck", others: ["Dog", "Cat", "Cow"], note: "A duck quacks." },
  { prompt: "Which animal lives in a web?", correct: "Spider", others: ["Bird", "Fish", "Frog"], note: "A spider lives in a web." },
  { prompt: "Which animal jumps and croaks?", correct: "Frog", others: ["Cow", "Cat", "Dog"], note: "A frog jumps and croaks." },
  { prompt: "Which animal is a baby dog?", correct: "Puppy", others: ["Kitten", "Calf", "Chick"], note: "A baby dog is a puppy." },
  { prompt: "Which animal is a baby cat?", correct: "Kitten", others: ["Puppy", "Calf", "Cub"], note: "A baby cat is a kitten." },
  { prompt: "Which animal pulls carts?", correct: "Horse", others: ["Cat", "Hen", "Fish"], note: "A horse can pull carts." },
  { prompt: "Which animal gives us silk?", correct: "Silkworm", others: ["Cow", "Hen", "Dog"], note: "The silkworm gives us silk." },
];

const EVS_BODY = [
  { prompt: "Which part helps us see?", correct: "Eyes", others: ["Hands", "Ears", "Feet"], note: "Eyes help us see." },
  { prompt: "Which part helps us hear?", correct: "Ears", others: ["Nose", "Toes", "Hair"], note: "Ears help us hear." },
  { prompt: "We smell with our…", correct: "Nose", others: ["Eyes", "Knees", "Elbows"], note: "We smell with our nose." },
  { prompt: "We taste with our…", correct: "Tongue", others: ["Ears", "Nose", "Eyes"], note: "We taste with our tongue." },
  { prompt: "We walk with our…", correct: "Legs", others: ["Ears", "Eyes", "Nose"], note: "We walk with our legs." },
  { prompt: "We hold things with our…", correct: "Hands", others: ["Feet", "Ears", "Nose"], note: "We hold with our hands." },
  { prompt: "How many fingers on one hand?", correct: "5", others: ["3", "4", "6"], note: "One hand has 5 fingers." },
  { prompt: "How many eyes do we have?", correct: "2", others: ["1", "3", "4"], note: "We have 2 eyes." },
  { prompt: "How many ears do we have?", correct: "2", others: ["1", "3", "4"], note: "We have 2 ears." },
  { prompt: "We think with our…", correct: "Brain", others: ["Foot", "Hand", "Ear"], note: "We think with our brain." },
  { prompt: "Teeth help us to…", correct: "Chew", others: ["See", "Hear", "Walk"], note: "Teeth help us chew." },
  { prompt: "Hair grows on our…", correct: "Head", others: ["Feet", "Hands", "Eyes"], note: "Hair grows on our head." },
  { prompt: "We bend our arm at the…", correct: "Elbow", others: ["Knee", "Ear", "Nose"], note: "We bend the arm at the elbow." },
  { prompt: "We bend our leg at the…", correct: "Knee", others: ["Elbow", "Ear", "Nose"], note: "We bend the leg at the knee." },
  { prompt: "Which part beats inside us?", correct: "Heart", others: ["Nose", "Ear", "Toe"], note: "The heart beats inside us." },
  { prompt: "Which part helps us breathe?", correct: "Lungs", others: ["Legs", "Hands", "Hair"], note: "Lungs help us breathe." },
  { prompt: "We wear shoes on our…", correct: "Feet", others: ["Hands", "Head", "Ears"], note: "Shoes go on our feet." },
  { prompt: "We wear a cap on our…", correct: "Head", others: ["Feet", "Hands", "Knees"], note: "A cap goes on our head." },
  { prompt: "We clap with our…", correct: "Hands", others: ["Feet", "Ears", "Eyes"], note: "We clap with our hands." },
  { prompt: "We kick a ball with our…", correct: "Legs", others: ["Hands", "Ears", "Nose"], note: "We kick with our legs." },
  { prompt: "Nails grow on our…", correct: "Fingers", others: ["Ears", "Eyes", "Nose"], note: "Nails grow on our fingers." },
  { prompt: "We blink with our…", correct: "Eyes", others: ["Ears", "Nose", "Mouth"], note: "We blink with our eyes." },
  { prompt: "We speak with our…", correct: "Mouth", others: ["Ears", "Eyes", "Feet"], note: "We speak with our mouth." },
  { prompt: "How many hands do we have?", correct: "2", others: ["1", "3", "4"], note: "We have 2 hands." },
  { prompt: "How many legs do we have?", correct: "2", others: ["1", "3", "4"], note: "We have 2 legs." },
];

const EVS_PLANTS = [
  { prompt: "What does a plant need to grow?", correct: "Water", others: ["Shoes", "Pencil", "Clock"], note: "Plants need water." },
  { prompt: "Which part of a plant is usually green?", correct: "Leaf", others: ["Root", "Stone", "Sand"], note: "Leaves are usually green." },
  { prompt: "Trees give us fresh…", correct: "Air", others: ["Plastic", "Metal", "Glass"], note: "Trees give us fresh air." },
  { prompt: "Which part holds the plant in soil?", correct: "Root", others: ["Leaf", "Flower", "Fruit"], note: "Roots hold the plant." },
  { prompt: "Which part makes seeds?", correct: "Flower", others: ["Root", "Stem", "Leaf"], note: "Flowers help make seeds." },
  { prompt: "Plants need sunlight and…", correct: "Water", others: ["Toys", "Books", "Shoes"], note: "Plants need water and sunlight." },
  { prompt: "A small plant grows from a…", correct: "Seed", others: ["Stone", "Coin", "Toy"], note: "Plants grow from seeds." },
  { prompt: "Which of these is a fruit?", correct: "Apple", others: ["Carrot", "Potato", "Onion"], note: "Apple is a fruit." },
  { prompt: "Which of these is a vegetable?", correct: "Carrot", others: ["Mango", "Banana", "Grapes"], note: "Carrot is a vegetable." },
  { prompt: "The stem carries water to the…", correct: "Leaves", others: ["Shoes", "Roof", "Road"], note: "The stem carries water to the leaves." },
  { prompt: "Which part of a plant do we smell?", correct: "Flower", others: ["Root", "Stem", "Stone"], note: "We smell the flower." },
  { prompt: "A tall plant with a hard stem is a…", correct: "Tree", others: ["Grass", "Weed", "Moss"], note: "A tree has a hard stem." },
  { prompt: "Where do most plants grow?", correct: "Soil", others: ["Air", "Metal", "Glass"], note: "Most plants grow in soil." },
  { prompt: "Which season helps flowers bloom?", correct: "Spring", others: ["Winter", "Night", "Storm"], note: "Flowers bloom in spring." },
  { prompt: "Leaves make food using…", correct: "Sunlight", others: ["Darkness", "Plastic", "Sand"], note: "Leaves make food using sunlight." },
  { prompt: "Which is a green vegetable?", correct: "Spinach", others: ["Apple", "Mango", "Banana"], note: "Spinach is a green vegetable." },
  { prompt: "A rose is a kind of…", correct: "Flower", others: ["Fruit", "Root", "Stone"], note: "A rose is a flower." },
  { prompt: "We should water plants to keep them…", correct: "Alive", others: ["Dry", "Broken", "Empty"], note: "Water keeps plants alive." },
  { prompt: "Which gives shade on a hot day?", correct: "Tree", others: ["Rock", "Road", "Wall"], note: "A tree gives shade." },
  { prompt: "Which part do we eat in a mango?", correct: "Fruit", others: ["Root", "Leaf", "Stem"], note: "We eat the fruit of a mango." },
  { prompt: "Grass is usually what colour?", correct: "Green", others: ["Blue", "Red", "Black"], note: "Grass is green." },
  { prompt: "Which part is under the ground?", correct: "Root", others: ["Flower", "Leaf", "Fruit"], note: "Roots are under the ground." },
  { prompt: "Plants clean our…", correct: "Air", others: ["Shoes", "Toys", "Books"], note: "Plants clean the air." },
  { prompt: "Which of these grows on trees?", correct: "Mango", others: ["Potato", "Onion", "Carrot"], note: "Mangoes grow on trees." },
  { prompt: "We should not pluck too many…", correct: "Flowers", others: ["Stones", "Toys", "Books"], note: "We should not pluck too many flowers." },
];

const EVS_CLEAN = [
  { prompt: "Where do we throw waste paper?", correct: "Dustbin", others: ["Floor", "Bed", "Plate"], note: "The dustbin keeps our place clean." },
  { prompt: "When should we wash our hands?", correct: "Before eating", others: ["Never", "Only at night", "After sleeping"], note: "Wash hands before eating." },
  { prompt: "How often should we brush our teeth?", correct: "Every day", others: ["Once a year", "Never", "Only on holidays"], note: "Brush every day." },
  { prompt: "We take a bath to stay…", correct: "Clean", others: ["Dirty", "Tired", "Hungry"], note: "A bath keeps us clean." },
  { prompt: "We should cut our nails to keep them…", correct: "Clean", others: ["Long", "Dirty", "Sharp"], note: "Short nails stay clean." },
  { prompt: "We cover our mouth when we…", correct: "Cough", others: ["Walk", "Read", "Sleep"], note: "Cover your mouth when you cough." },
  { prompt: "We should drink clean…", correct: "Water", others: ["Mud", "Oil", "Sand"], note: "Drink clean water." },
  { prompt: "Dirty hands can make us…", correct: "Sick", others: ["Happy", "Strong", "Tall"], note: "Dirty hands can make us sick." },
  { prompt: "We wash clothes to keep them…", correct: "Clean", others: ["Torn", "Wet", "Dirty"], note: "Washing keeps clothes clean." },
  { prompt: "We should keep our classroom…", correct: "Tidy", others: ["Messy", "Dark", "Noisy"], note: "Keep the classroom tidy." },
  { prompt: "We use soap when we…", correct: "Wash hands", others: ["Sleep", "Read", "Run"], note: "Use soap to wash hands." },
  { prompt: "We comb our…", correct: "Hair", others: ["Feet", "Teeth", "Ears"], note: "We comb our hair." },
  { prompt: "After playing we should wash our…", correct: "Hands", others: ["Books", "Toys", "Shoes"], note: "Wash hands after playing." },
  { prompt: "We should throw banana peels in the…", correct: "Dustbin", others: ["Road", "River", "Bed"], note: "Peels go in the dustbin." },
  { prompt: "Brushing keeps our teeth…", correct: "Strong", others: ["Weak", "Yellow", "Broken"], note: "Brushing keeps teeth strong." },
  { prompt: "We should keep our nails…", correct: "Short", others: ["Long", "Dirty", "Painted"], note: "Keep nails short and clean." },
  { prompt: "A clean home keeps us…", correct: "Healthy", others: ["Sick", "Sad", "Sleepy"], note: "A clean home keeps us healthy." },
  { prompt: "We should not spit on the…", correct: "Road", others: ["Dustbin", "Sink", "Toilet"], note: "Do not spit on the road." },
  { prompt: "We wear clean clothes to look…", correct: "Neat", others: ["Untidy", "Dirty", "Torn"], note: "Clean clothes look neat." },
  { prompt: "We should bathe with…", correct: "Water", others: ["Sand", "Mud", "Oil"], note: "We bathe with water." },
  { prompt: "Germs are washed away by…", correct: "Soap", others: ["Dust", "Mud", "Sand"], note: "Soap washes away germs." },
  { prompt: "We should keep flies away from…", correct: "Food", others: ["Books", "Toys", "Shoes"], note: "Keep flies away from food." },
  { prompt: "We should sweep the floor to remove…", correct: "Dust", others: ["Water", "Air", "Light"], note: "Sweeping removes dust." },
  { prompt: "We should wash fruits before we…", correct: "Eat", others: ["Throw", "Hide", "Kick"], note: "Wash fruits before eating." },
  { prompt: "Clean water is safe to…", correct: "Drink", others: ["Waste", "Spill", "Throw"], note: "Clean water is safe to drink." },
];

const EVS_FOOD = [
  { prompt: "Which one is a fruit?", correct: "Apple", others: ["Carrot", "Potato", "Onion"], note: "Apple is a fruit." },
  { prompt: "Which food is good for strong bones?", correct: "Milk", others: ["Candy", "Chips", "Soda"], note: "Milk builds strong bones." },
  { prompt: "Which is a vegetable?", correct: "Carrot", others: ["Banana", "Mango", "Grapes"], note: "Carrot is a vegetable." },
  { prompt: "Which drink is the healthiest?", correct: "Water", others: ["Soda", "Cola", "Syrup"], note: "Water is the healthiest drink." },
  { prompt: "Which food gives us energy?", correct: "Rice", others: ["Stone", "Paper", "Sand"], note: "Rice gives us energy." },
  { prompt: "Which is a healthy snack?", correct: "Fruit", others: ["Candy", "Chips", "Toffee"], note: "Fruit is a healthy snack." },
  { prompt: "Which one is sweet?", correct: "Mango", others: ["Chilli", "Salt", "Lemon"], note: "Mango is sweet." },
  { prompt: "Which one is sour?", correct: "Lemon", others: ["Sugar", "Milk", "Rice"], note: "Lemon is sour." },
  { prompt: "Which food comes from a cow?", correct: "Milk", others: ["Rice", "Apple", "Bread"], note: "Milk comes from a cow." },
  { prompt: "Bread is made from…", correct: "Wheat", others: ["Stone", "Sand", "Metal"], note: "Bread is made from wheat." },
  { prompt: "Which is a green vegetable?", correct: "Spinach", others: ["Apple", "Mango", "Banana"], note: "Spinach is a green vegetable." },
  { prompt: "Which food should we eat less?", correct: "Candy", others: ["Fruit", "Vegetables", "Milk"], note: "We should eat less candy." },
  { prompt: "Which fruit is yellow and long?", correct: "Banana", others: ["Apple", "Grapes", "Cherry"], note: "A banana is yellow and long." },
  { prompt: "Which one is a grain?", correct: "Rice", others: ["Apple", "Carrot", "Milk"], note: "Rice is a grain." },
  { prompt: "Eggs come from a…", correct: "Hen", others: ["Cow", "Goat", "Dog"], note: "Eggs come from a hen." },
  { prompt: "Which fruit is round and red?", correct: "Apple", others: ["Banana", "Grapes", "Lemon"], note: "An apple is round and red." },
  { prompt: "Which is good for our eyes?", correct: "Carrot", others: ["Candy", "Chips", "Soda"], note: "Carrots are good for the eyes." },
  { prompt: "We should eat fruits and…", correct: "Vegetables", others: ["Toffee", "Chips", "Ice cream"], note: "Eat fruits and vegetables." },
  { prompt: "Which one grows on a tree?", correct: "Mango", others: ["Potato", "Onion", "Carrot"], note: "Mangoes grow on trees." },
  { prompt: "Honey is made by…", correct: "Bees", others: ["Cows", "Hens", "Dogs"], note: "Honey is made by bees." },
  { prompt: "Which food is a vegetable?", correct: "Potato", others: ["Apple", "Banana", "Mango"], note: "Potato is a vegetable." },
  { prompt: "Which one is a drink?", correct: "Juice", others: ["Bread", "Rice", "Apple"], note: "Juice is a drink." },
  { prompt: "Which fruit has many small seeds?", correct: "Grapes", others: ["Apple", "Banana", "Mango"], note: "Grapes grow in bunches." },
  { prompt: "Which meal do we eat in the morning?", correct: "Breakfast", others: ["Dinner", "Lunch", "Supper"], note: "We eat breakfast in the morning." },
  { prompt: "We should wash fruits before we…", correct: "Eat", others: ["Throw", "Hide", "Kick"], note: "Wash fruits before eating." },
];

export const subjects: Subject[] = [
  {
    id: "english",
    title: "English",
    subtitle: "Letters and words",
    color: "blue",
    icon: "abc",
    topics: [
      topic(
        "english",
        "abcd",
        "ABCD",
        "Capital letters",
        "capital-letters",
        englishCapitalQuestions(),
      ),
      topic(
        "english",
        "abcd-small",
        "abcd",
        "Small letters",
        "small-letters",
        englishSmallQuestions(),
      ),
      topic(
        "english",
        "vowels",
        "Vowels",
        "a, e, i, o, u",
        "vowels",
        englishVowelQuestions(),
      ),
      topic(
        "english",
        "rhyming",
        "Rhyming",
        "Words that sound alike",
        "rhyming",
        englishRhymeQuestions(),
      ),
      topic(
        "english",
        "words",
        "Words",
        "Names and things",
        "words",
        englishWordQuestions(),
      ),
      topic(
        "english",
        "sight-words",
        "Sight Words",
        "100 common words",
        "sight-words",
        englishSightWordQuestions(),
        SIGHT_WORDS.length,
      ),
      topic(
        "english",
        "reading",
        "Reading",
        "154 daily words",
        "reading",
        englishReadingWordQuestions(),
        READING_WORDS.length,
      ),
    ],
  },
  {
    id: "hindi",
    title: "Hindi",
    subtitle: "शब्द और पहचान",
    color: "rose",
    icon: "devanagari",
    topics: [
      topic(
        "hindi",
        "swar",
        "स्वर",
        "Vowels",
        "vowels",
        devanagariRecognitionQuestions(HINDI_SWAR, "कौन सा स्वर है", "kaun sa swar hai"),
      ),
      topic(
        "hindi",
        "vyanjan",
        "व्यंजन",
        "Consonants",
        "devanagari",
        devanagariRecognitionQuestions(
          HINDI_VYANJAN,
          "कौन सा व्यंजन है",
          "kaun sa vyanjan hai",
        ),
      ),
      topic(
        "hindi",
        "akshar",
        "अक्षर",
        "Letter recognition",
        "letters",
        devanagariRecognitionQuestions(HINDI_LETTERS, "कौन सा अक्षर है", "kaun sa akshar hai"),
      ),
      topic("hindi", "shabd", "शब्द", "Word building", "words", hindiWordQuestions(0)),
      topic("hindi", "arth", "अर्थ", "Meanings", "meaning", hindiWordQuestions(2)),
    ],
  },
  {
    id: "marathi",
    title: "Marathi",
    subtitle: "शब्द आणि ओळख",
    color: "violet",
    icon: "devanagari",
    topics: [
      topic(
        "marathi",
        "swar",
        "स्वर",
        "Vowels",
        "vowels",
        devanagariRecognitionQuestions(HINDI_SWAR, "कोणता स्वर आहे", "konta swar aahe"),
      ),
      topic(
        "marathi",
        "vyanjan",
        "व्यंजन",
        "Consonants",
        "devanagari",
        devanagariRecognitionQuestions(
          HINDI_VYANJAN,
          "कोणते व्यंजन आहे",
          "konte vyanjan aahe",
        ),
      ),
      topic(
        "marathi",
        "akshar",
        "अक्षर",
        "Letter recognition",
        "letters",
        devanagariRecognitionQuestions(
          HINDI_LETTERS,
          "कोणते अक्षर आहे",
          "konte akshar aahe",
        ),
      ),
      topic("marathi", "shabd", "शब्द", "Words", "words", marathiWordQuestions(0)),
      topic("marathi", "arth", "अर्थ", "Meanings", "meaning", marathiWordQuestions(2)),
    ],
  },
  {
    id: "maths",
    title: "Maths",
    subtitle: "Numbers and shapes",
    color: "green",
    icon: "numbers",
    topics: [
      topic("maths", "numbers", "Numbers", "Counting 1 to 10", "numbers", mathsNumberQuestions()),
      topic(
        "maths",
        "addition",
        "Addition",
        "Putting numbers together",
        "addition",
        mathsAdditionQuestions(),
      ),
      topic(
        "maths",
        "subtraction",
        "Subtraction",
        "Taking away",
        "subtraction",
        mathsSubtractionQuestions(),
      ),
      topic(
        "maths",
        "shapes",
        "Shapes",
        "Circles, squares and more",
        "shapes",
        mathsShapeQuestions(),
      ),
      topic(
        "maths",
        "compare",
        "Compare",
        "Big, small and equal",
        "compare",
        mathsCompareQuestions(),
      ),
    ],
  },
  {
    id: "evs",
    title: "EVS",
    subtitle: "World around us",
    color: "orange",
    icon: "nature",
    topics: [
      topic("evs", "animals", "Animals", "Creatures around us", "animals", factQuestions(EVS_ANIMALS)),
      topic("evs", "body", "My Body", "Parts of the body", "body", factQuestions(EVS_BODY)),
      topic("evs", "plants", "Plants", "Growing green things", "plants", factQuestions(EVS_PLANTS)),
      topic("evs", "clean", "Keep Clean", "Good habits", "clean", factQuestions(EVS_CLEAN)),
      topic("evs", "food", "Food", "Fruits and healthy eating", "food", factQuestions(EVS_FOOD)),
    ],
  },
];

export const subjectIds = subjects.map((subject) => subject.id);

export function getSubjectById(subjectId: string) {
  return subjects.find((subject) => subject.id === subjectId) ?? null;
}

export function getTopicById(subjectId: string, topicId: string) {
  const subject = getSubjectById(subjectId);
  return subject?.topics.find((item) => item.id === topicId) ?? null;
}

export function isSubjectFullyComplete(
  subject: Subject,
  completedTopicIds: string[],
): boolean {
  return subject.topics.every((item) => completedTopicIds.includes(item.id));
}
