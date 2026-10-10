import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isRuntimeCapabilitiesResponse } from '../dist/index.js';
const status = { id: 'kimi-cu', displayName: 'Computer Use', description: '', supported: true, state: 'partial', steps: [{ id: 'permissions', state: 'missing' }], install: { running: false } };
test('capability status distinguishes prerequisite gaps and install failures', () => {
  assert.equal(isRuntimeCapabilitiesResponse({ capabilities: [status] }), true);
  assert.equal(isRuntimeCapabilitiesResponse({ capabilities: [{ ...status, install: { running: false, error: 'download failed' } }] }), true);
  for (const invalid of [null, {}, { capabilities: [{}] }, { capabilities: [{ ...status, steps: [{ id: 'permissions', state: 'ready' }] }] }, { capabilities: [{ ...status, install: { running: true, percent: Infinity } }] }, { capabilities: [{ ...status, supported: 'true' }] }]) assert.equal(isRuntimeCapabilitiesResponse(invalid), false);
});
