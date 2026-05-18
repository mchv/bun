// Pattern 17: jest.mock with async mock implementations.
// Factory returns functions with mockResolvedValue/mockRejectedValue.
// Hoisting must preserve async mock behavior.
const mockFetch = jest.fn().mockResolvedValue({ status: 200, json: () => ({ data: "mocked" }) });
const mockPost = jest.fn().mockRejectedValue(new Error("network error"));

jest.mock("./fixtures/service.js", () => ({
  fetchData: mockFetch,
  processData: mockPost,
  default: { fetchData: mockFetch, processData: mockPost },
}));

import { fetchData, processData } from "./fixtures/service.js";

describe("Pattern 17: async mock implementations", () => {
  test("mockResolvedValue works after hoisting", async () => {
    const result = await fetchData(1);
    expect(result).toEqual({ status: 200, json: expect.any(Function) });
    expect(mockFetch).toHaveBeenCalledWith(1);
  });

  test("mockRejectedValue works after hoisting", async () => {
    await expect(processData({})).rejects.toThrow("network error");
    expect(mockPost).toHaveBeenCalledWith({});
  });
});
