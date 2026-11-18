// declarativeNetRequest rules that send top-level navigations to Teams deep
// links to the extension's hand-off page, with the original URL in the
// fragment. The regexes must accept exactly what toDesktopUrl() accepts;
// test/rules.test.mjs checks the two against each other.
//
// One rule per host and link form: Chrome 156 rejects the same patterns with
// the three hosts in one alternation ("memoryLimitExceeded" from
// declarativeNetRequest.isRegexSupported), and accepts them per host.

import { TEAMS_HOSTS, LINK_KINDS, LAUNCHER_PATH } from './teams-url.js';

const esc = s => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const KINDS = `(?:${LINK_KINDS.map(esc).join('|')})`;

export const deepLinkRegex = host => `^https://${esc(host)}/(?:meet/|l/${KINDS}/).*`;

// In the launcher's `url` parameter the path is percent-encoded:
// "/_#/l/" arrives as "%2F_%23%2Fl%2F". Matching is case-sensitive like
// toDesktopUrl(), except for the hex digits of the escapes.
const SLASH = '%2[Ff]';
export const launcherRegex = host =>
  `^https://${esc(host)}${esc(LAUNCHER_PATH)}\\?(?:.*&)?url=${SLASH}_%23${SLASH}(?:meet${SLASH}|l${SLASH}${KINDS}${SLASH}).*`;

export function buildRules(extensionId) {
  const handoff = `chrome-extension://${extensionId}/src/handoff.html#\\0`;
  const filters = TEAMS_HOSTS.flatMap(host => [deepLinkRegex(host), launcherRegex(host)]);
  return filters.map((regexFilter, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: 'redirect', redirect: { regexSubstitution: handoff } },
    condition: { regexFilter, isUrlFilterCaseSensitive: true, resourceTypes: ['main_frame'] },
  }));
}
