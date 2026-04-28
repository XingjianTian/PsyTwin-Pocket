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
    currentSceneId: 'fantasy_space',
    currentSceneIcon: '🌲',
    // 事件
    hasEvent: false,
    eventCount: 0,
    // 心宠精灵位置
    petSpriteX: 0,
    petSpriteY: 0,
    // 心宠移动动画
    petAnimation: {},
    // 心宠当前所在场景
    petSceneId: 'fantasy_space',
    petSceneName: '奇幻空间',
    petActivity: '在森林里悠闲地散步',
    // 全屏模式
    isFullscreen: false,

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
    diaryDataMap: {},

    // ========== 帮助事件 ==========
    helpEvents: [],
    helpLoading: true,

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
    this.initHelpData();
  },

  onHide() {
    const app = getApp();
    app.eventBus.emit('tabbar-toggle', false);
  },

  onUnload() {
    if (this.statusTimer) {
      clearInterval(this.statusTimer);
    }
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
    }
    this._destroyWebSocket();
    const app = getApp();
    app.eventBus.emit('tabbar-toggle', false);
  },

  // 初始化游戏视图
  initGameView() {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();

    // 计算心宠移动边界（限制在底部草地区域，即截图红框内）
    // 状态栏+标题约占顶部 22%，按钮面板在底部约 18%
    // 红框草地区域大约在屏幕高度的 55% ~ 80% 之间
    this.boundary = {
      minX: 50,
      maxX: windowWidth - 50,
      minY: windowHeight * 0.4,
      maxY: windowHeight * 0.55,
    };

    const startX = windowWidth / 2;
    const startY = (this.boundary.minY + this.boundary.maxY) / 2;

    // 创建平滑移动动画实例
    this.petAnim = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease-in-out',
    });

    this.setData({
      petSpriteX: startX,
      petSpriteY: startY,
      petAnimation: this.petAnim.export(),
    });

    // 心宠随机移动定时器：每3秒有40%概率移动
    this.moveTimer = setInterval(() => {
      if (Math.random() < 0.4) {
        this.movePetSmoothly();
      }
    }, 3000);
  },

  // 平滑移动心宠到随机位置（带边界限制）
  movePetSmoothly() {
    if (!this.boundary) return;

    const { minX, maxX, minY, maxY } = this.boundary;

    const targetX = minX + Math.random() * (maxX - minX);
    const targetY = minY + Math.random() * (maxY - minY);

    // 使用动画平滑移动到目标位置
    this.petAnim.left(targetX).top(targetY).step();

    this.setData({
      petAnimation: this.petAnim.export(),
      petSpriteX: targetX,
      petSpriteY: targetY,
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

      // 心宠随机切换场景（每15秒有30%概率切换）
      if (Math.random() < 0.3) {
        this.switchPetScene();
      }

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

  // 心宠切换场景
  switchPetScene() {
    const { scenes, petSceneId } = this.data;
    const unlockedScenes = scenes.filter((s) => s.unlocked);
    if (unlockedScenes.length <= 1) return;

    // 随机选择一个不同于当前的场景
    let newScene;
    do {
      newScene = unlockedScenes[Math.floor(Math.random() * unlockedScenes.length)];
    } while (newScene.id === petSceneId);

    // 随机选择一个活动
    const newActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];

    this.setData({
      petSceneId: newScene.id,
      petSceneName: newScene.name,
      petActivity: newActivity,
    });

    // 如果心宠切换到了当前场景，显示提示
    const currentSceneObj = scenes.find((s) => s.current);
    if (currentSceneObj && currentSceneObj.id === newScene.id) {
      wx.showToast({
        title: '心宠回来了！',
        icon: 'none',
      });
    }
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
            currentSceneId: selectedScene.id,
            currentSceneIcon: selectedScene.icon || '🌲',
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
    this.switchView('help');
  },

  // ========== 视图切换控制 ==========

  // 切换全屏模式
  toggleFullscreen() {
    const { isFullscreen } = this.data;
    const app = getApp();
    app.eventBus.emit('tabbar-toggle', !isFullscreen);
    this.setData({ isFullscreen: !isFullscreen });
  },

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

  // 生成某天的日记条目
  generateDiaryEntries(dateStr) {
    const templates = [
      {
        time: '08:00',
        type: 'ACTIVITY',
        contents: [
          { text: '起床，精神满满', mood: 5, energy: 5, social: 0 },
          { text: '睡了个懒觉，心情不错', mood: 8, energy: -3, social: 0 },
          { text: '早起做了瑜伽', mood: 10, energy: -5, social: 0 },
        ],
      },
      {
        time: '10:00',
        type: 'ACTIVITY',
        contents: [
          { text: '认真上课，学到了新知识', mood: 3, energy: -8, social: 2 },
          { text: '课间和朋友聊天', mood: 5, energy: 0, social: 8 },
          { text: '专注完成了作业', mood: 8, energy: -5, social: 0 },
        ],
      },
      {
        time: '12:30',
        type: 'ACTIVITY',
        contents: [
          { text: '午餐吃了喜欢的食物', mood: 8, energy: 10, social: 3 },
          { text: '和朋友一起吃饭', mood: 5, energy: 8, social: 10 },
          { text: '午休了一会儿', mood: 3, energy: 10, social: 0 },
        ],
      },
      {
        time: '14:30',
        type: 'EVENT',
        contents: [
          { text: '考试没考好，心情低落', mood: -20, energy: -10, social: -5 },
          { text: '被老师表扬了，很开心', mood: 15, energy: 5, social: 0 },
          { text: '体育课跑得很快', mood: 10, energy: -15, social: 5 },
          { text: '小组讨论很顺利', mood: 8, energy: -5, social: 10 },
        ],
      },
      {
        time: '16:00',
        type: 'ITEM_FOUND',
        contents: [
          { text: '在森林探险时发现了幸运四叶草', mood: 10, energy: -5, social: 0 },
          { text: '捡到了一颗漂亮的石头', mood: 5, energy: 0, social: 0 },
          { text: '发现了隐藏的宝箱', mood: 15, energy: -3, social: 0 },
        ],
      },
      {
        time: '18:00',
        type: 'ACTIVITY',
        contents: [
          { text: '放学回家，感觉轻松', mood: 5, energy: 5, social: 0 },
          { text: '参加社团活动', mood: 8, energy: -10, social: 15 },
          { text: '去图书馆借了几本书', mood: 5, energy: -3, social: 0 },
        ],
      },
      {
        time: '20:00',
        type: 'ACTIVITY',
        contents: [
          { text: '和朋友一起玩耍', mood: 10, energy: -10, social: 15 },
          { text: '看了一集喜欢的动画', mood: 8, energy: -3, social: 0 },
          { text: '和家人一起吃饭', mood: 10, energy: 5, social: 10 },
          { text: '做了一会儿手工', mood: 8, energy: -5, social: 0 },
        ],
      },
      {
        time: '22:00',
        type: 'ACTIVITY',
        contents: [
          { text: '准备睡觉，今天很充实', mood: 5, energy: 10, social: 0 },
          { text: '听了一会儿音乐', mood: 8, energy: 5, social: 0 },
          { text: '读了一会儿书', mood: 5, energy: 3, social: 0 },
        ],
      },
    ];

    // 使用日期字符串作为种子来生成确定性的随机数
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
      seed += dateStr.charCodeAt(i);
    }
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // 随机选择 2-4 个条目
    const numEntries = 2 + Math.floor(random() * 3);
    const entries = [];
    const usedTemplates = new Set();

    for (let i = 0; i < numEntries; i++) {
      let templateIndex;
      do {
        templateIndex = Math.floor(random() * templates.length);
      } while (usedTemplates.has(templateIndex));
      usedTemplates.add(templateIndex);

      const template = templates[templateIndex];
      const contentIndex = Math.floor(random() * template.contents.length);
      const content = template.contents[contentIndex];

      // 生成随机的基础值
      const baseMood = 40 + Math.floor(random() * 30);
      const baseEnergy = 40 + Math.floor(random() * 30);
      const baseSocial = 30 + Math.floor(random() * 30);

      entries.push({
        id: `de_${dateStr}_${i}`,
        time: template.time,
        type: template.type,
        content: content.text,
        moodBefore: baseMood,
        moodAfter: Math.max(10, Math.min(100, baseMood + content.mood)),
        energyBefore: baseEnergy,
        energyAfter: Math.max(10, Math.min(100, baseEnergy + content.energy)),
        socialBefore: baseSocial,
        socialAfter: Math.max(10, Math.min(100, baseSocial + content.social)),
      });
    }

    // 按时间排序
    entries.sort((a, b) => a.time.localeCompare(b.time));

    return entries;
  },

  // 初始化日记数据
  initDiaryData() {
    const today = new Date().toISOString().split('T')[0];
    const dates = [];
    const now = new Date();
    const diaryDataMap = {};

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

      // 为每一天生成日记数据
      diaryDataMap[dateStr] = this.generateDiaryEntries(dateStr);
    }

    this.setData({
      diarySelectedDate: today,
      diaryDates: dates,
      diaryDataMap,
      diaryEntries: diaryDataMap[today],
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
    const { diaryDataMap } = this.data;
    const entries = diaryDataMap[date] || [];
    this.setData({
      diarySelectedDate: date,
      diaryEntries: entries,
    });
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

  // ========== 帮助事件 ==========

  // 初始化帮助数据
  initHelpData() {
    const mockEvents = [
      {
        id: 'evt_001',
        type: 'large',
        category: 'emotion',
        title: '考试失利',
        description: '今天数学考试没考好，心情很差，需要你的鼓励',
        status: 'pending',
        deadline: Date.now() + 24 * 60 * 60 * 1000,
        options: [
          { id: 'opt_1', text: '安慰鼓励', hint: '温柔的鼓励能让心宠重拾信心', impact: { mood: 15, energy: 5 } },
          { id: 'opt_2', text: '分析原因', hint: '帮助心宠找到问题所在', impact: { mood: 5, energy: -5 } },
          { id: 'opt_3', text: '陪伴散步', hint: '换个环境，放松心情', impact: { mood: 10, energy: -10 } },
          { id: 'opt_4', text: '制定计划', hint: '一起制定学习计划', impact: { mood: 8, energy: 5 } },
        ],
      },
    ];

    this.setData({
      helpEvents: mockEvents,
      helpLoading: false,
    });
  },

  // 选择帮助选项
  onHelpOptionSelect(e) {
    const { eventId, optionId } = e.currentTarget.dataset;
    const event = this.data.helpEvents.find((ev) => ev.id === eventId);
    const option = event && event.options.find((opt) => opt.id === optionId);

    if (!event || !option) return;

    wx.showModal({
      title: '确认选择',
      content: `确定要"${option.text}"吗？\n${option.hint}`,
      success: (res) => {
        if (res.confirm) {
          this.resolveHelpEvent(eventId, optionId);
        }
      },
    });
  },

  // 解决帮助事件
  resolveHelpEvent(eventId, optionId) {
    wx.showLoading({ title: '处理中...' });

    setTimeout(() => {
      wx.hideLoading();

      const event = this.data.helpEvents.find((ev) => ev.id === eventId);
      const option = event && event.options.find((opt) => opt.id === optionId);

      const helpEvents = this.data.helpEvents.map((ev) => {
        if (ev.id === eventId) {
          return {
            ...ev,
            status: 'resolved',
            resolvedOptionId: optionId,
            resolvedOptionText: option ? option.text : '未知选项',
          };
        }
        return ev;
      });

      this.setData({ helpEvents });

      wx.showToast({
        title: '事件已解决',
        icon: 'success',
      });
    }, 1000);
  },
});
