import { getNotifications, markAsRead } from '../../api/notification';

Page({
  data: {
    notifications: [],
    unreadCount: 0,
    loading: false,
  },

  onLoad() {
    this.loadNotifications();
  },

  async loadNotifications() {
    this.setData({ loading: true });
    const res = await getNotifications();
    if (res.code === 0 && res.data) {
      this.setData({
        notifications: res.data.list || [],
        unreadCount: res.data.unreadCount || 0,
      });
    }
    this.setData({ loading: false });
  },

  async onNotificationTap(e) {
    const { id, url } = e.currentTarget.dataset;
    const { notifications } = this.data;

    if (!id) return;

    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.isRead) return;

    await markAsRead(id);
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    const unreadCount = updated.filter((n) => !n.isRead).length;
    this.setData({ notifications: updated, unreadCount });

    if (url) {
      if (url.startsWith('/pages')) {
        wx.navigateTo({ url });
      } else {
        wx.switchTab({ url });
      }
    }
  },

  onMarkAllRead() {
    const { notifications } = this.data;
    notifications.forEach((n) => {
      if (!n.isRead) {
        markAsRead(n.id);
      }
    });
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    this.setData({ notifications: updated, unreadCount: 0 });
  },
});
