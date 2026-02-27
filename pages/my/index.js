import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

const app = getApp();

Page({
  behaviors: [useToastBehavior],

  data: {
    isLoad: false,
    role: 'student',
    userInfo: {},
    gridList: [],
    menuList: [],
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.initData();
  },

  async initData() {
    const role = wx.getStorageSync('user_role') || 'student';
    const token = wx.getStorageSync('access_token');

    if (token) {
      const userInfo = await this.getUserInfo();

      this.setData({
        role,
        isLoad: true,
        userInfo,
        gridList: this.getGridList(role),
        menuList: this.getMenuList(role),
      });
    } else {
      this.setData({ role });
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
      };
    }
  },

  getGridList(role) {
    if (role === 'student') {
      return [
        { name: '我的档案', icon: '📋', url: '/pages/my/info-edit/index' },
        { name: '服务预约', icon: '📅', url: '/pages/appointment/index' },
        { name: '心理测评', icon: '📝', url: '' },
        { name: 'VR 记录', icon: '🥽', url: '' },
      ];
    } else {
      return [
        { name: '我的排班', icon: '📅', url: '' },
        { name: '学生管理', icon: '👥', url: '' },
        { name: '预警列表', icon: '⚠️', url: '' },
        { name: '数据中心', icon: '📊', url: '/pages/dataCenter/index' },
      ];
    }
  },

  getMenuList(role) {
    if (role === 'student') {
      return [
        { name: '我的收藏', icon: '⭐', url: '' },
        { name: '浏览历史', icon: '📖', url: '' },
        { name: '消息通知', icon: '🔔', url: '' },
        { name: '联系客服', icon: '💬', url: '' },
        { name: '设置', icon: '⚙️', url: '/pages/setting/index' },
      ];
    } else {
      return [
        { name: '工作时间', icon: '⏰', url: '' },
        { name: '预警设置', icon: '⚠️', url: '' },
        { name: '消息通知', icon: '🔔', url: '' },
        { name: '联系客服', icon: '💬', url: '' },
        { name: '设置', icon: '⚙️', url: '/pages/setting/index' },
      ];
    }
  },

  onGridTap(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    }
  },

  onMenuTap(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      wx.navigateTo({ url });
    }
  },

  onEditProfile() {
    wx.navigateTo({
      url: '/pages/my/info-edit/index',
    });
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/login/login',
          });
        }
      },
    });
  },
});
