import request from '~/api/request';

const app = getApp();

Page({
  data: {
    phoneNumber: '',
    password: '',
    selectedRole: '', // 'student' 或 'teacher'
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value,
    });
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value,
    });
  },

  // 选择身份
  onSelectRole(e) {
    const { role } = e.currentTarget.dataset;
    this.setData({
      selectedRole: role,
    });
  },

  // 登录
  async login() {
    const { phoneNumber, password, selectedRole } = this.data;

    if (!phoneNumber || !password || !selectedRole) {
      wx.showToast({
        title: '请填写手机号、密码并选择身份',
        icon: 'none',
      });
      return;
    }

    console.log('[Login] Starting login...');
    console.log('[Login] phoneNumber:', phoneNumber);
    console.log('[Login] password:', password);
    console.log('[Login] selectedRole:', selectedRole);
    wx.showLoading({ title: '登录中...' });

    try {
      console.log('[Login] Sending request to /auth/login/password');
      const res = await request('/auth/login/password', 'post', {
        phone: phoneNumber,
        password: password,
      });
      console.log('[Login] Response received:', res);

      if (res.code === 0) {
        console.log('[Login] Login successful');
        console.log('[Login] Token:', res.data.token);

        // 保存 token
        await wx.setStorageSync('access_token', res.data.token);
        // 保存角色
        await wx.setStorageSync('user_role', selectedRole);
        // 更新 globalData
        app.globalData.role = selectedRole;
        // 触发角色变化事件，更新 TabBar
        app.eventBus.emit('role-change', selectedRole);

        wx.hideLoading();

        // 登录后统一跳转到首页
        this.navigateToHome();
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.message || '登录失败',
          icon: 'none',
        });
      }
    } catch (err) {
      console.error('[Login] Login error:', err);
      wx.hideLoading();
      wx.showToast({
        title: '登录失败: ' + (err.message || '未知错误'),
        icon: 'none',
      });
    }
  },

  // 登录后统一跳转到首页
  navigateToHome() {
    wx.switchTab({
      url: '/pages/home/index',
    });
  },
});
