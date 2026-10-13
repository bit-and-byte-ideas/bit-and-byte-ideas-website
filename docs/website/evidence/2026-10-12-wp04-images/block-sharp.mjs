// Test hook for WP-04 AC-5: makes every attempt to load sharp (or its native
// @img/* binding) throw, in any Node process started with
//   NODE_OPTIONS="--import=<path>/block-sharp.mjs"
// module.registerHooks covers both import and require (Node 24).
import { registerHooks } from 'node:module';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'sharp' || specifier.startsWith('@img/')) {
      throw new Error(`blocked by block-sharp.mjs: ${specifier}`);
    }
    return nextResolve(specifier, context);
  },
});
