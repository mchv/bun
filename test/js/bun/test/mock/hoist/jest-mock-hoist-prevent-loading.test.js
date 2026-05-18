// Test: jest.mock with factory — verifies mock value is used correctly.
// NOTE: The real module IS still loaded (side effects run) because bun resolves
// the module graph before transpilation. Preventing real module loading requires
// changes to the module resolver (not just the printer). See:
// ~/.kiro/pr-descriptions/jest-mock-prevent-real-loading-analysis.md
import { test, expect, jest } from "bun:test";

jest.mock("./hoist-fixtures/dep-side-effect.js", () => ({
  sideEffectValue: "mocked",
}));

import { sideEffectValue } from "./hoist-fixtures/dep-side-effect.js";

test("jest.mock with factory returns mock value", () => {
  expect(sideEffectValue).toBe("mocked");
});

// This test documents the current limitation: real module still loads
test.skip("real module side effect did NOT run (requires module resolver changes)", () => {
  expect(globalThis.__dep_side_effect_loaded).toBeUndefined();
});
