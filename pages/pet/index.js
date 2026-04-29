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
    currentActivity: '在温暖的床上休息',
    currentScene: '卧室',
    currentSceneId: 'bedroom',
    currentSceneIcon: '🛏️',
    // 事件
    hasEvent: false,
    eventCount: 0,
    // 心宠精灵位置
    petSpriteX: 0,
    petSpriteY: 0,
    // 心宠移动动画
    petAnimation: {},
    // 心宠当前所在场景（默认在卧室的床上）
    petSceneId: 'bedroom',
    petSceneName: '卧室',
    petActivity: '在温暖的床上休息',
    // 地图中心宠标记位置（一级地图用，初始在梦境小屋）
    petMarkerPrimaryStyle: 'left: calc(22% - 80rpx); top: 26%;',
    // 地图中心宠标记位置（二级地图用，初始不在任何二级地图里）
    petMarkerSecondaryStyle: '',
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

    // 地图层级：primary | secondary
    mapLevel: 'primary',
    activePrimarySceneId: '',

    // ========== 地图编辑模式 ==========
    isEditMode: false,
    editDragStart: null,
    editingSceneId: '',

    // 场景数据（五角星形状排列）
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
        y: '5%',
        tags: ['探索', '魔法', '森林'],
        hasSecondary: true,
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
        x: 'calc(78% - 80rpx)',
        y: '26%',
        tags: ['安全', '舒适', '倾诉'],
        hasSecondary: true,
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
        x: 'calc(65% - 80rpx)',
        y: '55%',
        tags: ['野餐', '社交', '开阔'],
        hasSecondary: true,
      },
      {
        id: 'school',
        name: '学校',
        description: '充满知识与活力的校园，有图书馆、食堂、教学楼等众多场所',
        icon: '🏫',
        gradient: 'linear-gradient(135deg, #FFD93D, #F6AD55)',
        color: '#FFD93D',
        deco: '🎓',
        unlocked: true,
        current: false,
        x: 'calc(35% - 80rpx)',
        y: '55%',
        tags: ['学习', '校园', '知识'],
        hasSecondary: true,
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
        x: 'calc(22% - 80rpx)',
        y: '26%',
        tags: ['梦境', '休息', '星空'],
        hasSecondary: true,
      },
    ],

    // 二级场景数据（分散分布，每个一级场景有不同数量的二级场景）
    secondaryScenes: {
      fantasy_space: [
        {
          id: 'deep_forest',
          name: '魔法森林',
          description: '充满神秘魔法的森林深处，古老的树木诉说着远古的故事',
          icon: '🌳',
          gradient: 'linear-gradient(135deg, #2E8B57, #3CB371)',
          color: '#2E8B57',
          x: '8%',
          y: '12%',
          tags: ['魔法', '探索', '自然'],
        },
        {
          id: 'crystal_cave',
          name: '水晶洞穴',
          description: '闪烁着七彩光芒的水晶洞穴，每一块水晶都蕴含着魔法能量',
          icon: '💎',
          gradient: 'linear-gradient(135deg, #4A90E2, #5BA3F5)',
          color: '#4A90E2',
          x: '72%',
          y: '8%',
          tags: ['水晶', '神秘', '能量'],
        },
        {
          id: 'mushroom_village',
          name: '蘑菇村落',
          description: '可爱的蘑菇小屋组成的村落，居民是善良的小精灵',
          icon: '🍄',
          gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
          color: '#FF6B6B',
          x: '15%',
          y: '65%',
          tags: ['精灵', '村落', '温馨'],
        },
        {
          id: 'fairy_lake',
          name: '精灵湖泊',
          description: '清澈见底的湖泊，水面上漂浮着发光的水莲花',
          icon: '🧚',
          gradient: 'linear-gradient(135deg, #87CEEB, #67AECB)',
          color: '#87CEEB',
          x: '68%',
          y: '58%',
          tags: ['湖泊', '精灵', '宁静'],
        },
        {
          id: 'star_meadow',
          name: '星空草地',
          description: '夜晚会发出微光的神奇草地，躺在这里可以看到最亮的星星',
          icon: '⭐',
          gradient: 'linear-gradient(135deg, #9B89B3, #7B6993)',
          color: '#9B89B3',
          x: '42%',
          y: '85%',
          tags: ['星空', '草地', '浪漫'],
        },
      ],
      soul_harbor: [
        {
          id: 'consulting_room',
          name: '咨询室',
          description: '温馨舒适的咨询空间，有柔软的沙发和温暖的灯光',
          icon: '🛋️',
          gradient: 'linear-gradient(135deg, #8B7355, #A08060)',
          color: '#8B7355',
          x: '10%',
          y: '15%',
          tags: ['咨询', '舒适', '安全'],
        },
        {
          id: 'reading_corner',
          name: '阅读角',
          description: '安静的阅读角落，书架上摆满了心理学和文学书籍',
          icon: '📚',
          gradient: 'linear-gradient(135deg, #4A90E2, #5BA3F5)',
          color: '#4A90E2',
          x: '75%',
          y: '10%',
          tags: ['阅读', '安静', '知识'],
        },
        {
          id: 'meditation_room',
          name: '冥想室',
          description: '充满禅意的冥想空间，有助放松身心、平静情绪',
          icon: '🧘',
          gradient: 'linear-gradient(135deg, #7BC8A4, #5BA88A)',
          color: '#7BC8A4',
          x: '18%',
          y: '62%',
          tags: ['冥想', '放松', '平静'],
        },
        {
          id: 'sandplay_room',
          name: '沙盘室',
          description: '摆放着各种沙盘道具的治疗室，通过游戏表达内心',
          icon: '🏖️',
          gradient: 'linear-gradient(135deg, #FFD93D, #F6AD55)',
          color: '#FFD93D',
          x: '70%',
          y: '55%',
          tags: ['沙盘', '游戏', '表达'],
        },
      ],
      open_wilderness: [
        {
          id: 'bonfire_area',
          name: '篝火区',
          description: '夜晚篝火温暖的地方，适合围坐聊天和烤棉花糖',
          icon: '🔥',
          gradient: 'linear-gradient(135deg, #FF8C42, #FF6B6B)',
          color: '#FF8C42',
          x: '8%',
          y: '10%',
          tags: ['篝火', '温暖', '社交'],
        },
        {
          id: 'picnic_lawn',
          name: '野餐草坪',
          description: '绿油油的草坪，是野餐和晒太阳的绝佳场所',
          icon: '🧺',
          gradient: 'linear-gradient(135deg, #7BC8A4, #5BA88A)',
          color: '#7BC8A4',
          x: '78%',
          y: '12%',
          tags: ['野餐', '草坪', '阳光'],
        },
        {
          id: 'hammock_area',
          name: '吊床区',
          description: '挂在两棵树之间的吊床，是午睡和发呆的好地方',
          icon: '🛏️',
          gradient: 'linear-gradient(135deg, #A8E6CF, #88C6AF)',
          color: '#A8E6CF',
          x: '12%',
          y: '60%',
          tags: ['吊床', '休息', '慵懒'],
        },
        {
          id: 'stream_side',
          name: '溪流边',
          description: '清澈的小溪边，可以听到流水声和鸟鸣声',
          icon: '💧',
          gradient: 'linear-gradient(135deg, #87CEEB, #67AECB)',
          color: '#87CEEB',
          x: '72%',
          y: '55%',
          tags: ['溪流', '自然', '宁静'],
        },
        {
          id: 'viewing_platform',
          name: '观景台',
          description: '高地上的观景台，可以俯瞰整个旷野的美景',
          icon: '🔭',
          gradient: 'linear-gradient(135deg, #9B89B3, #7B6993)',
          color: '#9B89B3',
          x: '45%',
          y: '82%',
          tags: ['观景', '高地', '美景'],
        },
      ],
      school: [
        {
          id: 'library',
          name: '图书馆',
          description: '安静的图书馆，书香四溢，适合阅读和学习',
          icon: '📚',
          gradient: 'linear-gradient(135deg, #8B4513, #A0522D)',
          color: '#8B4513',
          x: '6%',
          y: '12%',
          tags: ['阅读', '学习', '安静'],
        },
        {
          id: 'teaching_building',
          name: '教学楼',
          description: '知识的殿堂，每天在这里汲取新知识',
          icon: '🏫',
          gradient: 'linear-gradient(135deg, #4A90E2, #5BA3F5)',
          color: '#4A90E2',
          x: '74%',
          y: '8%',
          tags: ['上课', '学习', '知识'],
        },
        {
          id: 'lab',
          name: '实验室',
          description: '充满探索精神的实验室，各种奇妙的实验在这里进行',
          icon: '🔬',
          gradient: 'linear-gradient(135deg, #9B89B3, #7B6993)',
          color: '#9B89B3',
          x: '14%',
          y: '58%',
          tags: ['实验', '探索', '科学'],
        },
        {
          id: 'playground',
          name: '操场',
          description: '宽阔的操场，适合运动和放松',
          icon: '⚽',
          gradient: 'linear-gradient(135deg, #7BC8A4, #5BA88A)',
          color: '#7BC8A4',
          x: '76%',
          y: '52%',
          tags: ['运动', '放松', '活力'],
        },
        {
          id: 'cafeteria',
          name: '食堂',
          description: '热闹的食堂，各种美食应有尽有',
          icon: '🍜',
          gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
          color: '#FF6B6B',
          x: '42%',
          y: '82%',
          tags: ['美食', '社交', '休息'],
        },
        {
          id: 'psychological_room',
          name: '心理咨询室',
          description: '温馨私密的心理咨询空间，专业咨询师为你解忧',
          icon: '💬',
          gradient: 'linear-gradient(135deg, #E6A8D7, #D490C5)',
          color: '#E6A8D7',
          x: '48%',
          y: '38%',
          tags: ['咨询', '私密', '关怀'],
        },
      ],
      dream_house: [
        {
          id: 'bedroom',
          name: '卧室',
          description: '温馨舒适的卧室，柔软的床铺和温暖的灯光',
          icon: '🛏️',
          gradient: 'linear-gradient(135deg, #FF8E8E, #FFB6C1)',
          color: '#FF8E8E',
          x: '10%',
          y: '15%',
          tags: ['睡眠', '温馨', '舒适'],
        },
        {
          id: 'study_room',
          name: '书房',
          description: '摆满书籍的书房，是阅读和思考的好地方',
          icon: '📖',
          gradient: 'linear-gradient(135deg, #8B4513, #A0522D)',
          color: '#8B4513',
          x: '75%',
          y: '10%',
          tags: ['阅读', '思考', '安静'],
        },
        {
          id: 'kitchen',
          name: '厨房',
          description: '充满香气的厨房，可以制作各种美味的食物',
          icon: '🍳',
          gradient: 'linear-gradient(135deg, #FFD93D, #F6AD55)',
          color: '#FFD93D',
          x: '18%',
          y: '58%',
          tags: ['烹饪', '美食', '温馨'],
        },
        {
          id: 'garden',
          name: '花园',
          description: '种满鲜花的小花园，有蝴蝶和小鸟来访',
          icon: '🌸',
          gradient: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
          color: '#FF69B4',
          x: '72%',
          y: '52%',
          tags: ['花园', '鲜花', '自然'],
        },
      ],
    },
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
    this.updatePetMarker();
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

  // 获取所有可选场景（仅二级场景，心宠不能进入一级场景）
  getAllScenes() {
    const { secondaryScenes } = this.data;
    let allScenes = [];
    Object.values(secondaryScenes).forEach((list) => {
      allScenes = allScenes.concat(list);
    });
    return allScenes;
  },

  // 心宠切换场景
  switchPetScene() {
    const allScenes = this.getAllScenes();
    const { petSceneId } = this.data;
    if (allScenes.length <= 1) return;

    // 随机选择一个不同于当前的场景
    let newScene;
    do {
      newScene = allScenes[Math.floor(Math.random() * allScenes.length)];
    } while (newScene.id === petSceneId);

    // 随机选择一个活动
    const newActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];

    this.setData({
      petSceneId: newScene.id,
      petSceneName: newScene.name,
      petActivity: newActivity,
    });

    // 更新标记位置（根据当前地图级别）
    this.updatePetMarker();

    // 如果心宠切换到了当前场景，显示提示
    const { currentSceneId } = this.data;
    if (newScene.id === currentSceneId) {
      wx.showToast({
        title: '心宠回来了！',
        icon: 'none',
      });
    }
  },

  // 更新地图中心宠标记位置
  // 两个独立图标：一级地图显示父级场景位置，二级地图只显示在当前查看的二级地图里
  updatePetMarker() {
    const { scenes, secondaryScenes, petSceneId, activePrimarySceneId } = this.data;

    // 先查找是否在一级场景中
    let scene = scenes.find((s) => s.id === petSceneId);
    let parentScene = null;
    let parentId = null;

    // 如果不在一级场景中，在二级场景中查找
    if (!scene) {
      Object.entries(secondaryScenes).forEach(([pid, list]) => {
        const found = list.find((s) => s.id === petSceneId);
        if (found) {
          scene = found;
          parentId = pid;
          parentScene = scenes.find((s) => s.id === pid);
        }
      });
    }

    if (!scene) return;

    // 一级地图图标：始终显示在父级（或当前一级）场景位置
    const primaryScene = parentScene || scene;
    const primaryStyle = `left: ${primaryScene.x}; top: ${primaryScene.y};`;

    // 二级地图图标：只有当心宠属于当前正在查看的二级地图时才显示
    let secondaryStyle = '';
    if (activePrimarySceneId && parentId === activePrimarySceneId) {
      // 心宠在当前查看的二级地图里，显示在具体的二级场景位置
      secondaryStyle = `left: ${scene.x}; top: ${scene.y};`;
    }
    // 否则 secondaryStyle 为空字符串，二级图标隐藏

    this.setData({
      petMarkerPrimaryStyle: primaryStyle,
      petMarkerSecondaryStyle: secondaryStyle,
    });
  },

  // 点击进入二级场景
  enterSecondaryScene(sceneId) {
    this.setData({
      activePrimarySceneId: sceneId,
      mapLevel: 'secondary',
    });
    // 进入二级后更新标记位置（显示具体二级场景位置）
    this.updatePetMarker();
  },

  // 返回一级场景
  backToPrimary() {
    this.setData({
      mapLevel: 'primary',
      activePrimarySceneId: '',
    });
    // 返回一级后更新标记位置（显示父级一级场景位置）
    this.updatePetMarker();
  },

  // 点击设置
  onSettingsTap() {
    wx.showToast({
      title: '设置功能开发中',
      icon: 'none',
    });
  },

  // ========== 世界地图 ==========

  // 点击地块（一级场景）
  onSceneTap(e) {
    const { scene } = e.currentTarget.dataset;
    // 所有一级场景都有二级场景，直接打开二级视图
    this.enterSecondaryScene(scene.id);
  },

  // 点击二级场景地块
  onSecondarySceneTap(e) {
    const { scene } = e.currentTarget.dataset;
    wx.showModal({
      title: '切换场景',
      content: `确定要进入「${scene.name}」吗？`,
      confirmText: '进入',
      confirmColor: '#6B5B95',
      success: (res) => {
        if (res.confirm) {
          this.enterSecondarySceneDetail(scene);
        }
      },
    });
  },

  // 进入二级场景详情（真正进入该场景）
  enterSecondarySceneDetail(scene) {
    // 清空所有一级场景的 current 标记
    const scenes = this.data.scenes.map((s) => ({
      ...s,
      current: false,
    }));

    // 更新当前场景为二级场景
    this.setData({
      scenes,
      currentScene: scene.name,
      currentSceneId: scene.id,
      currentSceneIcon: scene.icon || '🌲',
    });

    wx.showToast({
      title: `已进入${scene.name}`,
      icon: 'success',
    });

    // 返回游戏视图
    this.backToGame();
    this.backToPrimary();
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

    // 禁止进入一级场景
    const primarySceneIds = this.data.scenes.map((s) => s.id);
    if (primarySceneIds.includes(selectedScene.id)) {
      wx.showToast({ title: '一级场景不能直接进入，请选择二级场景', icon: 'none' });
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
            current: false,
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

  // ========== 地图编辑模式 ==========

  // 切换编辑模式
  toggleEditMode() {
    const { isEditMode } = this.data;
    this.setData({ isEditMode: !isEditMode });
    if (!isEditMode) {
      wx.showToast({ title: '进入编辑模式，可拖拽场景', icon: 'none' });
    } else {
      wx.showToast({ title: '退出编辑模式', icon: 'none' });
    }
  },

  // 场景触摸开始（编辑模式）
  onSceneTouchStart(e) {
    if (!this.data.isEditMode) return;
    const { scene } = e.currentTarget.dataset;
    const touch = e.touches[0];
    this.setData({
      editDragStart: {
        sceneId: scene.id,
        startX: touch.clientX,
        startY: touch.clientY,
        origX: parseFloat(scene.x),
        origY: parseFloat(scene.y),
      },
      editingSceneId: scene.id,
    });
  },

  // 场景触摸移动（编辑模式）
  onSceneTouchMove(e) {
    if (!this.data.isEditMode || !this.data.editDragStart) return;
    const touch = e.touches[0];
    const dragStart = this.data.editDragStart;
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();

    // 计算移动距离（转换为百分比）
    const deltaX = ((touch.clientX - dragStart.startX) / windowWidth) * 100;
    const deltaY = ((touch.clientY - dragStart.startY) / windowHeight) * 100;

    let newX = dragStart.origX + deltaX;
    let newY = dragStart.origY + deltaY;

    // 限制在 5% - 85% 范围内
    newX = Math.max(5, Math.min(85, newX));
    newY = Math.max(5, Math.min(85, newY));

    // 更新场景位置
    const { secondaryScenes, activePrimarySceneId } = this.data;
    const scenes = secondaryScenes[activePrimarySceneId].map((s) => {
      if (s.id === dragStart.sceneId) {
        return { ...s, x: `${newX.toFixed(1)}%`, y: `${newY.toFixed(1)}%` };
      }
      return s;
    });

    this.setData({
      [`secondaryScenes.${activePrimarySceneId}`]: scenes,
    });
  },

  // 场景触摸结束
  onSceneTouchEnd() {
    if (!this.data.isEditMode) return;
    this.setData({
      editDragStart: null,
      editingSceneId: '',
    });
  },

  // 导出场景配置
  exportSceneConfig() {
    const { secondaryScenes } = this.data;
    let config = '';

    Object.keys(secondaryScenes).forEach((key) => {
      config += `      ${key}: [\n`;
      secondaryScenes[key].forEach((scene) => {
        config += `        {\n`;
        config += `          id: '${scene.id}',\n`;
        config += `          name: '${scene.name}',\n`;
        config += `          description: '${scene.description}',\n`;
        config += `          icon: '${scene.icon}',\n`;
        config += `          gradient: '${scene.gradient}',\n`;
        config += `          color: '${scene.color}',\n`;
        config += `          x: '${scene.x}',\n`;
        config += `          y: '${scene.y}',\n`;
        config += `          tags: [${scene.tags.map((t) => `'${t}'`).join(', ')}],\n`;
        config += `        },\n`;
      });
      config += `      ],\n`;
    });

    wx.setClipboardData({
      data: config,
      success() {
        wx.showModal({
          title: '配置已复制',
          content: '场景坐标配置已复制到剪贴板，请粘贴发给开发者',
          showCancel: false,
        });
      },
    });
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
