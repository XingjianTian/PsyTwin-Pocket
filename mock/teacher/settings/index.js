/**
 * 教师端 - 设置相关 Mock 数据
 */

const settings = {
  // 通知设置
  notifications: {
    warningAlert: true, // 预警提醒
    newAppointment: true, // 新预约提醒
    scheduleReminder: true, // 日程提醒
    systemNotice: true, // 系统通知
  },
  // 预警设置
  warningSettings: {
    highRiskAlert: true, // 高风险预警
    highRiskSound: true, // 高风险声音提醒
    mediumRiskAlert: true, // 中风险预警
    lowRiskAlert: false, // 低风险预警
    autoAssign: true, // 自动分配预警
  },
  // 工作时间设置
  workTime: {
    workDays: ['周一', '周二', '周三', '周四', '周五'],
    startTime: '09:00',
    endTime: '17:00',
    lunchBreak: {
      enabled: true,
      start: '12:00',
      end: '14:00',
    },
  },
};

/**
 * 获取设置
 * @param {string} type - 设置类型
 */
function getSettings(type) {
  const data = settings[type] || {};
  return {
    code: 0,
    message: 'success',
    data,
  };
}

/**
 * 更新设置
 * @param {string} type - 设置类型
 * @param {Object} data - 设置数据
 */
function updateSettings(type, data) {
  settings[type] = { ...settings[type], ...data };
  return {
    code: 0,
    message: 'success',
    data: settings[type],
  };
}

module.exports = {
  getSettings,
  updateSettings,
};
