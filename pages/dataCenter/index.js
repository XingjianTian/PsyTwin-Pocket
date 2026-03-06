import request from '~/api/request';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 角色
    role: 'teacher',

    // 预警统计
    warningStats: {
      high: 0,
      medium: 0,
      low: 0,
    },
    warningList: [],
    warningFilter: 'all', // all/high/medium/low

    // 今日日程
    scheduleStats: {
      total: 0,
      completed: 0,
      upcoming: 0,
      ongoing: 0,
    },
    scheduleList: [],
    scheduleExpanded: false,

    // 快捷入口
    quickEntries: [
      { name: '学生档案', icon: 'usergroup', color: '#722ed1', url: '/pages/teacher/student-list/index' },
      { name: '预约管理', icon: 'calendar', color: '#1890ff', url: '/pages/teacher/appointment-manage/index' },
      { name: '咨询记录', icon: 'file', color: '#52c41a', url: '' },
      { name: '发布通知', icon: 'notification', color: '#fa8c16', url: '' },
      { name: '数据报表', icon: 'chart', color: '#13c2c2', url: '' },
    ],

    // 工作统计
    workStats: {
      thisMonthCounseling: 0,
      thisMonthCounselingTrend: 0,
      totalHours: 0,
      totalHoursTrend: 0,
      resolvedWarnings: 0,
      resolvedWarningsTrend: 0,
      satisfactionRate: 0,
      satisfactionRateTrend: 0,
    },
  },

  onLoad() {
    this.init();
  },

  onShow() {
    this.init();
  },

  init() {
    // 检查角色
    const role = wx.getStorageSync('user_role') || 'student';
    this.setData({ role });

    // 如果不是教师角色，提示并返回
    if (role !== 'teacher') {
      wx.showToast({
        title: '仅限教师访问',
        icon: 'none',
      });
      return;
    }

    // 加载数据
    this.loadWarnings();
    this.loadSchedule();
    this.loadWorkStats();
  },

  // ===== 预警看板 =====

  /**
   * 加载预警数据
   */
  loadWarnings() {
    // 使用本地 Mock 数据
    const mockData = {
      list: [
        {
          id: 'w1',
          studentId: 's2021001',
          studentName: '张三',
          avatar: 'https://picsum.photos/80/80?random=11',
          riskLevel: 'high',
          riskReason: '聊天中出现自伤倾向关键词',
          triggerSource: 'chat',
          triggeredAt: '2026-03-06T15:30:00',
          status: 'pending',
          assignedTo: 't001',
          lastAction: null,
        },
        {
          id: 'w2',
          studentId: 's2021002',
          studentName: '李四',
          avatar: 'https://picsum.photos/80/80?random=12',
          riskLevel: 'high',
          riskReason: '连续3天情绪评分低于-0.8',
          triggerSource: 'assessment',
          triggeredAt: '2026-03-06T14:20:00',
          status: 'processing',
          assignedTo: 't001',
          lastAction: {
            type: 'message',
            content: '已发送关怀消息',
            time: '2026-03-06T14:30:00',
          },
        },
        {
          id: 'w3',
          studentId: 's2021003',
          studentName: '王五',
          avatar: 'https://picsum.photos/80/80?random=13',
          riskLevel: 'medium',
          riskReason: '周活跃度下降60%，发布负面动态',
          triggerSource: 'post',
          triggeredAt: '2026-03-06T10:15:00',
          status: 'pending',
          assignedTo: 't001',
          lastAction: null,
        },
      ],
      stats: {
        high: 2,
        medium: 3,
        low: 5,
      },
    };

    this.setData({
      warningList: mockData.list,
      warningStats: mockData.stats,
    });
  },

  /**
   * 切换预警筛选
   */
  onWarningFilterChange(e) {
    const { level } = e.currentTarget.dataset;
    this.setData({ warningFilter: level });

    // 筛选数据
    const allData = this.data.warningList;
    if (level === 'all') {
      this.loadWarnings();
    } else {
      const filtered = allData.filter((item) => item.riskLevel === level);
      this.setData({ warningList: filtered });
    }
  },

  /**
   * 点击预警项
   */
  onWarningTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/teacher/warning-list/index?id=${id}`,
    });
  },

  /**
   * 查看全部预警
   */
  onViewAllWarnings() {
    wx.navigateTo({
      url: '/pages/teacher/warning-list/index',
    });
  },

  // ===== 今日日程 =====

  /**
   * 加载今日日程
   */
  loadSchedule() {
    const mockData = {
      list: [
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
      ],
      stats: {
        total: 4,
        completed: 2,
        upcoming: 2,
        ongoing: 0,
      },
    };

    this.setData({
      scheduleList: mockData.list,
      scheduleStats: mockData.stats,
    });
  },

  /**
   * 展开/收起日程
   */
  onToggleSchedule() {
    this.setData({
      scheduleExpanded: !this.data.scheduleExpanded,
    });
  },

  /**
   * 点击日程项
   */
  onScheduleTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item.type === 'counseling' && item.status === 'ongoing') {
      wx.showModal({
        title: '开始咨询',
        content: `确认为 ${item.studentName} 开始咨询？`,
        success: (res) => {
          if (res.confirm) {
            wx.showToast({ title: '咨询已开始', icon: 'success' });
          }
        },
      });
    }
  },

  // ===== 快捷入口 =====

  /**
   * 点击快捷入口
   */
  onQuickEntryTap(e) {
    const { url, name } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: `${name} 功能开发中`, icon: 'none' });
    }
  },

  // ===== 工作统计 =====

  /**
   * 加载工作统计
   */
  loadWorkStats() {
    const mockData = {
      thisMonthCounseling: 23,
      thisMonthCounselingTrend: 15,
      totalHours: 186,
      totalHoursTrend: 8,
      resolvedWarnings: 45,
      resolvedWarningsTrend: -5,
      satisfactionRate: 4.8,
      satisfactionRateTrend: 0.2,
    };

    this.setData({
      workStats: mockData,
    });
  },

  // ===== 原有方法（保留兼容） =====

  getMemberData() {
    // 保留原有方法
  },

  getInteractionData() {
    // 保留原有方法
  },

  getCompleteRateData() {
    // 保留原有方法
  },

  getAreaData() {
    // 保留原有方法
  },
});
