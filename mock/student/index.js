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
    path: '/student/home/feed',
    handler: getFeed,
  },
  {
    path: '/student/home/posts/:id',
    handler: getPostDetail,
  },
  {
    path: '/student/home/posts/:id/comments',
    handler: getComments,
  },
  {
    path: '/student/home/posts/:id/like',
    handler: postLike,
  },
  {
    path: '/student/home/posts/:id/comments',
    handler: postComment,
  },
  {
    path: '/student/message/sessions',
    data: getSessions(mockReq).data,
  },
  {
    path: '/student/appointment/services',
    data: getServices(mockReq).data,
  },
  {
    path: '/student/appointment/records',
    data: getRecords(mockReq).data,
  },
  {
    path: '/student/my/info',
    data: getStudentInfo(mockReq).data,
  },
  {
    path: '/student/my/profile',
    data: getStudentProfile(mockReq).data,
  },
];
