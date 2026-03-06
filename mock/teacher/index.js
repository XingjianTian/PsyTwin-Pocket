/**
 * 教师端 Mock 数据
 * 兼容现有 mock 系统格式
 */

const warnings = require('./workbench/warnings');
const todaySchedule = require('./workbench/todaySchedule');
const stats = require('./workbench/stats');
const myInfo = require('./my/info');
const settings = require('./settings/index');

/**
 * 教师端 Mock 接口配置
 * 格式: { path: 正则或字符串, data: 响应数据 或 handler: 处理函数 }
 */
const teacherMock = [
  // 工作台 - 预警列表
  {
    path: /\/teacher\/workbench\/warnings$/,
    handler: (options) => {
      // 解析查询参数
      const url = options.url || '';
      const params = {};
      const queryMatch = url.match(/\?(.+)$/);
      if (queryMatch) {
        const pairs = queryMatch[1].split('&');
        pairs.forEach((pair) => {
          const [key, value] = pair.split('=');
          if (key) params[key] = decodeURIComponent(value || '');
        });
      }
      return warnings.getWarnings(params);
    },
  },
  // 工作台 - 预警详情
  {
    path: /\/teacher\/workbench\/warnings\/[\w-]+$/,
    handler: (options) => {
      const match = options.url.match(/\/warnings\/([\w-]+)/);
      const id = match ? match[1] : '';
      return warnings.getWarningDetail(id);
    },
  },
  // 工作台 - 处理预警
  {
    path: /\/teacher\/workbench\/warnings\/[\w-]+\/action$/,
    handler: (options) => {
      const match = options.url.match(/\/warnings\/([\w-]+)/);
      const id = match ? match[1] : '';
      const body = options.body || {};
      return warnings.handleWarning(id, body);
    },
  },
  // 工作台 - 今日日程
  {
    path: /\/teacher\/workbench\/schedule\/today$/,
    data: todaySchedule.getTodaySchedule(),
  },
  // 工作台 - 更新日程状态
  {
    path: /\/teacher\/workbench\/schedule\/[\w-]+\/status$/,
    handler: (options) => {
      const match = options.url.match(/\/schedule\/([\w-]+)/);
      const id = match ? match[1] : '';
      const body = options.body || {};
      return todaySchedule.updateScheduleStatus(id, body.status);
    },
  },
  // 工作台 - 工作统计
  {
    path: /\/teacher\/workbench\/stats$/,
    data: stats.getWorkStats(),
  },
  // 工作台 - 咨询趋势
  {
    path: /\/teacher\/workbench\/stats\/trend$/,
    handler: (options) => {
      const url = options.url || '';
      const match = url.match(/[?&]period=([^&]+)/);
      const period = match ? match[1] : 'month';
      return stats.getCounselingTrend(period);
    },
  },
  // 我的页面 - 教师信息
  {
    path: /\/teacher\/my\/info$/,
    data: myInfo.getTeacherInfo(),
  },
  {
    path: /\/teacher\/my\/profile$/,
    data: myInfo.getTeacherProfile(),
  },
  {
    path: /\/teacher\/my\/info$/,
    method: 'PUT',
    handler: (options) => {
      const body = options.body || {};
      return myInfo.updateTeacherInfo(body);
    },
  },
  // 设置相关
  {
    path: /\/teacher\/settings\/(\w+)$/,
    handler: (options) => {
      const match = options.url.match(/\/settings\/(\w+)/);
      const type = match ? match[1] : '';
      return settings.getSettings(type);
    },
  },
  {
    path: /\/teacher\/settings\/(\w+)$/,
    method: 'PUT',
    handler: (options) => {
      const match = options.url.match(/\/settings\/(\w+)/);
      const type = match ? match[1] : '';
      const body = options.body || {};
      return settings.updateSettings(type, body);
    },
  },
];

module.exports = teacherMock;
