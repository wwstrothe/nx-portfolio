// tools/test/jest.setup.ts

/**
 * Jest runs portfolio tests in jsdom.
 * Firebase Auth needs fetch to exist, and jsdom-friendly fetch is easiest via whatwg-fetch.
 */

// TextEncoder/TextDecoder are sometimes missing in jsdom envs
import { TextDecoder, TextEncoder } from 'node:util';
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder as any;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder as any;

// Polyfill fetch/Headers/Request/Response into the global scope (jsdom-compatible)
import 'whatwg-fetch';

