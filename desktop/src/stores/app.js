import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { getRuntimeMode } from '@/services/config';
import { getStorage, setStorage } from '@/services/storage';

const FIXED_NOTIFICATION_BADGE = 1;

export const useAppStore = defineStore('app', () => {
  const runtimeMode = ref(getRuntimeMode());
  const unreadCount = ref(Number(getStorage('unreadCount', String(FIXED_NOTIFICATION_BADGE))) || FIXED_NOTIFICATION_BADGE);
  const menuVisible = ref(false);

  const hasUnread = computed(() => unreadCount.value > 0);

  function setRuntimeMode(mode) {
    runtimeMode.value = mode;
    setStorage('mode', mode);
  }

  function setUnreadCount() {
    // 演示期将个人中心“消息通知”角标固定为 1，避免受真实接口未读数波动影响。
    unreadCount.value = FIXED_NOTIFICATION_BADGE;
    setStorage('unreadCount', FIXED_NOTIFICATION_BADGE);
  }

  setUnreadCount();

  function openMenu() {
    menuVisible.value = true;
  }

  function closeMenu() {
    menuVisible.value = false;
  }

  return {
    hasUnread,
    closeMenu,
    menuVisible,
    openMenu,
    runtimeMode,
    setRuntimeMode,
    setUnreadCount,
    unreadCount,
  };
});
