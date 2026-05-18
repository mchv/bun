// Pattern 19: Top-level await before jest.mock.
// If top-level await appears before jest.mock, the mock should still be hoisted
// above imports. The await should remain in its original position (after imports).
// The factory should NOT reference the awaited value (it would be undefined at hoist time).
const mockFn = jest.fn().mockReturnValue("mocked");

jest.mock("./fixtures/config.js", () => ({
  config: { apiUrl: "mock-url" },
  getConfig: mockFn,
  default: { apiUrl: "mock-url" },
}));

// This await is NOT referenced in the mock factory, so hoisting is safe
const delay = await Promise.resolve(1);

import { getConfig } from "./fixtures/config.js";

describe("Pattern 19: top-level await with jest.mock", () => {
  test("mock is hoisted above import despite top-level await", () => {
    expect(getConfig("apiUrl")).toBe("mocked");
    expect(mockFn).toHaveBeenCalledWith("apiUrl");
  });

  test("top-level await resolved correctly", () => {
    expect(delay).toBe(1);
  });
});
