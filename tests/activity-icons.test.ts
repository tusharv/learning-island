import assert from "node:assert/strict";
import test from "node:test";
import { subjects } from "../data/subjects.ts";

test("every subject and topic has a kid-friendly icon", () => {
  for (const subject of subjects) {
    assert.equal(typeof subject.icon, "string", `${subject.id} subject icon`);
    assert.ok(subject.icon.length > 0, `${subject.id} subject icon`);

    for (const topic of subject.topics) {
      assert.equal(typeof topic.icon, "string", `${subject.id}/${topic.id} topic icon`);
      assert.ok(topic.icon.length > 0, `${subject.id}/${topic.id} topic icon`);
    }
  }
});
