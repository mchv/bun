// Pattern 1: Basic jest.mock with factory BEFORE imports
// This is the most common pattern - mock is at the top, imports come after.
// Jest hoists jest.mock() above imports so the mock is active when the module loads.
jest.mock("./fixtures/logger.js", () => ({
  logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
  default: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

import { logger } from "./fixtures/logger.js";


describe("Pattern 1: basic jest.mock with factory before import", () => {
  test("imported module should be the mock", () => {
    expect(logger.info).toBeDefined();
    logger.info("test");
    expect(logger.info).toHaveBeenCalledWith("test");
  });
});
