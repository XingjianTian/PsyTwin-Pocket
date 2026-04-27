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
    // 模拟数据，实际应从服务器获取
    const mockEntries = [
      {
        id: 'de_001',
        time: '08:00',
        type: 'ACTIVITY',
        content: '起床，精神满满 (+5能量)',
        sceneId: 'fantasy_forest',
        activity: 'wake_up',
        moodBefore: 55,
        moodAfter: 60,
        energyBefore: 70,
        energyAfter: 75,
        socialBefore: 40,
        socialAfter: 40,
      },
      {
        id: 'de_002',
        time: '14:30',
        type: 'EVENT',
        content: '考试没考好，心情低落',
        sceneId: 'classroom',
        activity: 'studying',
        moodBefore: 60,
        moodAfter: 40,
        energyBefore: 75,
        energyAfter: 65,
        socialBefore: 40,
        socialAfter: 35,
        eventId: 'evt_001',
        userResponse: '安慰鼓励',
      },
      {
        id: 'de_003',
        time: '16:00',
        type: 'ITEM_FOUND',
        content: '在森林探险时发现了幸运四叶草',
        sceneId: 'fantasy_forest',
        activity: 'exploring',
        moodBefore: 40,
        moodAfter: 45,
        energyBefore: 65,
        energyAfter: 60,
        socialBefore: 35,
        socialAfter: 35,
      },
      {
        id: 'de_004',
        time: '20:00',
        type: 'ACTIVITY',
        content: '和朋友一起玩耍 (+10社交)',
        sceneId: 'fantasy_forest',
        activity: 'playing',
        moodBefore: 45,
        moodAfter: 50,
        energyBefore: 60,
        energyAfter: 50,
        socialBefore: 35,
        socialAfter: 45,
      },
    ];

    this.setData({
      entries: mockEntries,
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
