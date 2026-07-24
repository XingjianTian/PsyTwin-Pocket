const PET_SYNC_INTERVAL = 4000;

const DEMO_OBSERVER_SCENES = {
  picnic_lawn: 'open_wilderness',
  psychological_room: 'school',
};

function normalizePetStatus(data = {}) {
  return {
    state: data.state || data,
    serverTime: data.serverTime || 0,
    updatedAt: data.updatedAt || 0,
    stateVersion: Number(data.stateVersion) || 0,
  };
}

function shouldApplyPetStatus(currentVersion, nextVersion) {
  return Number(nextVersion) >= Number(currentVersion);
}

function createPetLocationPatch(state = {}, sceneInfo = null) {
  if (!state.sceneId) {
    return {};
  }

  return {
    petSceneId: state.sceneId,
    petSceneName: sceneInfo ? sceneInfo.name : state.sceneId,
    petActivity: state.activity,
    activityStartTime: state.activityStartTime,
    currentActivityDuration: state.activityDuration,
  };
}

function createDemoObserverPatch(userId, state = {}, sceneInfo = null) {
  const parentSceneId = DEMO_OBSERVER_SCENES[state.sceneId];
  if (userId !== 'demo_pet' || !parentSceneId) {
    return {};
  }

  return {
    currentView: 'game',
    currentSceneId: state.sceneId,
    currentScene: sceneInfo ? sceneInfo.name : state.sceneId,
    currentSceneIcon: sceneInfo ? sceneInfo.icon : '🌲',
    mapLevel: 'secondary',
    activePrimarySceneId: parentSceneId,
  };
}

module.exports = {
  PET_SYNC_INTERVAL,
  createDemoObserverPatch,
  createPetLocationPatch,
  normalizePetStatus,
  shouldApplyPetStatus,
};
