/**
 * 教师端工作台 - 预警数据 Mock
 */

const warnings = [
  {
    id: 'w1',
    studentId: 's2021001',
    studentName: '张三',
    avatar: 'https://picsum.photos/80/80?random=11',
    riskLevel: 'high',
    riskReason: '聊天中出现自伤倾向关键词',
    triggerSource: 'chat',
    triggeredAt: '2026-03-06T15:30:00',
    status: 'pending',
    assignedTo: 't001',
    lastAction: null,
  },
  {
    id: 'w2',
    studentId: 's2021002',
    studentName: '李四',
    avatar: 'https://picsum.photos/80/80?random=12',
    riskLevel: 'high',
    riskReason: '连续3天情绪评分低于-0.8',
    triggerSource: 'assessment',
    triggeredAt: '2026-03-06T14:20:00',
    status: 'processing',
    assignedTo: 't001',
    lastAction: {
      type: 'message',
      content: '已发送关怀消息',
      time: '2026-03-06T14:30:00',
    },
  },
  {
    id: 'w3',
    studentId: 's2021003',
    studentName: '王五',
    avatar: 'https://picsum.photos/80/80?random=13',
    riskLevel: 'medium',
    riskReason: '周活跃度下降60%，发布负面动态',
    triggerSource: 'post',
    triggeredAt: '2026-03-06T10:15:00',
    status: 'pending',
    assignedTo: 't001',
    lastAction: null,
  },
  {
    id: 'w4',
    studentId: 's2021004',
    studentName: '赵六',
    avatar: 'https://picsum.photos/80/80?random=14',
    riskLevel: 'medium',
    riskReason: '连续一周情绪标签为"焦虑"',
    triggerSource: 'chat',
    triggeredAt: '2026-03-05T18:45:00',
    status: 'resolved',
    assignedTo: 't001',
    lastAction: {
      type: 'appointment',
      content: '已预约3月7日咨询',
      time: '2026-03-05T19:00:00',
    },
  },
  {
    id: 'w5',
    studentId: 's2021005',
    studentName: '钱七',
    avatar: 'https://picsum.photos/80/80?random=15',
    riskLevel: 'low',
    riskReason: '情绪波动过大',
    triggerSource: 'behavior',
    triggeredAt: '2026-03-06T09:00:00',
    status: 'pending',
    assignedTo: 't001',
    lastAction: null,
  },
  {
    id: 'w6',
    studentId: 's2021006',
    studentName: '孙八',
    avatar: 'https://picsum.photos/80/80?random=16',
    riskLevel: 'low',
    riskReason: '睡眠质量下降',
    triggerSource: 'assessment',
    triggeredAt: '2026-03-05T16:20:00',
    status: 'pending',
    assignedTo: 't001',
    lastAction: null,
  },
];

/**
 * 获取预警列表
 * @param {Object} params - 查询参数
 * @param {string} params.level - 风险等级筛选 high/medium/low
 * @param {string} params.status - 状态筛选 pending/processing/resolved
 * @returns {Object} 预警数据
 */
function getWarnings(params = {}) {
  let result = [...warnings];

  if (params.level) {
    result = result.filter((w) => w.riskLevel === params.level);
  }

  if (params.status) {
    result = result.filter((w) => w.status === params.status);
  }

  // 按时间倒序
  result.sort((a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt));

  return {
    code: 0,
    message: 'success',
    data: {
      list: result,
      stats: {
        high: warnings.filter((w) => w.riskLevel === 'high' && w.status !== 'resolved').length,
        medium: warnings.filter((w) => w.riskLevel === 'medium' && w.status !== 'resolved').length,
        low: warnings.filter((w) => w.riskLevel === 'low' && w.status !== 'resolved').length,
      },
    },
  };
}

/**
 * 获取单个预警详情
 * @param {string} id - 预警ID
 */
function getWarningDetail(id) {
  const warning = warnings.find((w) => w.id === id);
  if (!warning) {
    return {
      code: 404,
      message: '预警不存在',
      data: null,
    };
  }

  return {
    code: 0,
    message: 'success',
    data: warning,
  };
}

/**
 * 处理预警
 * @param {string} id - 预警ID
 * @param {Object} action - 处理动作
 */
function handleWarning(id, action) {
  const warning = warnings.find((w) => w.id === id);
  if (!warning) {
    return {
      code: 404,
      message: '预警不存在',
      data: null,
    };
  }

  warning.status = action.actionType === 'note' ? warning.status : 'processing';
  warning.lastAction = {
    type: action.actionType,
    content: action.content,
    time: new Date().toISOString(),
  };

  return {
    code: 0,
    message: 'success',
    data: warning,
  };
}

module.exports = {
  getWarnings,
  getWarningDetail,
  handleWarning,
};
