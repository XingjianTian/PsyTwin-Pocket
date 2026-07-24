const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  PET_SYNC_INTERVAL,
  createDemoObserverPatch,
  createPetLocationPatch,
  normalizePetStatus,
  shouldApplyPetStatus,
} = require('./pet-sync');

test('uses the same four-second polling interval as the server tick', () => {
  assert.equal(PET_SYNC_INTERVAL, 4000);
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

test('normalizes a legacy status response with state fields directly in data', () => {
  const result = normalizePetStatus({
    userId: 'demo_pet',
    mood: 71,
    energy: 76,
    social: 44,
    sceneId: 'teaching_building',
    activity: '认真听讲做笔记',
    lastSyncAt: 8000,
  });

  assert.equal(result.state.sceneId, 'teaching_building');
  assert.equal(result.state.activity, '认真听讲做笔记');
});

test('does not apply an older status version', () => {
  assert.equal(shouldApplyPetStatus(10, 9), false);
  assert.equal(shouldApplyPetStatus(10, 10), true);
  assert.equal(shouldApplyPetStatus(10, 11), true);
});

test('builds a server-owned pet location patch without changing the observer scene', () => {
  const patch = createPetLocationPatch(
    {
      sceneId: 'teaching_building',
      activity: '正在上课',
      activityStartTime: 1000,
      activityDuration: 45,
    },
    { name: '教学楼', icon: '🏫' },
  );

  assert.deepEqual(patch, {
    petSceneId: 'teaching_building',
    petSceneName: '教学楼',
    petActivity: '正在上课',
    activityStartTime: 1000,
    currentActivityDuration: 45,
  });
  assert.equal(Object.hasOwn(patch, 'currentSceneId'), false);
});

test('does not replace the last valid location with an empty scene id', () => {
  assert.deepEqual(createPetLocationPatch({ sceneId: '' }, null), {});
});

test('normalizes a websocket status payload for the shared apply path', () => {
  const result = normalizePetStatus({
    state: { sceneId: 'classroom', stateVersion: 14 },
    serverTime: 8000,
    updatedAt: 7990,
    stateVersion: 14,
  });

  assert.equal(result.state.sceneId, 'classroom');
  assert.equal(result.stateVersion, 14);
});

test('routes server status through the authoritative apply method without changing observer scene', () => {
  const pageSource = fs.readFileSync(
    path.join(__dirname, '..', 'pages', 'pet', 'index.js'),
    'utf8',
  );

  assert.match(pageSource, /applyAuthoritativePetStatus\(status/);
  assert.doesNotMatch(pageSource, /currentSceneId:\s*state\.sceneId/);
});

test('forces demo_pet to the picnic lawn game view', () => {
  assert.deepEqual(
    createDemoObserverPatch(
      'demo_pet',
      { sceneId: 'picnic_lawn' },
      { name: '野餐草坪', icon: '🧺' },
    ),
    {
      currentView: 'game',
      currentSceneId: 'picnic_lawn',
      currentScene: '野餐草坪',
      currentSceneIcon: '🧺',
      mapLevel: 'secondary',
      activePrimarySceneId: 'open_wilderness',
    },
  );
});

test('forces demo_pet to the school counseling room game view', () => {
  const patch = createDemoObserverPatch(
    'demo_pet',
    { sceneId: 'psychological_room' },
    { name: '心理咨询室', icon: '💬' },
  );

  assert.equal(patch.currentSceneId, 'psychological_room');
  assert.equal(patch.activePrimarySceneId, 'school');
  assert.equal(patch.currentView, 'game');
  assert.equal(patch.mapLevel, 'secondary');
});

test('does not force the observer for normal users or normal scenes', () => {
  assert.deepEqual(createDemoObserverPatch('another_user', { sceneId: 'picnic_lawn' }), {});
  assert.deepEqual(createDemoObserverPatch('demo_pet', { sceneId: 'library' }), {});
});
