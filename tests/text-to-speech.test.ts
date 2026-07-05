import assert from "node:assert/strict";
import test from "node:test";
import {
  cancelSpeech,
  isSpeechSupported,
  speakText,
} from "../lib/textToSpeech.ts";

test("text-to-speech helpers are safe when speech synthesis is unavailable", () => {
  assert.equal(isSpeechSupported(), false);
  assert.doesNotThrow(() => speakText("hello"));
  assert.doesNotThrow(() => cancelSpeech());
  assert.doesNotThrow(() => speakText("   "));
});
