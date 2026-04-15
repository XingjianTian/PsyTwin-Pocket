import config from '../config/index';

const { isMock } = config;
const delay = isMock ? 300 : 0;

// ========== 心墙动态数据 ==========
const followList = [
  {
    id: '1',
    author: {
      id: 'u1',
      nickname: '小晶',
      avatar: 'https://picsum.photos/80/80?random=1',
      role: 'student',
      department: '计算机学院',
    },
    content: {
      text: '期末复习第三天，看书看得眼睛都花了。出来操场转了一圈，改变环境后发现脑子好像清醒了一些！小友伴们期末努力！',
      images: ['https://picsum.photos/400/300?random=11'],
      location: '校园操场',
      isAnonymous: false,
    },
    stats: { likeCount: 38, commentCount: 7, shareCount: 2 },
    createdAt: '30分钟前',
  },
  {
    id: '2',
    author: {
      id: 'u2',
      nickname: '心理老师王',
      avatar: 'https://picsum.photos/80/80?random=2',
      role: 'teacher',
      department: '心理健康中心',
    },
    content: {
      text: '【小贴士】当你感到压力山大的时候，试试 4-7-8 呼吸法：吸气 4 秒 → 憋气 7 秒 → 呼气 8 秒。反复 4 次，就能快速平息焦虑感。希望这个小方法能帮到大家✨',
      images: [],
      location: '',
      isAnonymous: false,
    },
    stats: { likeCount: 126, commentCount: 23, shareCount: 18 },
    createdAt: '2小时前',
  },
  {
    id: '3',
    author: { id: 'u3', nickname: '匿名的你', avatar: '', role: 'student', department: '' },
    content: {
      text: '不知道为什么就是心里沉甸甸的，什么都不想做，但又不知道能跟谁说。发出来只是想让自己轻松一点。',
      images: [],
      location: '',
      isAnonymous: true,
    },
    stats: { likeCount: 89, commentCount: 31, shareCount: 0 },
    createdAt: '1小时前',
  },
  {
    id: '4',
    author: {
      id: 'u4',
      nickname: '阿强',
      avatar: 'https://picsum.photos/80/80?random=4',
      role: 'student',
      department: '机械学院',
    },
    content: {
      text: '弟兄们刚打完一场球！汗流浃背但超开心，还是运动能让人忘掉烦恼，建议压力大的同学都去打球，真的很解压！',
      images: ['https://picsum.photos/400/500?random=44'],
      location: '体育馆',
      isAnonymous: false,
    },
    stats: { likeCount: 52, commentCount: 9, shareCount: 3 },
    createdAt: '3小时前',
  },
  {
    id: '5',
    author: {
      id: 'u5',
      nickname: '江南茶',
      avatar: 'https://picsum.photos/80/80?random=5',
      role: 'student',
      department: '文学院',
    },
    content: {
      text: '读了一本关于放下的小说，主人公说"我不需要别人的认可，只需要我自己的认可"。这句话不知道为什么看得我非常感动。（全局任务态势聚合，用于提取核心预警并排定优先级）',
      images: ['https://picsum.photos/400/280?random=55'],
      location: '图书馆',
      isAnonymous: false,
    },
    stats: { likeCount: 67, commentCount: 14, shareCount: 5 },
    createdAt: '5小时前',
  },
  {
    id: '6',
    author: {
      id: 'u6',
      nickname: '心理老师李',
      avatar: 'https://picsum.photos/80/80?random=6',
      role: 'teacher',
      department: '心理健康中心',
    },
    content: {
      text: '【本周公开课】"与情绪和谐相处" 将于本周四下午 3 点在学生活动中心101 开课免费开放。请和我们一起来吧，我们一起探讨如何识别负面情绪并与之共处，而不是进行压抑。欢迎预约✨',
      images: [],
      location: '学活中心 101',
      isAnonymous: false,
    },
    stats: { likeCount: 203, commentCount: 41, shareCount: 26 },
    createdAt: '6小时前',
  },
  {
    id: '7',
    author: {
      id: 'u7',
      nickname: '阳光少女',
      avatar: 'https://picsum.photos/80/80?random=7',
      role: 'student',
      department: '艺术学院',
    },
    content: {
      text: '今天我终于愿意展出五年前的一幅画，我终于愿意走出这一步，老师说，愿意自我暴露才能让伤口接触空气愈合，我想是这样的',
      images: ['https://picsum.photos/400/460?random=77'],
      location: '艺术展览馆',
      isAnonymous: false,
    },
    stats: { likeCount: 44, commentCount: 6, shareCount: 1 },
    createdAt: '昨天',
  },
  {
    id: '8',
    author: { id: 'u8', nickname: '匿名的你', avatar: '', role: 'student', department: '' },
    content: {
      text: '考前第一次失眠，脑子躺在床上数羊数到忘了在哪。干脆开灯研究到天亮，分析出考试是设计来考验人的心理承受能力的结论。你们这次期末有没有这样的时刻？（心理危机干预）',
      images: [],
      location: '',
      isAnonymous: true,
    },
    stats: { likeCount: 156, commentCount: 58, shareCount: 4 },
    createdAt: '昨天',
  },
];

