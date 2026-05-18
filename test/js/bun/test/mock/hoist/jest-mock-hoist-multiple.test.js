// Pattern 3: Multiple jest.mock calls mocking different dependencies.
// All mocks should be hoisted above all imports.
// Uses isolated fixtures to avoid mock leaking from other test files.
const mockDb = { query: jest.fn().mockReturnValue([{ id: 1, value: "mock-db" }]), transaction: jest.fn() };
const mockLogger = { info: jest.fn(), error: jest.fn(), debug: jest.fn() };

jest.mock("./fixtures/logger-isolated.js", () => ({
  logger: mockLogger,
  default: mockLogger,
}));

jest.mock("./fixtures/database-isolated.js", () => ({
  db: mockDb,
  default: mockDb,
}));

import { handleRequest } from "./fixtures/handler-isolated.js";
import { db } from "./fixtures/database-isolated.js";
import { logger } from "./fixtures/logger-isolated.js";

describe("Pattern 3: multiple jest.mock calls", () => {
  test("handler uses mocked database", async () => {
    const result = await handleRequest(1);
    expect(db.query).toHaveBeenCalled();
    expect(result.results).toEqual([{ id: 1, value: "mock-db" }]);
  });

  test("handler uses mocked logger", async () => {
    await handleRequest(1);
    expect(logger.info).toHaveBeenCalled();
  });
});
