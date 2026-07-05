import assert from "node:assert/strict";
import test from "node:test";
import { moveFocus } from "../lib/remoteNavigation.ts";

test("horizontal map navigation wraps through five subject islands", () => {
  assert.equal(moveFocus(0, "ArrowLeft", 5, 5), 4);
  assert.equal(moveFocus(4, "ArrowRight", 5, 5), 0);
});

test("two-column answer navigation moves by row and clamps at edges", () => {
  assert.equal(moveFocus(0, "ArrowRight", 4, 2), 1);
  assert.equal(moveFocus(0, "ArrowDown", 4, 2), 2);
  assert.equal(moveFocus(3, "ArrowDown", 4, 2), 3);
  assert.equal(moveFocus(2, "ArrowLeft", 4, 2), 2);
});

test("unknown keys keep the current focus", () => {
  assert.equal(moveFocus(2, "KeyA", 5, 5), 2);
});