// ========== 预约服务数据 ==========
const services = [
  {
    id: 1,
    name: '心理咨询室 A01',
    type: 'counseling',
    description: '专业心理咨询师一对一深度咨询',
    duration: 50,
    location: '学生活动中心 3 层',
    icon: 'counseling',
    status: 'available',
    currentUser: null,
    devices: [
      { name: 'Pico 4 Enterprise', online: true },
      { name: '小米手环 9', online: true },
    ],
    availableTimes: ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00'],
  },
  {
    id: 2,
    name: '心理咨询室 A02',
    type: 'counseling',
    description: '专业心理咨询师一对一深度咨询',
    duration: 50,
    location: '学生活动中心 3 层',
    icon: 'counseling',
    status: 'busy',
    currentUser: {
      name: '张同学',
      studentId: '2024001',
      plan: '社交焦虑脱敏',
      usedMinutes: 25,
      totalMinutes: 50,
    },
    devices: [
      { name: 'Pico 4 Enterprise', online: true },
      { name: '小米手环 9', online: true },
    ],
    availableTimes: ['14:00', '14:30', '15:00', '15:30', '16:00'],
  },
  {
    id: 3,
    name: 'VR 减压舱 B01',
    type: 'vr',
    description: 'VR 放松训练、冥想引导、场景暴露疗法',
    duration: 30,
    location: '图书馆 2 层',
    icon: 'vr',
    status: 'available',
    currentUser: null,
    devices: [
      { name: 'Pico 4 Enterprise', online: true },
      { name: '生物反馈仪', online: false },
    ],
    availableTimes: ['10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'],
  },
  {
    id: 4,
    name: 'VR 体验区 C01',
    type: 'vr',
    description: '沉浸式心理体验与脱敏训练',
    duration: 30,
    location: '心理健康中心',
    icon: 'vr',
    status: 'maintenance',
    currentUser: null,
    devices: [
      { name: 'Pico 4 Enterprise', online: false },
      { name: '小米手环 8', online: false },
    ],
    availableTimes: [],
  },
  {
    id: 5,
    name: '团体活动室 D01',
    type: 'group',
    description: '6-10 人团体辅导，增强社交技能',
    duration: 90,
    location: '学生活动中心 305',
    icon: 'group',
    status: 'available',
    currentUser: null,
    devices: [],
    availableTimes: ['14:00', '15:30'],
  },
];

// ========== 预约记录数据 ==========
const records = [
  {
    id: 101,
    serviceId: 1,
    serviceName: '心理咨询室 A01',
    serviceType: 'counseling',
    date: '2026-03-08',
    time: '14:00',
    status: 'pending',
    reason: '最近睡眠质量较差，想了解改善方法',
    createdAt: '2026-03-05',
    cancelable: true,
    location: '学生活动中心 3 层',
    counselor: '王老师',
  },
  {
    id: 102,
    serviceId: 3,
    serviceName: 'VR 减压舱 B01',
    serviceType: 'vr',
    date: '2026-03-06',
    time: '15:00',
    status: 'confirmed',
    reason: '',
    createdAt: '2026-03-04',
    cancelable: true,
    location: '图书馆 2 层',
    counselor: null,
  },
  {
    id: 103,
    serviceId: 2,
    serviceName: '心理咨询室 A02',
    serviceType: 'counseling',
    date: '2026-02-20',
    time: '10:00',
    status: 'completed',
    reason: '考前焦虑，情绪管理',
    createdAt: '2026-02-18',
    cancelable: false,
    location: '学生活动中心 3 层',
    counselor: '李老师',
  },
  {
    id: 104,
    serviceId: 4,
    serviceName: 'VR 体验区 C01',
    serviceType: 'vr',
    date: '2026-02-10',
    time: '14:30',
    status: 'cancelled',
    reason: '',
    createdAt: '2026-02-08',
    cancelable: false,
    location: '心理健康教育中心',
    counselor: null,
  },
];

