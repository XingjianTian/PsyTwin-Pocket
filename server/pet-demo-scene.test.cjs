const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  createPetDemoSceneController,
  shouldStopDemoOnClientDisconnect,
} = require('./pet-demo-scene');

function createFixture({ clientCount = 2 } = {}) {
  const state = {
    userId: 'demo_pet',
    sceneId: 'library',
    activity: '阅读',
    activityStartTime: 100,
    activityDuration: 20,
    stateVersion: 7,
    updatedAt: 100,
  };
  const broadcasts = [];
  const timers = [];
  let now = 1000;
  const controller = createPetDemoSceneController({
    getState: (userId) => (userId === 'demo_pet' ? state : null),
    getClientCount: () => clientCount,
    broadcast: (userId, nextState) => broadcasts.push({
      userId,
      sceneId: nextState.sceneId,
      stateVersion: nextState.stateVersion,
    }),
    getActivity: (sceneId) => `activity:${sceneId}`,
    getActivityDuration: (sceneId) => (sceneId === 'psychological_room' ? 30 : 10),
    now: () => now,
    setTimer: (callback, delay) => {
      const timer = { callback, delay, cancelled: false };
      timers.push(timer);
      return timer;
    },
    clearTimer: (timer) => {
      timer.cancelled = true;
    },
  });

  return {
    state,
    broadcasts,
    timers,
    controller,
    setNow: (value) => {
      now = value;
    },
  };
}

test('broadcasts picnic lawn immediately and counseling room after three seconds', () => {
  const fixture = createFixture();

  assert.equal(fixture.controller.trigger(), true);
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  assert.equal(fixture.state.activity, 'activity:picnic_lawn');
  assert.equal(fixture.state.stateVersion, 8);
  assert.equal(fixture.timers[0].delay, 3000);

  fixture.setNow(4000);
  fixture.timers[0].callback();

  assert.equal(fixture.state.sceneId, 'psychological_room');
  assert.equal(fixture.state.activity, 'activity:psychological_room');
  assert.equal(fixture.state.stateVersion, 9);
  assert.deepEqual(fixture.broadcasts.map((entry) => entry.sceneId), [
    'picnic_lawn',
    'psychological_room',
  ]);
  assert.equal(fixture.controller.isActive(), true);
});

test('restarts the sequence without replacing the original snapshot', () => {
  const fixture = createFixture();

  fixture.controller.trigger();
  const firstTimer = fixture.timers[0];
  fixture.controller.trigger();

  assert.equal(firstTimer.cancelled, true);
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  assert.equal(fixture.controller.stop('client_disconnected'), true);
  assert.equal(fixture.state.sceneId, 'library');
  assert.equal(fixture.state.activity, '阅读');
  assert.equal(fixture.state.activityStartTime, 100);
  assert.equal(fixture.state.activityDuration, 20);
  assert.equal(fixture.controller.isActive(), false);
});

test('locks only the demo pet while active', () => {
  const fixture = createFixture();

  fixture.controller.trigger();

  assert.equal(fixture.controller.isLocationLocked('demo_pet'), true);
  assert.equal(fixture.controller.isLocationLocked('another_user'), false);
});

test('persists the original location while the in-memory demo override is active', () => {
  const fixture = createFixture();

  fixture.controller.trigger();
  const persisted = fixture.controller.getPersistableState('demo_pet', fixture.state);

  assert.equal(persisted.sceneId, 'library');
  assert.equal(persisted.activity, '阅读');
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  assert.notEqual(persisted, fixture.state);
});

test('does not start without an active demo pet client', () => {
  const fixture = createFixture({ clientCount: 0 });

  assert.equal(fixture.controller.trigger(), false);
  assert.equal(fixture.state.sceneId, 'library');
  assert.equal(fixture.broadcasts.length, 0);
  assert.equal(fixture.timers.length, 0);
});

test('cancels the delayed counseling switch when the demo stops early', () => {
  const fixture = createFixture();

  fixture.controller.trigger();
  const timer = fixture.timers[0];
  fixture.controller.stop('client_disconnected');
  timer.callback();

  assert.equal(timer.cancelled, true);
  assert.equal(fixture.state.sceneId, 'library');
  assert.deepEqual(fixture.broadcasts.map((entry) => entry.sceneId), [
    'picnic_lawn',
    'library',
  ]);
});

test('stops for Pocket refresh but keeps running while another Unity receiver is connected', () => {
  assert.equal(shouldStopDemoOnClientDisconnect('pocket', ['unity']), true);
  assert.equal(shouldStopDemoOnClientDisconnect('unity', ['pocket', 'unity']), false);
  assert.equal(shouldStopDemoOnClientDisconnect('unity', ['pocket']), true);
});

test('server wires F9, tick locking, persistence protection, and disconnect cleanup', () => {
  const source = fs.readFileSync(path.join(__dirname, 'pet-server.js'), 'utf8');

  assert.match(source, /key\.name === 'f9'/);
  assert.match(source, /isLocationLocked\(userId\)/);
  assert.match(source, /getPersistableState\(userId, state\)/);
  assert.match(source, /demoSceneController\.stop\('client_disconnected'\)/);
});

test('server keeps the F9 demo route out of console output', () => {
  const source = fs.readFileSync(path.join(__dirname, 'pet-server.js'), 'utf8');

  assert.doesNotMatch(source, /F9：demo_pet 已到野餐草坪/);
  assert.doesNotMatch(source, /F9\s+demo_pet：野餐草坪/);
  assert.match(source, /if \(!started\) \{\s*console\.warn\('\[PetDemo\] 操作未执行'\);\s*\}/);
});

test('server leaves diary generation to the Sentinel template library', () => {
  const source = fs.readFileSync(path.join(__dirname, 'pet-server.js'), 'utf8');

  assert.doesNotMatch(source, /MINIMAX_CONFIG|callMiniMax|generateAiDiary|diaryQueue/);
  assert.doesNotMatch(source, /\/api\/pet\/test-diary|AI_DIARY/);
  assert.match(source, /日记模式: Sentinel 模板库（本服务不生成日记）/);
});
