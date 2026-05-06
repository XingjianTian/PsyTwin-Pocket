// 其他心宠名字列表
const PET_NAMES = [
  '小白', '小黄', '小黑', '小红', '小蓝',
  '小绿', '小紫', '小橙', '小粉', '小青',
  '圆圆', '方方', '星星', '月月', '花花',
  '草草', '乐乐', '笑笑', '泡泡', '糖糖',
];

// 对话内容池
const DIALOGUES = [
  ['嗨！你好呀！', '你好！今天天气不错呢！'],
  ['你去哪里呀？', '我在随便逛逛，你呢？'],
  ['最近过得怎么样？', '挺好的，就是有点忙！'],
  ['你也来这个场景玩吗？', '对呀，这里很漂亮！'],
  ['你好可爱呀！', '谢谢，你也很可爱！'],
  ['要一起去探险吗？', '好呀，我正好无聊呢！'],
  ['你今天吃了什么好吃的？', '食堂的麻辣烫，超好吃！'],
  ['最近有什么好玩的事吗？', '我发现了一个秘密基地！'],
  ['你觉得这个场景怎么样？', '挺喜欢的，很安静！'],
  ['我们交个朋友吧！', '好呀，以后一起玩！'],
  ['你在做什么呢？', '我在看风景，好美呀！'],
  ['要不要一起学习？', '好呀，正好有道题不会！'],
  ['你今天心情怎么样？', '超级开心！见到你了！'],
  ['这个场景你常来吗？', '偶尔来，放松一下心情'],
  ['最近有什么新发现吗？', '发现了一片美丽的花海！'],
];

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

