<template>
  <section class="notification-page">
    <MiniTopBar
      title="消息通知"
      fallback="/my"
    />

    <div
      v-if="unreadCount > 0"
      class="notification-header"
    >
      <span class="unread-text">有 {{ unreadCount }} 条未读消息</span>
      <button
        type="button"
        class="mark-read"
        @click="handleMarkAllRead"
      >
        全部已读
      </button>
    </div>

    <div class="notification-scroll">
      <div
        v-if="notifications.length"
        class="notification-list"
      >
        <button
          v-for="item in notifications"
          :key="item.id"
          type="button"
          class="notification-item"
          :class="{ unread: !item.isRead, read: item.isRead }"
          @click="handleTap(item)"
        >
          <div
            class="notification-icon"
            :class="`notification-icon-${item.type}`"
          >
            <component :is="resolveIcon(item.type)" />
          </div>
          <div class="notification-content">
            <div class="notification-title-row">
              <span class="notification-title">{{ item.title }}</span>
              <span
                v-if="!item.isRead"
                class="notification-dot"
              ></span>
            </div>
            <p class="notification-content-text">{{ item.content }}</p>
            <span class="notification-time">{{ item.createdAt }}</span>
          </div>
        </button>
      </div>

      <div
        v-else
        class="empty-state"
      >
        <NotificationIcon class="empty-icon" />
        <span class="empty-text">暂无通知</span>
      </div>
    </div>

    <div
      v-if="activeNotification"
      class="notification-modal-mask"
      @click.self="closeNotificationDetail"
    >
      <div class="notification-modal">
        <div class="notification-modal-body">
          <h3 class="notification-modal-title">{{ activeNotification.title }}</h3>
          <p class="notification-modal-content">{{ activeNotification.content }}</p>
        </div>
        <div
          class="notification-modal-actions"
          :class="{ dual: Boolean(activeTarget) }"
        >
          <button
            v-if="activeTarget"
            type="button"
            class="notification-modal-button secondary"
            @click="closeNotificationDetail"
          >
            关闭
          </button>
          <button
            type="button"
            class="notification-modal-button primary"
            @click="handleConfirmDetail"
          >
            {{ activeTarget ? '查看详情' : '知道了' }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  CalendarIcon,
  ErrorCircleIcon,
  NotificationIcon,
} from 'tdesign-icons-vue-next';

import MiniTopBar from '@/components/MiniTopBar.vue';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/services/notification';
import { useAppStore } from '@/stores/app';

const router = useRouter();
const appStore = useAppStore();
const notifications = ref([]);
const unreadCount = ref(0);
const activeNotification = ref(null);

const iconMap = {
  appointment: CalendarIcon,
  system: NotificationIcon,
  warning: ErrorCircleIcon,
};

const miniProgramRouteMap = {
  '/pages/appointment/index': '/appointment',
  '/pages/chat/index': '/chat',
  '/pages/dataCenter/index': '/data-center',
  '/pages/home/index': '/home',
  '/pages/login/login': '/login',
  '/pages/message/index': '/message',
  '/pages/my/index': '/my',
  '/pages/notification/index': '/notification',
  '/pages/post-detail/index': '/post-detail',
  '/pages/release/index': '/release',
  '/pages/search/index': '/search',
};

const activeTarget = computed(() => resolveNotificationTarget(activeNotification.value));

function resolveIcon(type) {
  return iconMap[type] || NotificationIcon;
}

function buildNotificationSnapshot(item, overrides = {}) {
  return {
    ...item,
    ...overrides,
  };
}

function resolveNotificationTarget(item) {
  const rawTarget = item?.route || item?.url || '';

  if (!rawTarget) {
    return '';
  }

  if (!rawTarget.startsWith('/pages/')) {
    return rawTarget;
  }

  const [miniPath, queryString = ''] = rawTarget.split('?');
  const desktopPath = miniProgramRouteMap[miniPath];

  if (!desktopPath) {
    return '';
  }

  const query = new URLSearchParams(queryString);

  // 桌面端不依赖小程序页面类型字段，避免把无效参数带到路由里。
  if (miniPath === '/pages/chat/index') {
    query.delete('type');
  }

  const nextQuery = query.toString();
  return nextQuery ? `${desktopPath}?${nextQuery}` : desktopPath;
}

