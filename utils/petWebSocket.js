/**
 * PsyTwin Pet WebSocket 客户端
 * 支持自动重连、心跳、认证和消息分发
 */

import createBus from './eventBus';
import config from '../config';

// WebSocket URL - 直接使用 petServiceUrl 配置
// petServiceUrl: http://localhost:3001 -> ws://localhost:3001/ws/pet
const petUrl = config.petServiceUrl || 'http://localhost:3001';
const WS_URL = petUrl.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws/pet';

// 重连退避策略: 1s→2s→4s→8s→16s→30s (max)
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];
const MAX_RECONNECT_ATTEMPTS = 5;
const HEARTBEAT_INTERVAL = 30000; // 30秒

// 消息类型常量
const MSG_TYPE = {
  AUTH: 'auth',
  AUTH_SUCCESS: 'auth_success',
  AUTH_FAILED: 'auth_failed',
  HEARTBEAT: 'heartbeat',
  HEARTBEAT_ACK: 'heartbeat_ack',
  PET_STATUS: 'pet_status',
  EVENT_TRIGGER: 'event_trigger',
  SCENE_SYNC: 'scene_sync',
  CONTROL_STATE_CHANGE: 'control_state_change',
};

// 生成唯一消息ID
function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

class PetWebSocket {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.messageHandler = null;
    this.eventBus = createBus();
    this.autoReconnect = true;
  }

  /**
   * 建立WebSocket连接
   */
  connect() {
    if (this.socket && this.isConnected) {
      console.log('[PetWebSocket] Already connected');
      return;
    }

    console.log('[PetWebSocket] Connecting to:', WS_URL);

    const socketTask = wx.connectSocket({
      url: WS_URL,
      success: () => {
        console.log('[PetWebSocket] Socket task created');
        this.socket = socketTask;
        this._setupSocketListeners();
      },
      fail: (err) => {
        console.error('[PetWebSocket] Connect failed:', err);
        this.socket = null;
        this._scheduleReconnect();
      },
    });
  }

  /**
   * 设置Socket监听器
   */
  _setupSocketListeners() {
    // 连接打开
    this.socket.onOpen(() => {
      console.log('[PetWebSocket] Socket opened');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this._sendAuth();
      this._startHeartbeat();
      this.eventBus.emit('connected');
    });

    // 收到消息
    this.socket.onMessage((res) => {
      try {
        const data = JSON.parse(res.data);
        console.log('[PetWebSocket] Received:', data.type);
        this._handleMessage(data);
      } catch (e) {
        console.error('[PetWebSocket] Parse error:', e);
      }
    });

    // 连接关闭
    this.socket.onClose(() => {
      console.log('[PetWebSocket] Socket closed');
      this._cleanup();
      if (this.autoReconnect) {
        this._scheduleReconnect();
      }
    });

    // 错误
    this.socket.onError((err) => {
      console.error('[PetWebSocket] Socket error:', err);
      this.eventBus.emit('error', err);
    });
  }

  /**
   * 发送认证消息
   */
  _sendAuth() {
    const token = wx.getStorageSync('access_token');
    if (!token) {
      console.error('[PetWebSocket] No token found, cannot auth');
      return;
    }

    const authMsg = {
      type: MSG_TYPE.AUTH,
      messageId: generateMessageId(),
      timestamp: Date.now(),
      payload: {
        token,
        clientType: 'pocket',
        version: '1.0.0',
      },
    };

    this._send(authMsg);
  }

  /**
   * 处理收到的消息
   */
  _handleMessage(data) {
    const { type, payload } = data;

    switch (type) {
      case MSG_TYPE.AUTH_SUCCESS:
        console.log('[PetWebSocket] Auth success');
        this.eventBus.emit('auth_success', payload);
        break;

      case MSG_TYPE.AUTH_FAILED:
        console.error('[PetWebSocket] Auth failed:', payload);
        this.eventBus.emit('auth_failed', payload);
        this.disconnect();
        break;

      case MSG_TYPE.HEARTBEAT_ACK:
        // 心跳响应，正常不做处理
        break;

      case MSG_TYPE.PET_STATUS:
        this.eventBus.emit('pet_status', payload);
        break;

      case MSG_TYPE.EVENT_TRIGGER:
        this.eventBus.emit('event_trigger', payload);
        break;

      case MSG_TYPE.SCENE_SYNC:
        this.eventBus.emit('scene_sync', payload);
        break;

      case MSG_TYPE.CONTROL_STATE_CHANGE:
        this.eventBus.emit('control_state_change', payload);
        break;

      default:
        console.log('[PetWebSocket] Unknown message type:', type);
    }
  }

  /**
   * 发送消息
   */
  _send(message) {
    if (!this.socket || !this.isConnected) {
      console.error('[PetWebSocket] Not connected, cannot send');
      return false;
    }

    const dataStr = JSON.stringify(message);
    this.socket.send({
      data: dataStr,
      success: () => {
        console.log('[PetWebSocket] Sent:', message.type);
      },
      fail: (err) => {
        console.error('[PetWebSocket] Send failed:', err);
      },
    });

    return true;
  }

  /**
   * 发送自定义消息
   */
  send(message) {
    const msg = {
      ...message,
      messageId: message.messageId || generateMessageId(),
      timestamp: message.timestamp || Date.now(),
    };
    return this._send(msg);
  }

  /**
   * 启动心跳
   */
  _startHeartbeat() {
    this._stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        const heartbeatMsg = {
          type: MSG_TYPE.HEARTBEAT,
          messageId: generateMessageId(),
          timestamp: Date.now(),
          payload: {
            timestamp: Date.now(),
          },
        };
        this._send(heartbeatMsg);
      }
    }, HEARTBEAT_INTERVAL);
  }

  /**
   * 停止心跳
   */
  _stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 调度重连
   */
  _scheduleReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('[PetWebSocket] Max reconnect attempts reached');
      this.eventBus.emit('reconnect_failed');
      return;
    }

    const delay = RECONNECT_DELAYS[this.reconnectAttempts] || RECONNECT_DELAYS[RECONNECT_DELAYS.length - 1];
    console.log(`[PetWebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * 清理资源
   */
  _cleanup() {
    this.isConnected = false;
    this._stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    console.log('[PetWebSocket] Disconnecting...');
    this.autoReconnect = false;
    this._cleanup();

    if (this.socket) {
      this.socket.close({
        success: () => {
          console.log('[PetWebSocket] Socket closed manually');
        },
      });
      this.socket = null;
    }

    this.eventBus.emit('disconnected');
  }

  /**
   * 检查连接状态
   */
  getConnected() {
    return this.isConnected;
  }

  /**
   * 监听事件
   */
  on(event, callback) {
    this.eventBus.on(event, callback);
  }

  /**
   * 取消监听
   */
  off(event, callback) {
    this.eventBus.off(event, callback);
  }

  /**
   * 主动重连（重置重连计数）
   */
  reconnect() {
    this.reconnectAttempts = 0;
    this.autoReconnect = true;
    this.disconnect();
    setTimeout(() => this.connect(), 100);
  }
}

// 单例
let instance = null;

export function getPetWebSocket() {
  if (!instance) {
    instance = new PetWebSocket();
  }
  return instance;
}

export default PetWebSocket;