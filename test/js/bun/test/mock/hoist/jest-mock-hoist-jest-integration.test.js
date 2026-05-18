// Pattern 25: Tests adapted from Jest's babel-plugin-jest-hoist integration tests.
// These cover edge cases that Jest's own test suite validates.

// Imports come first — jest.mock calls below should be hoisted above them
import { fetchData } from "./fixtures/service.js";
import { logger } from "./fixtures/logger.js";
import { config } from "./fixtures/config-unmocked.js";

// These should all be hoisted above imports
jest.mock("./fixtures/service.js", () => ({
  fetchData: jest.fn().mockReturnValue({ id: 1, name: "hoisted" }),
  processData: jest.fn(),
  default: { fetchData: jest.fn(), processData: jest.fn() },
}));

jest.mock("./fixtures/logger.js", () => ({
  logger: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
  default: { info: jest.fn(), error: jest.fn(), debug: jest.fn() },
}));

// This should NOT be hoisted (chained with non-mock method)
// jest.unmock('./fixtures/config.js').dontMock('./fixtures/other.js');

// This should NOT be hoisted (string concatenation = dynamic path)
// jest.mock('./fixtures/' + 'config.js', () => ({}));

// Local jest variable in block scope should NOT be hoisted
{
  const jest = { mock: () => {} };
  jest.mock("./fixtures/config-unmocked.js", () => ({}));
}

// Non-mock-prefixed object with .mock method should not error
const myObject = { mock: () => {} };
myObject.mock("apple", 27);

// Capital M mock prefix should work (case-insensitive)
const MockHandler = jest.fn().mockReturnValue("mock-handler");

describe("Pattern 25: Jest integration test patterns", () => {
  test("jest.mock is hoisted above imports", () => {
    expect(fetchData(1)).toEqual({ id: 1, name: "hoisted" });
  });

  test("multiple jest.mock calls are all hoisted", () => {
    logger.info("test");
    expect(logger.info).toHaveBeenCalledWith("test");
  });

  test("config is NOT mocked (block-scoped jest.mock was not hoisted)", () => {
    expect(config.apiUrl).toBe("https://real-api.example.com");
  });

  test("non-jest objects with .mock method don't interfere", () => {
    expect(myObject.mock).toBeFunction();
  });

  test("Capital-M mock prefix variables are hoisted", () => {
    expect(MockHandler).toBeFunction();
    expect(MockHandler()).toBe("mock-handler");
  });
});
