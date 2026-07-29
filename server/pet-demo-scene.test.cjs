const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  CLASSROOM_SCENE_ID,
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
      demoConversation: nextState.demoConversation
        ? JSON.parse(JSON.stringify(nextState.demoConversation))
        : null,
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

test('broadcasts the outdoor conversation before entering the counseling room', () => {
  const fixture = createFixture();

  assert.equal(fixture.controller.trigger(), true);
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  assert.equal(fixture.state.activity, 'activity:picnic_lawn');
  assert.equal(fixture.state.stateVersion, 8);
  assert.deepEqual(fixture.timers.map((timer) => timer.delay), [5200, 10000]);
  assert.equal(fixture.state.demoConversation.phase, 'line_1');
  assert.equal(fixture.state.demoConversation.speaker, 'main');
  assert.equal(fixture.state.demoConversation.text, '小暖，今天的风好舒服呀。');

  fixture.setNow(4600);
  fixture.timers[0].callback();
  assert.equal(fixture.state.demoConversation.phase, 'line_2');
  assert.equal(fixture.state.demoConversation.speaker, 'companion');
  assert.equal(fixture.state.demoConversation.text, '是呀，和你聊一会儿，心情都变好了。');
  assert.equal(fixture.timers[1].delay - fixture.timers[0].delay, 4800);

  fixture.setNow(7500);
  fixture.timers[1].callback();
  assert.equal(fixture.state.sceneId, 'psychological_room');
  assert.equal(fixture.state.activity, 'activity:psychological_room');
  assert.equal(fixture.state.stateVersion, 10);
  assert.deepEqual(fixture.broadcasts.map((entry) => entry.sceneId), [
    'picnic_lawn',
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

test('toggles presentation mode while keeping the pet in the classroom', () => {
  const fixture = createFixture();

  assert.equal(fixture.controller.togglePresentationMode(), true);
  assert.equal(fixture.controller.isPresentationMode(), true);
  assert.equal(fixture.state.sceneId, CLASSROOM_SCENE_ID);
  assert.equal(fixture.state.activity, `activity:${CLASSROOM_SCENE_ID}`);
  assert.equal(fixture.timers.length, 0);
  assert.equal(fixture.controller.isLocationLocked('demo_pet'), true);

  assert.equal(fixture.controller.togglePresentationMode(), false);
  assert.equal(fixture.controller.isPresentationMode(), false);
  assert.equal(fixture.state.sceneId, 'library');
});

test('F9 scene switching supersedes the stable presentation location', () => {
  const fixture = createFixture();

  fixture.controller.togglePresentationMode();
  assert.equal(fixture.controller.trigger(), true);

  assert.equal(fixture.controller.isPresentationMode(), false);
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  fixture.controller.stop();
  assert.equal(fixture.state.sceneId, 'library');
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

test('starts without Unity or any other active demo pet client', () => {
  const fixture = createFixture({ clientCount: 0 });

  assert.equal(fixture.controller.trigger(), true);
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  assert.equal(fixture.broadcasts.length, 1);
  assert.equal(fixture.timers.length, 2);
});

test('cancels the delayed counseling switch when the demo stops early', () => {
  const fixture = createFixture();

  fixture.controller.trigger();
  const timers = [...fixture.timers];
  fixture.controller.stop('client_disconnected');
  timers.forEach((timer) => timer.callback());

  assert.equal(timers.every((timer) => timer.cancelled), true);
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
  assert.match(source, /key\.name === 'f8'/);
  assert.match(source, /togglePresentationMode\(\)/);
  assert.match(source, /presentationEnabled \? '---启动---' : '---关闭---'/);
  assert.match(source, /const defaultPresentationStarted = startDefaultPresentationMode\(\);/);
  assert.match(source, /if \(defaultPresentationStarted\) \{\s*console\.log\('---启动---'\);/);
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
