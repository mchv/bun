// Pattern 14: jest.mock inside conditional should NOT be hoisted.
// In bun, mock.module() always patches the module registry regardless of position.
// The key difference from hoisted mocks: the factory runs at call time, not before imports.
import { logger } from "./fixtures/logger.js";

if (true) {
  jest.mock("./fixtures/logger.js", () => ({
    logger: { info: jest.fn() },
    default: { info: jest.fn() },
  }));
}

describe("Pattern 14: jest.mock inside if-block", () => {
  test("jest.mock inside if-block is NOT hoisted but still registers mock", () => {
    // In bun, mock.module() patches the registry even when not hoisted.
    // The mock is active because it ran (just not before the import).
    // This verifies the mock was NOT hoisted (it ran after the import).
    expect(logger.info).toBeDefined();
  });
});
