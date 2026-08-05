const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { addHelpEvent, getVisibleHelpEvents } = require('./help-event-notifications');

test('adds one server-backed help event and keeps sourceId idempotent', () => {
  const state = { helpEvents: [], stateVersion: 2 };
  const input = {
    sourceId: 'request-1',
    category: 'emotion',
    severity: 'high',
    title: '最近有点担心你',
    description: '如果感到焦虑或疲惫，可以和咨询师聊聊天。',
    deadline: 5000,
  };

  const first = addHelpEvent(state, input, 1000);
  const second = addHelpEvent(state, input, 2000);

  assert.equal(first.created, true);
  assert.equal(second.created, false);
  assert.equal(state.helpEvents.length, 1);
  assert.equal(state.stateVersion, 3);
  assert.equal(first.event.source, 'sentinel');
  assert.equal(first.event.status, 'pending');
});

test('returns all active unexpired events for existing Pocket consumers', () => {
  const state = {
    helpEvents: [
      { id: 'active', status: 'pending', deadline: 5000 },
      { id: 'resolved', status: 'resolved', deadline: 5000 },
      { id: 'expired', status: 'pending', deadline: 500 },
    ],
  };

  assert.deepEqual(getVisibleHelpEvents(state, 1000).map((event) => event.id), ['active']);
});

test('keeps a low-severity Sentinel event as a daily warm notification', () => {
  const state = { helpEvents: [], stateVersion: 1 };
  const result = addHelpEvent(state, {
    sourceId: 'warm-notification-1',
    category: 'emotion',
    severity: 'low',
    title: '💚 温馨通知',
    description: '欢迎来到线下体验空间，预约一场 VR 放松活动。',
  }, 1000);

  assert.equal(result.event.severity, 'low');
  assert.equal(result.event.type, 'daily');
  assert.equal(result.event.title, '💚 温馨通知');
});

test('pet server authenticates, persists, and broadcasts Sentinel events', () => {
  const source = fs.readFileSync(path.join(__dirname, 'pet-server.js'), 'utf8');

  assert.match(source, /app\.post\('\/api\/pet\/events\/notify'/);
  assert.match(source, /req\.get\('x-pet-sync-key'\)/);
  assert.match(source, /addHelpEvent\(state, event\)/);
  assert.match(source, /saveData\(petData\)/);
  assert.match(source, /broadcastPetStatus\(userId, state\)/);
  assert.match(source, /const events = getVisibleHelpEvents\(state\)/);
});
