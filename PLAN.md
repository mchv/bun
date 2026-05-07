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

## Root Cause (Confirmed)

The bug is in the **transpiler → CJS wrapper pipeline**:

1. A file has both `import` statements AND `module.exports`
2. Bun's parser detects `module.exports` and flags the file as CJS (`uses_module_ref = true`)
3. The transpiler keeps the `import` statements as-is (doesn't convert to `require()`)
4. `JSCommonJSModule.cpp:721` wraps the code in `(function(exports,require,module,__filename,__dirname){ ... })`
5. The resulting code has `import` inside a function — **invalid JavaScript**
6. JSC evaluates it and returns something that's not a callable function
7. Line 178 checks `fn.getObject()` → null → throws the error

**Key finding**: `src/js_parser/ast/P.zig:217` has a `legacy_cjs_import_stmts` field that was designed to handle this case, but it's **never populated** — only declared and initialized empty.

## Fix Strategy

The fix should be in the transpiler/printer: when outputting a CJS module (one that will be wrapped in a function), any `import` statements must be converted to `require()` calls. This is what Node.js does — you can't have `import` inside a CJS module.

Two possible approaches:

### Approach A: Convert imports to require in the printer (simpler)
When `uses_module_ref` is true and the output format is CJS (Program type), convert all `import { x } from 'y'` to `const { x } = require('y')` in the printer stage.

### Approach B: Detect the conflict earlier in the parser
When the parser sees both `import` and `module.exports`, either:
- Treat the file as ESM (ignore `module.exports`, convert to `export default`)
- Or convert imports to require during parsing (populate `legacy_cjs_import_stmts`)

Approach A is simpler and less risky. The printer already has access to `uses_module_ref` and can conditionally emit `require()` instead of `import`.

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
