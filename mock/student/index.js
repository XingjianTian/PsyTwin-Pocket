import { getFeed } from './home/getFeed';
import { getSessions } from './message/getSessions';
import { getServices, getRecords } from './appointment/getAppointment';
import { getStudentInfo, getStudentProfile } from './my/getInfo';

// 模拟请求对象
const mockReq = { data: {} };

export default [
  {
    path: '/mock/student/home/feed',
    data: getFeed(mockReq).data,
  },
  {
    path: '/mock/student/message/sessions',
    data: getSessions(mockReq).data,
  },
  {
    path: '/mock/student/appointment/services',
    data: getServices(mockReq).data,
  },
  {
    path: '/mock/student/appointment/records',
    data: getRecords(mockReq).data,
  },
  {
    path: '/mock/student/my/info',
    data: getStudentInfo(mockReq).data,
  },
  {
    path: '/mock/student/my/profile',
    data: getStudentProfile(mockReq).data,
  },
];
