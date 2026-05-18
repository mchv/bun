// Pattern 26: jest.mock with {virtual: true} for non-existent modules.
// From Jest's integration test: jest.mock('virtual-module', () => 'kiwi', {virtual: true})
// Virtual modules don't exist on disk but can be mocked and required.
jest.mock("virtual-test-module", () => ({ value: "virtual" }), { virtual: true });

const virtualModule = require("virtual-test-module");

describe("Pattern 26: virtual module mock", () => {
  test("virtual module returns mocked value", () => {
    expect(virtualModule.value).toBe("virtual");
  });
});
