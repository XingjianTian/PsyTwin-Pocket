import request from '~/api/request';

// 根据时段生成问候语
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '深夜了';
  if (hour < 11) return '早上好';
  if (hour < 13) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
}

// 建议 Chips 配置
const CHIPS = [
  {
    id: 1,
    icon: 'heart',
    color: 'purple',
    title: '倾诉一下心情',
    desc: '今天发生了什么，说出来轻松一点',
    prompt: '我想聊聊今天的心情',
  },
  {
    id: 2,
    icon: 'help-circle',
    color: 'blue',
    title: '我感到焦虑/压力大',
    desc: '一起分析压力来源，找到应对方法',
    prompt: '我最近感到很焦虑和压力很大，想聊聊',
  },
  {
    id: 3,
    icon: 'moon',
    color: 'teal',
    title: '睡眠不好怎么办',
    desc: '失眠、多梦、睡不着的困扰',
    prompt: '我最近睡眠质量很差，有什么改善方法吗？',
  },
  {
    id: 4,
    icon: 'user-group',
    color: 'green',
    title: '人际关系的烦恼',
    desc: '和朋友、室友、家人的矛盾',
    prompt: '我在人际关系上遇到了一些困扰，想聊聊',
  },
];

Page({
  data: {
    greeting: '你好',
    userName: '同学',
    chips: CHIPS,
    hasHistory: false,
    lastMessage: '',
    inputValue: '',
  },

  onLoad() {
    this.initGreeting();
    this.loadUserInfo();
    this.loadLastSession();
  },

  onShow() {
    this.loadLastSession();
  },

  // 初始化时段问候语
  initGreeting() {
    this.setData({ greeting: getGreeting() });
  },

  // 加载用户信息（取昵称）
  async loadUserInfo() {
    try {
      const res = await request('/mock/student/my/info');
      const nickname = res.data?.nickname || '同学';
      // 只取名字前两个字避免过长
      const shortName = nickname.length > 3 ? nickname.slice(0, 2) : nickname;
      this.setData({ userName: shortName });
    } catch (err) {
      // 保持默认"同学"
    }
  },

  // 加载最近一条 AI 会话记录
  async loadLastSession() {
    try {
      const res = await request('/mock/student/message/sessions');
      const sessions = res.data || [];
      const aiSession = sessions.find((s) => s.type === 'ai');
      if (aiSession && aiSession.lastMessage) {
        this.setData({
          hasHistory: true,
          lastMessage: aiSession.lastMessage,
        });
      }
    } catch (err) {
      // 无历史记录则不显示
    }
  },

  // 点击 Chip 带预设 prompt 进入聊天
  onChipTap(e) {
    const { prompt } = e.currentTarget.dataset;
    this.enterChat(prompt);
  },

  // 点击输入栏 / 历史记录进入聊天
  onEnterChat(e) {
    const { prompt } = e.currentTarget.dataset;
    this.enterChat(prompt || '');
  },

  enterChat(prompt) {
    const encodedPrompt = prompt ? encodeURIComponent(prompt) : '';
    wx.navigateTo({
      url: `/pages/chat/index?id=ai-assistant&type=ai&name=${encodeURIComponent('心图 AI')}&prompt=${encodedPrompt}`,
    });
  },

  // 输入框输入处理
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息
  onSend() {
    const { inputValue } = this.data;
    if (!inputValue.trim()) return;
    this.enterChat(inputValue);
    this.setData({ inputValue: '' });
  },
});
