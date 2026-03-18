// pages/chat/index.js
import { sendToTherapist, extractResponseText } from '../../api/ai';

const app = getApp();
const { socket } = app.globalData;

Page({
  data: {
    myAvatar: '/static/chat/avatar.png',
    userId: null,
    avatar: '/agents-icons/Therapist.png',
    name: '',
    messages: [],
    input: '',
    anchor: '',
    keyboardHeight: 0,
    chatType: 'counselor',
    isAIThinking: false,
  },

  onLoad(options) {
    console.log('[Chat] onLoad called, options:', options);
    const { id, type = 'counselor', name: chatName, prompt } = options;
    const initialMessages = [];
    let needAutoSend = false;

    if (prompt) {
      const decodedPrompt = decodeURIComponent(prompt);
      initialMessages.push({
        messageId: null,
        from: 0,
        content: decodedPrompt,
        time: Date.now(),
        read: true,
      });
      needAutoSend = type === 'ai';
    }

    this.setData({
      userId: id,
      chatType: type,
      name: chatName ? decodeURIComponent(chatName) : '',
      messages: initialMessages,
    });

    const eventChannel = this.getOpenerEventChannel();
    if (eventChannel) {
      eventChannel.on('update', this.update);
    }

    wx.nextTick(() => {
      this.scrollToBottom();
      if (needAutoSend) {
        console.log('[Chat] 自动发送初始消息给 AI');
        this.sendToAI(decodeURIComponent(prompt));
      }
    });
  },

  /** 生命周期函数--监听页面初次渲染完成 */
  onReady() {},

  /** 生命周期函数--监听页面显示 */
  onShow() {},

  /** 生命周期函数--监听页面隐藏 */
  onHide() {},

  /** 生命周期函数--监听页面卸载 */
  onUnload() {
    app.eventBus.off('update', this.update);
  },

  /** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh() {},

  /** 页面上拉触底事件的处理函数 */
  onReachBottom() {},

  /** 用户点击右上角分享 */
  onShareAppMessage() {},

  /** 更新数据 */
  update({ userId, avatar, name, messages }) {
    this.setData({ userId, avatar, name, messages: [...messages] });
    wx.nextTick(() => {
      this.scrollToBottom();
    });
  },

  handleKeyboardHeightChange(event) {
    const { height } = event.detail;
    if (!height) return;
    this.setData({ keyboardHeight: height });
    wx.nextTick(() => {
      this.scrollToBottom();
    });
  },

  /** 处理收起键盘事件 */
  handleBlur() {
    this.setData({ keyboardHeight: 0 });
  },

  /** 处理输入事件 */
  handleInput(event) {
    this.setData({ input: event.detail.value });
  },

  sendMessage() {
    const { userId, messages, input: content, chatType } = this.data;
    console.log('[Chat] sendMessage called', { content, chatType, hasUserId: !!userId });
    if (!content) return;

    const userMessage = { messageId: null, from: 0, content, time: Date.now(), read: true };
    messages.push(userMessage);
    this.setData({ input: '', messages });
    wx.nextTick(this.scrollToBottom);

    if (chatType === 'ai') {
      console.log('[Chat] 触发 AI 模式，调用 sendToAI');
      this.sendToAI(content);
    } else {
      console.log('[Chat] 触发 WebSocket 模式');
      socket.send(JSON.stringify({ type: 'message', data: { userId, content } }));
    }
  },

  async sendToAI(content) {
    const { messages } = this.data;

    this.setData({ isAIThinking: true });

    console.log('[Chat] 发送消息给 AI:', content);
    const result = await sendToTherapist(content);
    console.log('[Chat] AI 响应结果:', result);

    if (result.success) {
      const aiContent = extractResponseText(result.data);
      console.log('[Chat] AI 提取的文本:', aiContent);
      const aiMessage = { messageId: null, from: 1, content: aiContent, time: Date.now(), read: true };
      messages.push(aiMessage);
    } else {
      console.log('[Chat] AI 请求失败:', result.error);
      const errorMessage = {
        messageId: null,
        from: 1,
        content: `AI 暂时无法回复: ${result.error}`,
        time: Date.now(),
        read: true,
      };
      messages.push(errorMessage);
    }

    this.setData({ messages, isAIThinking: false });
    wx.nextTick(this.scrollToBottom);
  },

  /** 消息列表滚动到底部 */
  scrollToBottom() {
    this.setData({ anchor: 'bottom' });
  },
});
