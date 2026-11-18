// Recognises Microsoft Teams web links and converts them to msteams:// links
// for a locally installed Teams client.
//
// The hosts and deep-link paths below are the ones teams-for-linux 2.26.0
// accepts for msteams:// ("v2") links: config `msTeamsProtocols.v2` in
// /opt/teams-for-linux/resources/app.asar. teams-for-linux turns such a link
// back into https by replacing the scheme (`processArgs`, same file).

export const TEAMS_HOSTS = ['teams.microsoft.com', 'teams.live.com', 'teams.cloud.microsoft'];

export const LINK_KINDS = [
  'app', 'call', 'channel', 'chat', 'entity', 'file',
  'meeting', 'meetup-join', 'message', 'task', 'team',
];

const DEEP_LINK_PATH = new RegExp(`^/(?:meet/|l/(?:${LINK_KINDS.join('|')})/)`);

// A Teams deep link answered by a 302 to the launcher page carries the
// original path in the `url` parameter, prefixed with "/_#", e.g.
// url=/_#/l/meetup-join/19:meeting_…@thread.v2/0?context=…&anon=true
// (observed 2026-11-11 for a meetup-join link on teams.microsoft.com).
export const LAUNCHER_PATH = '/dl/launcher/launcher.html';
const LAUNCHER_PREFIX = '/_#';

/**
 * @param {string} href - absolute URL
 * @returns {string|null} msteams:// URL, or null when href is not a Teams
 *   deep link this extension hands over
 */
export function toDesktopUrl(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !TEAMS_HOSTS.includes(url.hostname)
      || url.port !== '' || url.username !== '' || url.password !== '') {
    return null;
  }

  let rest;
  if (DEEP_LINK_PATH.test(url.pathname)) {
    rest = url.pathname + url.search + url.hash;
  } else if (url.pathname === LAUNCHER_PATH) {
    const inner = url.searchParams.get('url');
    if (inner === null || !inner.startsWith(LAUNCHER_PREFIX)) {
      return null;
    }
    rest = inner.slice(LAUNCHER_PREFIX.length);
    if (!DEEP_LINK_PATH.test(rest)) {
      return null;
    }
  } else {
    return null;
  }
  return `msteams://${url.hostname}${rest}`;
}
