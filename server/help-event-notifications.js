const VALID_CATEGORIES = new Set(['emotion', 'study', 'social']);
const VALID_SEVERITIES = new Set(['high', 'medium', 'low']);

function normalizeHelpEvent(input, now = Date.now()) {
  if (!input || typeof input !== 'object') throw new Error('缺少 event');

  const sourceId = String(input.sourceId || '').trim();
  const title = String(input.title || '').trim();
  const description = String(input.description || '').trim();
  if (!sourceId || !title || !description) {
    throw new Error('缺少 event.sourceId、event.title 或 event.description');
  }

  const category = VALID_CATEGORIES.has(input.category) ? input.category : 'emotion';
  const severity = VALID_SEVERITIES.has(input.severity) ? input.severity : 'high';
  const deadline = Number.isFinite(input.deadline) && input.deadline > now
    ? input.deadline
    : now + 24 * 60 * 60 * 1000;

  return {
    id: `sentinel_${sourceId}`,
    sourceId,
    source: 'sentinel',
    type: severity === 'high' ? 'large' : 'daily',
    category,
    severity,
    title,
    description,
    status: 'pending',
    createdAt: now,
    deadline,
  };
}

function addHelpEvent(state, input, now = Date.now()) {
  if (!state.helpEvents) state.helpEvents = [];
  const event = normalizeHelpEvent(input, now);
  const existing = state.helpEvents.find((item) => item.sourceId === event.sourceId);
  if (existing) return { event: existing, created: false };

  state.helpEvents.unshift(event);
  state.stateVersion = (state.stateVersion || 0) + 1;
  state.updatedAt = now;
  return { event, created: true };
}

function getVisibleHelpEvents(state, now = Date.now()) {
  return (state.helpEvents || []).filter((event) => (
    event.status !== 'resolved' && (!event.deadline || event.deadline > now)
  ));
}

module.exports = { addHelpEvent, getVisibleHelpEvents, normalizeHelpEvent };
