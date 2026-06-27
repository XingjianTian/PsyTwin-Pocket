import { createRouter, createWebHashHistory } from 'vue-router';

import AppShell from '@/layouts/AppShell.vue';
import AppointmentPage from '@/pages/AppointmentPage.vue';
import ChatPage from '@/pages/ChatPage.vue';
import DataCenterPage from '@/pages/DataCenterPage.vue';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import MessagePage from '@/pages/MessagePage.vue';
import MyPage from '@/pages/MyPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';
import NotificationPage from '@/pages/NotificationPage.vue';
import PostDetailPage from '@/pages/PostDetailPage.vue';
import ReleasePage from '@/pages/ReleasePage.vue';
import SearchPage from '@/pages/SearchPage.vue';
import WarningsPage from '@/pages/WarningsPage.vue';

const routes = [
  {
    path: '/',
    component: AppShell,
    children: [
      {
        path: '',
        redirect: '/login',
      },
      {
        path: '/login',
        name: 'login',
        component: LoginPage,
        meta: {
          public: true,
          showTabBar: false,
          title: '登录',
        },
      },
      {
        path: '/home',
        name: 'home',
        component: HomePage,
        meta: {
          title: '心墙',
          roles: ['student', 'teacher'],
        },
      },
      {
        path: '/message',
        name: 'message',
        component: MessagePage,
        meta: {
          title: 'AI',
          roles: ['student', 'teacher'],
        },
      },
      {
        path: '/chat',
        name: 'chat',
        component: ChatPage,
        meta: {
          title: 'AI 对话',
          roles: ['student', 'teacher'],
          showTabBar: false,
        },
      },
      {
        path: '/appointment',
        name: 'appointment',
        component: AppointmentPage,
        meta: {
          title: '预约',
          roles: ['student'],
        },
      },
      {
        path: '/my',
        name: 'my',
        component: MyPage,
        meta: {
          title: '我的',
          roles: ['student', 'teacher'],
        },
      },
      {
        path: '/data-center',
        name: 'data-center',
        component: DataCenterPage,
        meta: {
          title: '工作台',
          roles: ['teacher'],
        },
      },
      {
        path: '/warnings',
        name: 'warnings',
        component: WarningsPage,
        meta: {
          title: '预警列表',
          roles: ['teacher'],
          showTabBar: false,
        },
      },
      {
        path: '/post-detail',
        name: 'post-detail',
        component: PostDetailPage,
        meta: {
          title: '帖子详情',
          roles: ['student', 'teacher'],
          showTabBar: false,
        },
      },
      {
        path: '/search',
        name: 'search',
        component: SearchPage,
        meta: {
          title: '搜索',
          roles: ['student', 'teacher'],
          showTabBar: false,
        },
      },
      {
        path: '/notification',
        name: 'notification',
        component: NotificationPage,
        meta: {
          title: '消息通知',
          roles: ['student', 'teacher'],
          showTabBar: false,
        },
      },
      {
        path: '/release',
        name: 'release',
        component: ReleasePage,
        meta: {
          title: '发布动态',
          roles: ['student', 'teacher'],
          showTabBar: false,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: AppShell,
    children: [
      {
        path: '',
        name: 'not-found-inner',
        component: NotFoundPage,
        meta: {
          public: true,
          showTabBar: false,
          title: '页面不存在',
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  const role = window.localStorage.getItem('psytwin.desktop.role') || 'student';
  const token = window.localStorage.getItem('psytwin.desktop.token');
  const isPublic = Boolean(to.meta.public);
  const allowedRoles = to.meta.roles || [];

  if (!isPublic && !token) {
    return { name: 'login' };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return role === 'teacher' ? { name: 'data-center' } : { name: 'home' };
  }

  return true;
});

export default router;
