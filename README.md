# linux-teams-redirect

A Chrome extension (Manifest V3) that opens Microsoft Teams links in a locally
installed Teams client instead of the Teams web app, by handing them over as
`msteams://` links. Intended for Linux systems that run unofficial Teams
app (i.e., https://github.com/IsmaelMartinez/teams-for-linux).

## What it does

1. A top-level navigation to a Teams deep link is redirected (by a
   `declarativeNetRequest` rule) to the extension's hand-off page. 
   Redirected links are caught once they are resolved to a Teams URL.
2. The hand-off page converts the link to `msteams://<host>/<path>` and opens
   it. Browser asks whether to open the external application; after that the
   DE decides which application gets the link.
3. Once browser's dialog is gone, the page returns to the page the link was
   clicked on, or closes the tab if the tab was opened just for the link.
4. If neither signal arrives, the page stays, showing the `msteams://` link
   to click by hand.

Handled links, on `teams.microsoft.com`, `teams.live.com` and
`teams.cloud.microsoft`:

- `/meet/…`
- `/l/<kind>/…` for `app`, `call`, `channel`, `chat`, `entity`, `file`,
  `meeting`, `meetup-join`, `message`, `task`, `team`
- `/dl/launcher/launcher.html?url=/_#/<one of the above>`

These match the links [teams-for-linux](https://github.com/IsmaelMartinez/teams-for-linux)
accepts as `msteams://` arguments (`msTeamsProtocols.v2` in its
configuration). The Teams web app itself (`/v2/…` and other paths) is not
intercepted.

## Tested with

- Google Chrome 156.0.8078.47
- KDE Plasma on Wayland: `msteams://` links from Chrome open KDE's
  "Choose Application" dialog, listing the installed handlers
- teams-for-linux 2.26.0 as the `x-scheme-handler/msteams` handler

## Install (unpacked)

1. Open `chrome://extensions` and enable Developer mode.
2. Click **Load unpacked** and select this directory.

The extension only hands the link over; a desktop application registered for
`x-scheme-handler/msteams` has to receive it.

## Development

```
npm test
```

runs the unit tests (Node's built-in test runner): link conversion, and
agreement between the redirect rules and the converter.

The redirect rules are one per host and link form. Chrome rejected the same
patterns with the three hosts in one alternation:
`declarativeNetRequest.isRegexSupported` returned `memoryLimitExceeded`.

`src/handoff.js` has diagnostics, commented out, that record the focus and
pointer events of each hand-off; `src/log.html` shows the last recorded run.
Turning them back on also needs the `storage` permission.

## License

GNU General Public License v3.0 or later; see [LICENSE](LICENSE).

### Icon

The files in `icons/` are the Teams for Linux logo from
[teams-for-linux](https://github.com/IsmaelMartinez/teams-for-linux), a
GPL-3.0 project, at commit
[`162ae6cf`](https://github.com/IsmaelMartinez/teams-for-linux/commit/162ae6cfce96c101214be9f88763b6b936c18623)
(pull request #1392). `icon-16.png`, `icon-32.png` and `icon-48.png` are its
`build/icons/` files, unchanged. `icon-128.png` is `T+P.svg` from that
repository's `app/assets/icons/T4L Logo 2024.zip`, rendered at 96×96 and
centred on a transparent 128×128 canvas, following the Chrome Web Store's
[icon guidance](https://developer.chrome.com/docs/webstore/images). That
archive lists the logo's penguin as derived
from [Tux bw.svg](https://commons.wikimedia.org/wiki/File:Tux_bw.svg) on
Wikimedia Commons: Larry Ewing (original), gg3po (SVG), Iwan Gabovitch (black
and white), GNU GPL version 2 or later.
