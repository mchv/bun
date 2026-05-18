// Pattern 16: jest.mock of timer/async modules.
// Mocking 'timers/promises' or modules that return promises.
// The factory returns mock async functions - hoisting must not break async resolution.
const mockSetTimeout = jest.fn().mockResolvedValue(undefined);

jest.mock("timers/promises", () => ({
  setTimeout: mockSetTimeout,
}));

import { setTimeout as sleep } from "timers/promises";

describe("Pattern 16: jest.mock of async/timer module", () => {
  test("mocked setTimeout resolves immediately", async () => {
    await sleep(1000);
    expect(mockSetTimeout).toHaveBeenCalledWith(1000);
  });

  test("mock can be reconfigured for different async behavior", async () => {
    mockSetTimeout.mockResolvedValue("done");
    const result = await sleep(500);
    expect(result).toBe("done");
  });
});
