import request from './request';

export async function getNotifications(options = {}) {
  const { page = 1, limit = 20, type } = options;
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type) {
    params.append('type', type);
  }

  try {
    const res = await request(`/student/my/notifications?${params.toString()}`, 'GET');
    return res;
  } catch (err) {
    console.error('[Notification] getNotifications error:', err);
    return { code: -1, message: '获取通知失败', data: null };
  }
}

export async function markAsRead(id) {
  try {
    const res = await request(`/student/my/notifications/${id}/read`, 'PUT');
    return res;
  } catch (err) {
    console.error('[Notification] markAsRead error:', err);
    return { code: -1, message: '标记已读失败', data: null };
  }
}

export async function getUnreadCount() {
  try {
    const res = await getNotifications({ page: 1, limit: 1 });
    return res;
  } catch (err) {
    return { code: 0, data: { unreadCount: 0 } };
  }
}

export default {
  getNotifications,
  markAsRead,
  getUnreadCount,
};
