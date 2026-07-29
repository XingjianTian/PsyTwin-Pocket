const DEMO_USER_ID = 'demo_pet';
const CLASSROOM_SCENE_ID = 'teaching_building';
const OUTDOOR_SCENE_ID = 'picnic_lawn';
const COUNSELING_SCENE_ID = 'psychological_room';
const DEMO_DIALOGUE_SECOND_LINE_MS = 5200;
const DEMO_DELAY_MS = 10000;
const DEMO_COMPANION = {
  id: 'demo_companion',
  name: '小暖',
  avatar: '/static/pet/demo_companion_xiaonuan.png',
};
const DEMO_DIALOGUE = [
  { speaker: 'main', text: '小暖，今天的风好舒服呀。' },
  { speaker: 'companion', text: '是呀，和你聊一会儿，心情都变好了。' },
];

const LOCATION_FIELDS = [
  'sceneId',
  'activity',
  'activityStartTime',
  'activityDuration',
];

function shouldStopDemoOnClientDisconnect(clientType, remainingClientTypes) {
  if (clientType === 'pocket') {
    return true;
  }

  if (clientType === 'unity') {
    return !remainingClientTypes.includes('unity');
  }

  return remainingClientTypes.length === 0;
}

function createPetDemoSceneController(options) {
  const {
    getState,
    broadcast,
    getActivity,
    getActivityDuration,
    now = Date.now,
    setTimer = setTimeout,
    clearTimer = clearTimeout,
  } = options;

  let snapshot = null;
  let timers = [];
  let sequence = 0;
  let mode = null;

  const broadcastState = (state) => {
    const timestamp = now();
    state.stateVersion = (state.stateVersion || 0) + 1;
    state.updatedAt = timestamp;
    broadcast(DEMO_USER_ID, state);
  };

  const applyScene = (state, sceneId, demoConversation = null) => {
    const timestamp = now();
    state.sceneId = sceneId;
    state.activity = getActivity(sceneId);
    state.activityStartTime = timestamp;
    state.activityDuration = getActivityDuration(sceneId);
    state.demoConversation = demoConversation;
    broadcastState(state);
  };

  const clearTimers = () => {
    timers.forEach((activeTimer) => clearTimer(activeTimer));
    timers = [];
  };

  const buildConversation = (phase, line = null) => ({
    active: true,
    phase,
    companion: DEMO_COMPANION,
    ...(line || {}),
  });

  const trigger = () => {
    const state = getState(DEMO_USER_ID);
    if (!state) {
      return false;
    }

    if (!snapshot) {
      snapshot = LOCATION_FIELDS.reduce((result, field) => ({
        ...result,
        [field]: state[field],
      }), {});
    }

    clearTimers();

    sequence += 1;
    mode = 'scene_switch';
    const currentSequence = sequence;
    applyScene(state, OUTDOOR_SCENE_ID, buildConversation('line_1', DEMO_DIALOGUE[0]));
    timers.push(setTimer(() => {
      if (!snapshot || currentSequence !== sequence) return;
      const currentState = getState(DEMO_USER_ID);
      if (!currentState) return;
      currentState.demoConversation = buildConversation('line_2', DEMO_DIALOGUE[1]);
      broadcastState(currentState);
    }, DEMO_DIALOGUE_SECOND_LINE_MS));
    timers.push(setTimer(() => {
      if (!snapshot || currentSequence !== sequence) {
        return;
      }

      timers = [];
      const currentState = getState(DEMO_USER_ID);
      if (currentState) {
        applyScene(currentState, COUNSELING_SCENE_ID, null);
      }
    }, DEMO_DELAY_MS));

    return true;
  };

  const stop = () => {
    if (!snapshot) {
      return false;
    }

    sequence += 1;
    clearTimers();

    const currentSnapshot = snapshot;
    snapshot = null;
    mode = null;
    const state = getState(DEMO_USER_ID);
    if (state) {
      Object.assign(state, currentSnapshot);
      delete state.demoConversation;
      state.stateVersion = (state.stateVersion || 0) + 1;
      state.updatedAt = now();
      broadcast(DEMO_USER_ID, state);
    }

    return true;
  };

  const togglePresentationMode = () => {
    if (snapshot) {
      stop();
      return false;
    }

    const state = getState(DEMO_USER_ID);
    if (!state) {
      return false;
    }

    snapshot = LOCATION_FIELDS.reduce((result, field) => ({
      ...result,
      [field]: state[field],
    }), {});
    mode = 'presentation';
    applyScene(state, CLASSROOM_SCENE_ID, null);
    return true;
  };

  const getPersistableState = (userId, state) => {
    if (userId !== DEMO_USER_ID || !snapshot) {
      return state;
    }

    const persistableState = {
      ...state,
      ...snapshot,
    };
    delete persistableState.demoConversation;
    return persistableState;
  };

  return {
    trigger,
    togglePresentationMode,
    stop,
    isActive: () => snapshot !== null,
    isPresentationMode: () => mode === 'presentation',
    isLocationLocked: (userId) => userId === DEMO_USER_ID && snapshot !== null,
    getPersistableState,
  };
}

module.exports = {
  CLASSROOM_SCENE_ID,
  COUNSELING_SCENE_ID,
  DEMO_COMPANION,
  DEMO_DIALOGUE,
  DEMO_DIALOGUE_SECOND_LINE_MS,
  DEMO_DELAY_MS,
  DEMO_USER_ID,
  OUTDOOR_SCENE_ID,
  createPetDemoSceneController,
  shouldStopDemoOnClientDisconnect,
};
