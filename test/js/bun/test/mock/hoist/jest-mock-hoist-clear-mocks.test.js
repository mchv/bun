// Pattern 23: jest.clearAllMocks/resetAllMocks in beforeEach.
// These jest.* calls should NOT be hoisted - only jest.mock/jest.unmock are hoisted.
// This tests that the hoisting implementation doesn't over-match on "jest.*" calls.
const mockLogger = { info: jest.fn(), error: jest.fn() };

jest.mock("./fixtures/logger.js", () => ({
  logger: mockLogger,
  default: mockLogger,
}));

import { logger } from "./fixtures/logger.js";

describe("Pattern 23: jest.clearAllMocks not hoisted", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("mock is active after clearAllMocks", () => {
    logger.info("first");
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
  });

  test("mock is cleared between tests", () => {
    // clearAllMocks in beforeEach resets call counts
    logger.info("second");
    expect(mockLogger.info).toHaveBeenCalledTimes(1);
  });
});
