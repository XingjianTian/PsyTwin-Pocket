/**
 * 教师端工作台 - 工作统计 Mock
 */

/**
 * 获取教师工作统计
 * @returns {Object} 统计数据
 */
function getWorkStats() {
  return {
    code: 0,
    message: 'success',
    data: {
      // 本月咨询
      thisMonthCounseling: 23,
      thisMonthCounselingTrend: 15, // 环比增加15%
      // 累计时长（小时）
      totalHours: 186,
      totalHoursTrend: 8,
      // 处理预警
      resolvedWarnings: 45,
      resolvedWarningsTrend: -5, // 环比减少5%
      // 满意度 0-5
      satisfactionRate: 4.8,
      satisfactionRateTrend: 0.2,
      // 待处理预警
      pendingWarnings: 8,
      // 今日咨询
      todayCounseling: 3,
    },
  };
}

/**
 * 获取咨询趋势数据（用于图表）
 * @param {string} period - 周期 week/month/year
 */
function getCounselingTrend(period = 'month') {
  const trends = {
    week: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      data: [2, 3, 1, 4, 2, 0, 1],
    },
    month: {
      labels: ['第1周', '第2周', '第3周', '第4周'],
      data: [8, 12, 10, 15],
    },
    year: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      data: [45, 52, 48, 60, 55, 58],
    },
  };

  return {
    code: 0,
    message: 'success',
    data: trends[period] || trends.month,
  };
}

module.exports = {
  getWorkStats,
  getCounselingTrend,
};
