// Pattern 2: Variable defined BEFORE jest.mock, referenced in factory.
// In Jest, only variables prefixed with "mock" are allowed in hoisted factories.
// The variable must be hoisted along with the jest.mock call.
const mockFetchData = jest.fn().mockReturnValue({ id: 1, name: "mocked" });

jest.mock("./fixtures/service.js", () => ({
  fetchData: mockFetchData,
  processData: jest.fn(),
  default: { fetchData: mockFetchData, processData: jest.fn() },
}));

import { fetchData } from "./fixtures/service.js";

describe("Pattern 2: variable before jest.mock referenced in factory", () => {
  test("mock function is used as the module export", () => {
    const result = fetchData(42);
    expect(result).toEqual({ id: 1, name: "mocked" });
    expect(mockFetchData).toHaveBeenCalledWith(42);
  });

  test("mock can be reconfigured between tests", () => {
    mockFetchData.mockReturnValue({ id: 2, name: "updated" });
    expect(fetchData(99)).toEqual({ id: 2, name: "updated" });
  });
});
