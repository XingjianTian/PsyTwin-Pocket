/**
 * 教师端工作台 - 今日日程 Mock
 */

const todaySchedule = [
  {
    id: 's1',
    type: 'counseling',
    title: '心理咨询',
    studentName: '张三',
    studentId: 's2021001',
    avatar: 'https://picsum.photos/80/80?random=21',
    startTime: '09:00',
    endTime: '09:50',
    location: '心理咨询室A',
    status: 'completed',
    notes: '学业压力咨询',
  },
  {
    id: 's2',
    type: 'counseling',
    title: '心理咨询',
    studentName: '李四',
    studentId: 's2021002',
    avatar: 'https://picsum.photos/80/80?random=22',
    startTime: '10:30',
    endTime: '11:20',
    location: '心理咨询室A',
    status: 'completed',
    notes: '人际关系困扰',
  },
  {
    id: 's3',
    type: 'counseling',
    title: '心理咨询',
    studentName: '王五',
    studentId: 's2021003',
    avatar: 'https://picsum.photos/80/80?random=23',
    startTime: '14:00',
    endTime: '14:50',
    location: '心理咨询室B',
    status: 'upcoming',
    notes: '情绪管理',
  },
  {
    id: 's4',
    type: 'duty',
    title: 'VR设备值班',
    studentName: null,
    studentId: null,
    avatar: null,
    startTime: '15:00',
    endTime: '17:00',
    location: 'VR体验中心',
    status: 'upcoming',
    notes: '负责VR设备管理与指导',
  },
  {
    id: 's5',
    type: 'counseling',
    title: '心理咨询',
    studentName: '赵六',
    studentId: 's2021004',
    avatar: 'https://picsum.photos/80/80?random=24',
    startTime: '16:00',
    endTime: '16:50',
    location: '心理咨询室A',
    status: 'upcoming',
    notes: '职业规划咨询',
  },
];

/**
 * 获取今日日程
 * @returns {Object} 日程数据
 */
function getTodaySchedule() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  // 自动更新状态
  const schedule = todaySchedule.map((item) => {
    const [startHour, startMinute] = item.startTime.split(':').map(Number);
    const [endHour, endMinute] = item.endTime.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    let status = item.status;
    if (currentTime > end && status !== 'cancelled') {
      status = 'completed';
    } else if (currentTime >= start && currentTime <= end && status !== 'cancelled') {
      status = 'ongoing';
    }

    return { ...item, status };
  });

  // 统计
  const stats = {
    total: schedule.length,
    completed: schedule.filter((s) => s.status === 'completed').length,
    upcoming: schedule.filter((s) => s.status === 'upcoming').length,
    ongoing: schedule.filter((s) => s.status === 'ongoing').length,
  };

  return {
    code: 0,
    message: 'success',
    data: {
      list: schedule,
      stats,
    },
  };
}

/**
 * 更新日程状态
 * @param {string} id - 日程ID
 * @param {string} status - 新状态
 */
function updateScheduleStatus(id, status) {
  const schedule = todaySchedule.find((s) => s.id === id);
  if (!schedule) {
    return {
      code: 404,
      message: '日程不存在',
      data: null,
    };
  }

  schedule.status = status;
  return {
    code: 0,
    message: 'success',
    data: schedule,
  };
}

module.exports = {
  getTodaySchedule,
  updateScheduleStatus,
};
