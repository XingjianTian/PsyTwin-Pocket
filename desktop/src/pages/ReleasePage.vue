<template>
  <section class="release-page">
    <MiniTopBar
      title="发布动态"
      fallback="/home"
    />

    <div class="release-scroll">
      <section class="release-card upload-card">
        <div class="upload-grid">
          <div
            v-for="(item, index) in form.images"
            :key="`${item}-${index}`"
            class="upload-item"
          >
            <img
              :src="item"
              alt="动态图片"
            />
            <button
              type="button"
              class="upload-remove"
              @click="removeImage(index)"
            >
              ×
            </button>
          </div>

          <button
            v-if="form.images.length < 4"
            type="button"
            class="upload-item upload-item-add"
            @click="addImage"
          >
            <AddIcon />
            <span>添加图片</span>
          </button>
        </div>
      </section>

      <section class="release-card desc-card">
        <div class="field-label">添加描述</div>
        <textarea
          v-model="form.text"
          class="desc-textarea"
          maxlength="500"
          placeholder="分享你此刻的想法"
        ></textarea>
        <div class="textarea-count">{{ form.text.length }}/500</div>
      </section>

      <section class="release-card">
        <div class="field-label">添加标签</div>
        <div class="tag-list">
          <button
            v-for="item in releaseTags"
            :key="item"
            type="button"
            class="tag-item"
            :class="{ active: form.selectedTags.includes(item) }"
            @click="toggleTag(item)"
          >
            #{{ item }}
          </button>
        </div>
      </section>

      <section class="release-card">
        <button
          type="button"
          class="location-cell"
          @click="fillLocation"
        >
          <div class="location-left">
            <LocationIcon />
            <span>所在位置</span>
          </div>
          <div class="location-right">
            <span>{{ form.location || '点击获取位置' }}</span>
            <ChevronRightIcon />
          </div>
        </button>
      </section>

      <section class="release-card">
        <button
          type="button"
          class="location-cell"
          @click="form.isAnonymous = !form.isAnonymous"
        >
          <div class="location-left">
            <UserAvatarIcon />
            <span>匿名发布</span>
          </div>
          <div
            class="anonymous-toggle"
            :class="{ active: form.isAnonymous }"
          >
            <div class="anonymous-dot"></div>
          </div>
        </button>
      </section>

      <div class="release-bottom-space"></div>
    </div>

    <div class="release-actions">
      <button
        type="button"
        class="action-btn action-btn-light"
        @click="handleSaveDraft"
      >
        存草稿
      </button>
      <button
        type="button"
        class="action-btn action-btn-primary"
        @click="handlePublish"
      >
        发布
      </button>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  AddIcon,
  ChevronRightIcon,
  LocationIcon,
  UserAvatarIcon,
} from 'tdesign-icons-vue-next';

import MiniTopBar from '@/components/MiniTopBar.vue';
import {
  clearReleaseDraft,
  getReleaseDraft,
  presetImages,
  publishRelease,
  releaseTags,
  saveReleaseDraft,
} from '@/services/release';

const router = useRouter();
const form = reactive({
  text: '',
  selectedTags: [],
  images: [],
  location: '',
  isAnonymous: false,
});

const demoLocations = ['校园操场', '图书馆', '学活中心', '宿舍楼下'];

function syncDraft() {
  saveReleaseDraft({
    text: form.text,
    selectedTags: form.selectedTags,
    images: form.images,
    location: form.location,
    isAnonymous: form.isAnonymous,
  });
}

function toggleTag(tag) {
  if (form.selectedTags.includes(tag)) {
    form.selectedTags = form.selectedTags.filter((item) => item !== tag);
  } else if (form.selectedTags.length < 3) {
    form.selectedTags = [...form.selectedTags, tag];
  }
}

function addImage() {
  const nextImage = presetImages[form.images.length % presetImages.length];
  form.images = [...form.images, nextImage];
}

function removeImage(index) {
  form.images = form.images.filter((_, currentIndex) => currentIndex !== index);
}

function fillLocation() {
  form.location = demoLocations[(form.location.length + form.images.length + form.text.length) % demoLocations.length];
}

function handleSaveDraft() {
  syncDraft();
  MessagePlugin.success('草稿已保存');
  router.push('/home');
}

function handlePublish() {
  if (!form.text.trim() && form.images.length === 0) {
    MessagePlugin.warning('至少输入文字或添加一张图片');
    return;
  }

  publishRelease({
    text: form.text.trim(),
    images: form.images,
    location: form.location,
    isAnonymous: form.isAnonymous,
    tags: form.selectedTags,
  });
  MessagePlugin.success('动态发布成功');
  Object.assign(form, {
    text: '',
    selectedTags: [],
    images: [],
    location: '',
    isAnonymous: false,
  });
  clearReleaseDraft();
  router.push('/home');
}

onMounted(() => {
  Object.assign(form, getReleaseDraft());
});
</script>

<style scoped lang="less">
.release-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f5f5f5;
}

.release-scroll {
  flex: 1;
  overflow: auto;
}

.release-card {
  margin: 10px 12px 0;
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.upload-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  color: rgba(0, 0, 0, 0.42);
  font-size: 12px;
}

.upload-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-item-add {
  border: 1px dashed rgba(0, 0, 0, 0.14);
}

.upload-item-add :deep(svg) {
  font-size: 20px;
}

.upload-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 16px;
  line-height: 1;
}

.field-label {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 15px;
  font-weight: 600;
}

.desc-textarea {
  width: 100%;
  min-height: 144px;
  resize: none;
  border: 0;
  outline: 0;
  background: transparent;
  color: rgba(0, 0, 0, 0.82);
  font-size: 14px;
  line-height: 1.7;
}

.textarea-count {
  text-align: right;
  color: rgba(0, 0, 0, 0.36);
  font-size: 12px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  min-height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f6f7fb;
  color: rgba(0, 0, 0, 0.66);
  font-size: 13px;
}

.tag-item.active {
  background: #111827;
  color: #ffffff;
}

.location-cell,
.location-left,
.location-right {
  display: flex;
  align-items: center;
}

.location-cell {
  justify-content: space-between;
  width: 100%;
  color: rgba(0, 0, 0, 0.86);
}

.location-left {
  gap: 8px;
}

.location-right {
  gap: 6px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 13px;
}

.anonymous-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  padding: 2px;
  border-radius: 999px;
  background: #d1d5db;
  transition: background 0.2s ease;
}

.anonymous-toggle.active {
  background: #0052d9;
}

.anonymous-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  transition: transform 0.2s ease;
}

.anonymous-toggle.active .anonymous-dot {
  transform: translateX(20px);
}

.release-bottom-space {
  height: 90px;
}

.release-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px 14px 18px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.98);
}

.action-btn {
  height: 42px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
}

.action-btn-light {
  background: #eef2ff;
  color: #4338ca;
}

.action-btn-primary {
  background: linear-gradient(135deg, #0052d9 0%, #3b82f6 100%);
  color: #ffffff;
}
</style>
