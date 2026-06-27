<template>
  <div
    ref="stageRef"
    class="desktop-stage"
  >
    <div
      class="phone-scale-shell"
      :style="shellStyle"
    >
      <div class="phone-frame">
        <div class="phone-frame__camera"></div>
        <div class="phone-screen">
          <div class="phone-screen__statusbar">
            <span>9:41</span>
            <div class="status-icons">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          <div class="phone-screen__viewport">
            <RouterView />
          </div>

          <MiniTabBar v-if="showTabBar" />

          <div
            v-if="appStore.menuVisible"
            class="phone-menu-mask"
            @click="appStore.closeMenu()"
          ></div>

          <aside
            class="phone-menu-drawer"
            :class="{ 'is-open': appStore.menuVisible }"
          >
            <div class="phone-menu-drawer__header">
              <div>
                <p class="phone-menu-drawer__eyebrow">PsyTwin Pocket</p>
                <h3>{{ authStore.userName }}</h3>
                <p>{{ authStore.role === 'teacher' ? '教师端' : '学生端' }}</p>
              </div>
              <button
                type="button"
                class="phone-menu-drawer__close"
                @click="appStore.closeMenu()"
              >
                ×
              </button>
            </div>

            <div class="phone-menu-drawer__section">
              <button
                type="button"
                class="phone-menu-drawer__item"
                @click="goToLogin"
              >
                返回登录页
              </button>
              <button
                type="button"
                class="phone-menu-drawer__item"
                @click="switchRole"
              >
                切换到{{ authStore.role === 'teacher' ? '学生端' : '教师端' }}
              </button>
              <button
                type="button"
                class="phone-menu-drawer__item danger"
                @click="logout"
              >
                退出登录
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';

import MiniTabBar from '@/components/MiniTabBar.vue';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';

const PHONE_FRAME_WIDTH = 430;
const PHONE_FRAME_HEIGHT = 900;
const STAGE_PADDING_X = 48;
const STAGE_PADDING_Y = 80;

const appStore = useAppStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const stageRef = ref(null);
const phoneScale = ref(1);

const showTabBar = computed(() => route.meta.showTabBar !== false);
const shellStyle = computed(() => ({
  '--phone-scale': phoneScale.value,
  width: `${PHONE_FRAME_WIDTH * phoneScale.value}px`,
  height: `${PHONE_FRAME_HEIGHT * phoneScale.value}px`,
}));

function updatePhoneScale() {
  const stageElement = stageRef.value;
  if (!stageElement) {
    return;
  }

  const availableWidth = Math.max(stageElement.clientWidth - STAGE_PADDING_X, 320);
  const availableHeight = Math.max(stageElement.clientHeight - STAGE_PADDING_Y, 480);
  const nextScale = Math.min(availableWidth / PHONE_FRAME_WIDTH, availableHeight / PHONE_FRAME_HEIGHT, 1);

  phoneScale.value = Number(nextScale.toFixed(3));
}

function goToLogin() {
  appStore.closeMenu();
  router.push('/login');
}

function switchRole() {
  const nextRole = authStore.role === 'teacher' ? 'student' : 'teacher';
  authStore.setRole(nextRole);
  appStore.closeMenu();
  router.push(nextRole === 'teacher' ? '/data-center' : '/home');
}

function logout() {
  authStore.logout();
  appStore.closeMenu();
  router.push('/login');
}

onMounted(() => {
  updatePhoneScale();
  window.addEventListener('resize', updatePhoneScale);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePhoneScale);
});
</script>
