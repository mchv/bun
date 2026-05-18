// Pattern 5: jest.mock calls interleaved with imports and other code.
// Jest hoists ALL jest.mock calls above ALL imports regardless of position.

jest.mock("./fixtures/logger.js", () => ({
  logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
  default: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

import { logger } from "./fixtures/logger.js";

jest.mock("./fixtures/config.js", () => ({
  config: { apiUrl: "mock-url" },
  getConfig: jest.fn().mockReturnValue("mock"),
  default: { apiUrl: "mock-url" },
}));

import { config } from "./fixtures/config.js";

describe("Pattern 5: jest.mock interleaved with imports", () => {
  test("logger is mocked even though mock is after bun:test import", () => {
    logger.info("hello");
    expect(logger.info).toHaveBeenCalledWith("hello");
  });

  test("config is mocked even though mock is between imports", () => {
    expect(config.apiUrl).toBe("mock-url");
  });
});
