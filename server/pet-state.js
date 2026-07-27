const DEFAULT_STATE = {
  mood: 60,
  energy: 75,
  social: 45,
  sceneId: 'bedroom',
  activity: '在温暖的床上休息',
  activityDuration: 10,
  activityLog: {},
  coins: 0,
  bagItems: [],
  helpEvents: [],
  diaryDataMap: {},
  stateVersion: 0,
};

const clamp = (value, min, max, fallback) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
};

function getDefaultState(userId, now = Date.now()) {
  return {
    ...DEFAULT_STATE,
    userId,
    activityLog: {},
    bagItems: [],
    helpEvents: [],
    diaryDataMap: {},
    activityStartTime: now,
    lastSyncAt: now,
    updatedAt: now,
  };
}

function serializeState(state) {
  return {
    userId: state.userId,
    mood: state.mood,
    energy: state.energy,
    social: state.social,
    sceneId: state.sceneId,
    activity: state.activity,
    activityStartTime: state.activityStartTime,
    activityDuration: state.activityDuration,
    ...(state.demoConversation ? { demoConversation: state.demoConversation } : {}),
    stateVersion: state.stateVersion || 0,
    updatedAt: state.updatedAt || state.lastSyncAt || Date.now(),
    lastSyncAt: state.lastSyncAt,
    diaryDataMap: state.diaryDataMap || {},
    bagItems: state.bagItems || [],
    helpEvents: state.helpEvents || [],
    coins: state.coins || 0,
    activityLog: state.activityLog || {},
  };
}

function restoreState(userId, persisted = {}, now = Date.now()) {
  const fallback = getDefaultState(userId, now);
  const lastSyncAt = Number.isFinite(Number(persisted.lastSyncAt))
    ? Number(persisted.lastSyncAt)
    : now;

  return {
    ...fallback,
    ...persisted,
    userId,
    mood: clamp(persisted.mood, 0, 100, fallback.mood),
    energy: clamp(persisted.energy, 0, 100, fallback.energy),
    social: clamp(persisted.social, 0, 100, fallback.social),
    stateVersion: Math.max(0, Number(persisted.stateVersion) || 0),
    lastSyncAt,
    updatedAt: Number.isFinite(Number(persisted.updatedAt))
      ? Number(persisted.updatedAt)
      : lastSyncAt,
  };
}

function toStatusPayload(state, serverTime = Date.now()) {
  return {
    state,
    serverTime,
    updatedAt: state.updatedAt || state.lastSyncAt,
    stateVersion: state.stateVersion || 0,
  };
}

module.exports = {
  getDefaultState,
  serializeState,
  restoreState,
  toStatusPayload,
};
