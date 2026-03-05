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

    if (token) {
      const userInfo = await this.getUserInfo();
      const earnedBadgeCount = (userInfo.badges || []).filter((b) => b.earned).length;
      const riskLevel = userInfo.healthOverview?.riskLevel || 'low';
      const trend = userInfo.healthOverview?.trend || 'stable';

      this.setData({
        role,
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
        role,
        gridList: this.getGridList(role),
        menuList: this.getMenuList(role),
      });
    }
  },

  async getUserInfo() {
    try {
      const res = await request('/mock/student/my/info');
      return res.data || {};
    } catch (err) {
      return {
        nickname: '用户',
        avatar: '',
        role: this.data.role,
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
        { name: '心理测评', icon: 'edit-1', color: 'green', url: '' },
        { name: 'VR 记录', icon: 'tv', color: 'orange', url: '' },
      ];
    }
    return [
      { name: '我的排班', icon: 'calendar', color: 'purple', url: '' },
      { name: '学生管理', icon: 'user-group', color: 'blue', url: '' },
      { name: '预警列表', icon: 'error-circle', color: 'orange', url: '' },
      { name: '数据中心', icon: 'chart', color: 'green', url: '/pages/dataCenter/index' },
    ];
  },

  // ===== 菜单配置 =====

  getMenuList(role) {
    if (role === 'student') {
      return [
        { name: '我的收藏', icon: 'star', color: 'orange', url: '', badge: '' },
        { name: '浏览历史', icon: 'history', color: 'blue', url: '', badge: '' },
        { name: '消息通知', icon: 'notification', color: 'purple', url: '', badge: '3' },
        { name: '隐私设置', icon: 'lock-on', color: 'green', url: '', badge: '' },
        { name: '联系客服', icon: 'service', color: 'gray', url: '', badge: '' },
        { name: '设置', icon: 'setting', color: 'gray', url: '/pages/setting/index', badge: '' },
      ];
    }
    return [
      { name: '工作时间', icon: 'time', color: 'purple', url: '', badge: '' },
      { name: '预警设置', icon: 'error-circle', color: 'orange', url: '', badge: '' },
      { name: '消息通知', icon: 'notification', color: 'blue', url: '', badge: '' },
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