function patchReadState(notificationId) {
  let nextUnreadCount = unreadCount.value;

  notifications.value = notifications.value.map((item) => {
    if (item.id !== notificationId || item.isRead) {
      return item;
    }

    nextUnreadCount = Math.max(0, nextUnreadCount - 1);
    return {
      ...item,
      isRead: true,
    };
  });

  unreadCount.value = nextUnreadCount;
  appStore.setUnreadCount(nextUnreadCount);
}

async function loadNotifications() {
  const data = await getNotifications();
  notifications.value = data.list;
  unreadCount.value = data.unreadCount;
  appStore.setUnreadCount(data.unreadCount);
}

async function handleTap(item) {
  if (!item.isRead) {
    const data = await markNotificationAsRead(item.id);
    if (data?.list) {
      notifications.value = data.list;
      unreadCount.value = data.unreadCount;
      appStore.setUnreadCount(data.unreadCount);
      const latestItem = data.list.find((notification) => notification.id === item.id);
      activeNotification.value = buildNotificationSnapshot(item, latestItem || { isRead: true });
      return;
    }

    patchReadState(item.id);
  }

  activeNotification.value = buildNotificationSnapshot(item, { isRead: true });
}

function closeNotificationDetail() {
  activeNotification.value = null;
}

function handleConfirmDetail() {
  const target = activeTarget.value;

  closeNotificationDetail();

  if (target) {
    router.push(target);
  }
}

async function handleMarkAllRead() {
  const pendingIds = notifications.value.filter((item) => !item.isRead).map((item) => item.id);
  const data = await markAllNotificationsAsRead(pendingIds);
  notifications.value = data.list;
  unreadCount.value = data.unreadCount;
  appStore.setUnreadCount(data.unreadCount);
}

onMounted(() => {
  loadNotifications();
});
</script>

<style scoped lang="less">
.notification-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border-bottom: 1px solid #efefef;
}

.unread-text {
  color: #666666;
  font-size: 13px;
}

.mark-read {
  color: #7c3aed;
  font-size: 13px;
}

.notification-scroll {
  flex: 1;
  overflow: auto;
}

.notification-list {
  padding: 12px;
}

.notification-item {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 14px;
  margin-bottom: 10px;
  border-radius: 16px;
  background: #ffffff;
  text-align: left;
}

.notification-item.unread {
  background: #f9f5ff;
}

.notification-item.read {
  opacity: 0.74;
}

.notification-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 20px;
}

.notification-icon-warning {
  color: #ef4444;
  background: #fef2f2;
}

.notification-icon-appointment {
  color: #16a34a;
  background: #f0fdf4;
}

.notification-icon-system {
  color: #2563eb;
  background: #eff6ff;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.notification-title {
  color: #1f2937;
  font-size: 15px;
  font-weight: 600;
}

.notification-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}

.notification-content-text {
  margin: 0 0 8px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.notification-time {
  color: #9ca3af;
  font-size: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
}

.empty-icon {
  font-size: 44px;
}

.empty-text {
  margin-top: 12px;
  font-size: 14px;
}

.notification-modal-mask {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.56);
}

.notification-modal {
  width: 100%;
  max-width: 328px;
  overflow: hidden;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
}

.notification-modal-body {
  padding: 28px 24px 30px;
}

.notification-modal-title {
  margin: 0 0 20px;
  color: #111827;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
}

.notification-modal-content {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
  white-space: pre-wrap;
}

.notification-modal-actions {
  display: grid;
  grid-template-columns: 1fr;
  border-top: 1px solid #e5e7eb;
}

.notification-modal-actions.dual {
  grid-template-columns: 1fr 1fr;
}

.notification-modal-button {
  min-height: 64px;
  color: #4f46e5;
  font-size: 17px;
  font-weight: 600;
  background: transparent;
}

.notification-modal-button + .notification-modal-button {
  border-left: 1px solid #e5e7eb;
}

.notification-modal-button.secondary {
  color: #6b7280;
  font-weight: 500;
}
</style>
