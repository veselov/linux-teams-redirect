// The redirect rules and toDesktopUrl() must agree: a URL the rules redirect
// but the hand-off page cannot convert would strand the tab, and a URL the
// page could convert but the rules miss would open in the browser.
// Chrome evaluates regexFilter with RE2; the patterns used here are in the
// subset where RE2 and JavaScript RegExp behave the same.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRules } from '../src/rules.js';
import { toDesktopUrl } from '../src/teams-url.js';
import { CONVERTED, REJECTED } from './cases.mjs';

const rules = buildRules('abcdefghijklmnopabcdefghijklmnop');
const redirected = url => rules.some(r =>
  new RegExp(r.condition.regexFilter, r.condition.isUrlFilterCaseSensitive ? '' : 'i').test(url));

for (const input of [...CONVERTED.map(([i]) => i), ...REJECTED]) {
  test(`rules and converter agree on ${input}`, () => {
    assert.equal(redirected(input), toDesktopUrl(input) !== null);
  });
}

test('redirect target carries the whole original URL in the fragment', () => {
  for (const r of rules) {
    assert.equal(r.action.redirect.regexSubstitution,
      'chrome-extension://abcdefghijklmnopabcdefghijklmnop/src/handoff.html#\\0');
    assert.deepEqual(r.condition.resourceTypes, ['main_frame']);
  }
});
