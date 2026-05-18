// Pattern 28: Shadowed jest variable in block scope.
// From Jest's integration test: if a local variable named 'jest' exists in a block,
// calls on that local variable should NOT be hoisted.
import { logger } from "./fixtures/logger-unmocked.js";

// This block creates a local 'jest' that shadows the global
{
  const jest = { unmock: () => {}, mock: () => {} };
  // This should NOT be hoisted because 'jest' here is the local variable
  jest.mock("./fixtures/logger-unmocked.js", () => ({
    logger: { info: () => "shadowed" },
  }));
}

describe("Pattern 28: shadowed jest variable not hoisted", () => {
  test("logger is real because block-scoped jest.mock was not hoisted", () => {
    expect(typeof logger.info).toBe("function");
    // Real logger doesn't have .mock property
    expect(logger.info.mock).toBeUndefined();
  });
});
