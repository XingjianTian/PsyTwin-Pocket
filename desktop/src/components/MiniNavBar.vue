<template>
  <header class="mini-navbar">
    <button
      type="button"
      class="mini-navbar__menu"
      @click="appStore.openMenu()"
    >
      <ViewListIcon />
    </button>

    <button
      type="button"
      class="mini-navbar__search"
      @click="router.push('/search')"
    >
      <SearchIcon class="mini-navbar__search-icon" />
      <span>请搜索你想要的内容</span>
    </button>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { SearchIcon, ViewListIcon } from 'tdesign-icons-vue-next';

import { useAppStore } from '@/stores/app';

const appStore = useAppStore();
const router = useRouter();
</script>
