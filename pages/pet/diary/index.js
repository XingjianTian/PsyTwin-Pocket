// pages/pet/diary/index.js
Page({
  data: {
    entries: [],
    selectedDate: '',
    dates: [],
    loading: true,
  },

  onLoad() {
    const today = new Date().toISOString().split('T')[0];
    this.setData({ selectedDate: today });
    this.loadDiary();
    this.generateDates();
  },

  // 生成日期列表（最近7天）
  generateDates() {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
      dates.push({
        date: dateStr,
        day: date.getDate(),
        weekDay: dayNames[date.getDay()],
        isToday: i === 0,
      });
    }
    this.setData({ dates });
  },

  // 加载日记数据
  loadDiary() {
    const diaryMap = wx.getStorageSync('petDiaryMap') || {};
    const entries = diaryMap[this.data.selectedDate] || [];
    this.setData({
      entries,
      loading: false,
    });
  },

  // 选择日期
  onDateSelect(e) {
    const { date } = e.currentTarget.dataset;
    this.setData({ selectedDate: date });
    this.loadDiary();
  },

  // 获取类型颜色
  getTypeColor(type) {
    const colors = {
      ACTIVITY: '#7BC8A4',
      EVENT: '#FF6B6B',
      ITEM_FOUND: '#FFD93D',
      SOCIAL: '#87CEEB',
    };
    return colors[type] || '#8C8299';
  },

  // 获取类型标签
  getTypeLabel(type) {
    const labels = {
      ACTIVITY: '日常',
      EVENT: '事件',
      ITEM_FOUND: '发现',
      SOCIAL: '社交',
    };
    return labels[type] || type;
  },

  // 返回
  onBackTap() {
    wx.navigateBack();
  },
});
