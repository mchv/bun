// Pattern 21: Mock variable defined BETWEEN jest.mock calls.
// Real-world pattern from outboxEventsWorker.test.ts:
//   jest.mock('moduleA', () => ({...}));
//   const instrumentationMock = { ... jest.fn() ... };
//   jest.mock('moduleB', () => ({ default: () => instrumentationMock }));
// The variable must be hoisted WITH the jest.mock that references it,
// but AFTER the first jest.mock (order matters).
jest.mock("./fixtures/logger.js", () => ({
  logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
  default: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

const mockServiceImpl = {
  fetchData: jest.fn().mockReturnValue({ id: 1 }),
  processData: jest.fn(),
};

jest.mock("./fixtures/service.js", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => mockServiceImpl),
  ...mockServiceImpl,
}));

import { logger } from "./fixtures/logger.js";
import { fetchData } from "./fixtures/service.js";

describe("Pattern 21: mock variable between jest.mock calls", () => {
  test("first mock (logger) is active", () => {
    logger.info("test");
    expect(logger.info).toHaveBeenCalledWith("test");
  });

  test("second mock uses the interleaved variable", () => {
    expect(fetchData(1)).toEqual({ id: 1 });
    expect(mockServiceImpl.fetchData).toHaveBeenCalledWith(1);
  });
});
