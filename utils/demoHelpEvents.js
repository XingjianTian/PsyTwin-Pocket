const DEMO_HELP_EVENTS = {
  high: {
    type: 'demo',
    category: 'emotion',
    severity: 'high',
    title: '演示：持续情绪低落',
    description: '这是演示用高危求助事件，用于展示预约咨询分流。',
  },
  medium: {
    type: 'demo',
    category: 'study',
    severity: 'medium',
    title: '演示：近期压力偏高',
    description: '这是演示用中危求助事件，用于展示心理测评分流。',
  },
  low: {
    type: 'demo',
    category: 'social',
    severity: 'low',
    title: '演示：想找人聊聊',
    description: '这是演示用低危求助事件，用于展示陪伴提示分流。',
  },
};

function createDemoHelpEvent(severity = 'high') {
  const template = DEMO_HELP_EVENTS[severity] || DEMO_HELP_EVENTS.high;

  return {
    ...template,
    id: `demo_${severity}_${Date.now()}`,
    source: 'demo',
    status: 'pending',
    createdAt: Date.now(),
    deadline: Date.now() + 30 * 60 * 1000,
  };
}

function mergeHelpEvents(serverEvents = [], currentEvents = []) {
  const eventsById = new Map();

  [...serverEvents, ...currentEvents.filter((event) => event.source === 'demo')].forEach((event) => {
    if (event && event.id && !eventsById.has(event.id)) {
      eventsById.set(event.id, event);
    }
  });

  return [...eventsById.values()];
}

module.exports = {
  createDemoHelpEvent,
  mergeHelpEvents,
};
