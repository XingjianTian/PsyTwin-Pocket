import request from '~/api/request';

const app = getApp();

Page({
  data: {
    sessions: [],
    loading: true,
  },

  onLoad() {
    this.loadSessions();
  },

  async loadSessions() {
    try {
      const res = await request('/mock/student/message/sessions');
      this.setData({
        sessions: res.data || [],
        loading: false,
      });
    } catch (err) {
      console.error('加载会话列表失败', err);
      this.setData({ loading: false });
    }
  },

  // 点击会话进入聊天
  toChat(e) {
    const { id, type, name } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/chat/index?id=${id}&type=${type}&name=${encodeURIComponent(name)}`,
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadSessions().then(() => {
      wx.stopPullDownRefresh();
    });
  },
});
