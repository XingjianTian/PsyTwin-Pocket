// 色彩系统
const COLORS = {
  sceneForest: '#7BC8A4',
  moodHigh: '#FF8E8E',
  moodLow: '#FF6B6B',
  energyHigh: '#A8E6CF',
  energyLow: '#FF8C42',
  socialHigh: '#87CEEB',
  socialLow: '#9B89B3',
};

// 活动列表
const ACTIVITIES = [
  '在森林里悠闲地散步',
  '和其他小动物玩耍',
  '静静地冥想休息',
  '探索新发现的洞穴',
  '收集森林里的能量',
];

Page({
  data: {
    // 当前视图: game | map | bag | diary
    currentView: 'game',

    // 状态值
    mood: 60,
    energy: 75,
    social: 45,
    // 当前活动
    currentActivity: '在森林里悠闲地散步',
    currentScene: '奇幻森林 · 翡翠谷',
    // 事件
    hasEvent: false,
    eventCount: 0,
    // 心宠精灵位置
    petSpriteX: 0,
    petSpriteY: 0,

    // ========== 世界地图 ==========
    showSceneModal: false,
    selectedScene: {},

    // ========== 心宠背包模态 ==========
    showBag: false,
    bagItems: [],
    bagCapacity: { used: 0, total: 50 },
    bagLoading: true,

    // ========== 心情日记模态 ==========
    showDiary: false,
    diaryEntries: [],
    diaryDates: [],
    diarySelectedDate: '',
    diaryLoading: true,

    // 场景数据
    scenes: [
      {
        id: 'fantasy_space',
        name: '奇幻空间',
        description: '充满魔法的神秘森林，树木会发光，蘑菇会说话，是心宠探索未知的起点',
        icon: '🌲',
        gradient: 'linear-gradient(135deg, #7BC8A4, #5BA88A)',
        color: '#7BC8A4',
        deco: '✨',
        unlocked: true,
        current: true,
        x: 'calc(50% - 80rpx)',
        y: '8%',
        tags: ['探索', '魔法', '森林'],
      },
      {
        id: 'dream_house',
        name: '梦境小屋',
        description: '温馨的夜晚小屋，窗外星空璀璨，适合休息、做梦和整理心情',
        icon: '🌙',
        gradient: 'linear-gradient(135deg, #9B89B3, #7B6993)',
        color: '#9B89B3',
        deco: '⭐',
        unlocked: true,
        current: false,
        x: 'calc(50% - 80rpx)',
        y: '32%',
        tags: ['梦境', '休息', '星空'],
      },
      {
        id: 'open_wilderness',
        name: '自由旷野',
        description: '一望无际的开放林地，有篝火、吊床和野餐区，适合社交和放松身心',
        icon: '🌳',
        gradient: 'linear-gradient(135deg, #A8E6CF, #88C6AF)',
        color: '#A8E6CF',
        deco: '🔥',
        unlocked: true,
        current: false,
        x: 'calc(25% - 80rpx)',
        y: '56%',
        tags: ['野餐', '社交', '开阔'],
      },
      {
        id: 'soul_harbor',
        name: '心灵港湾',
        description: '温馨舒适的心理咨询室，有柔软沙发、绿植和书架，是倾诉烦恼的安全港湾',
        icon: '🛋️',
        gradient: 'linear-gradient(135deg, #87CEEB, #67AECB)',
        color: '#87CEEB',
        deco: '📚',
        unlocked: true,
        current: false,
        x: 'calc(75% - 80rpx)',
        y: '56%',
        tags: ['安全', '舒适', '倾诉'],
      },
    ],
  },

  // 状态定时器
  statusTimer: null,

  // 移动定时器
  moveTimer: null,

  // WebSocket实例
  _ws: null,

  /**
   * 初始化WebSocket连接
   */
  _initWebSocket() {
    const wsModule = require('../../utils/petWebSocket');
    const ws = wsModule.getPetWebSocket();
    this._ws = ws;

    // 监听连接成功
    ws.on('connected', () => {
      console.log('[Pet] WebSocket connected');
    });

    // 监听心宠状态更新
    ws.on('pet_status', (payload) => {
      console.log('[Pet] Pet status update:', payload);
      const { status } = payload || {};
      if (status) {
        this.setData({
          mood: status.mood || this.data.mood,
          energy: status.energy || this.data.energy,
          social: status.sociability || this.data.social,
        });
      }
    });

    // 监听事件触发（帮助按钮闪烁）
    ws.on('event_trigger', (payload) => {
      console.log('[Pet] Event triggered:', payload);
      this.setData({
        hasEvent: true,
        eventCount: (this.data.eventCount || 0) + 1,
      });
      wx.showModal({
        title: payload.title || '新事件',
        content: payload.description || '有一个新事件等待处理',
        showCancel: true,
        confirmText: '查看',
      });
    });

    // 监听重连失败
    ws.on('reconnect_failed', () => {
      wx.showToast({
        title: '连接失败，请检查网络',
        icon: 'none',
      });
    });

    // 建立连接
    ws.connect();
  },

  /**
   * 销毁WebSocket连接
   */
  _destroyWebSocket() {
    if (this._ws) {
      this._ws.off('connected');
      this._ws.off('pet_status');
      this._ws.off('event_trigger');
      this._ws.off('reconnect_failed');
      this._ws.disconnect();
      this._ws = null;
    }
  },

  onLoad() {
    this.initGameView();
    this.startStatusAnimation();
    this._initWebSocket();
    this.initBagData();
    this.initDiaryData();
  },

  onUnload() {
    if (this.statusTimer) {
      clearInterval(this.statusTimer);
    }
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
    }
    this._destroyWebSocket();
  },

  // 初始化游戏视图
  initGameView() {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2 - 100;

    this.setData({
      petSpriteX: centerX,
      petSpriteY: centerY,
    });

    // 心宠随机移动定时器
    this.moveTimer = setInterval(() => {
      if (Math.random() < 0.3) {
        this.setRandomTarget(windowWidth, windowHeight);
      }
    }, 2000);
  },

  // 设置随机目标位置
  setRandomTarget(windowWidth, windowHeight) {
    const margin = 80;
    const centerY = windowHeight / 2 - 100;
    const newX = margin + Math.random() * (windowWidth - margin * 2);
    const newY = centerY + Math.random() * 100;

    this.setData({
      petSpriteX: newX,
      petSpriteY: newY,
    });
  },

  // 状态动画
  startStatusAnimation() {
    // 状态值波动
    this.statusTimer = setInterval(() => {
      this.setData({
        mood: this.fluctuateValue(this.data.mood, 15, 90),
        energy: this.fluctuateValue(this.data.energy, 20, 95),
        social: this.fluctuateValue(this.data.social, 10, 85),
        currentActivity: ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)],
      });

      // 模拟事件（每30秒可能触发一次）
      if (Math.random() < 0.1) {
        this.setData({
          hasEvent: true,
          eventCount: Math.floor(Math.random() * 3) + 1,
        });
      }
    }, 5000);
  },

  // 数值波动
  fluctuateValue(value, min, max) {
    const change = (Math.random() - 0.5) * 6;
    let newValue = value + change;
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    return Math.round(newValue);
  },

  // 点击设置
  onSettingsTap() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none',
    });
  },

  // ========== 世界地图 ==========

  // 点击地块
  onSceneTap(e) {
    const { scene } = e.currentTarget.dataset;
    this.setData({
      selectedScene: scene,
      showSceneModal: true,
    });
  },

  // 关闭场景详情弹窗
  closeSceneModal() {
    this.setData({ showSceneModal: false });
  },

  // 确认进入场景
  confirmEnterScene() {
    const { selectedScene } = this.data;

    if (!selectedScene.unlocked) {
      wx.showToast({ title: '该场景尚未解锁', icon: 'none' });
      return;
    }

    if (selectedScene.current) {
      wx.showToast({ title: '当前就在这个场景', icon: 'none' });
      this.closeSceneModal();
      return;
    }

    wx.showModal({
      title: '切换场景',
      content: `确定要进入「${selectedScene.name}」吗？`,
      confirmText: '进入',
      confirmColor: '#6B5B95',
      success: (res) => {
        if (res.confirm) {
          // 更新当前场景
          const scenes = this.data.scenes.map((scene) => ({
            ...scene,
            current: scene.id === selectedScene.id,
          }));

          this.setData({
            scenes,
            currentScene: selectedScene.name,
          });

          wx.showToast({
            title: `已进入${selectedScene.name}`,
            icon: 'success',
          });

          this.closeSceneModal();
          this.backToGame();

          // TODO: 调用API切换场景
        }
      },
    });
  },

  // 点击帮助
  onHelpTap() {
    const { hasEvent, eventCount } = this.data;
    if (hasEvent && eventCount > 0) {
      wx.navigateTo({
        url: '/pages/pet/events/index',
      });
    } else {
      wx.showToast({
        title: '暂无求助',
        icon: 'none',
      });
    }
  },

  // ========== 视图切换控制 ==========

  // 切换到指定视图
  switchView(view) {
    if (this.data.currentView === view) {
      // 如果已经是当前视图，则返回游戏
      this.setData({ currentView: 'game' });
    } else {
      this.setData({ currentView: view });
    }
  },

  // 返回游戏视图
  backToGame() {
    this.setData({ currentView: 'game' });
  },

  // ========== 世界地图 ==========

  // 点击世界地图
  onMapTap() {
    this.switchView('map');
  },

  // ========== 心宠背包 ==========

  // 初始化背包数据
  initBagData() {
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
        source: '商店购买',
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
      bagItems: mockItems,
      bagCapacity: { used, total: 50 },
      bagLoading: false,
    });
  },

  // 点击背包
  onBagTap() {
    this.switchView('bag');
  },

  // 点击背包物品
  onBagItemTap(e) {
    const { item } = e.currentTarget.dataset;
    const effectParts = [];
    if (item.effect.mood) effectParts.push(`心情${item.effect.mood > 0 ? '+' : ''}${item.effect.mood}`);
    if (item.effect.energy) effectParts.push(`能量${item.effect.energy > 0 ? '+' : ''}${item.effect.energy}`);
    if (item.effect.sociability) effectParts.push(`社交${item.effect.sociability > 0 ? '+' : ''}${item.effect.sociability}`);
    const effectStr = effectParts.join('，') || '无特殊效果';

    wx.showModal({
      title: item.name,
      content: `${item.description}\n\n效果:\n${effectStr}\n\n来源: ${item.source}\n\n数量: ${item.quantity}`,
      showCancel: false,
      confirmText: '知道了',
    });
  },

  // ========== 心情日记 ==========

  // 初始化日记数据
  initDiaryData() {
    const today = new Date().toISOString().split('T')[0];
    const dates = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
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

    const mockEntries = [
      {
        id: 'de_001',
        time: '08:00',
        type: 'ACTIVITY',
        content: '起床，精神满满 (+5能量)',
        moodBefore: 55, moodAfter: 60,
        energyBefore: 70, energyAfter: 75,
        socialBefore: 40, socialAfter: 40,
      },
      {
        id: 'de_002',
        time: '14:30',
        type: 'EVENT',
        content: '考试没考好，心情低落',
        moodBefore: 60, moodAfter: 40,
        energyBefore: 75, energyAfter: 65,
        socialBefore: 40, socialAfter: 35,
      },
      {
        id: 'de_003',
        time: '16:00',
        type: 'ITEM_FOUND',
        content: '在森林探险时发现了幸运四叶草',
        moodBefore: 40, moodAfter: 45,
        energyBefore: 65, energyAfter: 60,
        socialBefore: 35, socialAfter: 35,
      },
      {
        id: 'de_004',
        time: '20:00',
        type: 'ACTIVITY',
        content: '和朋友一起玩耍 (+10社交)',
        moodBefore: 45, moodAfter: 50,
        energyBefore: 60, energyAfter: 50,
        socialBefore: 35, socialAfter: 45,
      },
    ];

    this.setData({
      diarySelectedDate: today,
      diaryDates: dates,
      diaryEntries: mockEntries,
      diaryLoading: false,
    });
  },

  // 点击日记
  onDiaryTap() {
    this.switchView('diary');
  },

  // 选择日记日期
  onDiaryDateSelect(e) {
    const { date } = e.currentTarget.dataset;
    this.setData({ diarySelectedDate: date });
    // 实际应根据日期加载对应数据
  },

  // 获取日记类型颜色
  getDiaryTypeColor(type) {
    const colors = {
      ACTIVITY: '#7BC8A4',
      EVENT: '#FF6B6B',
      ITEM_FOUND: '#FFD93D',
      SOCIAL: '#87CEEB',
    };
    return colors[type] || '#8C8299';
  },

  // 获取日记类型标签
  getDiaryTypeLabel(type) {
    const labels = {
      ACTIVITY: '日常',
      EVENT: '事件',
      ITEM_FOUND: '发现',
      SOCIAL: '社交',
    };
    return labels[type] || type;
  },
});
