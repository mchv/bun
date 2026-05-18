// Test: jest.mock() edge cases for hoisting
import { test, expect, jest } from "bun:test";

// Test: multiple jest.mock calls with imports after them
jest.mock("./hoist-fixtures/dep-before.js", () => ({ getValue: () => "mocked-a" }));
jest.mock("./hoist-fixtures/dep-partial.js", () => ({ realFn: () => "mocked-b", otherFn: () => "mocked-c" }));
import { getValue } from "./hoist-fixtures/dep-before.js";
import { realFn } from "./hoist-fixtures/dep-partial.js";

test("multiple jest.mock calls before imports all work", () => {
  expect(getValue()).toBe("mocked-a");
  expect(realFn()).toBe("mocked-b");
});

test("relative order of mocks is preserved", () => {
  // Both mocks should be active — the second didn't overwrite the first
  expect(getValue()).toBe("mocked-a");
  expect(realFn()).toBe("mocked-b");
});
