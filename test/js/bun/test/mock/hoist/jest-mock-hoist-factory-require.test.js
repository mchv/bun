// Pattern 27: Factory function can use require(), builtins, and globals.
// From Jest's integration test: the factory is allowed to call require('path'),
// use Array.from, and access globals — these are not out-of-scope violations.
jest.mock("./fixtures/service.js", () => {
  const path = require("path");
  const array = Array.from({ length: 3 });
  array[0] = path.sep;
  return {
    fetchData: jest.fn().mockReturnValue(array),
    processData: jest.fn(),
    default: { fetchData: jest.fn(), processData: jest.fn() },
  };
});

import { fetchData } from "./fixtures/service.js";

describe("Pattern 27: factory uses require/builtins/globals", () => {
  test("factory can use require() for other modules", () => {
    const result = fetchData();
    expect(result[0]).toBe("/"); // path.sep on unix
  });

  test("factory can use Array.from and other builtins", () => {
    const result = fetchData();
    expect(result).toHaveLength(3);
  });
});
