// Pattern 20: process.env assignment before jest.mock.
// The env assignment must execute BEFORE the mock factory runs,
// because the factory or the mocked module may read process.env.
// Hoisting jest.mock must NOT move it above process.env assignments.
process.env.TEST_API_URL = "http://test-server";

jest.mock("./fixtures/config.js", () => ({
  config: { apiUrl: process.env.TEST_API_URL },
  getConfig: jest.fn().mockReturnValue(process.env.TEST_API_URL),
  default: { apiUrl: process.env.TEST_API_URL },
}));

import { config, getConfig } from "./fixtures/config.js";

describe("Pattern 20: process.env before jest.mock", () => {
  test("factory can read process.env set before it", () => {
    expect(config.apiUrl).toBe("http://test-server");
  });

  test("getConfig returns env value", () => {
    expect(getConfig("x")).toBe("http://test-server");
  });
});
