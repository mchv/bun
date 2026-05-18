// Pattern 13: jest.doMock() should NOT be hoisted.
// jest.doMock is the explicit non-hoisted variant of jest.mock.
// TODO: implement jest.doMock in bun
import { test, describe } from "bun:test";

describe.skip("Pattern 13: jest.doMock should NOT be hoisted", () => {
  test("logger is the real module because doMock was not hoisted", () => {});
});
