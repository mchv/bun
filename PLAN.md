# Plan: Fix "Expected CommonJS module to have a function wrapper" for dynamic import of CJS+ESM mixed modules

## Problem Statement

When a file uses `module.exports` (making it CJS) but is loaded via `import()` (dynamic ESM import), AND that file has dependencies that are ESM modules, bun's CJS wrapper fails with:
```
TypeError: Expected CommonJS module to have a function wrapper
```

This is issue [#20718](https://github.com/oven-sh/bun/issues/20718) — the simplest reproduction is:

```js
// a.ts - ESM entry point
import("./b.ts")

// b.ts - mixed: uses module.exports but imports ESM dep
import { SlashCommandBuilder } from '@discordjs/builders';
module.exports = { d: new SlashCommandBuilder() }
```

## Root Cause Hypothesis

Based on reading `src/jsc/bindings/JSCommonJSModule.cpp:172-185`:

1. Bun's transpiler detects `module.exports` and decides the file is CJS
2. It wraps the file in `(function(exports, require, module, __filename, __dirname) { ... })`
3. The wrapped code is evaluated via `JSC::evaluate()`
4. The result is expected to be a callable function object

The bug: when the CJS file contains `import` statements (which bun allows in CJS via its transpiler), the transpiler may:
- Fail to properly wrap the function (syntax issue in the output)
- Or produce an async module (due to top-level await from ESM deps) that can't be synchronously evaluated as a function

The key code path is in `JSCommonJSModule.cpp` line 172:
```cpp
JSValue fnValue = JSC::evaluate(globalObject, code, jsUndefined());
// ...
JSObject* fn = fnValue.getObject();
if (!fn) [[unlikely]] {
    // ERROR: "Expected CommonJS module to have a function wrapper"
}
```

`fnValue` is not an object — it's likely `undefined` or a Promise (if the module became async).

## Approach

1. **Write a failing test** that reproduces #20718 (dynamic import of CJS file with ESM dependency)
2. **Add logging** to see what `fnValue` actually is when the error occurs
3. **Trace the transpiler output** to see if the function wrapper is correctly generated
4. **Fix** either the transpiler (to correctly wrap) or the loader (to handle async CJS modules)

## Files to Modify

- `test/regression/issue/20718.test.ts` — new failing test
- `src/jsc/bindings/JSCommonJSModule.cpp` — the error site
- `src/js_parser/parser.zig` — possibly where CJS detection/wrapping happens
- `src/jsc/bindings/ModuleLoader.cpp` — where module type is determined

## Test Strategy

Create a minimal reproduction that:
1. Has an ESM entry file that does `import("./cjs-file.js")`
2. The CJS file uses `module.exports = { ... }`
3. The CJS file imports from another ESM module
4. Run with `bun run` and verify no error