// 活动列表（按场景分类）
const SCENE_ACTIVITIES = {
  // 宿舍相关
  bedroom: [
    '在温暖的被窝里睡懒觉',
    '躺在床上刷手机',
    '趴在书桌前写作业',
    '坐在电脑前打游戏',
    '躺在床上发呆思考人生',
    '整理床铺和桌面',
    '躺着看天花板',
    '熬夜追剧',
  ],
  dormitory: [
    '在宿舍里整理东西',
    '坐在桌前学习',
    '和室友聊天',
    '躺在床上休息',
    '在宿舍里打游戏',
  ],
  // 教学楼
  teaching_building: [
    '认真听讲做笔记',
    '在教室里上课',
    '和同学讨论问题',
    '偷偷在课上走神',
    '积极回答老师提问',
  ],
  // 图书馆
  library: [
    '在书架间寻找资料',
    '安静地阅读书籍',
    '认真复习功课',
    '在自习区写作业',
    '查阅参考书籍',
  ],
  // 食堂
  cafeteria: [
    '挑选喜欢的菜品',
    '享受美味的午餐',
    '和朋友一起吃饭聊天',
    '品尝新出的菜品',
    '慢慢享受晚餐',
  ],
  // 操场
  playground: [
    '在操场上跑步锻炼',
    '打篮球挥洒汗水',
    '坐在草坪上休息',
    '和朋友一起运动',
    '做着拉伸运动',
  ],
  // 奇幻空间
  deep_forest: [
    '在魔法森林中探险',
    '采集发光的魔法草药',
    '追踪神秘的森林精灵',
    '寻找隐藏的宝藏',
    '观察会说话的树木',
  ],
  crystal_cave: [
    '探索水晶洞穴的深处',
    '收集七彩的水晶碎片',
    '感受水晶的魔法能量',
    '在水晶丛中冥想',
    '寻找传说中的魔法石',
  ],
  mushroom_village: [
    '和蘑菇精灵打招呼',
    '在蘑菇村落里散步',
    '品尝精灵特制的蘑菇汤',
    '帮助小精灵采蘑菇',
    '参观蘑菇小屋',
  ],
  fairy_lake: [
    '在湖边欣赏水莲花',
    '和水精灵一起玩耍',
    '收集湖中的星光水滴',
    '坐在湖边静静地冥想',
    '观察湖中的神奇生物',
  ],
  star_meadow: [
    '躺在草地上看星星',
    '收集草地上的星光露珠',
    '在星空下许愿',
    '和萤火虫一起跳舞',
    '欣赏美丽的星空',
  ],
  // 自由旷野
  bonfire_area: [
    '围坐在篝火旁取暖',
    '烤棉花糖吃',
    '和朋友围炉夜话',
    '看着篝火发呆',
    '听 firewood 噼啪声',
  ],
  picnic_lawn: [
    '在草坪上野餐',
    '铺开野餐垫享受阳光',
    '品尝美味的三明治',
    '躺在草坪上晒太阳',
    '和朋友分享零食',
  ],
  hammock_area: [
    '在吊床上悠闲地摇晃',
    '躺在吊上午睡',
    '坐在吊床上看书',
    '享受慵懒的午后时光',
    '在吊床上发呆',
  ],
  stream_side: [
    '在溪边听流水声',
    '用小手拨弄清澈的溪水',
    '在溪边寻找漂亮的石头',
    '看着溪水发呆',
    '听鸟鸣和流水声',
  ],
  viewing_platform: [
    '站在观景台俯瞰美景',
    '欣赏远处的山峦',
    '吹着风看风景',
    '拍照记录美好瞬间',
    '深呼吸感受大自然',
  ],
  // 小镇
  supermarket: [
    '在超市里挑选零食',
    '推着购物车逛货架',
    '对比商品的价格',
    '发现新口味的饮料',
    '买了很多好吃的',
  ],
  cinema: [
    '坐在电影院里看电影',
    '吃着爆米花等开场',
    '被电影情节感动哭了',
    '和朋友讨论剧情',
    '准备看下一场电影',
  ],
  amusement_park: [
    '坐过山车尖叫',
    '在旋转木马上拍照',
    '排队等玩刺激项目',
    '吃游乐园的棉花糖',
    '坐摩天轮看风景',
  ],
  cafe: [
    '喝着咖啡发呆',
    '品尝精致的蛋糕',
    '在咖啡馆里看书',
    '和朋友聊天喝茶',
    '听着音乐享受午后',
  ],
  arcade: [
    '在玩抓娃娃机',
    '挑战街机高分记录',
    '和朋友对战游戏',
    '跳舞机上秀舞姿',
    '赢了好多游戏币',
  ],
  // 梦境小屋
  study_room: [
    '在书房里阅读书籍',
    '在书桌前写日记',
    '翻阅有趣的绘本',
    '整理书架上的书',
    '坐在窗边看书',
  ],
  kitchen: [
    '在厨房里做饭',
    '烘焙香甜的小饼干',
    '尝试新的食谱',
    '煮一杯热茶',
    '准备美味的点心',
  ],
  garden: [
    '在花园里浇花',
    '和蝴蝶追逐嬉戏',
    '采摘新鲜的鲜花',
    '躺在花丛中晒太阳',
    '种植新的花苗',
  ],
  // 心理咨询室
  psychological_room: [
    '在咨询室里倾诉烦恼',
    '和咨询师聊天',
    '在舒适的沙发上休息',
    '整理自己的情绪',
    '做放松训练',
  ],
};

