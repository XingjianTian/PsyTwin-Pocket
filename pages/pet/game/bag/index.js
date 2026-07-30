// pages/pet/bag/index.js
const { pullPetState } = require('../lib/pet-server');
const { ITEM_DATABASE } = require('../lib/itemDatabase');

Page({
  data: {
    items: [],
    capacity: { used: 0, total: 50 },
    loading: true,
    serverError: false,
  },


  // 同步主页 enrichBagItems 逻辑，补齐缺失属性
  enrichItems(items) {
    if (!items || items.length === 0) return items;
    return items.map((item) => {
      const template = ITEM_DATABASE.find((t) => t.itemId === item.itemId);
      if (!template) return item;
      return {
        ...template,
        quantity: item.quantity || 1,
        name: item.name || template.name,
        icon: item.icon || template.icon,
        rarity: item.rarity || template.rarity,
        type: item.type || template.type,
        description: item.description || template.description,
        effect: item.effect && (item.effect.mood || item.effect.energy || item.effect.social)
          ? item.effect : template.effect,
      };
    });
  },

  onLoad() {
    this.loadInventory();
  },

  getPetUserId() {
    let userId = wx.getStorageSync('petUserId');
    if (!userId) {
      userId = 'pet_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      wx.setStorageSync('petUserId', userId);
    }
    return userId;
  },

  async loadInventory() {
    this.setData({ loading: true, serverError: false });
    const userId = this.getPetUserId();

    try {
      const result = await pullPetState(userId);
      if (result.success && result.data && result.data.state) {
        const state = result.data.state;
        if (state.bagItems && state.bagItems.length > 0) {
          const used = state.bagItems.reduce(function(sum, item) { return sum + item.quantity; }, 0);
          this.setData({
            items: this.enrichItems(state.bagItems),
            capacity: { used: used, total: 50 },
            loading: false,
          });
          wx.setStorageSync('petBagItems', this.enrichItems(state.bagItems));
          console.log('[Bag] Loaded from server:', state.bagItems.length, 'items');
          return;
        }
      }
    } catch (err) {
      console.log('[Bag] Server fail, using local:', err);
    }

    // Fallback to local storage
    const savedBag = wx.getStorageSync('petBagItems');
    if (savedBag && savedBag.length > 0) {
      const used = savedBag.reduce(function(sum, item) { return sum + item.quantity; }, 0);
      this.setData({
        items: this.enrichItems(savedBag),
        capacity: { used: used, total: 50 },
        loading: false,
      });
      console.log('[Bag] Loaded from local:', savedBag.length, 'items');
      return;
    }

    // No data available
    this.setData({
      items: [],
      capacity: { used: 0, total: 50 },
      loading: false,
      serverError: true,
    });
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: item.name,
      content: item.description + '\n\n效果:\n' + this.formatEffect(item.effect) + '\n\n来源: ' + item.source + '\n\n数量: ' + item.quantity,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  formatEffect(effect) {
    const parts = [];
    if (effect.mood) parts.push('心情' + (effect.mood > 0 ? '+' : '') + effect.mood);
    if (effect.energy) parts.push('能量' + (effect.energy > 0 ? '+' : '') + effect.energy);
    if (effect.sociability) parts.push('社交' + (effect.sociability > 0 ? '+' : '') + effect.sociability);
    return parts.join('，') || '无特殊效果';
  },

  onBackTap() {
    wx.navigateBack();
  },
});
