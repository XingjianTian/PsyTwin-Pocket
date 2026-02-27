// 预约服务列表
const getServices = (req) => {
  return {
    success: true,
    message: '获取成功',
    data: [
      {
        id: 1,
        name: '心理咨询室',
        type: 'counseling',
        description: '专业心理咨询师一对一咨询',
        duration: 50,
        location: '学生活动中心 302',
        icon: '🧠',
        availableTimes: [
          '09:00',
          '09:30',
          '10:00',
          '10:30',
          '11:00',
          '11:30',
          '14:00',
          '14:30',
          '15:00',
          '15:30',
          '16:00',
          '16:30',
        ],
      },
      {
        id: 2,
        name: 'VR 心理体验',
        type: 'vr',
        description: 'VR 放松训练、场景暴露疗法',
        duration: 30,
        location: '心理中心 101',
        icon: '🥽',
        availableTimes: ['10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
      },
      {
        id: 3,
        name: '团体活动室',
        type: 'group',
        description: '6-10 人团体辅导',
        duration: 90,
        location: '学生活动中心 305',
        icon: '👥',
        availableTimes: ['14:00', '15:30'],
      },
    ],
  };
};

// 预约记录
const getRecords = (req) => {
  return {
    success: true,
    message: '获取成功',
    data: [
      {
        id: 101,
        serviceId: 1,
        serviceName: '心理咨询室',
        date: '2026-03-01',
        time: '14:00',
        status: 'pending',
        reason: '最近睡眠不好，想咨询一下',
        createdAt: '2026-02-26',
        cancelable: true,
      },
      {
        id: 102,
        serviceId: 2,
        serviceName: 'VR 心理体验',
        date: '2026-02-20',
        time: '15:00',
        status: 'completed',
        reason: '',
        createdAt: '2026-02-18',
        cancelable: false,
      },
    ],
  };
};

module.exports = {
  getServices,
  getRecords,
};
