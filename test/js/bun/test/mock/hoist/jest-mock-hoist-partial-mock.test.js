// Test: jest.mock with ...require() factory BEFORE imports (partial mock pattern)
import { test, expect, jest } from "bun:test";

const mockFn = jest.fn(() => "mocked");

jest.mock("./hoist-fixtures/dep-partial-isolated.js", () => ({
  ...require("./hoist-fixtures/dep-partial-isolated.js"),
  realFn: mockFn,
}));

import { realFn, otherFn } from "./hoist-fixtures/dep-partial-isolated.js";

test("partial mock: overridden function is mocked", () => {
  expect(realFn()).toBe("mocked");
});

test("partial mock: non-overridden function returns real value", () => {
  expect(otherFn()).toBe("other");
});
