import assert from "node:assert/strict";
import test from "node:test";
import { subjects } from "../data/subjects.ts";
import { buildAppChromeContext } from "../lib/breadcrumbs.ts";

test("map page shows only Learning Island with no back action", () => {
  const context = buildAppChromeContext({ page: "map" });

  assert.equal(context.back, null);
  assert.equal(context.crumbs.length, 1);
  assert.equal(context.crumbs[0]?.label, "Learning Island");
  assert.equal(context.crumbs[0]?.current, true);
});

test("subject page links back to the map", () => {
  const context = buildAppChromeContext({
    page: "subject",
    subject: {
      id: "english",
      title: "English",
      subtitle: "Letters and words",
      color: "blue",
      icon: "abc",
      topics: [],
    },
  });

  assert.equal(context.back?.label, "Map");
  assert.equal(context.back?.href, "/");
  assert.deepEqual(
    context.crumbs.map((crumb) => crumb.label),
    ["Home", "English"],
  );
});

test("hub learn and test crumbs include the topic trail", () => {
  const subject = {
    id: "english",
    title: "English",
    subtitle: "Letters and words",
    color: "blue",
    icon: "abc",
    topics: [],
  };
  const topic = {
    id: "sight-words",
    title: "Sight Words",
    subtitle: "100 common words",
    icon: "sight-words" as const,
    questions: [],
  };

  const learn = buildAppChromeContext({
    page: "learn",
    subject,
    topic,
  });
  const quiz = buildAppChromeContext({
    page: "quiz",
    subject,
    topic,
  });

  assert.equal(learn.back?.label, "Sight Words");
  assert.deepEqual(
    learn.crumbs.map((crumb) => crumb.label),
    ["Home", "English", "Sight Words", "Learn"],
  );
  assert.deepEqual(
    quiz.crumbs.map((crumb) => crumb.label),
    ["Home", "English", "Sight Words", "Test"],
  );
});

test("quiz routes for standard topics link back to the subject", () => {
  const subject = subjects.find((item) => item.id === "maths");
  const topic = subject?.topics.find((item) => item.id === "numbers");

  assert.ok(subject);
  assert.ok(topic);

  const context = buildAppChromeContext({
    page: "quiz",
    subject,
    topic,
  });

  assert.equal(context.back?.label, "Numbers");
  assert.equal(context.back?.href, "/maths");
  assert.equal(context.crumbs.at(-1)?.label, "Quiz");
});
