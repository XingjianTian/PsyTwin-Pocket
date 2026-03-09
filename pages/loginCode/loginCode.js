import request from '~/api/request';

Page({
  data: {
    phoneNumber: '',
    sendCodeCount: 60,
    verifyCode: '',
  },

  timer: null,

  onLoad(options) {
    const { phoneNumber } = options;
    if (phoneNumber) {
      this.setData({ phoneNumber });
    }
    this.countDown();
  },

  onVerifycodeChange(e) {
    this.setData({
      verifyCode: e.detail.value,
    });
  },

  countDown() {
    this.setData({ sendCodeCount: 60 });
    this.timer = setInterval(() => {
      if (this.data.sendCodeCount <= 0) {
        this.setData({ isSend: false, sendCodeCount: 0 });
        clearInterval(this.timer);
      } else {
        this.setData({ sendCodeCount: this.data.sendCodeCount - 1 });
      }
    }, 1000);
  },

  async sendCode() {
    if (this.data.sendCodeCount === 0) {
      try {
        const { phoneNumber } = this.data;
        const res = await request('/auth/sms/send', 'post', {
          phone: phoneNumber,
          type: 'login',
        });
        if (res.code === 0) {
          wx.showToast({ title: '验证码已发送', icon: 'success' });
          this.countDown();
        } else {
          wx.showToast({ title: res.message || '发送失败', icon: 'none' });
        }
      } catch (err) {
        wx.showToast({ title: '发送失败', icon: 'none' });
      }
    }
  },

  async login() {
    try {
      const { phoneNumber, verifyCode } = this.data;
      wx.showLoading({ title: '登录中...' });

      const res = await request('/auth/login/code', 'post', {
        phone: phoneNumber,
        code: verifyCode,
      });

      wx.hideLoading();

      if (res.code === 0) {
        await wx.setStorageSync('access_token', res.data.token);
        await wx.setStorageSync('user_role', res.data.user.role);
        wx.switchTab({
          url: `/pages/my/index`,
        });
      } else {
        wx.showToast({
          title: res.message || '登录失败',
          icon: 'none',
        });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: '登录失败: ' + (err.message || '未知错误'),
        icon: 'none',
      });
    }
  },
});
