<template>
  <nav class="mini-tabbar">
    <button
      v-for="item in menus"
      :key="item.route"
      type="button"
      class="mini-tabbar__item"
      :class="{ 'is-active': route.path === item.route }"
      @click="router.push(item.route)"
    >
      <component
        :is="item.icon"
        class="mini-tabbar__icon"
      />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CalendarIcon, ChatIcon, DashboardIcon, HomeIcon, UserIcon } from 'tdesign-icons-vue-next';

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const menus = computed(() => {
  if (authStore.role === 'teacher') {
    return [
      { label: '心墙', route: '/home', icon: HomeIcon },
      { label: 'AI', route: '/message', icon: ChatIcon },
      { label: '工作台', route: '/data-center', icon: DashboardIcon },
      { label: '我的', route: '/my', icon: UserIcon },
    ];
  }

  return [
    { label: '心墙', route: '/home', icon: HomeIcon },
    { label: 'AI', route: '/message', icon: ChatIcon },
    { label: '预约', route: '/appointment', icon: CalendarIcon },
    { label: '我的', route: '/my', icon: UserIcon },
  ];
});
</script>
