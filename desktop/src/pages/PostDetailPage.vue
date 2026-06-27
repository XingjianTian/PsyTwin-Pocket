<template>
  <section class="post-detail-container">
    <MiniTopBar
      title="帖子详情"
      fallback="/home"
    />

    <div class="post-detail-scroll">
      <div class="post-content">
        <div class="post-header">
          <div class="author-info">
            <div
              class="author-avatar"
              :class="{ 'avatar-anonymous': post.content.isAnonymous }"
            >
              <img
                v-if="post.author.avatar && !post.content.isAnonymous"
                :src="post.author.avatar"
                :alt="post.author.nickname"
              />
              <UserAvatarIcon v-else />
            </div>
            <div class="author-meta">
              <div class="author-name-row">
                <span class="author-name">{{ post.content.isAnonymous ? '匿名的你' : post.author.nickname }}</span>
                <div
                  v-if="post.author.role === 'teacher'"
                  class="teacher-tag"
                >
                  <EducationIcon />
                  <span>教师</span>
                </div>
              </div>
              <div class="author-sub">
                <span
                  v-if="!post.content.isAnonymous && post.author.department"
                  class="author-dept"
                >
                  {{ post.author.department }}
                </span>
                <span class="post-time">{{ post.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="post-body">
          <p class="post-text">{{ post.content.text }}</p>

          <div
            v-if="post.content.location"
            class="location-tag"
          >
            <LocationIcon />
            <span>{{ post.content.location }}</span>
          </div>

          <div
            v-if="post.content.images?.length"
            class="image-grid"
          >
            <img
              v-for="item in post.content.images"
              :key="item"
              :src="item"
              :alt="post.author.nickname"
              class="post-image"
              :class="{ single: post.content.images.length === 1 }"
            />
          </div>
        </div>

        <div class="post-stats">
          <div class="stats-left">{{ likeCount }} 赞 · {{ comments.length }} 评论</div>
          <div class="action-btns">
            <button
              type="button"
              class="action-btn"
              :class="{ liked: isLiked }"
              @click="handleLike"
            >
              <ThumbUpIcon />
            </button>
            <button
              type="button"
              class="action-btn"
              @click="isCollected = !isCollected"
            >
              <StarIcon />
            </button>
            <button
              type="button"
              class="share-btn"
            >
              <ShareIcon />
            </button>
          </div>
        </div>
      </div>

      <section class="comments-section">
        <div class="comments-header">评论 ({{ comments.length }})</div>

        <div class="comment-list">
          <article
            v-for="item in comments"
            :key="item.id"
            class="comment-item"
          >
            <div class="comment-avatar">
              <img
                v-if="item.author.avatar"
                :src="item.author.avatar"
                :alt="item.author.nickname"
              />
              <UserAvatarIcon v-else />
            </div>
            <div class="comment-body">
              <div class="comment-meta">
                <span class="comment-author">{{ item.author.nickname }}</span>
                <span
                  v-if="item.author.role === 'teacher'"
                  class="teacher-badge"
                >
                  教师
                </span>
                <span class="comment-time">{{ item.createdAt }}</span>
              </div>
              <p class="comment-content">{{ item.content }}</p>
              <div class="comment-actions">
                <div class="comment-like">
                  <ThumbUpIcon />
                  <span>{{ item.likeCount }}</span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>

    <div class="footer-bar">
      <input
        v-model="inputValue"
        class="comment-input"
        type="text"
        placeholder="说点什么吧..."
        @keydown.enter="sendComment"
      />
      <button
        type="button"
        class="comment-send-btn"
        @click="sendComment"
      >
        发送
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  EducationIcon,
  LocationIcon,
  ShareIcon,
  StarIcon,
  ThumbUpIcon,
  UserAvatarIcon,
} from 'tdesign-icons-vue-next';

import MiniTopBar from '@/components/MiniTopBar.vue';
import { getFallbackPostDetail, getPostDetail, submitPostComment, togglePostLike } from '@/services/post';

const route = useRoute();
const post = ref(getFallbackPostDetail(typeof route.query.id === 'string' ? route.query.id : '1'));
const comments = ref(post.value.comments || []);
const isLiked = ref(false);
const isCollected = ref(false);
const inputValue = ref('');

const likeCount = computed(() => (post.value.stats?.likeCount || 0) + (isLiked.value ? 1 : 0));

async function loadPostDetail(postId) {
  const detail = await getPostDetail(postId);
  post.value = detail;
  comments.value = detail.comments || [];
  isLiked.value = Boolean(detail.isLiked);
  isCollected.value = Boolean(detail.isCollected);
}

async function handleLike() {
  const nextValue = !isLiked.value;
  isLiked.value = nextValue;
  const result = await togglePostLike(post.value.id);

  if (result && typeof result.liked === 'boolean') {
    isLiked.value = result.liked;
  }
}

async function sendComment() {
  const content = inputValue.value.trim();
  if (!content) return;

  const createdComment = await submitPostComment(post.value.id, content);

  comments.value = [
    ...comments.value,
    {
      id: createdComment?.id || `c-${Date.now()}`,
      author: {
        nickname: createdComment?.author?.nickname || '我',
        avatar: createdComment?.author?.avatar || 'https://picsum.photos/80/80?random=500',
        role: createdComment?.author?.role || 'student',
      },
      createdAt: createdComment?.createdAt || '刚刚',
      content: createdComment?.content || content,
      likeCount: createdComment?.likeCount || 0,
      isLiked: false,
    },
  ];
  inputValue.value = '';
}

watch(
  () => route.query.id,
  (value) => {
    loadPostDetail(typeof value === 'string' ? value : '1');
  },
);

onMounted(() => {
  loadPostDetail(typeof route.query.id === 'string' ? route.query.id : '1');
});
</script>

<style scoped lang="less">
.post-detail-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
}

