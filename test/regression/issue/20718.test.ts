import { expect, test } from "bun:test";
import { bunEnv, bunExe, tempDir } from "harness";

// https://github.com/oven-sh/bun/issues/20718
// Bug: dynamic import() of a CJS file (uses module.exports) that itself
// imports from an ESM module throws "Expected CommonJS module to have a function wrapper"

test("dynamic import of CJS file that imports ESM dependency", async () => {
  using dir = tempDir("issue-20718", {
    "package.json": JSON.stringify({ type: "module" }),
    // ESM dependency
    "esm-dep.js": `export const value = 42;`,
    // CJS file that imports the ESM dep and uses module.exports
    "cjs-file.js": `
      import { value } from './esm-dep.js';
      module.exports = { result: value };
    `,
    // Entry point that dynamically imports the CJS file
    "entry.js": `
      const mod = await import('./cjs-file.js');
      console.log(JSON.stringify(mod.default || mod));
    `,
  });

  await using proc = Bun.spawn({
    cmd: [bunExe(), "run", "entry.js"],
    cwd: String(dir),
    env: bunEnv,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    proc.stdout.text(),
    proc.stderr.text(),
    proc.exited,
  ]);

  // Should not throw "Expected CommonJS module to have a function wrapper"
  expect(stderr).not.toContain("Expected CommonJS module to have a function wrapper");
  expect(exitCode).toBe(0);
  expect(JSON.parse(stdout.trim())).toEqual({ result: 42 });
});

test("require() of CJS file that imports ESM dependency", async () => {
  using dir = tempDir("issue-20718-require", {
    // No "type": "module" — so files are CJS by default
    "esm-dep.mjs": `export const value = 99;`,
    // CJS file that imports the ESM dep
    "cjs-file.js": `
      const { value } = require('./esm-dep.mjs');
      module.exports = { result: value };
    `,
    // Entry point
    "entry.js": `
      const mod = require('./cjs-file.js');
      console.log(JSON.stringify(mod));
    `,
  });

  await using proc = Bun.spawn({
    cmd: [bunExe(), "run", "entry.js"],
    cwd: String(dir),
    env: bunEnv,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    proc.stdout.text(),
    proc.stderr.text(),
    proc.exited,
  ]);

  expect(stderr).not.toContain("Expected CommonJS module to have a function wrapper");
  expect(exitCode).toBe(0);
  expect(JSON.parse(stdout.trim())).toEqual({ result: 99 });
});

test("CJS file with import statement and module.exports in type:module project", async () => {
  // This is the pattern from issue #20718 - a file that bun detects as CJS
  // (because of module.exports) but contains import statements
  using dir = tempDir("issue-20718-mixed", {
    "package.json": JSON.stringify({ type: "module" }),
    "dep.js": `export class Builder { constructor() { this.name = 'test'; } }`,
    "mixed.js": `
      import { Builder } from './dep.js';
      module.exports = { d: new Builder() };
    `,
    "entry.js": `import('./mixed.js').then(m => console.log(JSON.stringify(m.default)))`,
  });

  await using proc = Bun.spawn({
    cmd: [bunExe(), "run", "entry.js"],
    cwd: String(dir),
    env: bunEnv,
    stdout: "pipe",
    stderr: "pipe",
  });

  const [stdout, stderr, exitCode] = await Promise.all([
    proc.stdout.text(),
    proc.stderr.text(),
    proc.exited,
  ]);

  expect(stderr).not.toContain("Expected CommonJS module to have a function wrapper");
  expect(stderr).not.toContain("TypeError");
  expect(exitCode).toBe(0);
  expect(JSON.parse(stdout.trim())).toEqual({ d: { name: "test" } });
});
