// Pattern 9: jest.mock AFTER imports.
// In Jest, jest.mock is hoisted above imports regardless of where it appears.
// This is the key behavior that makes jest.mock different from mock.module.
import { fetchData } from "./fixtures/service.js";
import { logger } from "./fixtures/logger.js";

jest.mock("./fixtures/service.js", () => ({
  fetchData: jest.fn().mockReturnValue({ id: 0, name: "hoisted-mock" }),
  processData: jest.fn(),
  default: { fetchData: jest.fn(), processData: jest.fn() },
}));

jest.mock("./fixtures/logger.js", () => ({
  logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
  default: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

describe("Pattern 9: jest.mock after imports (hoisting required)", () => {
  test("service mock is active despite being declared after import", () => {
    expect(fetchData(1)).toEqual({ id: 0, name: "hoisted-mock" });
  });

  test("logger mock is active despite being declared after import", () => {
    logger.info("test");
    expect(logger.info).toHaveBeenCalledWith("test");
  });
});
