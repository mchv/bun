// Test: jest.mock() BEFORE other imports (standard Jest pattern)
// The hoisting should move the dep-before import to the top so mock.module patches resolved bindings.
import { test, expect, jest } from "bun:test";

const mockFn = jest.fn(() => "mocked");

jest.mock("./hoist-fixtures/dep-before.js", () => ({
  getValue: mockFn,
}));

import { getValue } from "./hoist-fixtures/dep-before.js";

test("jest.mock before imports works", () => {
  expect(getValue()).toBe("mocked");
  expect(mockFn).toHaveBeenCalled();
});
