Page({
  onLoad(options) {
    this.feedQuery = options && options.oper ? `?oper=${encodeURIComponent(options.oper)}` : '';
  },

  onShow() {
    wx.navigateTo({ url: `/pages/home/feed/index${this.feedQuery || ''}` });
  },
});
