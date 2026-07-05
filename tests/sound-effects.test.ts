import assert from "node:assert/strict";
import test from "node:test";
import {
  SOUND_EVENTS,
  getSoundPattern,
  parseSoundPreference,
  serializeSoundPreference,
} from "../lib/soundEffects.ts";

test("defines sound patterns for remote and quiz moments", () => {
  assert.deepEqual(SOUND_EVENTS, [
    "move",
    "select",
    "correct",
    "incorrect",
    "complete",
  ]);

  for (const eventName of SOUND_EVENTS) {
    const pattern = getSoundPattern(eventName);
    assert.ok(pattern.length > 0, `${eventName} sound has tones`);

    for (const tone of pattern) {
      assert.ok(tone.frequency > 0, `${eventName} frequency`);
      assert.ok(tone.duration > 0, `${eventName} duration`);
      assert.ok(tone.gain > 0, `${eventName} gain`);
    }
  }

  assert.ok(
    getSoundPattern("complete").length > getSoundPattern("correct").length,
    "completion should feel more celebratory than one correct answer",
  );
});

test("sound preference defaults on and serializes for local storage", () => {
  assert.equal(parseSoundPreference(null), true);
  assert.equal(parseSoundPreference("on"), true);
  assert.equal(parseSoundPreference("off"), false);
  assert.equal(parseSoundPreference("unexpected"), true);
  assert.equal(serializeSoundPreference(true), "on");
  assert.equal(serializeSoundPreference(false), "off");
});
