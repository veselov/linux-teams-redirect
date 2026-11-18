// Shared test inputs. Meeting/tenant/object IDs are synthetic; the shapes
// follow links observed in Chrome on 2026-11-11.
const CTX = 'context=%7b%22Tid%22%3a%2200000000-0000-0000-0000-000000000001%22%2c%22Oid%22%3a%2200000000-0000-0000-0000-000000000002%22%7d';
const MEETING = '19%3ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%40thread.v2';

// [input, expected msteams URL]
export const CONVERTED = [
  [`https://teams.microsoft.com/l/meetup-join/${MEETING}/0?${CTX}`,
    `msteams://teams.microsoft.com/l/meetup-join/${MEETING}/0?${CTX}`],
  ['https://teams.live.com/meet/9876543210?p=abcdef',
    'msteams://teams.live.com/meet/9876543210?p=abcdef'],
  ['https://teams.cloud.microsoft/l/chat/0/0?users=someone@example.com',
    'msteams://teams.cloud.microsoft/l/chat/0/0?users=someone@example.com'],
  ['https://teams.microsoft.com/l/channel/19%3aabc%40thread.tacv2/General?groupId=g&tenantId=t',
    'msteams://teams.microsoft.com/l/channel/19%3aabc%40thread.tacv2/General?groupId=g&tenantId=t'],
  // Launcher page, as reached by the 302 from /l/meetup-join/…
  [`https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%25220000%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=00000000-0000-0000-0000-000000000003&directDl=true&msLaunch=true&enableMobilePage=true`,
    'msteams://teams.microsoft.com/l/meetup-join/19:meeting_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@thread.v2/0?context=%7b%22Tid%22%3a%220000%22%7d&anon=true'],
];

export const REJECTED = [
  'https://teams.microsoft.com/v2/',
  'https://teams.microsoft.com/v2/?meetingjoin=true',
  'https://teams.microsoft.com/light-meetings/launch?agent=web',
  'https://teams.microsoft.com/',
  'https://teams.microsoft.com/l/unknownkind/x',
  'https://teams.microsoft.com/L/meetup-join/x',
  'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2FL%2Fmeetup-join%2Fx',
  'https://teams.microsoft.com/dl/launcher/launcher.html?type=meetup-join',
  'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2Fsomething-else',
  'http://teams.microsoft.com/l/meetup-join/x',
  'https://teams.microsoft.com:8443/l/meetup-join/x',
  'https://evil.example/l/meetup-join/x',
  'https://teams.microsoft.com.evil.example/l/meetup-join/x',
  'https://www.google.com/url?q=https://teams.microsoft.com/l/meetup-join/x',
  'not a url',
];
