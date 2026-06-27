import { isSuccessResponse, normalizeCollection, requestPocket, unwrapData } from './pocket';

const fallbackWarnings = [
  {
    id: 'w1',
    studentId: 's2021001',
    studentName: '张三',
    avatar: 'https://picsum.photos/80/80?random=301',
    riskLevel: 'high',
    riskReason: '聊天中出现自伤倾向关键词',
    triggerSource: 'chat',
    triggeredAt: '2026-03-06 15:30',
    status: 'pending',
    lastAction: null,
  },
  {
    id: 'w2',
    studentId: 's2021002',
    studentName: '李四',
    avatar: 'https://picsum.photos/80/80?random=302',
    riskLevel: 'high',
    riskReason: '连续 3 天情绪评分低于 -0.8',
    triggerSource: 'assessment',
    triggeredAt: '2026-03-06 14:20',
    status: 'processing',
    lastAction: {
      content: '已发送关怀消息',
      time: '2026-03-06 14:30',
    },
  },
  {
    id: 'w3',
    studentId: 's2021003',
    studentName: '王五',
    avatar: 'https://picsum.photos/80/80?random=303',
    riskLevel: 'medium',
    riskReason: '周活跃度下降 60%，发布负面动态',
    triggerSource: 'post',
    triggeredAt: '2026-03-06 10:15',
    status: 'pending',
    lastAction: null,
  },
];

const fallbackSchedules = [
  {
    id: 's1',
    type: 'counseling',
    title: '心理咨询',
    studentName: '张三',
    avatar: 'https://picsum.photos/80/80?random=311',
    startTime: '09:00',
    endTime: '09:50',
    location: '心理咨询室 A',
    status: 'completed',
    notes: '学业压力咨询',
  },
  {
    id: 's2',
    type: 'counseling',
    title: '心理咨询',
    studentName: '李四',
    avatar: 'https://picsum.photos/80/80?random=312',
    startTime: '14:00',
    endTime: '14:50',
    location: '心理咨询室 B',
    status: 'upcoming',
    notes: '情绪管理',
  },
  {
    id: 's3',
    type: 'duty',
    title: 'VR设备值班',
    studentName: null,
    avatar: '',
    startTime: '15:00',
    endTime: '17:00',
    location: 'VR体验中心',
    status: 'upcoming',
    notes: '负责 VR 设备管理与指导',
  },
];

const fallbackWorkStats = {
  thisMonthCounseling: 23,
  thisMonthCounselingTrend: 18,
  totalHours: 248,
  totalHoursTrend: 7,
  resolvedWarnings: 16,
  resolvedWarningsTrend: 12,
  satisfactionRate: 4.8,
  satisfactionRateTrend: 0.2,
};

const quickEntries = [
  { name: '学生档案', icon: 'usergroup', color: '#722ed1' },
  { name: '预约管理', icon: 'calendar', color: '#1890ff' },
  { name: '咨询记录', icon: 'edit', color: '#52c41a' },
  { name: '发布通知', icon: 'notification', color: '#fa8c16' },
  { name: '数据报表', icon: 'chart', color: '#13c2c2' },
];

