// pages/pet/events/index.js
const { fetchPetEvents } = require('../lib/pet-server');

Page({
  data: {
    events: [],
    loading: true,
    serverError: false,
  },

  onLoad() {
    this.loadEvents();
  },

  getPetUserId() {
    let userId = wx.getStorageSync('petUserId');
    if (!userId) {
      userId = 'pet_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      wx.setStorageSync('petUserId', userId);
    }
    return userId;
  },

  async loadEvents() {
    this.setData({ loading: true, serverError: false });
    const userId = this.getPetUserId();
    try {
      const result = await fetchPetEvents(userId);
      if (result.success && result.data && result.data.events && result.data.events.length > 0) {
        this.setData({ events: result.data.events, loading: false });
        wx.setStorageSync('petHelpEvents', result.data.events);
        console.log('[Events] Loaded from server:', result.data.events.length);
        return;
      }
      this.loadLocalEvents();
    } catch (err) {
      console.log('[Events] Server fail, fallback to local');
      this.loadLocalEvents();
    }
  },

  loadLocalEvents() {
    const localEvents = wx.getStorageSync('petHelpEvents');
    if (localEvents && localEvents.length > 0) {
      this.setData({ events: localEvents, loading: false });
      console.log('[Events] Loaded from local:', localEvents.length);
      return;
    }
    this.setData({ events: [], loading: false, serverError: true });
  },

  onOptionSelect(e) {
    const { eventId, optionId } = e.currentTarget.dataset;
    let event = null;
    let option = null;
    for (let i = 0; i < this.data.events.length; i++) {
      if (this.data.events[i].id === eventId) {
        event = this.data.events[i];
        break;
      }
    }
    if (event && event.options) {
      for (let i = 0; i < event.options.length; i++) {
        if (event.options[i].id === optionId) {
          option = event.options[i];
          break;
        }
      }
    }
    if (!event || !option) return;
    wx.showModal({
      title: '确认选择',
      content: '确定要"' + option.text + '"吗？\n' + option.hint,
      success: function(res) {
        if (res.confirm) {
          this.resolveEvent(eventId, optionId);
        }
      }.bind(this),
    });
  },

  resolveEvent(eventId, optionId) {
    wx.showLoading({ title: '处理中...' });
    let selectedOption = null;
    for (let i = 0; i < this.data.events.length; i++) {
      if (this.data.events[i].id === eventId) {
        const opts = this.data.events[i].options;
        if (opts) {
          for (let j = 0; j < opts.length; j++) {
            if (opts[j].id === optionId) {
              selectedOption = opts[j];
              break;
            }
          }
        }
        break;
      }
    }
    wx.hideLoading();
    const events = this.data.events.map(function(ev) {
      if (ev.id === eventId) {
        return Object.assign({}, ev, {
          status: 'resolved',
          resolvedOptionId: optionId,
          resolvedOptionText: (selectedOption && selectedOption.text) ? selectedOption.text : '未知选项',
        });
      }
      return ev;
    });
    this.setData({ events: events });
    wx.setStorageSync('petHelpEvents', events);
    wx.showToast({ title: '事件已解决', icon: 'success' });
    setTimeout(function() { wx.navigateBack(); }, 1500);
  },

  onBackTap() {
    wx.navigateBack();
  },
});
