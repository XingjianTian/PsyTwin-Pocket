<template>
  <section class="search-page">
    <header class="search-header">
      <button
        type="button"
        class="search-back"
        @click="goBack"
      >
        <ChevronLeftIcon />
      </button>

      <div class="search-input-wrap">
        <SearchIcon class="search-input-icon" />
        <input
          v-model="searchValue"
          class="search-input"
          type="text"
          placeholder="请搜索你想要的内容"
          autofocus
          @keydown.enter="handleSubmit"
        />
      </div>

      <button
        type="button"
        class="search-cancel"
        @click="handleCancel"
      >
        取消
      </button>
    </header>

    <div class="search-scroll">
      <section class="search-panel">
        <div class="section-head">
          <span class="section-title">历史记录</span>
          <button
            v-if="historyWords.length"
            type="button"
            class="clear-btn"
            @click="handleClearHistory"
          >
            <DeleteIcon />
          </button>
        </div>
        <div
          v-if="historyWords.length"
          class="tag-list"
        >
          <button
            v-for="item in historyWords"
            :key="item"
            type="button"
            class="tag-chip"
            @click="handleTagTap(item)"
          >
            {{ item }}
          </button>
        </div>
        <div
          v-else
          class="empty-hint"
        >
          暂无搜索记录
        </div>
      </section>

      <section class="search-panel">
        <div class="section-head">
          <span class="section-title">搜索发现</span>
        </div>
        <div class="tag-list">
          <button
            v-for="item in popularWords"
            :key="item"
            type="button"
            class="tag-chip tag-chip-popular"
            @click="handleTagTap(item)"
          >
            <SearchIcon />
            <span>{{ item }}</span>
          </button>
        </div>
      </section>

      <section
        v-if="searched"
        class="search-panel"
      >
        <div class="section-head">
          <span class="section-title">相关动态</span>
          <span class="result-count">{{ results.length }} 条</span>
        </div>

        <div
          v-if="results.length"
          class="result-list"
        >
          <button
            v-for="item in results"
            :key="item.postId"
            type="button"
            class="result-item"
            @click="openPost(item.postId)"
          >
            <div class="result-avatar">
              <img
                v-if="item.avatar && !item.isAnonymous"
                :src="item.avatar"
                :alt="item.nickname"
              />
              <UserAvatarIcon v-else />
            </div>
            <div class="result-content">
              <div class="result-title-row">
                <span class="result-name">{{ item.isAnonymous ? '匿名的你' : item.nickname }}</span>
                <span class="result-time">{{ item.createdAt }}</span>
              </div>
              <p class="result-desc">{{ item.desc }}</p>
              <div
                v-if="item.tags.length"
                class="result-location"
              >
                <LocationIcon />
                <span>{{ item.tags[0].text }}</span>
              </div>
            </div>
          </button>
        </div>

        <div
          v-else
          class="result-empty"
        >
          没有找到相关内容
        </div>
      </section>

      <div class="search-bottom-pad"></div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ChevronLeftIcon,
  DeleteIcon,
  LocationIcon,
  SearchIcon,
  UserAvatarIcon,
} from 'tdesign-icons-vue-next';

import {
  clearSearchWords,
  getSearchPanelData,
  saveSearchWord,
  searchPosts,
} from '@/services/search';

const router = useRouter();
const historyWords = ref([]);
const popularWords = ref([]);
const results = ref([]);
const searchValue = ref('');
const searched = ref(false);

async function loadPanelData() {
  const data = await getSearchPanelData();
  historyWords.value = data.historyWords;
  popularWords.value = data.popularWords;
}

async function runSearch(keyword) {
  const value = keyword.trim();
  if (!value) {
    searched.value = false;
    results.value = [];
    return;
  }

  historyWords.value = saveSearchWord(value);
  searchValue.value = value;
  searched.value = true;
  results.value = await searchPosts(value);
}

function handleSubmit() {
  runSearch(searchValue.value);
}

function handleTagTap(value) {
  runSearch(value);
}

function handleClearHistory() {
  historyWords.value = clearSearchWords();
}

function handleCancel() {
  searchValue.value = '';
  searched.value = false;
  results.value = [];
  router.push('/home');
}

function openPost(postId) {
  router.push({
    name: 'post-detail',
    query: {
      id: postId,
    },
  });
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push('/home');
}

onMounted(() => {
  loadPanelData();
});
</script>

<style scoped lang="less">
.search-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.search-header {
  display: grid;
  grid-template-columns: 36px 1fr 40px;
  align-items: center;
  gap: 10px;
  padding: 10px 12px 12px;
  background: #ffffff;
}

.search-back,
.search-cancel,
.clear-btn {
  display: grid;
  place-items: center;
}

.search-back {
  width: 36px;
  height: 36px;
  color: rgba(0, 0, 0, 0.82);
  font-size: 22px;
}

.search-cancel {
  color: #0052d9;
  font-size: 14px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  background: #f3f3f3;
}

.search-input-icon {
  color: rgba(0, 0, 0, 0.4);
  font-size: 16px;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.86);
}

.search-scroll {
  flex: 1;
  overflow: auto;
}

.search-panel {
  margin: 10px 12px 0;
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-title {
  color: rgba(0, 0, 0, 0.9);
  font-size: 15px;
  font-weight: 600;
}

.clear-btn {
  width: 28px;
  height: 28px;
  color: rgba(0, 0, 0, 0.36);
  font-size: 18px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 7px 12px;
  border-radius: 999px;
  background: #f6f7fb;
  color: rgba(0, 0, 0, 0.68);
  font-size: 13px;
}

.tag-chip-popular {
  color: #0052d9;
  background: rgba(0, 82, 217, 0.08);
}

.empty-hint,
.result-empty {
  color: rgba(0, 0, 0, 0.4);
  font-size: 13px;
}

.result-count {
  color: rgba(0, 0, 0, 0.42);
  font-size: 12px;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  text-align: left;
}

.result-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  overflow: hidden;
  border-radius: 50%;
  background: #ede9fe;
  color: #7c3aed;
}

.result-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-content {
  flex: 1;
  min-width: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child .result-content {
  padding-bottom: 0;
  border-bottom: 0;
}

.result-title-row,
.result-location {
  display: flex;
  align-items: center;
}

.result-title-row {
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.result-name {
  color: rgba(0, 0, 0, 0.86);
  font-size: 14px;
  font-weight: 600;
}

.result-time {
  color: rgba(0, 0, 0, 0.4);
  font-size: 12px;
}

.result-desc {
  display: -webkit-box;
  margin: 0 0 8px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.68);
  font-size: 13px;
  line-height: 1.6;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.result-location {
  gap: 4px;
  color: rgba(0, 0, 0, 0.42);
  font-size: 12px;
}

.search-bottom-pad {
  height: 20px;
}
</style>
