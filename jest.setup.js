import { TextDecoder, TextEncoder } from 'node:util';

if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = TextEncoder;
}

if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = TextDecoder;
}

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'alert', {
    configurable: true,
    writable: true,
    value: () => {},
  });
}
