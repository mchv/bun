// Pattern 8: jest.mock with no factory argument (auto-mock).
// Jest automatically mocks all exports with jest.fn().
// Bun requires a factory function — auto-mock is not yet supported.
// TODO: implement auto-mock in bun
import { test, describe } from "bun:test";

describe.skip("Pattern 8: jest.mock without factory (auto-mock)", () => {
  test("all exports should be mocked as jest.fn()", () => {});
  test("object exports should have mocked methods", () => {});
});
