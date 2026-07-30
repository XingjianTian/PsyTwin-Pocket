// app.js
import config from './config';
import createBus from './utils/eventBus';

console.log('[App] Mock config:', config);
console.log('[App] isMock value:', config.isMock);

// 动态导入 Mock，避免在 isMock=false 时覆盖 wx.request
let Mock = null;
let connectSocket = null;
let fetchUnreadNum = null;

if (config.isMock) {
  console.log('[App] Initializing Mock...');
  // 动态导入
  const mockModule = require('./mock/index');
  Mock = mockModule.default || mockModule;
  Mock();

  // 动态导入 chat
  const chatModule = require('./mock/chat');
  connectSocket = chatModule.connectSocket;
  fetchUnreadNum = chatModule.fetchUnreadNum;

  console.log('[App] Mock initialized');
} else {
  console.log('[App] Mock disabled - using real API');
}

App({
  onLaunch() {
    if (config.demoMode) {
      wx.setStorageSync('access_token', wx.getStorageSync('access_token') || 'demo-video-token');
      wx.setStorageSync('user_role', wx.getStorageSync('user_role') || 'student');
    }

    // 检查登录状态，未登录则跳转登录页
    const token = wx.getStorageSync('access_token');
    if (!token) {
      wx.reLaunch({
        url: '/pages/login/login',
      });
      return;
    }

    // 初始化角色
    const role = wx.getStorageSync('user_role');
    if (role) {
      this.globalData.role = role;
    }

    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });

    // 只在 Mock 模式下初始化
    if (config.isMock) {
      this.getUnreadNum();
      this.connect();
    }
  },

  globalData: {
    userInfo: null,
    unreadNum: 1, // 未读消息数量
    socket: null, // SocketTask 对象
    role: '', // 用户角色：student 或 teacher
  },

  /** 全局事件总线 */
  eventBus: createBus(),

  /** 初始化WebSocket */
  connect() {
    if (!connectSocket) return;
    const socket = connectSocket();
    socket.onMessage((data) => {
      data = JSON.parse(data);
      if (data.type === 'message' && !data.data.message.read) {
        this.setUnreadNum(this.globalData.unreadNum + 1);
      }
    });
    this.globalData.socket = socket;
  },

  /** 获取未读消息数量 */
  getUnreadNum() {
    if (!fetchUnreadNum) return;
    fetchUnreadNum().then(({ data }) => {
      this.globalData.unreadNum = data;
      this.eventBus.emit('unread-num-change', data);
    });
  },

  /** 设置未读消息数量 */
  setUnreadNum(unreadNum) {
    this.globalData.unreadNum = unreadNum;
    this.eventBus.emit('unread-num-change', unreadNum);
  },
});
