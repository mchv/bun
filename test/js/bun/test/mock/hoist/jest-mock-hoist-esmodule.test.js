// Pattern 4: jest.mock with __esModule: true flag.
// Common in TypeScript projects where default exports need special handling.
const mockGetConfig = jest.fn().mockReturnValue("mock-value");

jest.mock("./fixtures/config.js", () => ({
  __esModule: true,
  config: { apiUrl: "https://mock-api.test", timeout: 100, retries: 0 },
  getConfig: mockGetConfig,
  default: { apiUrl: "https://mock-api.test", timeout: 100, retries: 0 },
}));

import config, { getConfig } from "./fixtures/config.js";

describe("Pattern 4: jest.mock with __esModule flag", () => {
  test("named export is mocked", () => {
    expect(getConfig("apiUrl")).toBe("mock-value");
    expect(mockGetConfig).toHaveBeenCalledWith("apiUrl");
  });

  test("default export is mocked", () => {
    expect(config.apiUrl).toBe("https://mock-api.test");
    expect(config.timeout).toBe(100);
  });
});
