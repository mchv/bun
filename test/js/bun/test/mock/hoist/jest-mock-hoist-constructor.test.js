// Pattern 6: jest.mock returning jest.fn().mockImplementation (class/constructor mocking).
// When mocking a default export as a constructor, wrap in { default: fn }.
const mockProcess = jest.fn();
const MockService = jest.fn().mockImplementation(() => ({
  fetchData: jest.fn().mockReturnValue({ id: 1 }),
  processData: mockProcess,
}));

jest.mock("./fixtures/service.js", () => ({
  default: MockService,
  __esModule: true,
}));

import Service from "./fixtures/service.js";

describe("Pattern 6: jest.mock with mockImplementation (constructor)", () => {
  test("module default export is a mock constructor", () => {
    const instance = new Service();
    expect(instance.fetchData()).toEqual({ id: 1 });
  });

  test("mock functions are accessible for assertions", () => {
    const instance = new Service();
    instance.processData({ x: 1 });
    expect(mockProcess).toHaveBeenCalledWith({ x: 1 });
  });
});
