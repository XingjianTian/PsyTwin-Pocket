import Mock from './WxMock';
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
  // 在这里添加新的mock数据
  const mockData = [...loginMock, ...homeMock, ...searchMock, ...dataCenter, ...my, ...studentMock, ...teacherMock];

  mockData.forEach((item, index) => {
    console.log(`[Mock] Registering [${index}]:`, item.path, item.handler ? '(handler)' : '(data)');
    Mock.mock(item.path, item.handler || item.data);
  });
  console.log('[Mock] All endpoints registered');
};
