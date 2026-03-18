import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

const app = getApp();

// 风险等级映射
const RISK_LEVEL_MAP = {
  low: '心理状态良好',
  medium: '需要适当关注',
  high: '建议尽快咨询',
};

// 趋势映射
const TREND_MAP = {
  improving: { text: '持续好转', icon: 'arrow-up' },
  stable: { text: '保持稳定', icon: 'remove' },
  worsening: { text: '需要关注', icon: 'arrow-down' },
};

Page({
  behaviors: [useToastBehavior],

  data: {
    isLoad: false,
    role: 'student',
    userInfo: {},
    gridList: [],
    menuList: [],

    // 计算属性
    riskLevelText: '',
    trendText: '',
    trendIcon: '',
    earnedBadgeCount: 0,
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.initData();
  },

  // ===== 初始化 =====

  async initData() {
    const role = wx.getStorageSync('user_role') || 'student';
    const token = wx.getStorageSync('access_token');

    // 先设置角色，确保后续请求使用正确的角色
    this.setData({ role });

    if (token) {
      const userInfo = await this.getUserInfo();
      const earnedBadgeCount = (userInfo.badges || []).filter((b) => b.earned).length;
      // 适配后端数据结构：riskLevel 在顶层，构造 healthOverview
      const riskLevel = (userInfo.riskLevel || 'low').toLowerCase();
      const trend = 'stable'; // 后端暂无 trend 字段，使用默认值

      // 构造 healthOverview 对象（如果后端没返回）
      if (!userInfo.healthOverview) {
        userInfo.healthOverview = {
          riskLevel: riskLevel,
          riskScore: riskLevel === 'low' ? 0.15 : riskLevel === 'medium' ? 0.45 : 0.75,
          trend: trend,
          dimensions: [
            { name: '情绪状态', score: 82 },
            { name: '睡眠质量', score: 74 },
            { name: '压力管理', score: 68 },
            { name: '社交关系', score: 88 },
          ],
        };
      }

      this.setData({
        isLoad: true,
        userInfo,
        earnedBadgeCount,
        riskLevelText: RISK_LEVEL_MAP[riskLevel] || '心理状态良好',
        trendText: TREND_MAP[trend]?.text || '保持稳定',
        trendIcon: TREND_MAP[trend]?.icon || 'remove',
        gridList: this.getGridList(role),
        menuList: this.getMenuList(role),
      });
    } else {
      this.setData({
        gridList: this.getGridList(role),
        menuList: this.getMenuList(role),
      });
    }
  },

  async getUserInfo() {
    const role = this.data.role;
    console.log('[MyPage] getUserInfo, role:', role);

    // 教师角色：直接返回 Mock 数据（避免请求失败）
    if (role === 'teacher') {
      return {
        nickname: '王老师',
        avatar: 'https://picsum.photos/80/80?random=99',
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
    }

    // 学生角色：请求 API
    try {
      const res = await request('/student/my/info');
      console.log('[MyPage] Student response:', res);
      return res.data || {};
    } catch (err) {
      console.error('[MyPage] getUserInfo error:', err);
      return {
        nickname: '用户',
        avatar: '',
        role: 'student',
        stats: { counselingCount: 0, vrSessionCount: 0, totalMinutes: 0, assessmentCount: 0 },
        healthOverview: { riskLevel: 'low', trend: 'stable', dimensions: [] },
        lastAssessment: { date: '暂无', conclusion: '尚未进行测评' },
        badges: [],
      };
    }
  },

  // ===== 宫格配置 =====

  getGridList(role) {
    if (role === 'student') {
      return [
        { name: '我的档案', icon: 'user', color: 'purple', url: '/pages/my/info-edit/index' },
        { name: '服务预约', icon: 'calendar', color: 'blue', url: '/pages/appointment/index' },
        { name: '心理测评', icon: 'edit-1', color: 'green', url: '/pages/assessment/index' },
        { name: 'VR 记录', icon: 'video', color: 'orange', url: '/pages/vr-record/index' },
      ];
    }
    return [
      { name: '我的排班', icon: 'calendar', color: 'purple', url: '/pages/teacher/schedule/index' },
      { name: '学生管理', icon: 'usergroup', color: 'blue', url: '/pages/teacher/student-list/index' },
      { name: '预警列表', icon: 'error', color: 'orange', url: '/pages/teacher/warning-list/index' },
      { name: '数据中心', icon: 'chart', color: 'green', url: '/pages/dataCenter/index' },
    ];
  },

  // ===== 菜单配置 =====

  getMenuList(role) {
    if (role === 'student') {
      return [
        { name: '我的收藏', icon: 'star', color: 'orange', url: '', badge: '' },
        { name: '浏览历史', icon: 'time', color: 'blue', url: '', badge: '' },
        { name: '消息通知', icon: 'notification', color: 'purple', url: '/pages/notification/index', badge: '3' },
        { name: '隐私设置', icon: 'lock', color: 'green', url: '', badge: '' },
        { name: '联系客服', icon: 'service', color: 'gray', url: '', badge: '' },
        { name: '设置', icon: 'setting', color: 'gray', url: '/pages/setting/index', badge: '' },
      ];
    }
    return [
      { name: '工作时间', icon: 'time', color: 'purple', url: '', badge: '' },
      { name: '预警设置', icon: 'error', color: 'orange', url: '', badge: '' },
      { name: '消息通知', icon: 'notification', color: 'blue', url: '/pages/notification/index', badge: '' },
      { name: '联系客服', icon: 'service', color: 'gray', url: '', badge: '' },
      { name: '设置', icon: 'setting', color: 'gray', url: '/pages/setting/index', badge: '' },
    ];
  },

  // ===== 事件处理 =====

  onGridTap(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      // 预约页是 tabBar 页面，用 switchTab
      if (url.includes('appointment')) {
        wx.switchTab({ url });
      } else {
        wx.navigateTo({ url });
      }
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  },

  onMenuTap(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    } else {
      wx.showToast({ title: '功能开发中', icon: 'none' });
    }
  },

  onEditProfile() {
    wx.navigateTo({ url: '/pages/my/info-edit/index' });
  },

  onGoSetting() {
    wx.navigateTo({ url: '/pages/setting/index' });
  },

  onGoAssessment() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/login/login' });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      confirmColor: '#ef4444',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.reLaunch({ url: '/pages/login/login' });
        }
      },
    });
  },
});
