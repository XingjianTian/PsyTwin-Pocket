const PET_SYNC_INTERVAL = 5000;

function normalizePetStatus(data = {}) {
  return {
    state: data.state || {},
    serverTime: data.serverTime || 0,
    updatedAt: data.updatedAt || 0,
    stateVersion: Number(data.stateVersion) || 0,
  };
}

function shouldApplyPetStatus(currentVersion, nextVersion) {
  return Number(nextVersion) >= Number(currentVersion);
}

module.exports = {
  PET_SYNC_INTERVAL,
  normalizePetStatus,
  shouldApplyPetStatus,
};