// 时间调度配置（基于现实时间）
// 工作日（周一到周五）日程
const WEEKDAY_SCHEDULE = [
  { hour: 0, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 1, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 2, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 3, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 4, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 5, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 6, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 7, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 8, scenes: [{ id: 'teaching_building', weight: 85 }, { id: 'library', weight: 10 }, { id: 'bedroom', weight: 5 }] },
  { hour: 9, scenes: [{ id: 'teaching_building', weight: 85 }, { id: 'library', weight: 10 }, { id: 'bedroom', weight: 5 }] },
  { hour: 10, scenes: [{ id: 'teaching_building', weight: 80 }, { id: 'library', weight: 15 }, { id: 'bedroom', weight: 5 }] },
  { hour: 11, scenes: [{ id: 'teaching_building', weight: 75 }, { id: 'library', weight: 15 }, { id: 'bedroom', weight: 10 }] },
  { hour: 12, scenes: [{ id: 'cafeteria', weight: 70 }, { id: 'picnic_lawn', weight: 20 }, { id: 'mushroom_village', weight: 10 }] },
  { hour: 13, scenes: [{ id: 'library', weight: 50 }, { id: 'teaching_building', weight: 30 }, { id: 'hammock_area', weight: 20 }] },
  { hour: 14, scenes: [{ id: 'library', weight: 55 }, { id: 'teaching_building', weight: 35 }, { id: 'bedroom', weight: 10 }] },
  { hour: 15, scenes: [{ id: 'library', weight: 50 }, { id: 'teaching_building', weight: 30 }, { id: 'playground', weight: 20 }] },
  { hour: 16, scenes: [{ id: 'library', weight: 45 }, { id: 'playground', weight: 35 }, { id: 'teaching_building', weight: 20 }] },
  { hour: 17, scenes: [{ id: 'playground', weight: 40 }, { id: 'picnic_lawn', weight: 30 }, { id: 'stream_side', weight: 20 }, { id: 'bedroom', weight: 10 }] },
  { hour: 18, scenes: [{ id: 'cafeteria', weight: 60 }, { id: 'picnic_lawn', weight: 25 }, { id: 'bonfire_area', weight: 15 }] },
  { hour: 19, scenes: [{ id: 'library', weight: 45 }, { id: 'bedroom', weight: 35 }, { id: 'teaching_building', weight: 20 }] },
  { hour: 20, scenes: [{ id: 'bedroom', weight: 50 }, { id: 'library', weight: 30 }, { id: 'teaching_building', weight: 20 }] },
  { hour: 21, scenes: [{ id: 'bedroom', weight: 60 }, { id: 'library', weight: 25 }, { id: 'star_meadow', weight: 15 }] },
  { hour: 22, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'star_meadow', weight: 20 }, { id: 'dormitory', weight: 10 }] },
  { hour: 23, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
];

// 周末（周六到周日）日程
const WEEKEND_SCHEDULE = [
  { hour: 0, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 1, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 2, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 3, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 4, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 5, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 6, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 7, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 8, scenes: [{ id: 'bedroom', weight: 60 }, { id: 'picnic_lawn', weight: 25 }, { id: 'deep_forest', weight: 15 }] },
  { hour: 9, scenes: [{ id: 'picnic_lawn', weight: 40 }, { id: 'deep_forest', weight: 35 }, { id: 'bedroom', weight: 25 }] },
  { hour: 10, scenes: [{ id: 'deep_forest', weight: 45 }, { id: 'crystal_cave', weight: 30 }, { id: 'picnic_lawn', weight: 25 }] },
  { hour: 11, scenes: [{ id: 'crystal_cave', weight: 40 }, { id: 'mushroom_village', weight: 35 }, { id: 'picnic_lawn', weight: 25 }] },
  { hour: 12, scenes: [{ id: 'cafeteria', weight: 50 }, { id: 'mushroom_village', weight: 35 }, { id: 'picnic_lawn', weight: 15 }] },
  { hour: 13, scenes: [{ id: 'mushroom_village', weight: 40 }, { id: 'fairy_lake', weight: 35 }, { id: 'hammock_area', weight: 25 }] },
  { hour: 14, scenes: [{ id: 'fairy_lake', weight: 45 }, { id: 'deep_forest', weight: 30 }, { id: 'crystal_cave', weight: 25 }] },
  { hour: 15, scenes: [{ id: 'star_meadow', weight: 40 }, { id: 'viewing_platform', weight: 35 }, { id: 'stream_side', weight: 25 }] },
  { hour: 16, scenes: [{ id: 'viewing_platform', weight: 40 }, { id: 'stream_side', weight: 35 }, { id: 'bonfire_area', weight: 25 }] },
  { hour: 17, scenes: [{ id: 'bonfire_area', weight: 40 }, { id: 'supermarket', weight: 35 }, { id: 'cafe', weight: 25 }] },
  { hour: 18, scenes: [{ id: 'supermarket', weight: 40 }, { id: 'cafeteria', weight: 35 }, { id: 'bonfire_area', weight: 25 }] },
  { hour: 19, scenes: [{ id: 'cafe', weight: 40 }, { id: 'amusement_park', weight: 35 }, { id: 'bedroom', weight: 25 }] },
  { hour: 20, scenes: [{ id: 'bedroom', weight: 50 }, { id: 'arcade', weight: 30 }, { id: 'amusement_park', weight: 20 }] },
  { hour: 21, scenes: [{ id: 'bedroom', weight: 60 }, { id: 'star_meadow', weight: 25 }, { id: 'dormitory', weight: 15 }] },
  { hour: 22, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'star_meadow', weight: 20 }, { id: 'dormitory', weight: 10 }] },
  { hour: 23, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
];