.post-detail-scroll {
  flex: 1;
  overflow: auto;
  padding-bottom: 10px;
}

.post-content,
.comments-section {
  margin: 10px 12px 0;
  padding: 16px;
  border-radius: 14px;
  background: #fff;
}

.post-header,
.author-info,
.author-name-row,
.author-sub,
.location-tag,
.post-stats,
.comment-meta,
.comment-like,
.footer-bar {
  display: flex;
  align-items: center;
}

.post-header {
  margin-bottom: 12px;
}

.author-info {
  gap: 10px;
}

.author-avatar,
.comment-avatar {
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #ede9fe;
  color: #7c3aed;
}

.author-avatar {
  width: 40px;
  height: 40px;
}

.comment-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.author-avatar.avatar-anonymous {
  background: #f3f4f6;
  color: #9ca3af;
}

.author-avatar img,
.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.author-name-row {
  gap: 6px;
}

.author-name {
  color: rgba(0, 0, 0, 0.88);
  font-size: 16px;
  font-weight: 600;
}

.teacher-tag,
.teacher-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 8px;
  background: #ede9fe;
  color: #7c3aed;
  font-size: 11px;
}

.author-sub,
.comment-time,
.post-time {
  gap: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.post-text {
  margin: 0 0 12px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 15px;
  line-height: 1.7;
}

.location-tag {
  gap: 4px;
  width: fit-content;
  padding: 6px 10px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: #f3f4f6;
  color: rgba(0, 0, 0, 0.48);
  font-size: 12px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.post-image {
  width: 100%;
  height: 110px;
  border-radius: 8px;
  object-fit: cover;
}

.post-image.single {
  grid-column: span 3;
  height: 190px;
}

.post-stats {
  justify-content: space-between;
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid #eee;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}

.action-btns {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn,
.share-btn {
  display: grid;
  place-items: center;
  color: #9ca3af;
  font-size: 18px;
}

.action-btn.liked {
  color: #7c3aed;
}

.comments-header {
  margin-bottom: 14px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 15px;
  font-weight: 600;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.comment-item {
  display: flex;
  gap: 10px;
}

.comment-body {
  flex: 1;
}

.comment-meta {
  gap: 6px;
  margin-bottom: 4px;
}

.comment-author {
  color: rgba(0, 0, 0, 0.82);
  font-size: 13px;
  font-weight: 600;
}

.comment-content {
  margin: 0 0 6px;
  color: rgba(0, 0, 0, 0.82);
  font-size: 14px;
  line-height: 1.6;
}

.comment-like {
  gap: 4px;
  color: rgba(0, 0, 0, 0.42);
  font-size: 12px;
}

.footer-bar {
  position: relative;
  flex-shrink: 0;
  gap: 10px;
  padding: 10px 12px;
  margin: 0 12px 10px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.comment-input {
  flex: 1;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  outline: none;
  background: #f9fafb;
  font-size: 14px;
}
</style>
