// 预约服务（咨询室/体验室）列表
const getServices = (req) => {
  return {
    code: 0,
    message: '获取成功',
    data: [
      {
        id: 1,
        name: '心理咨询室 A01',
        type: 'counseling',
        description: '专业心理咨询师一对一深度咨询',
        duration: 50,
        location: '学生活动中心 3 层',
        icon: 'counseling',
        status: 'available', // available / busy / maintenance
        currentUser: null,
        devices: [
          { name: 'Pico 4 Enterprise', online: true },
          { name: '小米手环 9', online: true },
        ],
        availableTimes: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
      },
      {
        id: 2,
        name: '心理咨询室 A02',
        type: 'counseling',
        description: '专业心理咨询师一对一深度咨询',
        duration: 50,
        location: '学生活动中心 3 层',
        icon: 'counseling',
        status: 'busy',
        currentUser: {
          name: '张同学',
          studentId: '2024001',
          plan: '社交焦虑脱敏',
          usedMinutes: 25,
          totalMinutes: 50,
        },
        devices: [
          { name: 'Pico 4 Enterprise', online: true },
          { name: '小米手环 9', online: true },
        ],
        availableTimes: ['14:00', '14:30', '15:00', '15:30', '16:00'],
      },
      {
        id: 3,
        name: 'VR 减压舱 B01',
        type: 'vr',
        description: 'VR 放松训练、冥想引导、场景暴露疗法',
        duration: 30,
        location: '图书馆 2 层',
        icon: 'vr',
        status: 'available',
        currentUser: null,
        devices: [
          { name: 'Pico 4 Enterprise', online: true },
          { name: '生物反馈仪', online: false },
        ],
        availableTimes: ['10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'],
      },
      {
        id: 4,
        name: 'VR 体验区 C01',
        type: 'vr',
        description: '沉浸式心理体验与脱敏训练',
        duration: 30,
        location: '心理健康教育中心',
        icon: 'vr',
        status: 'maintenance',
        currentUser: null,
        devices: [
          { name: 'Pico 4 Enterprise', online: false },
          { name: '小米手环 8', online: false },
        ],
        availableTimes: [],
      },
      {
        id: 5,
        name: '团体活动室 D01',
        type: 'group',
        description: '6-10 人团体辅导，增强社交技能',
        duration: 90,
        location: '学生活动中心 305',
        icon: 'group',
        status: 'available',
        currentUser: null,
        devices: [],
        availableTimes: ['14:00', '15:30'],
      },
    ],
  };
};

// 预约记录
const getRecords = (req) => {
  return {
    code: 0,
    message: '获取成功',
    data: [
      {
        id: 101,
        serviceId: 1,
        serviceName: '心理咨询室 A01',
        serviceType: 'counseling',
        date: '2026-03-08',
        time: '14:00',
        status: 'pending', // pending / confirmed / completed / cancelled
        reason: '最近睡眠质量较差，想了解改善方法',
        createdAt: '2026-03-05',
        cancelable: true,
        location: '学生活动中心 3 层',
        counselor: '王老师',
      },
      {
        id: 102,
        serviceId: 3,
        serviceName: 'VR 减压舱 B01',
        serviceType: 'vr',
        date: '2026-03-06',
        time: '15:00',
        status: 'confirmed',
        reason: '',
        createdAt: '2026-03-04',
        cancelable: true,
        location: '图书馆 2 层',
        counselor: null,
      },
      {
        id: 103,
        serviceId: 2,
        serviceName: '心理咨询室 A02',
        serviceType: 'counseling',
        date: '2026-02-20',
        time: '10:00',
        status: 'completed',
        reason: '考前焦虑，情绪管理',
        createdAt: '2026-02-18',
        cancelable: false,
        location: '学生活动中心 3 层',
        counselor: '李老师',
      },
      {
        id: 104,
        serviceId: 4,
        serviceName: 'VR 体验区 C01',
        serviceType: 'vr',
        date: '2026-02-10',
        time: '14:30',
        status: 'cancelled',
        reason: '',
        createdAt: '2026-02-08',
        cancelable: false,
        location: '心理健康教育中心',
        counselor: null,
      },
    ],
  };
};

module.exports = {
  getServices,
  getRecords,
};
