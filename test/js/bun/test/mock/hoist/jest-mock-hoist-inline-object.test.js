// Pattern 10: jest.mock with inline object literal (most common pattern).
// The factory returns a plain object with mock values/functions.
jest.mock("./fixtures/database.js", () => ({
  db: {
    query: jest.fn().mockReturnValue([]),
    transaction: jest.fn().mockReturnValue({ commit: jest.fn(), rollback: jest.fn() }),
  },
  Model: {
    findAll: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]),
    findOne: jest.fn().mockResolvedValue({ id: 1, name: "test" }),
    create: jest.fn().mockResolvedValue({ id: 3 }),
    update: jest.fn().mockResolvedValue([1]),
  },
  default: {
    query: jest.fn().mockReturnValue([]),
    transaction: jest.fn(),
  },
}));

import { db, Model } from "./fixtures/database.js";

describe("Pattern 10: inline object literal factory", () => {
  test("db.query returns mocked empty array", () => {
    expect(db.query("SELECT 1")).toEqual([]);
    expect(db.query).toHaveBeenCalledWith("SELECT 1");
  });

  test("Model.findAll returns mocked data", async () => {
    const results = await Model.findAll();
    expect(results).toEqual([{ id: 1 }, { id: 2 }]);
  });

  test("Model.create returns mocked result", async () => {
    const result = await Model.create({ name: "new" });
    expect(result).toEqual({ id: 3 });
  });

  test("transaction mock has commit and rollback", () => {
    const tx = db.transaction();
    expect(tx.commit).toBeDefined();
    expect(tx.rollback).toBeDefined();
  });
});
