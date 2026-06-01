// pages/pet/diary/index.js
const { pullPetState } = require('../../api/pet-server');

Page({
  data: {
    entries: [],
    selectedDate: '',
    dates: [],
    loading: true,
    serverError: false,
  },

  onLoad() {
    const today = new Date().toISOString().split('T')[0];
    this.setData({ selectedDate: today });
    this.loadDiary();
    this.generateDates();
  },

  getPetUserId() {
    let userId = wx.getStorageSync('petUserId');
    if (!userId) {
      userId = 'pet_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      wx.setStorageSync('petUserId', userId);
    }
    return userId;
  },

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
    this.setData({ dates: dates });
  },

  async loadDiary() {
    this.setData({ loading: true, serverError: false });
    const userId = this.getPetUserId();

    try {
      const result = await pullPetState(userId);
      if (result.success && result.data && result.data.state && result.data.state.diaryDataMap) {
        const diaryDataMap = result.data.state.diaryDataMap;
        wx.setStorageSync('petDiaryMap', diaryDataMap);
        const entries = diaryDataMap[this.data.selectedDate] || [];
        this.setData({ entries: entries, loading: false });
        console.log('[Diary] Loaded from server:', entries.length, 'entries');
        return;
      }
    } catch (err) {
      console.log('[Diary] Server fail, using local:', err);
    }

    // Fallback to local storage
    const diaryMap = wx.getStorageSync('petDiaryMap') || {};
    const entries = diaryMap[this.data.selectedDate] || [];
    this.setData({
      entries: entries,
      loading: false,
      serverError: entries.length === 0,
    });
    console.log('[Diary] Loaded from local:', entries.length, 'entries');
  },

  onDateSelect(e) {
    const { date } = e.currentTarget.dataset;
    this.setData({ selectedDate: date });
    this.loadDiary();
  },

  getTypeColor(type) {
    const colors = {
      ACTIVITY: '#7BC8A4',
      EVENT: '#FF6B6B',
      ITEM_FOUND: '#FFD93D',
      SOCIAL: '#87CEEB',
    };
    return colors[type] || '#8C8299';
  },

  getTypeLabel(type) {
    const labels = {
      ACTIVITY: '日常',
      EVENT: '事件',
      ITEM_FOUND: '发现',
      SOCIAL: '社交',
    };
    return labels[type] || type;
  },

  onBackTap() {
    wx.navigateBack();
  },
});
