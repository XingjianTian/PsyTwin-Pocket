// 条件导入 Mock，避免在 isMock=false 时覆盖 wx.request
let Mock = null;

// 只有在需要时才导入
const initMock = () => {
  if (!Mock) {
    Mock = require('./WxMock');
  }
  return Mock;
};

// 导入包含path和data的对象
import loginMock from './login/index';
import homeMock from './home/index';
import searchMock from './search/index';
import dataCenter from './dataCenter/index';
import my from './my/index';
import studentMock from './student/index';
import teacherMock from './teacher/index';

export default () => {
  console.log('[Mock] Initializing mock data...');
  const MockInstance = initMock();

  // 在这里添加新的mock数据
  const mockData = [...loginMock, ...homeMock, ...searchMock, ...dataCenter, ...my, ...studentMock, ...teacherMock];

  mockData.forEach((item, index) => {
    console.log(`[Mock] Registering [${index}]:`, item.path, item.handler ? '(handler)' : '(data)');
    MockInstance.mock(item.path, item.handler || item.data);
  });
  console.log('[Mock] All endpoints registered');
};
