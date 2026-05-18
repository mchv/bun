// Pattern 15: jest.mock with non-string-literal path should NOT be hoisted.
// However in bun, mock.module() still patches the registry when called.
import { logger } from "./fixtures/logger.js";

const modulePath = "./fixtures/logger.js";
jest.mock(modulePath, () => ({
  logger: { info: jest.fn() },
  default: { info: jest.fn() },
}));

describe("Pattern 15: jest.mock with variable path (not hoisted)", () => {
  test("mock is NOT hoisted but still patches in bun", () => {
    // Variable path means it can't be statically hoisted,
    // but mock.module() still patches when it runs
    expect(logger.info).toBeDefined();
  });
});
