// Test: jest.mock hoisting — import variant coverage and no-op cases
import { test, expect, jest, describe } from "bun:test";

// === Case 1: jest.mock AFTER imports (no reordering needed, should still work) ===
import { getValue } from "./hoist-fixtures/dep-before.js";
jest.mock("./hoist-fixtures/dep-before.js", () => ({ getValue: () => "after-mock" }));

test("jest.mock after imports still works (mock patches resolved bindings)", () => {
  expect(getValue()).toBe("after-mock");
});

// === Case 2: default import with jest.mock factory ===
jest.mock("./hoist-fixtures/dep-default.js", () => ({
  default: "mocked-default",
  named: "mocked-named",
}));
import depDefault, { named } from "./hoist-fixtures/dep-default.js";

test("default import with jest.mock factory", () => {
  expect(depDefault).toBe("mocked-default");
  expect(named).toBe("mocked-named");
});

// === Case 3: namespace import with jest.mock factory ===
jest.mock("./hoist-fixtures/dep-partial.js", () => ({
  realFn: () => "ns-mocked",
  otherFn: () => "ns-other",
}));
import * as ns from "./hoist-fixtures/dep-partial.js";

test("namespace import with jest.mock factory", () => {
  expect(ns.realFn()).toBe("ns-mocked");
  expect(ns.otherFn()).toBe("ns-other");
});
