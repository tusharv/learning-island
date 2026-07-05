export const SECOND_EMOJIS = ["🌟", "💡", "🎯", "👀", "📚", "🌈"];

const META_PATTERNS =
  /word list|clap your hands|on the board|in class today|on the page|out loud|listen for "|read the word|teacher wrote|story book|read about|easy to read|can spell|please (?:the|she|he|we|you|smoke|water|rain|mango|it)/i;

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsWord(text, word) {
  return new RegExp(`\\b${escapeRegExp(word)}\\b`, "i").test(text);
}

function isUsableSentence(text, word) {
  const trimmed = text?.trim();

  if (!trimmed || trimmed.length < 8 || trimmed.length > 90) {
    return false;
  }

  if (!containsWord(trimmed, word)) {
    return false;
  }

  if (META_PATTERNS.test(trimmed)) {
    return false;
  }

  return true;
}

function addCandidate(pool, text, word) {
  if (!isUsableSentence(text, word)) {
    return;
  }

  const key = text.trim().replace(/\s+/g, " ").toLowerCase();
  pool.set(key, text.trim().replace(/\s+/g, " "));
}

function swapSheHe(sentence) {
  if (/^She\b/.test(sentence)) {
    return sentence.replace(/^She\b/, "He");
  }
  if (/^He\b/.test(sentence)) {
    return sentence.replace(/^He\b/, "She");
  }
  return null;
}

function swapIWe(sentence) {
  if (/\b(my|mine|our|ours)\b/i.test(sentence)) {
    return null;
  }
  if (/^I am\b/.test(sentence)) {
    return sentence.replace(/^I am\b/, "We are");
  }
  if (/^We are\b/.test(sentence)) {
    return sentence.replace(/^We are\b/, "I am");
  }
  if (/^I\b/.test(sentence)) {
    return sentence.replace(/^I\b/, "We");
  }
  if (/^We\b/.test(sentence)) {
    return sentence.replace(/^We\b/, "I");
  }
  return null;
}

function swapLookSee(sentence) {
  if (/^Look\b/.test(sentence)) {
    return sentence.replace(/^Look\b/, "See");
  }
  if (/^See\b/.test(sentence)) {
    return sentence.replace(/^See\b/, "Look");
  }
  return null;
}

function trueImperativeVariant(sentence) {
  const trimmed = sentence.replace(/\.$/, "");

  if (
    trimmed.startsWith("Please") ||
    trimmed.startsWith("Do not") ||
    trimmed.startsWith("Don't")
  ) {
    return null;
  }

  const imperativeStarts =
    /^(Blow|Stop|Press|Stir|Brush|Close|Open|Wash|Plant|Run|Sit|Stand|Swim|Throw|Send|Ask|Sweep|Clap|Shift|Spell|Print|Drop|Bend|Bring|Crush|Slide|Greet|Shout|Look|See|Can you)\b/i;

  if (!imperativeStarts.test(trimmed)) {
    return null;
  }

  return `Please ${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}.`;
}

function deriveFromPrimary(word, primary) {
  const results = [];
  const p = primary.replace(/\.$/, "");
  const lower = p.toLowerCase();

  if (/ rose from /.test(p)) {
    const [, rest] = p.split(/ rose from /i);
    results.push(`There was ${word} near the ${rest.toLowerCase()}.`);
  }

  if (/ came from /.test(p)) {
    results.push(`I watched the ${word} pour out.`);
  }

  if (/ lit up /.test(p)) {
    results.push(`The bright ${word} warmed the room.`);
  }

  if (/ flew high/.test(p)) {
    results.push(`Our ${word} waved in the wind.`);
  }

  if (/ is very /.test(p)) {
    results.push(`That path is very ${word}.`);
  }

  if (/ sat on /.test(p)) {
    results.push(`We rested on the soft ${word}.`);
  }

  if (/ with a /.test(p)) {
    results.push(`I ate soup with a ${word}.`);
  }

  if (/ in the /.test(p) && !/\bsleep\b/i.test(p)) {
    results.push(`We played in the ${word}.`);
  }

  if (/ in my /.test(p)) {
    results.push(`I rest in my cosy bed.`);
  }

  if (/ made my hair /.test(p)) {
    results.push(`Rain made my hair ${word}.`);
  }

  if (/^You are /.test(p)) {
    results.push(`My sister is very ${word}.`);
  }

  if (/^Do not /.test(p)) {
    results.push(`We stay quiet and do not ${word}.`);
  }

  if (/^I smell /.test(p)) {
    results.push(`We smell fresh bread baking.`);
  }

  if (/^The .* is /.test(p)) {
    results.push(`This fruit is very ${word}.`);
  }

  if (/ planted seeds/.test(p)) {
    results.push(`Seeds grew in the garden ${word}.`);
  }

  if (/ gave a little /.test(p)) {
    results.push(`A soft ${word} showed on her face.`);
  }

  if (/^Press the /.test(p)) {
    results.push(`Use the ${word} to stop safely.`);
  }

  if (/^Water came/.test(p)) {
    results.push(`Hot water shot from the ${word}.`);
  }

  if (/^Gave a quick/.test(p) || / quick wave/.test(p)) {
    results.push(`She gave a quick ${word} hello.`);
  }

  if (lower.startsWith("the ") && lower.includes(word.toLowerCase())) {
    results.push(`I saw the ${word} outside.`);
  }

  if (lower.startsWith("a ") && lower.includes(word.toLowerCase())) {
    results.push(`There is a ${word} in the yard.`);
  }

  return results;
}

