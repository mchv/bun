// Test: cases where hoisting should NOT trigger or should be a no-op
import { test, expect, jest } from "bun:test";
import { getValue } from "./hoist-fixtures/dep-before.js";

// jest.mock with a factory — this is AFTER the import, so no reordering needed
// but the mock should still work (mock.module patches resolved bindings)
jest.mock("./hoist-fixtures/dep-before.js", () => ({ getValue: () => "no-reorder" }));

test("jest.mock after all imports is a no-op reorder but mock still works", () => {
  expect(getValue()).toBe("no-reorder");
});

test("jest.fn and jest.spyOn do NOT trigger hoisting", () => {
  // These should not cause any reordering issues
  const mockFn = jest.fn(() => 42);
  expect(mockFn()).toBe(42);
});
