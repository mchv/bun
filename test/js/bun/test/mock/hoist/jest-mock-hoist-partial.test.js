// Pattern 7: jest.mock with require() inside factory for partial mocking.
// The factory calls require() to get the real module, then overrides specific exports.
jest.mock("./fixtures/service-isolated.js", () => ({
  ...require("./fixtures/service-isolated.js"),
  fetchData: jest.fn().mockReturnValue({ id: 99, name: "partial-mock" }),
}));

import { fetchData, processData } from "./fixtures/service-isolated.js";

describe("Pattern 7: partial mock with require() in factory", () => {
  test("overridden export uses mock", () => {
    expect(fetchData(1)).toEqual({ id: 99, name: "partial-mock" });
  });

  test("non-overridden export uses real implementation", () => {
    const result = processData({ id: 1 });
    expect(result).toEqual({ id: 1, processed: true });
  });
});
