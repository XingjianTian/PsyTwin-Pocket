/**
 * 教师端 - 我的页面 Mock 数据
 */

const teacherInfo = {
  id: 't001',
  nickname: '王老师',
  avatar: 'https://picsum.photos/80/80?random=99',
  phone: '13800138000',
  role: 'teacher',
  teacherId: 'T2021001',
  department: '心理健康中心',
  title: '国家二级心理咨询师',
  qualifications: ['国家二级心理咨询师', '注册心理师', '沙盘游戏治疗师'],
  workStats: {
    totalCounseling: 186,
    totalHours: 248,
    thisMonthCounseling: 23,
    satisfactionRate: 4.8,
  },
  badges: [
    { name: '优秀咨询师', earned: true, icon: 'lock-on' },
    { name: '金牌导师', earned: true, icon: 'user' },
    { name: '心理达人', earned: true, icon: 'heart' },
    { name: '十佳教师', earned: false, icon: 'lock-on' },
  ],
};

const teacherProfile = {
  id: 't001',
  nickname: '王老师',
  avatar: 'https://picsum.photos/80/80?random=99',
  role: 'teacher',
  teacherId: 'T2021001',
  department: '心理健康中心',
  title: '国家二级心理咨询师',
  bio: '专注于大学生心理健康教育，擅长情绪管理、人际关系咨询',
  specialties: ['情绪管理', '人际关系', '学业压力', '职业规划'],
  workStats: {
    totalCounseling: 186,
    totalHours: 248,
    thisMonthCounseling: 23,
    satisfactionRate: 4.8,
  },
  schedule: {
    workDays: ['周一', '周二', '周三', '周四', '周五'],
    workHours: '09:00 - 17:00',
    availableSlots: [
      { day: '周一', slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
      { day: '周二', slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
      { day: '周三', slots: ['09:00-10:00', '10:00-11:00'] },
      { day: '周四', slots: ['14:00-15:00', '15:00-16:00'] },
      { day: '周五', slots: ['09:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'] },
    ],
  },
};

/**
 * 获取教师信息
 */
function getTeacherInfo() {
  return {
    code: 0,
    message: 'success',
    data: teacherInfo,
  };
}

/**
 * 获取教师档案
 */
function getTeacherProfile() {
  return {
    code: 0,
    message: 'success',
    data: teacherProfile,
  };
}

/**
 * 更新教师信息
 * @param {Object} data - 更新的数据
 */
function updateTeacherInfo(data) {
  Object.assign(teacherInfo, data);
  return {
    code: 0,
    message: 'success',
    data: teacherInfo,
  };
}

module.exports = {
  getTeacherInfo,
  getTeacherProfile,
  updateTeacherInfo,
};
