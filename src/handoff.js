// Reached through a declarativeNetRequest redirect; the original Teams URL is
// everything after the first "#".
//
// When to leave the page: Chrome asks before opening an external application,
// in a tab-modal dialog, and leaving the page while that dialog is up
// dismisses it and cancels the hand-off (observed 2026-11-11, Chrome 156, KDE
// Wayland). The dialog appearing took focus from the page (a window blur
// ~0.1 s after the hand-off started, in a diagnostic run the same day).
// While the dialog is up the page is not reachable, so the page getting focus
// or pointer input again after that blur is taken to mean the dialog is gone.
// Without any such signal the page stays, with the link to retry by hand.
//
// Diagnostics (commented out): record() can show every run's event log on
// this page and keep it in chrome.storage.local for src/log.html. To turn
// it back on, uncomment the lines in record() and the event list in
// handoff.html, and add "storage" to the manifest's "permissions".
import { toDesktopUrl } from './teams-url.js';

const original = location.hash.slice(1);
const target = toDesktopUrl(original);

const t0 = performance.now();
// const events = document.getElementById('events');
const log = [];

function record(what) {
  const line = `+${((performance.now() - t0) / 1000).toFixed(2)}s ${what}`
    + ` | hasFocus=${document.hasFocus()} visibility=${document.visibilityState}`;
  log.push(line);
  // const li = document.createElement('li');
  // li.textContent = line;
  // events.append(li);
  // chrome.storage.local.set({ lastHandoffLog: { at: new Date().toISOString(), target, log } });
}

let armed = false;
let leaving = false;

function arm(reason) {
  record(reason);
  if (!armed) {
    armed = true;
    record('armed: waiting for focus or pointer input to come back');
  }
}

function pageReachable(reason) {
  if (!armed || leaving) {
    return;
  }
  leaving = true;
  record(`leaving: ${reason}`);
  leave();
}

if (target === null) {
  document.getElementById('status').textContent =
    `Not a Teams link this extension hands over: ${original}`;
} else {
  const link = document.getElementById('link');
  link.href = target;
  link.textContent = target;
  document.getElementById('manual').hidden = false;

  window.addEventListener('blur', () => arm('window blur'));
  window.addEventListener('focus', () => { record('window focus'); pageReachable('window focus'); });
  document.addEventListener('pointermove', () => pageReachable('pointermove'));
  document.addEventListener('pointerdown', () => pageReachable('pointerdown'));
  chrome.windows.onFocusChanged.addListener(id =>
    record(`chrome.windows.onFocusChanged ${id === chrome.windows.WINDOW_ID_NONE ? 'WINDOW_ID_NONE' : id}`));
  link.addEventListener('click', () => record('link clicked'));

  // A focus event can be missed (e.g. focus returning before the listener
  // runs); polling document.hasFocus() covers that.
  let lastFocus = document.hasFocus();
  setInterval(() => {
    const now = document.hasFocus();
    if (now !== lastFocus) {
      lastFocus = now;
      record(`poll: hasFocus changed to ${now}`);
      if (now) {
        pageReachable('poll: hasFocus');
      } else {
        arm('poll: hasFocus lost');
      }
    }
  }, 250);

  record('start; setting location to msteams link');
  location.href = target;
}

// Return to the page the link was opened from, or close the tab when the tab
// was opened just for this link.
async function leave() {
  if (history.length > 1) {
    history.back();
    return;
  }
  const tab = await chrome.tabs.getCurrent();
  if (tab) {
    await chrome.tabs.remove(tab.id);
  }
}
