// pages/pet/bag/index.js
Page({
  data: {
    items: [],
    capacity: { used: 0, total: 50 },
    loading: true,
  },

  onLoad() {
    this.loadInventory();
  },

  // 加载背包数据
  loadInventory() {
    // 模拟数据，实际应从服务器获取
    const mockItems = [
      {
        itemId: 'item_001',
        name: '幸运饼干',
        type: 'FOOD',
        description: '吃下去会带来好运',
        quantity: 3,
        effect: { mood: 10, energy: 5 },
        icon: '🥠',
        source: '在奇幻森林探索时发现',
      },
      {
        itemId: 'item_002',
        name: '快乐玩具',
        type: 'TOY',
        description: '让心宠开心的玩具',
        quantity: 2,
        effect: { mood: 15 },
        icon: '🧸',
        source: '完成事件获得',
      },
      {
        itemId: 'item_003',
        name: '幸运四叶草',
        type: 'DECORATION',
        description: '稀有的幸运象征',
        quantity: 1,
        effect: { mood: 5 },
        icon: '🍀',
        source: '在森林深处发现',
      },
      {
        itemId: 'item_004',
        name: '能量饮料',
        type: 'FOOD',
        description: '快速恢复能量',
        quantity: 5,
        effect: { energy: 20 },
        icon: '🥤',
        source: '场景探索',
      },
      {
        itemId: 'item_005',
        name: '社交礼物',
        type: 'GIFT',
        description: '增进友谊的礼物',
        quantity: 2,
        effect: { sociability: 10 },
        icon: '🎁',
        source: '朋友赠送',
      },
    ];

    const used = mockItems.reduce((sum, item) => sum + item.quantity, 0);

    this.setData({
      items: mockItems,
      capacity: { used, total: 50 },
      loading: false,
    });
  },

  // 查看物品详情
  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: item.name,
      content: `${item.description}\n\n效果:\n${this.formatEffect(item.effect)}\n\n来源: ${item.source}\n\n数量: ${item.quantity}`,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  // 格式化效果
  formatEffect(effect) {
    const parts = [];
    if (effect.mood) parts.push(`心情${effect.mood > 0 ? '+' : ''}${effect.mood}`);
    if (effect.energy) parts.push(`能量${effect.energy > 0 ? '+' : ''}${effect.energy}`);
    if (effect.sociability) parts.push(`社交${effect.sociability > 0 ? '+' : ''}${effect.sociability}`);
    return parts.join('，') || '无特殊效果';
  },

  // 返回
  onBackTap() {
    wx.navigateBack();
  },
});
