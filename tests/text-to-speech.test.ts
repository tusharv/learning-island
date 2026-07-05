import assert from "node:assert/strict";
import test from "node:test";
import {
  cancelSpeech,
  isSpeechSupported,
  pickEnglishVoice,
  prepareSpeechEngine,
  speakText,
  warmUpSpeechEngine,
} from "../lib/textToSpeech.ts";

test("text-to-speech helpers are safe when speech synthesis is unavailable", () => {
  assert.equal(isSpeechSupported(), false);
  assert.doesNotThrow(() => speakText("hello"));
  assert.doesNotThrow(() => cancelSpeech());
  assert.doesNotThrow(() => speakText("   "));
  assert.doesNotThrow(() => prepareSpeechEngine());
  assert.doesNotThrow(() => warmUpSpeechEngine());
});

test("pickEnglishVoice prefers local English voices", () => {
  const voices = [
    { lang: "hi-IN", localService: true, name: "Hindi" },
    { lang: "en-US", localService: false, name: "US remote" },
    { lang: "en-IN", localService: true, name: "India local" },
  ] as SpeechSynthesisVoice[];

  assert.equal(pickEnglishVoice(voices)?.name, "India local");
});

test("pickEnglishVoice falls back to any English voice", () => {
  const voices = [
    { lang: "fr-FR", localService: true, name: "French" },
    { lang: "en-GB", localService: false, name: "UK" },
  ] as SpeechSynthesisVoice[];

  assert.equal(pickEnglishVoice(voices)?.name, "UK");
});