// 随机事件概率配置
const RANDOM_EVENTS = {
  skipClass: { probability: 0.08, scenes: ['deep_forest', 'crystal_cave', 'mushroom_village', 'fairy_lake'], description: '逃课去探险了' },
  stayUpGaming: { probability: 0.15, scenes: ['bedroom', 'dormitory'], description: '熬夜打游戏' },
  earlyAdventure: { probability: 0.12, scenes: ['deep_forest', 'crystal_cave'], description: '早起去探险' },
  suddenMovie: { probability: 0.1, scenes: ['cinema', 'arcade', 'amusement_park'], description: '突发奇想去看电影' },
  midnightSnack: { probability: 0.08, scenes: ['cafeteria', 'kitchen'], description: '半夜起来觅食' },
  stargazing: { probability: 0.15, scenes: ['star_meadow', 'viewing_platform'], description: '去看星星' },
};

Page({
  data: {
    // 当前视图: game | map | bag | diary
    currentView: 'game',

    // 时间显示
    currentTime: '00:00',
    currentDateLabel: '周一 00:00',

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
    // 其他心宠列表
    otherPets: [],
    // 当前显示的对话
    activeDialog: null,
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
        id: 'town',
        name: '小镇',
        description: '热闹非凡的现代化小镇，有超市、电影院、游乐园等生活设施，是心宠休闲娱乐的好去处',
        icon: '🏘️',
        gradient: 'linear-gradient(135deg, #FF8C42, #FF6B6B)',
        color: '#FF8C42',
        deco: '🎡',
        unlocked: true,
        current: false,
        x: 'calc(78% - 80rpx)',
        y: '26%',
        tags: ['休闲', '娱乐', '生活'],
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
      town: [
        {
          id: 'supermarket',
          name: '超市',
          description: '琳琅满目的商品货架，从零食饮料到日用品应有尽有，是心宠采购日常用品的好去处',
          icon: '🛒',
          gradient: 'linear-gradient(135deg, #4A90E2, #5BA3F5)',
          color: '#4A90E2',
          x: '10%',
          y: '15%',
          tags: ['购物', '日常', '零食'],
        },
        {
          id: 'cinema',
          name: '电影院',
          description: '舒适的观影大厅，放映着最新最热的电影大片，爆米花和可乐是标配',
          icon: '🎬',
          gradient: 'linear-gradient(135deg, #9B89B3, #7B6993)',
          color: '#9B89B3',
          x: '75%',
          y: '10%',
          tags: ['电影', '娱乐', '放松'],
        },
        {
          id: 'amusement_park',
          name: '游乐园',
          description: '充满欢声笑语的主题乐园，有过山车、旋转木马和摩天轮，释放压力的最佳选择',
          icon: '🎡',
          gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
          color: '#FF6B6B',
          x: '18%',
          y: '62%',
          tags: ['游乐', '刺激', '欢乐'],
        },
        {
          id: 'cafe',
          name: '咖啡馆',
          description: '温馨的街角咖啡馆，飘香的咖啡和精致的甜点，适合发呆、阅读和约会',
          icon: '☕',
          gradient: 'linear-gradient(135deg, #8B4513, #A0522D)',
          color: '#8B4513',
          x: '70%',
          y: '55%',
          tags: ['咖啡', '甜点', '约会'],
        },
        {
          id: 'arcade',
          name: '游戏厅',
          description: '充满霓虹灯光的游戏厅，抓娃娃机、跳舞机和街机对战，和朋友们比拼技术',
          icon: '🎮',
          gradient: 'linear-gradient(135deg, #7BC8A4, #5BA88A)',
          color: '#7BC8A4',
          x: '45%',
          y: '85%',
          tags: ['游戏', '竞技', '娱乐'],
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
          id: 'dormitory',
          name: '宿舍',
          description: '温馨舒适的宿舍，有书桌、小床和一台游戏电脑，是休息和放松的小天地',
          icon: '🏠',
          gradient: 'linear-gradient(135deg, #9B89B3, #7B6993)',
          color: '#9B89B3',
          x: '14%',
          y: '58%',
          tags: ['休息', '游戏', '温馨'],
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
    // 初始化时间显示
    this.updateTimeDisplay();
    // 根据当前时间初始化心宠位置
    this.forceUpdateSceneByTime();
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
    if (this.otherPetTimer) {
      clearInterval(this.otherPetTimer);
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

    // 初始化其他心宠
    this.initOtherPets();
  },

  // 初始化其他心宠
  initOtherPets() {
    const allScenes = this.getAllScenes();
    const otherPets = [];

    for (let i = 0; i < 20; i++) {
      // 随机分配一个场景
      const randomScene = allScenes[Math.floor(Math.random() * allScenes.length)];
      
      // 随机初始位置
      const x = this.boundary.minX + Math.random() * (this.boundary.maxX - this.boundary.minX);
      const y = this.boundary.minY + Math.random() * (this.boundary.maxY - this.boundary.minY);

      otherPets.push({
        id: `other-pet-${i}`,
        name: PET_NAMES[i],
        sceneId: randomScene.id,
        sceneName: randomScene.name,
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        isMoving: false,
        isTalking: false,
        isInConversation: false,
        dialogText: '',
        dialogPartner: null,
        lastCheckedHour: -1,
      });
    }

    this.setData({ otherPets });

    // 启动其他心宠的移动循环
    this.startOtherPetsMovement();
  },

  // 启动其他心宠的移动
  startOtherPetsMovement() {
    // 每5秒更新一次其他心宠（包括对话）
    this.otherPetTimer = setInterval(() => {
      this.updateOtherPets();
    }, 5000);
  },

  // 更新所有其他心宠的状态
  updateOtherPets() {
    const { otherPets, petSceneId, petSpriteX, petSpriteY } = this.data;
    const updatedPets = [...otherPets];
    let hasDialogChange = false;
    const currentHour = new Date().getHours();

    updatedPets.forEach((pet, index) => {
      // 如果正在对话，不移动
      if (pet.isTalking) return;

      // 每个心宠独立的时间调度（整点时切换场景）
      if (pet.lastCheckedHour !== currentHour) {
        pet.lastCheckedHour = currentHour;
        // 20%概率切换场景
        if (Math.random() < 0.2) {
          const newSceneId = this.getSceneBySchedule();
          if (newSceneId !== pet.sceneId) {
            const newScene = this.getSceneInfo(newSceneId);
            if (newScene) {
              pet.sceneId = newSceneId;
              pet.sceneName = newScene.name;
              // 切换场景后随机新位置
              const { minX, maxX, minY, maxY } = this.boundary;
              pet.x = minX + Math.random() * (maxX - minX);
              pet.y = minY + Math.random() * (maxY - minY);
            }
          }
        }
      }

      // 30%概率移动（如果不在对话中）
      if (Math.random() < 0.3 && !pet.isTalking && !pet.isInConversation) {
        this.moveOtherPet(pet);
      }
    });

    // 检查对话：同一场景一次只触发一对
    const scenesWithDialog = new Set();
    
    for (let i = 0; i < updatedPets.length; i++) {
      const pet = updatedPets[i];
      if (pet.isTalking || pet.isInConversation) continue;
      
      // 检查与主心宠的碰撞
      if (pet.sceneId === petSceneId && !scenesWithDialog.has(pet.sceneId)) {
        const distance = this.getDistance(pet.x, pet.y, petSpriteX, petSpriteY);
        if (distance < 60) {
          this.startDialogBetweenPets(pet, {
            id: 'main-pet',
            name: '心宠',
            x: petSpriteX,
            y: petSpriteY,
          }, i);
          scenesWithDialog.add(pet.sceneId);
          hasDialogChange = true;
          break; // 一次只触发一对
        }
      }
      
      // 检查与其他心宠的碰撞
      for (let j = i + 1; j < updatedPets.length; j++) {
        const otherPet = updatedPets[j];
        if (otherPet.isTalking || otherPet.isInConversation) continue;
        
        if (pet.sceneId === otherPet.sceneId && !scenesWithDialog.has(pet.sceneId)) {
          const distance = this.getDistance(pet.x, pet.y, otherPet.x, otherPet.y);
          if (distance < 60) {
            this.startDialogBetweenPets(pet, otherPet, i, j);
            scenesWithDialog.add(pet.sceneId);
            hasDialogChange = true;
            break; // 一次只触发一对
          }
        }
      }
      
      if (hasDialogChange) break; // 已经触发了一对，跳出
    }

    this.setData({ otherPets: updatedPets });
  },

  // 计算两点距离
  getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  },

  // 移动其他心宠
  moveOtherPet(pet) {
    const { minX, maxX, minY, maxY } = this.boundary;
    
    // 随机选择目标位置
    const targetX = minX + Math.random() * (maxX - minX);
    const targetY = minY + Math.random() * (maxY - minY);
    
    // 直接更新位置（CSS transition会处理动画）
    pet.x = targetX;
    pet.y = targetY;
    pet.isMoving = false;
  },

  // 开始两个心宠之间的对话（轮流显示）
  startDialogBetweenPets(pet1, pet2, index1, index2) {
    // 检查当前场景是否已有对话在进行
    const { otherPets } = this.data;
    const currentSceneId = pet1.sceneId;
    
    // 检查同场景是否有其他心宠在对话
    const hasActiveDialog = otherPets.some(p => 
      p.sceneId === currentSceneId && (p.isTalking || p.isInConversation)
    );
    
    if (hasActiveDialog) {
      return; // 如果已有对话，跳过
    }
    
    // 随机选择一组对话
    const dialoguePair = DIALOGUES[Math.floor(Math.random() * DIALOGUES.length)];
    
    // 第一阶段：第一个宠物说话（持续3秒）
    const updatedPets = [...otherPets];
    
    if (pet1.id !== 'main-pet') {
      updatedPets[index1].isTalking = true;
      updatedPets[index1].dialogText = dialoguePair[0];
      updatedPets[index1].dialogPartner = pet2.name;
    }

    // 第二个宠物标记为正在对话
    if (index2 !== undefined && updatedPets[index2]) {
      updatedPets[index2].isInConversation = true;
      updatedPets[index2].dialogPartner = pet1.name;
    }

    this.setData({ otherPets: updatedPets });

    // 第二阶段：3秒后，第一个宠物说完，第二个宠物回答
    setTimeout(() => {
      const currentPets = [...this.data.otherPets];
      
      // 第一个宠物停止说话
      if (pet1.id !== 'main-pet' && currentPets[index1]) {
        currentPets[index1].isTalking = false;
        currentPets[index1].dialogText = '';
      }
      
      // 第二个宠物开始说话（如果存在）
      if (index2 !== undefined && currentPets[index2]) {
        currentPets[index2].isTalking = true;
        currentPets[index2].dialogText = dialoguePair[1];
        currentPets[index2].isInConversation = false;
      }
      
      this.setData({ otherPets: currentPets });
    }, 3000);

    // 第三阶段：6秒后，对话完全结束
    setTimeout(() => {
      const finalPets = [...this.data.otherPets];
      if (pet1.id !== 'main-pet' && finalPets[index1]) {
        finalPets[index1].isTalking = false;
        finalPets[index1].dialogText = '';
        finalPets[index1].dialogPartner = null;
      }
      if (index2 !== undefined && finalPets[index2]) {
        finalPets[index2].isTalking = false;
        finalPets[index2].dialogText = '';
        finalPets[index2].dialogPartner = null;
      }
      this.setData({ otherPets: finalPets });
    }, 6000);
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
    let lastCheckedHour = -1;
    let lastCheckedMinute = -1;

    // 状态值波动和场景调度检查
    this.statusTimer = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // 每分钟更新一次时间显示
      if (minute !== lastCheckedMinute) {
        lastCheckedMinute = minute;
        this.updateTimeDisplay();
      }

      // 每5秒波动一次状态值
      this.setData({
        mood: this.fluctuateValue(this.data.mood, 15, 90),
        energy: this.fluctuateValue(this.data.energy, 20, 95),
        social: this.fluctuateValue(this.data.social, 10, 85),
      });

      // 每小时检查一次时间调度（整点切换场景）
      if (hour !== lastCheckedHour) {
        lastCheckedHour = hour;
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

  // ========== 时间调度系统 ==========

  // 获取当前时间信息
  getCurrentTimeInfo() {
    const now = new Date();
    return {
      hour: now.getHours(),
      dayOfWeek: now.getDay(), // 0=周日, 1=周一, ..., 6=周六
      isWeekend: now.getDay() === 0 || now.getDay() === 6,
    };
  },

  // 根据权重随机选择场景
  weightedRandomScene(sceneWeights) {
    const totalWeight = sceneWeights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of sceneWeights) {
      random -= item.weight;
      if (random <= 0) {
        return item.id;
      }
    }
    return sceneWeights[0].id;
  },

  // 根据时间获取场景调度配置
  getSceneBySchedule() {
    const { hour, isWeekend } = this.getCurrentTimeInfo();
    const schedule = isWeekend ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;
    const hourConfig = schedule.find((item) => item.hour === hour);

    if (!hourConfig || !hourConfig.scenes || hourConfig.scenes.length === 0) {
      return 'bedroom'; // 默认回宿舍
    }

    return this.weightedRandomScene(hourConfig.scenes);
  },

  // 根据场景ID获取场景信息
  getSceneInfo(sceneId) {
    const allScenes = this.getAllScenes();
    return allScenes.find((s) => s.id === sceneId);
  },

  // 根据场景获取活动描述
  getActivityByScene(sceneId) {
    const activities = SCENE_ACTIVITIES[sceneId];
    if (activities && activities.length > 0) {
      return activities[Math.floor(Math.random() * activities.length)];
    }
    return '在探索这个神秘的地方';
  },

  // 检查是否触发随机事件
  checkRandomEvent() {
    const { hour, isWeekend } = this.getCurrentTimeInfo();
    const { petSceneId } = this.data;

    // 遍历所有随机事件
    for (const [eventKey, eventConfig] of Object.entries(RANDOM_EVENTS)) {
      if (Math.random() < eventConfig.probability) {
        // 检查当前场景是否在允许列表中
        if (eventConfig.scenes.includes(petSceneId)) {
          return {
            triggered: true,
            description: eventConfig.description,
            sceneId: petSceneId,
          };
        }
      }
    }

    return { triggered: false };
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

  // 心宠切换场景（基于时间调度）
  switchPetScene() {
    const { petSceneId } = this.data;

    // 1. 根据时间获取应该去的场景
    let targetSceneId = this.getSceneBySchedule();

    // 2. 检查是否触发随机事件（偏离日程）
    const randomEvent = this.checkRandomEvent();
    if (randomEvent.triggered) {
      targetSceneId = randomEvent.sceneId;
    }

    // 3. 如果目标场景和当前场景相同，不切换
    if (targetSceneId === petSceneId) {
      // 只更新活动描述
      const newActivity = this.getActivityByScene(petSceneId);
      this.setData({
        petActivity: newActivity,
      });
      return;
    }

    // 4. 获取目标场景信息
    const newScene = this.getSceneInfo(targetSceneId);
    if (!newScene) {
      console.warn('[Pet] Scene not found:', targetSceneId);
      return;
    }

    // 5. 获取新场景的活动描述
    const newActivity = this.getActivityByScene(targetSceneId);

    // 6. 更新数据
    this.setData({
      petSceneId: newScene.id,
      petSceneName: newScene.name,
      petActivity: newActivity,
    });

    // 7. 更新标记位置（根据当前地图级别）
    this.updatePetMarker();

    // 8. 如果心宠切换到了当前场景，显示提示
    const { currentSceneId } = this.data;
    if (newScene.id === currentSceneId) {
      wx.showToast({
        title: randomEvent.triggered ? `心宠${randomEvent.description}回来了！` : '心宠回来了！',
        icon: 'none',
      });
    }
  },

  // 更新时间显示
  updateTimeDisplay() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekDay = weekDays[now.getDay()];
    
    this.setData({
      currentTime: `${hours}:${minutes}`,
      currentDateLabel: `${weekDay} ${hours}:${minutes}`,
    });
  },

  // 强制根据当前时间更新场景（用于初始化或整点切换）
  forceUpdateSceneByTime() {
    const { hour, isWeekend } = this.getCurrentTimeInfo();
    const targetSceneId = this.getSceneBySchedule();
    const newScene = this.getSceneInfo(targetSceneId);

    if (newScene) {
      const newActivity = this.getActivityByScene(targetSceneId);
      this.setData({
        petSceneId: newScene.id,
        petSceneName: newScene.name,
        petActivity: newActivity,
      });
      this.updatePetMarker();
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
