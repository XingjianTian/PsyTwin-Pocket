import { getNotifications, markAsRead } from './notification-api';
import { formatNotificationTime } from '../../utils/util';

Page({
  data: {
    notifications: [],
    unreadCount: 0,
    loading: false,
  },

  onLoad() {
    this._isPageActive = false;
  },

  onShow() {
    this._isPageActive = true;
    this.loadNotifications();
    this.startPolling();
  },

  onHide() {
    this._isPageActive = false;
    this.stopPolling();
  },

  onUnload() {
    this._isPageActive = false;
    this.stopPolling();
  },

  startPolling() {
    this.stopPolling();
    this._interval = setInterval(() => {
      if (!this._isPageActive) return;
      this.loadNotifications();
    }, 10000);
  },

  stopPolling() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  },

  async loadNotifications() {
    const app = getApp();
    if (!this._isPageActive) return;
    this.setData({ loading: true });
    const res = await getNotifications();
    if (!this._isPageActive) return;

    if (res.code === 0 && res.data) {
      const list = (res.data.list || []).map((item) => ({
        ...item,
        createdAt: formatNotificationTime(item.createdAt),
      }));
      const unreadCount = res.data.unreadCount || 0;
      this.setData({
        notifications: list,
        unreadCount,
      });
      app.setUnreadNum(unreadCount);
    }

    if (!this._isPageActive) return;
    this.setData({ loading: false });
  },

  async onNotificationTap(e) {
    const app = getApp();
    const { id, url } = e.currentTarget.dataset;
    const { notifications } = this.data;

    if (!id) return;

    const notification = notifications.find((n) => n.id === id);
    if (!notification) return;

    if (!notification.isRead) {
      const res = await markAsRead(id);
      if (res.code === 0) {
        const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
        const unreadCount = updated.filter((n) => !n.isRead).length;
        this.setData({ notifications: updated, unreadCount });
        app.setUnreadNum(unreadCount);
      }
    }

    wx.showModal({
      title: notification.title,
      content: notification.content,
      showCancel: !!url,
      confirmText: url ? '查看详情' : '知道了',
      cancelText: '关闭',
      success: (res) => {
        if (res.confirm && url) {
          if (url.startsWith('/pages')) {
            wx.navigateTo({ url });
          } else {
            wx.switchTab({ url });
          }
        }
      },
    });
  },

  onMarkAllRead() {
    const app = getApp();
    const { notifications } = this.data;
    notifications.forEach((n) => {
      if (!n.isRead) {
        markAsRead(n.id);
      }
    });
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    this.setData({ notifications: updated, unreadCount: 0 });
    app.setUnreadNum(0);
  },
});
