// 学生用户信息
const getStudentInfo = (req) => {
  return {
    code: 0,
    message: '获取成功',
    data: {
      id: 'stu001',
      nickname: '小明同学',
      avatar: 'https://picsum.photos/200/200?random=200',
      phone: '138****8888',
      role: 'student',
      studentId: '2023001001',
      department: '计算机学院',
      className: '软件工程 2301 班',
      joinDate: '2023-09',
      // 心理健康概览
      healthOverview: {
        riskLevel: 'low', // low / medium / high
        riskScore: 0.15, // 0~1，越低越健康
        trend: 'improving', // stable / improving / worsening
        // 各维度得分（0~100，越高越健康）
        dimensions: [
          { name: '情绪状态', score: 82 },
          { name: '睡眠质量', score: 74 },
          { name: '压力管理', score: 68 },
          { name: '社交关系', score: 88 },
        ],
      },
      // 活动统计
      stats: {
        counselingCount: 2,
        vrSessionCount: 5,
        assessmentCount: 3,
        totalMinutes: 185,
        lastActiveDate: '2026-03-01',
      },
      // 最近测评
      lastAssessment: {
        type: 'SCL-90',
        date: '2026-01-15',
        score: 72, // 综合得分 0~100
        conclusion: '心理状态良好，继续保持',
      },
      // 成就徽章
      badges: [
        { id: 1, name: '初次咨询', icon: 'chat', earned: true, desc: '完成首次心理咨询' },
        { id: 2, name: 'VR 探索者', icon: 'desktop', earned: true, desc: '体验 VR 心理训练 5 次' },
        { id: 3, name: '坚持打卡', icon: 'calendar', earned: true, desc: '连续记录心情 7 天' },
        { id: 4, name: '心理达人', icon: 'star', earned: false, desc: '完成 5 次心理咨询' },
      ],
    },
  };
};

// 学生心理档案（详细）
const getStudentProfile = (req) => {
  return {
    code: 0,
    message: '获取成功',
    data: {
      basicInfo: {
        name: '小明同学',
        studentId: '2023001001',
        department: '计算机学院',
        className: '软件工程 2301 班',
      },
      psychologicalProfile: {
        riskLevel: 'low',
        riskScore: 0.15,
        trend: 'improving',
        lastAssessment: '2026-01-15',
        assessmentType: 'SCL-90',
      },
      records: {
        counselingCount: 2,
        lastCounseling: '2026-01-10',
        vrSessionCount: 5,
        lastVrSession: '2026-02-20',
      },
    },
  };
};

module.exports = {
  getStudentInfo,
  getStudentProfile,
};
