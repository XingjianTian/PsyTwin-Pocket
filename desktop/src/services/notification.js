import {
  formatNotificationTime,
  normalizeCollection,
  requestPocket,
  isSuccessResponse,
  unwrapData,
} from './pocket';

const fallbackNotifications = [
  {
    id: 'n1',
    type: 'warning',
    title: '情绪预警提醒',
    content: '系统检测到你最近连续三天情绪波动较大，建议优先关注并及时沟通。',
    createdAt: '2026-04-06T09:20:00Z',
    url: '/chat?name=心图 AI&prompt=我最近情绪波动有点大，想先和你聊聊',
    isRead: false,
  },
];

function mapNotification(item) {
  return {
    ...item,
    type: String(item.type || 'system').toLowerCase(),
    createdAt: formatNotificationTime(item.createdAt),
  };
}

export async function getNotifications() {
  try {
    const response = await requestPocket({
      method: 'GET',
      url: '/student/my/notifications?page=1&limit=20',
    });

    if (!isSuccessResponse(response)) {
      throw new Error(response?.message || '获取通知失败');
    }

    const payload = unwrapData(response, ['list', 'unreadCount']) || {};
    const list = normalizeCollection(payload.list).map(mapNotification);
    return {
      list,
      unreadCount: payload.unreadCount ?? list.filter((item) => !item.isRead).length,
    };
  } catch (error) {
    const list = fallbackNotifications.map(mapNotification);
    return {
      list,
      unreadCount: list.filter((item) => !item.isRead).length,
    };
  }
}

export async function markNotificationAsRead(id) {
  try {
    await requestPocket({
      method: 'PUT',
      url: `/student/my/notifications/${id}/read`,
    });
  } catch (error) {
    return null;
  }

  return getNotifications();
}

export async function markAllNotificationsAsRead(ids = []) {
  const pendingIds = normalizeCollection(ids).filter(Boolean);

  if (pendingIds.length === 0) {
    return getNotifications();
  }

  await Promise.all(pendingIds.map((id) => markNotificationAsRead(id)));
  return getNotifications();
}
