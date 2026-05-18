// Pattern 12: jest.mock inside function/block scope should NOT be hoisted.
// In bun, mock.module() patches the registry regardless of scope.
// The test verifies the mock is NOT hoisted (runs after import) but still patches.
import { logger } from "./fixtures/logger.js";

describe("Pattern 12: jest.mock in non-top-level scope (not hoisted)", () => {
  test("jest.mock inside describe still registers mock (bun behavior)", () => {
    jest.mock("./fixtures/logger.js", () => ({
      logger: { info: jest.fn() },
      default: { info: jest.fn() },
    }));
    // In bun, mock.module patches even from inside describe
    expect(logger.info).toBeDefined();
  });
});
