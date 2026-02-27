// 学生用户信息
const getStudentInfo = (req) => {
  return {
    success: true,
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
      profile: {
        riskLevel: 'low',
        lastAssessment: '2026-01-15',
        counselingCount: 2,
        vrSessionCount: 5,
      },
    },
  };
};

// 学生心理档案
const getStudentProfile = (req) => {
  return {
    success: true,
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
        trend: 'stable', // stable, improving, worsening
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
