const test = require('node:test');
const assert = require('node:assert/strict');

const {
  PET_SYNC_INTERVAL,
  normalizePetStatus,
  shouldApplyPetStatus,
} = require('./pet-sync');

test('uses the same five-second polling interval as the server tick', () => {
  assert.equal(PET_SYNC_INTERVAL, 5000);
});

test('normalizes the authoritative status response', () => {
  const result = normalizePetStatus({
    state: { mood: 72, energy: 64, social: 51, sceneId: 'library' },
    serverTime: 5000,
    updatedAt: 4995,
    stateVersion: 9,
  });

  assert.deepEqual(result, {
    state: { mood: 72, energy: 64, social: 51, sceneId: 'library' },
    serverTime: 5000,
    updatedAt: 4995,
    stateVersion: 9,
  });
});

test('does not apply an older status version', () => {
  assert.equal(shouldApplyPetStatus(10, 9), false);
  assert.equal(shouldApplyPetStatus(10, 10), true);
  assert.equal(shouldApplyPetStatus(10, 11), true);
});
