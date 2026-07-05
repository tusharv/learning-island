export const SECOND_EMOJIS = ["🌟", "💡", "🎯", "👀", "📚", "🌈"];

export function swapSubject(sentence) {
  if (/^I am\b/.test(sentence)) {
    return sentence.replace(/^I am\b/, "We are");
  }
  if (/^We are\b/.test(sentence)) {
    return sentence.replace(/^We are\b/, "I am");
  }
  if (/^She\b/.test(sentence)) {
    return sentence.replace(/^She\b/, "He");
  }
  if (/^He\b/.test(sentence)) {
    return sentence.replace(/^He\b/, "She");
  }
  if (/^I\b/.test(sentence)) {
    return sentence.replace(/^I\b/, "We");
  }
  if (/^We\b/.test(sentence)) {
    return sentence.replace(/^We\b/, "I");
  }
  if (/^The\b/.test(sentence)) {
    return sentence.replace(/^The\b/, "My");
  }
  if (/^My\b/.test(sentence)) {
    return sentence.replace(/^My\b/, "The");
  }
  if (/^Look\b/.test(sentence)) {
    return sentence.replace(/^Look\b/, "See");
  }
  return sentence;
}

export function alternateExample(word, primary, hash) {
  const swapped = swapSubject(primary);
  if (swapped !== primary) {
    return swapped;
  }

  const templates = [
    () => `We read the word ${word} in class today.`,
    () => `Listen for "${word}" in the story.`,
    () => `${word.charAt(0).toUpperCase() + word.slice(1)} is on our word list.`,
    () => `Can you say "${word}" out loud?`,
    () => `Look for "${word}" on the page.`,
    () => `My teacher wrote ${word} on the board.`,
  ];

  return templates[hash % templates.length]();
}

export function buildExamples(word, primary, emojiMap, fallbackEmoji = "📖") {
  const emoji = emojiMap[word] ?? fallbackEmoji;
  const hash = word.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const ex2 = alternateExample(word, primary, hash);
  let ex3 = alternateExample(word, primary, hash + 5);

  if (ex3 === ex2 || ex3 === primary) {
    ex3 = `Clap your hands when you hear "${word}".`;
  }

  return {
    emoji,
    examples: [
      { emoji, text: primary },
      { emoji: SECOND_EMOJIS[hash % SECOND_EMOJIS.length], text: ex2 },
      { emoji: SECOND_EMOJIS[(hash + 3) % SECOND_EMOJIS.length], text: ex3 },
    ],
  };
}
