Page({
  data: {
    // 状态值
    mood: 60,
    energy: 75,
    social: 20,
    // 功能按钮
    functions: [
      { icon: '💬', label: '对话', color: '#4CAF50' },
      { icon: '📊', label: '评估', color: '#2196F3' },
      { icon: '📅', label: '预约', color: '#FF9800' },
      { icon: '🎮', label: 'VR游戏', color: '#9C27B0' },
      { icon: '🛍️', label: '商店', color: '#00BCD4' },
      { icon: '📷', label: '相册', color: '#795548' },
      { icon: '🎁', label: '任务', color: '#E91E63' },
      { icon: '⚙️', label: '更多', color: '#607D8B' },
    ],
  },

  onLoad() {
    // 模拟状态变化
    this.startStatusAnimation();
  },

  onUnload() {
    if (this.statusTimer) {
      clearInterval(this.statusTimer);
    }
  },

  startStatusAnimation() {
    // 每隔一段时间微调状态值，模拟动态变化
    this.statusTimer = setInterval(() => {
      this.setData({
        mood: this.fluctuateValue(this.data.mood),
        energy: this.fluctuateValue(this.data.energy),
        social: this.fluctuateValue(this.data.social),
      });
    }, 5000);
  },

  fluctuateValue(value) {
    const change = (Math.random() - 0.5) * 4;
    let newValue = value + change;
    if (newValue > 100) newValue = 100;
    if (newValue < 0) newValue = 0;
    return Math.round(newValue);
  },

  // 点击设置按钮
  onSettingsTap() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none',
    });
  },

  // 点击功能按钮
  onFunctionTap(e) {
    const { index } = e.currentTarget.dataset;
    const func = this.data.functions[index];
    wx.showToast({
      title: `${func.label}功能开发中`,
      icon: 'none',
    });
  },
});
