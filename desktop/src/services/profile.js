import { requestPocket, isSuccessResponse, unwrapData } from './pocket';

const studentProfile = {
  nickname: '张同学',
  avatar: 'https://picsum.photos/120/120?random=201',
  department: '计算机学院',
  studentId: '2024001',
  className: '软件工程 2401',
  stats: {
    counselingCount: 6,
    vrSessionCount: 3,
    totalMinutes: 420,
    assessmentCount: 4,
  },
  healthOverview: {
    riskLevel: 'low',
    trend: 'stable',
    dimensions: [
      { name: '情绪状态', score: 82 },
      { name: '睡眠质量', score: 74 },
      { name: '压力管理', score: 68 },
      { name: '社交关系', score: 88 },
    ],
  },
  lastAssessment: {
    date: '2026-04-03',
    conclusion: '最近整体状态稳定，睡眠与压力管理维度建议持续关注。',
  },
  badges: [
    { id: 1, name: '连续签到', earned: true, icon: 'star' },
    { id: 2, name: '积极表达', earned: true, icon: 'heart' },
    { id: 3, name: '心理探索者', earned: false, icon: 'lock-on' },
    { id: 4, name: '睡眠守护者', earned: false, icon: 'lock-on' },
  ],
};

const teacherProfile = {
  nickname: '王老师',
  avatar: 'https://picsum.photos/120/120?random=202',
  teacherId: 'T2021001',
  department: '心理健康中心',
  title: '国家二级心理咨询师',
  qualifications: ['国家二级心理咨询师', '注册心理师', '沙盘游戏治疗师'],
  workStats: {
    thisMonthCounseling: 23,
    totalCounseling: 186,
    totalHours: 248,
    satisfactionRate: 4.8,
  },
  badges: [
    { id: 1, name: '优秀咨询师', earned: true, icon: 'star' },
    { id: 2, name: '金牌导师', earned: true, icon: 'certificate' },
    { id: 3, name: '十佳教师', earned: false, icon: 'lock-on' },
  ],
};

function normalizeBadges(list, fallbackList) {
  if (!Array.isArray(list) || list.length === 0) {
    return fallbackList;
  }

  return list.map((item, index) => ({
    id: item.id || index + 1,
    name: item.name || item.title || `徽章 ${index + 1}`,
    earned: Boolean(item.earned),
    icon: item.icon || 'star',
  }));
}

function normalizeTeacherProfile(userInfo = {}) {
  return {
    nickname: userInfo.nickname || userInfo.name || teacherProfile.nickname,
    avatar: userInfo.avatar || teacherProfile.avatar,
    teacherId: userInfo.teacherId || userInfo.teacherNo || teacherProfile.teacherId,
    department: userInfo.department || teacherProfile.department,
    title: userInfo.title || teacherProfile.title,
    qualifications: Array.isArray(userInfo.qualifications) && userInfo.qualifications.length > 0
      ? userInfo.qualifications
      : teacherProfile.qualifications,
    workStats: {
      ...teacherProfile.workStats,
      ...(userInfo.workStats || userInfo.stats || {}),
    },
    badges: normalizeBadges(userInfo.badges, teacherProfile.badges),
  };
}

export function getGridList(role) {
  if (role === 'teacher') {
    return [
      { name: '我的排班', icon: 'calendar', color: 'purple' },
      { name: '学生管理', icon: 'usergroup', color: 'blue' },
      { name: '预警列表', icon: 'error', color: 'orange', route: '/warnings' },
      { name: '数据中心', icon: 'chart', color: 'green', route: '/data-center' },
    ];
  }

  return [
    { name: '我的档案', icon: 'user', color: 'purple' },
    { name: '服务预约', icon: 'calendar', color: 'blue', route: '/appointment' },
    { name: '心理测评', icon: 'edit', color: 'green' },
    { name: 'VR 记录', icon: 'video', color: 'orange' },
  ];
}

export function getMenuList(role) {
  if (role === 'teacher') {
    return [
      { name: '工作时间', icon: 'time', color: 'purple' },
      { name: '预警设置', icon: 'error', color: 'orange' },
      { name: '消息通知', icon: 'notification', color: 'blue', route: '/notification' },
      { name: '联系客服', icon: 'service', color: 'gray' },
      { name: '设置', icon: 'setting', color: 'gray' },
    ];
  }

  return [
    { name: '我的收藏', icon: 'star', color: 'orange' },
    { name: '浏览历史', icon: 'time', color: 'blue' },
    { name: '消息通知', icon: 'notification', color: 'purple', route: '/notification' },
    { name: '隐私设置', icon: 'lock-on', color: 'green' },
    { name: '联系客服', icon: 'service', color: 'gray' },
    { name: '设置', icon: 'setting', color: 'gray' },
  ];
}

export function getProfile(role = 'student') {
  return role === 'teacher' ? teacherProfile : studentProfile;
}

export async function fetchProfile(role = 'student') {
  if (role === 'teacher') {
    try {
      const response = await requestPocket({
        method: 'GET',
        url: '/teacher/my/info',
      });

      if (!isSuccessResponse(response)) {
        return teacherProfile;
      }

      return normalizeTeacherProfile(unwrapData(response) || {});
    } catch (error) {
      return teacherProfile;
    }
  }

  try {
    const response = await requestPocket({
      method: 'GET',
      url: '/student/my/info',
    });

    if (!isSuccessResponse(response)) {
      return studentProfile;
    }

    const userInfo = unwrapData(response) || {};
    const riskLevel = String(userInfo.riskLevel || userInfo.healthOverview?.riskLevel || 'low').toLowerCase();

    return {
      nickname: userInfo.nickname || userInfo.name || studentProfile.nickname,
      avatar: userInfo.avatar || studentProfile.avatar,
      department: userInfo.department || studentProfile.department,
      studentId: userInfo.studentId || userInfo.studentNo || studentProfile.studentId,
      className: userInfo.className || studentProfile.className,
      stats: {
        ...studentProfile.stats,
        ...(userInfo.stats || {}),
      },
      healthOverview: userInfo.healthOverview || {
        riskLevel,
        trend: 'stable',
        dimensions: studentProfile.healthOverview.dimensions,
      },
      lastAssessment: userInfo.lastAssessment || studentProfile.lastAssessment,
      badges: Array.isArray(userInfo.badges) && userInfo.badges.length > 0 ? userInfo.badges : studentProfile.badges,
    };
  } catch (error) {
    return studentProfile;
  }
}
