import { getFeed } from './home/getFeed';
import { getPostDetail } from './home/getPostDetail';
import { getComments } from './home/getComments';
import { postLike } from './home/postLike';
import { postComment } from './home/postComment';
import { getSessions } from './message/getSessions';
import { getServices, getRecords } from './appointment/getAppointment';
import { getStudentInfo, getStudentProfile } from './my/getInfo';

// 模拟请求对象
const mockReq = { data: {} };

export default [
  {
    path: '/mock/student/home/feed',
    handler: getFeed,
  },
  {
    path: '/mock/student/home/post-detail',
    handler: getPostDetail,
  },
  {
    path: '/mock/student/home/comments',
    handler: getComments,
  },
  {
    path: '/mock/student/home/post-like',
    handler: postLike,
  },
  {
    path: '/mock/student/home/post-comment',
    handler: postComment,
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