function exampleFromUsage(word, usage) {
  const trimmed = usage.replace(/\.$/, "");

  if (/^Use \w+ at the table\.?$/i.test(usage)) {
    return `I eat rice with a ${word}.`;
  }
  if (/^Use \w+ when you need to stop\.?$/i.test(usage)) {
    return `The ${word} stopped the bike.`;
  }
  if (/^Use \w+ when you rise up\.?$/i.test(usage)) {
    return `We ${word} up straight.`;
  }
  if (/^Use \w+ with a broom\.?$/i.test(usage)) {
    return `Mom uses a broom to ${word}.`;
  }
  if (/^Use \w+ with the word I\.?$/i.test(usage)) {
    return `I ${word} ready for school.`;
  }
  if (/^Use \w+ before an action word/.test(trimmed)) {
    return `I ${word} run fast.`;
  }
  if (/^Say \w+ when it is time for bed\.?$/i.test(usage)) {
    return `The baby went to ${word}.`;
  }
  if (/^Say \w+ when cheeks look rosy\.?$/i.test(usage)) {
    return `Her cheeks had a pink ${word}.`;
  }
  if (/^Say \w+ when something is burning\.?$/i.test(usage)) {
    return `Gray ${word} came from the fire.`;
  }

  return null;
}

function exampleFromMeaning(word, meaning) {
  const lower = meaning.toLowerCase();

  if (lower.includes("colour") || lower.includes("color")) {
    return `My crayon is ${word}.`;
  }

  if (lower.includes("animal") || lower.includes("bird") || lower.includes("fish")) {
    return `We saw a ${word} at the zoo.`;
  }

  if (lower.includes("food") || lower.includes("fruit") || lower.includes("eat")) {
    return `I like to eat ${word}.`;
  }

  if (lower.startsWith("a ") || lower.startsWith("an ")) {
    return `There is a ${word} in our room.`;
  }

  if (lower.includes("sound")) {
    return `I heard a ${word} in the park.`;
  }

  return null;
}

export function buildKidExampleSentences(word, meaning, usage, primary) {
  const pool = new Map();

  addCandidate(pool, primary, word);

  for (const candidate of [
    swapSheHe(primary),
    swapIWe(primary),
    swapLookSee(primary),
    trueImperativeVariant(primary),
    exampleFromUsage(word, usage),
    exampleFromMeaning(word, meaning),
    ...deriveFromPrimary(word, primary),
  ]) {
    addCandidate(pool, candidate, word);
  }

  if (pool.size < 3) {
    console.warn(`Only ${pool.size} examples for "${word}" — add explicit extras.`);
  }

  return [...pool.values()].slice(0, 3);
}

export function buildExamples(
  word,
  primary,
  emojiMap,
  fallbackEmoji = "📖",
  meaning = "",
  usage = "",
  explicitExtras = [],
) {
  const emoji = emojiMap[word] ?? fallbackEmoji;
  const hash = word.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  let texts;

  if (explicitExtras.length >= 2) {
    texts = [primary, explicitExtras[0], explicitExtras[1]];
  } else {
    texts = buildKidExampleSentences(word, meaning, usage, primary);
  }

  const unique = [];
  const seen = new Set();

  for (const text of texts) {
    const key = text.trim().toLowerCase();
    if (seen.has(key) || !isUsableSentence(text, word)) {
      continue;
    }
    seen.add(key);
    unique.push(text.trim());
  }

  while (unique.length < 3 && explicitExtras.length >= 2) {
    break;
  }

  return {
    emoji,
    examples: unique.slice(0, 3).map((text, index) => ({
      emoji:
        index === 0 ? emoji : SECOND_EMOJIS[(hash + index) % SECOND_EMOJIS.length],
      text,
    })),
  };
}