function formatDateTime(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function buildWarningStats(list) {
  return {
    high: list.filter((item) => item.riskLevel === 'high' && item.status !== 'resolved').length,
    medium: list.filter((item) => item.riskLevel === 'medium' && item.status !== 'resolved').length,
    low: list.filter((item) => item.riskLevel === 'low' && item.status !== 'resolved').length,
  };
}

function buildScheduleStats(list) {
  return {
    total: list.length,
    completed: list.filter((item) => item.status === 'completed').length,
    upcoming: list.filter((item) => item.status === 'upcoming').length,
    ongoing: list.filter((item) => item.status === 'ongoing').length,
  };
}

function normalizeLastAction(value) {
  if (!value || typeof value !== 'object') {
    return null;
  }

  return {
    type: value.type || value.actionType || 'note',
    content: value.content || value.note || '已更新处理进度',
    time: formatDateTime(value.time || value.createdAt || value.updatedAt),
  };
}

function normalizeWarning(item, index = 0) {
  const student = item.student || item.user || {};
  const riskLevel = String(item.riskLevel || item.risk_level || 'low').toLowerCase();

  return {
    id: item.id || item.warningId || `warning-${index}`,
    studentId: item.studentId || student.id || student.studentId || '',
    studentName: item.studentName || student.name || student.nickname || '未知学生',
    avatar: item.avatar || student.avatar || `https://picsum.photos/80/80?random=${301 + index}`,
    riskLevel,
    riskReason: item.riskReason || item.reason || item.risk_reason || '暂无风险说明',
    triggerSource: String(item.triggerSource || item.source || item.trigger_source || 'behavior').toLowerCase(),
    triggeredAt: formatDateTime(item.triggeredAt || item.triggered_at || item.createdAt || item.created_at),
    status: String(item.status || 'pending').toLowerCase(),
    lastAction: normalizeLastAction(item.lastAction || item.last_action || item.latestAction),
  };
}

function normalizeSchedule(item, index = 0) {
  return {
    id: item.id || `schedule-${index}`,
    type: String(item.type || 'counseling').toLowerCase(),
    title: item.title || '心理咨询',
    studentName: item.studentName || item.student?.name || null,
    avatar: item.avatar || item.student?.avatar || '',
    startTime: item.startTime || item.start || '',
    endTime: item.endTime || item.end || '',
    location: item.location || '待定',
    status: String(item.status || 'upcoming').toLowerCase(),
    notes: item.notes || item.remark || '',
  };
}

function normalizeWorkStats(value = {}) {
  return {
    ...fallbackWorkStats,
    ...value,
  };
}

function sortWarnings(list) {
  return [...list].sort((a, b) => new Date(b.triggeredAt || 0) - new Date(a.triggeredAt || 0));
}

export function createFallbackWorkbenchData() {
  return {
    warningStats: buildWarningStats(fallbackWarnings),
    warningList: fallbackWarnings,
    scheduleList: fallbackSchedules,
    scheduleStats: buildScheduleStats(fallbackSchedules),
    quickEntries,
    workStats: fallbackWorkStats,
  };
}

export async function getWorkbenchData() {
  const fallbackData = createFallbackWorkbenchData();

  try {
    const [warningsResult, scheduleResult, statsResult] = await Promise.allSettled([
      requestPocket({
        method: 'GET',
        url: '/teacher/workbench/warnings',
      }),
      requestPocket({
        method: 'GET',
        url: '/teacher/workbench/schedule/today',
      }),
      requestPocket({
        method: 'GET',
        url: '/teacher/workbench/stats',
      }),
    ]);

    const warningsResponse = warningsResult.status === 'fulfilled' ? warningsResult.value : null;
    const scheduleResponse = scheduleResult.status === 'fulfilled' ? scheduleResult.value : null;
    const statsResponse = statsResult.status === 'fulfilled' ? statsResult.value : null;

    const warningPayload = isSuccessResponse(warningsResponse)
      ? unwrapData(warningsResponse, ['list', 'stats']) || {}
      : {};
    const warningList = isSuccessResponse(warningsResponse)
      ? sortWarnings(normalizeCollection(warningPayload.list).map(normalizeWarning))
      : fallbackData.warningList;

    const schedulePayload = isSuccessResponse(scheduleResponse)
      ? unwrapData(scheduleResponse, ['list', 'stats']) || {}
      : {};
    const scheduleList = isSuccessResponse(scheduleResponse)
      ? normalizeCollection(schedulePayload.list).map(normalizeSchedule)
      : fallbackData.scheduleList;

    const statsPayload = isSuccessResponse(statsResponse) ? unwrapData(statsResponse) || {} : fallbackData.workStats;

    return {
      warningStats: warningPayload.stats || buildWarningStats(warningList),
      warningList,
      scheduleList,
      scheduleStats: schedulePayload.stats || buildScheduleStats(scheduleList),
      quickEntries,
      workStats: normalizeWorkStats(statsPayload),
    };
  } catch (error) {
    return fallbackData;
  }
}

export async function getWarningsByTab(tab = 'pending') {
  try {
    const response = await requestPocket({
      method: 'GET',
      url: '/teacher/workbench/warnings',
      params: {
        status: tab,
      },
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response?.message || '获取预警失败');
    }

    const payload = unwrapData(response, ['list', 'stats']) || {};
    return sortWarnings(normalizeCollection(payload.list).map(normalizeWarning));
  } catch (error) {
    return createFallbackWorkbenchData().warningList.filter((item) => item.status === tab);
  }
}
