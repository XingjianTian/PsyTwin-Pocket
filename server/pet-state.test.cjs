const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getDefaultState,
  serializeState,
  restoreState,
  toStatusPayload,
} = require('./pet-state');

test('persists and restores the complete authoritative pet state', () => {
  const state = {
    ...getDefaultState('demo_pet', 1000),
    mood: 31,
    energy: 82,
    social: 47,
    sceneId: 'library',
    activity: '阅读',
    activityStartTime: 900,
    activityDuration: 25,
    stateVersion: 12,
    updatedAt: 950,
    lastSyncAt: 950,
  };

  const restored = restoreState('demo_pet', serializeState(state), 2000);

  assert.equal(restored.mood, 31);
  assert.equal(restored.energy, 82);
  assert.equal(restored.social, 47);
  assert.equal(restored.sceneId, 'library');
  assert.equal(restored.activity, '阅读');
  assert.equal(restored.activityStartTime, 900);
  assert.equal(restored.activityDuration, 25);
  assert.equal(restored.stateVersion, 12);
  assert.equal(restored.updatedAt, 950);
  assert.equal(restored.lastSyncAt, 950);
});

test('returns a stable read-only status payload with server metadata', () => {
  const state = {
    ...getDefaultState('demo_pet', 1000),
    stateVersion: 4,
    updatedAt: 3000,
  };

  assert.deepEqual(toStatusPayload(state, 5000), {
    state,
    serverTime: 5000,
    updatedAt: 3000,
    stateVersion: 4,
  });
});

test('creates independent mutable collections for each pet', () => {
  const first = getDefaultState('first', 1000);
  const second = getDefaultState('second', 1000);

  first.activityLog.today = [{ type: 'event' }];
  first.bagItems.push({ itemId: 'item_001' });

  assert.deepEqual(second.activityLog, {});
  assert.deepEqual(second.bagItems, []);
});
