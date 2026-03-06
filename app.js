// app.js
import config from './config';
import Mock from './mock/index';
import createBus from './utils/eventBus';
import { connectSocket, fetchUnreadNum } from './mock/chat';

console.log('[App] Mock config:', config);
console.log('[App] isMock value:', config.isMock);

if (config.isMock) {
  console.log('[App] Initializing Mock...');
  Mock();
  console.log('[App] Mock initialized');
} else {
  console.log('[App] Mock disabled');
}

App({
  onLaunch() {
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

    this.getUnreadNum();
    this.connect();
  },

  globalData: {
    userInfo: null,
    unreadNum: 0, // 未读消息数量
    socket: null, // SocketTask 对象
    role: '', // 用户角色：student 或 teacher
  },

  /** 全局事件总线 */
  eventBus: createBus(),

  /** 初始化WebSocket */
  connect() {
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
