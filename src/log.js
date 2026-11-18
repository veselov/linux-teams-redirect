// Diagnostics viewer for the last hand-off log. Only works with the
// diagnostics in handoff.js turned back on, which also needs the "storage"
// permission in the manifest.
const { lastHandoffLog } = await chrome.storage.local.get('lastHandoffLog');
if (!lastHandoffLog) {
  document.getElementById('meta').textContent = 'none recorded';
} else {
  document.getElementById('meta').textContent = `${lastHandoffLog.at} ${lastHandoffLog.target}`;
  const events = document.getElementById('events');
  for (const line of lastHandoffLog.log) {
    const li = document.createElement('li');
    li.textContent = line;
    events.append(li);
  }
}
