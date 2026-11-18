import { buildRules } from './rules.js';

async function installRules() {
  const rules = buildRules(chrome.runtime.id);
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existing.map(r => r.id),
    addRules: rules,
  });
}

chrome.runtime.onInstalled.addListener(() => {
  installRules().catch(e => console.error('installing redirect rules failed:', e));
});
