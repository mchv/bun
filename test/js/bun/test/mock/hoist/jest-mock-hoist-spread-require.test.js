// Pattern 24: jest.mock with ...require() spread for partial mock.
// Real-world pattern from enquiryComputedFieldsWorker:
//   jest.mock('@motorway/motorway-api-provider', () => ({
//     ...require('@motorway/motorway-api-provider'),
//     content: { installContentIntegration: jest.fn() },
//   }));
// The require() inside the factory must resolve to the REAL module,
// not the mock (avoiding circular reference).
jest.mock("./fixtures/config.js", () => ({
  ...require("./fixtures/config.js"),
  getConfig: jest.fn().mockReturnValue("overridden"),
}));

import { config, getConfig } from "./fixtures/config.js";

describe("Pattern 24: spread require in factory (partial mock)", () => {
  test("overridden export uses mock", () => {
    expect(getConfig("x")).toBe("overridden");
  });

  test("non-overridden exports preserve real values", () => {
    // config object should have real values from the spread
    expect(config.apiUrl).toBe("https://real-api.example.com");
    expect(config.timeout).toBe(5000);
  });
});
