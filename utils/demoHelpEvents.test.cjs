const assert = require('node:assert/strict');
const { test } = require('node:test');

const { createDemoHelpEvent } = require('./demoHelpEvents');

test('demo help event is independent from pet state and marked as demo', () => {
  const event = createDemoHelpEvent('medium');

  assert.equal(event.source, 'demo');
  assert.equal(event.severity, 'medium');
  assert.equal(event.status, 'pending');
  assert.equal(event.category, 'study');
  assert.ok(event.id.startsWith('demo_medium_'));
});

test('unknown demo severity falls back to a high-risk event', () => {
  const event = createDemoHelpEvent('unknown');

  assert.equal(event.source, 'demo');
  assert.equal(event.severity, 'high');
});
