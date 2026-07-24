const DEMO_USER_ID = 'demo_pet';
const OUTDOOR_SCENE_ID = 'picnic_lawn';
const COUNSELING_SCENE_ID = 'psychological_room';
const DEMO_DELAY_MS = 3000;

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
    getClientCount,
    broadcast,
    getActivity,
    getActivityDuration,
    now = Date.now,
    setTimer = setTimeout,
    clearTimer = clearTimeout,
  } = options;

  let snapshot = null;
  let timer = null;
  let sequence = 0;

  const applyScene = (state, sceneId) => {
    const timestamp = now();
    state.sceneId = sceneId;
    state.activity = getActivity(sceneId);
    state.activityStartTime = timestamp;
    state.activityDuration = getActivityDuration(sceneId);
    state.stateVersion = (state.stateVersion || 0) + 1;
    state.updatedAt = timestamp;
    broadcast(DEMO_USER_ID, state);
  };

  const trigger = () => {
    const state = getState(DEMO_USER_ID);
    if (!state || getClientCount(DEMO_USER_ID) === 0) {
      return false;
    }

    if (!snapshot) {
      snapshot = LOCATION_FIELDS.reduce((result, field) => ({
        ...result,
        [field]: state[field],
      }), {});
    }

    if (timer) {
      clearTimer(timer);
    }

    sequence += 1;
    const currentSequence = sequence;
    applyScene(state, OUTDOOR_SCENE_ID);
    timer = setTimer(() => {
      if (!snapshot || currentSequence !== sequence) {
        return;
      }

      timer = null;
      const currentState = getState(DEMO_USER_ID);
      if (currentState) {
        applyScene(currentState, COUNSELING_SCENE_ID);
      }
    }, DEMO_DELAY_MS);

    return true;
  };

  const stop = () => {
    if (!snapshot) {
      return false;
    }

    sequence += 1;
    if (timer) {
      clearTimer(timer);
      timer = null;
    }

    const currentSnapshot = snapshot;
    snapshot = null;
    const state = getState(DEMO_USER_ID);
    if (state) {
      Object.assign(state, currentSnapshot);
      state.stateVersion = (state.stateVersion || 0) + 1;
      state.updatedAt = now();
      broadcast(DEMO_USER_ID, state);
    }

    return true;
  };

  const getPersistableState = (userId, state) => {
    if (userId !== DEMO_USER_ID || !snapshot) {
      return state;
    }

    return {
      ...state,
      ...snapshot,
    };
  };

  return {
    trigger,
    stop,
    isActive: () => snapshot !== null,
    isLocationLocked: (userId) => userId === DEMO_USER_ID && snapshot !== null,
    getPersistableState,
  };
}

module.exports = {
  COUNSELING_SCENE_ID,
  DEMO_DELAY_MS,
  DEMO_USER_ID,
  OUTDOOR_SCENE_ID,
  createPetDemoSceneController,
  shouldStopDemoOnClientDisconnect,
};
