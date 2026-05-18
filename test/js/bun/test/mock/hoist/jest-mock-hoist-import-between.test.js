// Pattern 22: Import statement between jest.mock calls.
// Real-world pattern from outboxEventsWorker.test.ts:
//   jest.mock('moduleA', () => ({...}));
//   import Foo from 'moduleB';
//   const mockFoo = mock<Foo>({...});
//   jest.mock('moduleB', () => jest.fn(() => mockFoo));
// The import must be hoisted above ALL jest.mocks (standard ESM behavior),
// and jest.mocks must be hoisted above the import of the module they mock.
jest.mock("./fixtures/database.js", () => ({
  db: { query: jest.fn().mockReturnValue([]) },
  Model: { findAll: jest.fn() },
  default: { query: jest.fn().mockReturnValue([]) },
}));

import { logger } from "./fixtures/logger.js";

const mockHandler = jest.fn().mockReturnValue("handled");

jest.mock("./fixtures/handler.js", () => ({
  handleRequest: mockHandler,
  getStatus: jest.fn().mockReturnValue("mock-status"),
  default: { handleRequest: mockHandler, getStatus: jest.fn() },
}));

import { handleRequest, getStatus } from "./fixtures/handler.js";
import { db } from "./fixtures/database.js";

describe("Pattern 22: import between jest.mock calls", () => {
  test("first mock (database) is active", () => {
    expect(db.query("SELECT 1")).toEqual([]);
  });

  test("second mock (handler) uses interleaved variable", () => {
    expect(handleRequest(1)).toBe("handled");
    expect(mockHandler).toHaveBeenCalledWith(1);
  });

  test("non-mocked import (logger) is real", () => {
    // logger was imported between mocks but not mocked itself
    expect(typeof logger.info).toBe("function");
  });

  test("getStatus from second mock works", () => {
    expect(getStatus()).toBe("mock-status");
  });
});
