import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toDesktopUrl } from '../src/teams-url.js';
import { CONVERTED, REJECTED } from './cases.mjs';

for (const [input, expected] of CONVERTED) {
  test(`converts ${input}`, () => {
    assert.equal(toDesktopUrl(input), expected);
  });
}

for (const input of REJECTED) {
  test(`rejects ${input}`, () => {
    assert.equal(toDesktopUrl(input), null);
  });
}
