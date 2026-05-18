// Pattern 18: jest.useFakeTimers() combined with jest.mock().
// Both are top-level calls that need to work together.
// jest.useFakeTimers should NOT be hoisted (it's not jest.mock),
// but jest.mock should still be hoisted above imports.
jest.mock("./fixtures/service.js", () => ({
  fetchData: jest.fn().mockImplementation(() => new Promise(resolve => {
    setTimeout(() => resolve({ id: 1, delayed: true }), 1000);
  })),
  processData: jest.fn(),
  default: { fetchData: jest.fn(), processData: jest.fn() },
}));

import { fetchData } from "./fixtures/service.js";

describe("Pattern 18: jest.useFakeTimers with jest.mock", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("mock is active and timer can be advanced", async () => {
    const promise = fetchData(1);
    jest.advanceTimersByTime(1000);
    const result = await promise;
    expect(result).toEqual({ id: 1, delayed: true });
  });
});