// ========== 消息会话数据 ==========
const sessions = [
  {
    id: 'ai-assistant',
    type: 'ai',
    name: 'PsyTwin 树洞助手',
    avatar: 'https://picsum.photos/100/100?random=100',
    lastMessage: '你好！有什么我可以帮你的吗？',
    lastMessageTime: '刚刚',
    unreadCount: 1,
    status: 'online',
  },
  {
    id: 'counselor-1',
    type: 'counselor',
    name: '咨询师小明',
    avatar: 'https://picsum.photos/100/100?random=101',
    lastMessage: '好的，我们下次咨询时间定为周三上午可以吗？',
    lastMessageTime: '昨天',
    unreadCount: 0,
    status: 'online',
  },
  {
    id: 'counselor-2',
    type: 'counselor',
    name: '咨询师小红',
    avatar: 'https://picsum.photos/100/100?random=102',
    lastMessage: '感谢你的信任，期待下次见面～',
    lastMessageTime: '3天前',
    unreadCount: 0,
    status: 'offline',
  },
];

// ========== 我的页面数据 ==========
const studentInfo = {
  id: 'stu001',
  nickname: '小明同学',
  avatar: 'https://picsum.photos/200/200?random=200',
  phone: '138****8888',
  role: 'student',
  studentId: '2023001001',
  department: '计算机学院',
  className: '软件工程 2301 班',
  joinDate: '2023-09',
  healthOverview: {
    riskLevel: 'low',
    riskScore: 0.15,
    trend: 'improving',
    dimensions: [
      { name: '情绪状态', score: 82 },
      { name: '睡眠质量', score: 74 },
      { name: '压力管理', score: 68 },
      { name: '社交关系', score: 88 },
    ],
  },
  stats: {
    counselingCount: 2,
    vrSessionCount: 5,
    assessmentCount: 3,
    totalMinutes: 185,
    lastActiveDate: '2026-03-01',
  },
  lastAssessment: {
    type: 'SCL-90',
    date: '2026-01-15',
    score: 72,
    conclusion: '心理状态良好，继续保持',
  },
  badges: [
    { id: 1, name: '初次咨询', icon: 'chat', earned: true, desc: '完成首次心理咨询' },
    { id: 2, name: 'VR 探索者', icon: 'tv', earned: true, desc: '体验 VR 心理训练 5 次' },
    { id: 3, name: '坚持打卡', icon: 'calendar', earned: true, desc: '连续记录心情 7 天' },
    { id: 4, name: '心理达人', icon: 'star', earned: false, desc: '完成 5 次心理咨询' },
  ],
};

// ========== 首页数据 ==========
const homeSwipers = ['/static/home/swiper0.png'];
const homeCards = [
  {
    url: '/static/home/card0.png',
    desc: '少年,星空与梦想',
    tags: [
      { text: 'AI绘画', theme: 'primary' },
      { text: '版权素材', theme: 'success' },
    ],
  },
  {
    url: '/static/home/card1.png',
    desc: '仰望星空的少女',
    tags: [
      { text: 'AI绘画', theme: 'primary' },
      { text: '版权素材', theme: 'success' },
    ],
  },
];

