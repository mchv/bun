// Pattern 11: Non-mock-prefixed variable referenced in factory.
// In bun, the factory is lazy (called when module is first loaded).
// By the time the factory runs, all top-level variables are initialized.
// So non-mock-prefixed variables work fine in bun (unlike Jest which errors).
const myHelper = jest.fn().mockReturnValue("works-in-bun");

jest.mock("./fixtures/logger.js", () => ({
  logger: { info: myHelper },
  default: { info: myHelper },
}));

import { logger } from "./fixtures/logger.js";

describe("Pattern 11: non-mock-prefixed variable in factory", () => {
  test("in bun, non-mock-prefixed vars work in factory (factory is lazy)", () => {
    // Unlike Jest which errors on non-mock-prefixed vars,
    // bun's mock.module factory is lazy so all vars are initialized
    expect(logger.info("test")).toBe("works-in-bun");
    expect(myHelper).toHaveBeenCalledWith("test");
  });
});
