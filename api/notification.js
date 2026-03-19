import request from './request';

export async function getNotifications(options = {}) {
  const { page = 1, limit = 20, type } = options;
  const queryParams = [`page=${page}`, `limit=${limit}`];
  if (type) {
    queryParams.push(`type=${encodeURIComponent(type)}`);
  }

  try {
    const res = await request(`/student/my/notifications?${queryParams.join('&')}`, 'GET');
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