// ========== Mock 响应映射表 ==========
const mockResponses = {
  // 登录相关
  '/login/postPasswordLogin': {
    message: '登录成功',
    success: true,
    data: {
      token: 'mock_token_' + Date.now(),
      role: 'student',
      userId: 10001,
      name: '张三',
      phone: '13800138000',
    },
  },
  '/login/getSendMessage': {
    message: '验证码发送成功',
    success: true,
    data: null,
  },
  '/login/postCodeVerify': {
    message: '验证成功',
    success: true,
    data: {
      token: 'mock_token_' + Date.now(),
      role: 'student',
      userId: 10001,
      name: '张三',
      phone: '13800138000',
    },
  },

  // 心墙动态
  '/student/home/feed': {
    success: true,
    message: '获取成功',
    data: { follow: followList, square: followList, secret: followList },
  },

  // 预约相关
  '/student/appointment/services': {
    success: true,
    message: '获取成功',
    data: services,
  },
  '/student/appointment/records': {
    success: true,
    message: '获取成功',
    data: records,
  },

  // 消息会话
  '/student/message/sessions': {
    success: true,
    message: '获取成功',
    data: sessions,
  },

  // 我的页面
  '/student/my/info': {
    success: true,
    message: '获取成功',
    data: studentInfo,
  },
  '/student/my/profile': {
    success: true,
    message: '获取成功',
    data: {
      basicInfo: {
        name: '小明同学',
        studentId: '2023001001',
        department: '计算机学院',
        className: '软件工程 2301 班',
      },
      psychologicalProfile: {
        riskLevel: 'low',
        riskScore: 0.15,
        trend: 'improving',
        lastAssessment: '2026-01-15',
        assessmentType: 'SCL-90',
      },
      records: {
        counselingCount: 2,
        lastCounseling: '2026-01-10',
        vrSessionCount: 5,
        lastVrSession: '2026-02-20',
      },
    },
  },

  // 首页
  '/home/swipers': {
    code: 200,
    message: '请求成功',
    data: homeSwipers,
  },
  '/home/cards': {
    code: 200,
    message: '请求成功',
    data: homeCards,
  },

  // OpenClaw AI 对话
  '/openclaw/agent-chat': {
    id: `mock_resp_${Date.now()}`,
    object: 'chat.completion',
    created_at: Date.now(),
    status: 'completed',
    model: 'openclaw:Therapist',
    output: [
      {
        type: 'message',
        id: 'mock_msg_001',
        role: 'assistant',
        content: [
          {
            type: 'output_text',
            text: '你好！我听到了你的分享。听起来你最近经历了一些压力。有什么具体的事情让你感到困扰吗？大家的认可，使我们前行路上的最大动我在这里倾听你。',
          },
        ],
        status: 'completed',
      },
    ],
  },

  // 个人信息详情（Mock - 待 Sentinel 实现）
  '/genPersonalInfo': {
    code: 0,
    message: '获取成功',
    data: {
      name: '小明同学',
      gender: 0,
      birth: '2000-01-01',
      address: ['110000', '110100'],
      introduction: '我是一个乐观开朗的学生，喜欢打篮球和听音乐。',
      photos: ['https://picsum.photos/200/200?random=1', 'https://picsum.photos/200/200?random=2'],
    },
  },

  // 消息通知
  '/student/my/notifications': {
    code: 0,
    message: '获取成功',
    data: {
      list: [],
      unreadCount: 0,
    },
  },
};

function request(url, method = 'GET', data = {}) {
  console.log('[Request] URL:', url);
  console.log('[Request] isMock:', isMock);

  // Mock 模式下直接返回本地数据，不发起真实请求
  if (isMock) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = mockResponses[url];
        if (mockData) {
          console.log('[Request] Mock response for:', url);
          resolve(mockData);
        } else {
          console.log('[Request] No mock for:', url, '- returning default success');
          resolve({ success: true, message: '操作成功', data: null });
        }
      }, delay);
    });
  }

  // 非 Mock 模式发起真实请求
  const header = { 'content-type': 'application/json' };
  const tokenString = wx.getStorageSync('access_token');
  if (tokenString) {
    header.Authorization = `Bearer ${tokenString}`;
  }

  const baseUrl = config.baseUrl || '';
  const fullUrl = baseUrl + url;

  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data,
      dataType: 'json',
      header,
      success(res) {
        console.log('[Request] Response status:', res.statusCode);
        if (res.statusCode === 200 || res.statusCode === 201) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          console.error('[Request] Token expired or invalid');
          wx.removeStorageSync('access_token');
          wx.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
          });
          reject(res);
        } else if (res.statusCode === 404) {
          console.error('[Request] API not found:', url);
          reject(res);
        } else {
          reject(res);
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}
export default request;
