<template>
  <section class="ai-page">
    <div class="ai-header">
      <div class="brand-row">
        <div class="brand-logo">
          <img
            src="/psytwin.jpg"
            alt="心图 AI"
          />
        </div>
        <span class="brand-name">心图 AI</span>
      </div>
      <div class="greeting-line1">
        <span class="greeting-hi">{{ overview.greeting }}，</span>
        <span class="greeting-name">{{ overview.userName }}</span>
      </div>
      <div class="greeting-line2">今天有什么想聊的吗？</div>
    </div>

    <div class="ai-scroll">
      <section class="chips-area">
        <div class="chips-label">你可以这样开始</div>
        <div class="chip-list">
          <button
            v-for="item in overview.chips"
            :key="item.id"
            type="button"
            class="chip-item"
            @click="enterChat(item.prompt)"
          >
            <div
              class="chip-icon-wrap"
              :class="`chip-color-${item.color}`"
            >
              <component :is="resolveChipIcon(item.icon)" />
            </div>
            <div class="chip-text-wrap">
              <div class="chip-title">{{ item.title }}</div>
              <div class="chip-desc">{{ item.desc }}</div>
            </div>
            <ChevronRightIcon class="chip-arrow" />
          </button>
        </div>
      </section>

      <section
        v-if="overview.hasHistory"
        class="history-area"
      >
        <div class="history-label">最近对话</div>
        <button
          type="button"
          class="history-item"
          @click="enterChat('')"
        >
          <div class="history-avatar">
            <ChatIcon />
          </div>
          <div class="history-info">
            <div class="history-title">继续上次对话</div>
            <div class="history-last">{{ overview.lastMessage }}</div>
          </div>
          <ChevronRightIcon class="chip-arrow" />
        </button>
      </section>

      <div class="scroll-bottom-pad"></div>
    </div>

    <div class="input-bar">
      <div class="input-wrap">
        <AddIcon class="input-add" />
        <input
          v-model="inputValue"
          class="input-field"
          type="text"
          placeholder="和心图 AI 聊聊吧…"
          @keydown.enter="onSend"
        />
        <button
          type="button"
          class="input-send-btn"
          @click="onSend"
        >
          <ArrowUpIcon />
        </button>
      </div>
      <div class="input-tips">心图 AI 不会存储你的对话，请放心倾诉</div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  AddIcon,
  ArrowUpIcon,
  ChatIcon,
  ChevronRightIcon,
  HeartIcon,
  HelpCircleIcon,
  MoonIcon,
  UsergroupIcon,
} from 'tdesign-icons-vue-next';

import { useAuthStore } from '@/stores/auth';
import { getMessageOverview } from '@/services/message';

const authStore = useAuthStore();
const router = useRouter();
const inputValue = ref('');
const overview = reactive({
  chips: [],
  greeting: '你好',
  hasHistory: false,
  lastMessage: '',
  userName: '同学',
});

const chipIcons = {
  heart: HeartIcon,
  'help-circle': HelpCircleIcon,
  moon: MoonIcon,
  usergroup: UsergroupIcon,
};

function resolveChipIcon(icon) {
  return chipIcons[icon] || HeartIcon;
}

function enterChat(prompt) {
  router.push({
    name: 'chat',
    query: {
      name: '心图 AI',
      prompt,
    },
  });
}

function onSend() {
  if (!inputValue.value.trim()) return;
  enterChat(inputValue.value.trim());
  inputValue.value = '';
}

onMounted(async () => {
  const result = await getMessageOverview(authStore.userName || '同学');
  Object.assign(overview, result);
});
</script>

<style scoped lang="less">
.ai-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f3f3f3;
}

.ai-header {
  position: relative;
  overflow: hidden;
  padding: 44px 20px 24px;
  background: linear-gradient(135deg, #7c3aed 0%, #9f67fa 100%);
}

.ai-header::before {
  content: '';
  position: absolute;
  top: -70px;
  right: -30px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
}

.brand-row {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.brand-logo {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.2);
}

.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-name {
  color: rgba(255, 255, 255, 0.92);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
}

.greeting-line1 {
  position: relative;
  z-index: 1;
  margin-bottom: 4px;
}

.greeting-hi,
.greeting-name {
  font-size: 24px;
  line-height: 1.25;
}

.greeting-hi {
  color: rgba(255, 255, 255, 0.78);
  font-weight: 300;
}

.greeting-name {
  color: #ffffff;
  font-weight: 700;
}

.greeting-line2 {
  position: relative;
  z-index: 1;
  color: rgba(255, 255, 255, 0.68);
  font-size: 14px;
}

.ai-scroll {
  flex: 1;
  overflow: auto;
}

.chips-area,
.history-area {
  padding: 16px 12px 0;
}

.chips-label,
.history-label {
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 11px;
  letter-spacing: 0.5px;
}

.chip-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chip-item,
.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 12px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
  text-align: left;
}

.chip-icon-wrap,
.history-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  flex-shrink: 0;
  font-size: 18px;
}

.chip-color-purple,
.history-avatar {
  background: #ede9fe;
  color: #7c3aed;
}

.chip-color-blue {
  background: #dbeafe;
  color: #3b82f6;
}

.chip-color-green {
  background: #d1fae5;
  color: #10b981;
}

.chip-color-teal {
  background: #ccfbf1;
  color: #14b8a6;
}

.chip-text-wrap,
.history-info {
  flex: 1;
  min-width: 0;
}

.chip-title,
.history-title {
  margin-bottom: 3px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  font-weight: 600;
}

.chip-desc,
.history-last {
  overflow: hidden;
  color: rgba(0, 0, 0, 0.42);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chip-arrow {
  color: #9ca3af;
  font-size: 18px;
}

.scroll-bottom-pad {
  height: 138px;
}

.input-bar {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 8px 12px 14px;
  background: linear-gradient(to top, #fff 72%, rgba(255, 255, 255, 0));
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 28px;
  background: #f5f5f5;
}

.input-add {
  color: #9ca3af;
  font-size: 18px;
}

.input-field {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
}

.input-send-btn {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #9f67fa);
  color: #ffffff;
  font-size: 16px;
}

.input-tips {
  margin-top: 6px;
  color: rgba(0, 0, 0, 0.4);
  text-align: center;
  font-size: 11px;
}
</style>
