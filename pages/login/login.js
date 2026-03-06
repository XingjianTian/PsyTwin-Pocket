import request from '~/api/request';

const app = getApp();

Page({
  data: {
    phoneNumber: '',
    selectedRole: '', // 'student' 或 'teacher'
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      phoneNumber: e.detail.value,
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
    const { phoneNumber, selectedRole } = this.data;

    if (!phoneNumber || !selectedRole) {
      wx.showToast({
        title: '请填写手机号并选择身份',
        icon: 'none',
      });
      return;
    }

    console.log('[Login] Starting login...');
    console.log('[Login] phoneNumber:', phoneNumber);
    console.log('[Login] selectedRole:', selectedRole);
    wx.showLoading({ title: '登录中...' });

    try {
      console.log('[Login] Sending request to /login/postPasswordLogin');
      const res = await request('/login/postPasswordLogin', 'post', {
        data: {
          account: phoneNumber,
          password: 'mock_password', // mock 密码
        },
      });
      console.log('[Login] Response received:', res);

      if (res.success) {
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

        // 根据角色跳转到对应首页
        this.navigateByRole(selectedRole);
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

  // 根据角色跳转到对应首页
  navigateByRole(role) {
    if (role === 'teacher') {
      // 教师端：跳转到工作台（Tab 页面）
      wx.switchTab({
        url: '/pages/dataCenter/index',
      });
    } else {
      // 学生端：跳转到首页
      wx.switchTab({
        url: '/pages/home/index',
      });
    }
  },
});
