<template>
  <article
    class="home-card"
    @click="$emit('click')"
  >
    <div
      v-if="card.url"
      class="home-card__image-wrap"
    >
      <img
        class="home-card__image"
        :src="card.url"
        :alt="card.nickname"
      />
      <div
        v-if="card.isAnonymous"
        class="anonymous-badge"
      >
        <UserAvatarIcon />
      </div>
    </div>

    <div class="home-card__body">
      <div
        v-if="!card.url"
        class="home-card__author"
      >
        <div
          class="author-avatar"
          :class="{ 'avatar-anonymous': card.isAnonymous }"
        >
          <img
            v-if="card.avatar && !card.isAnonymous"
            :src="card.avatar"
            :alt="card.nickname"
          />
          <UserAvatarIcon v-else />
        </div>
        <div class="author-name-wrap">
          <span class="author-name">{{ card.isAnonymous ? '匿名的你' : card.nickname }}</span>
          <span
            v-if="!card.isAnonymous && card.department"
            class="author-dept"
          >
            {{ card.department }}
          </span>
        </div>
        <div
          v-if="card.role === 'teacher'"
          class="teacher-tag"
        >
          <EducationIcon />
          <span>教师</span>
        </div>
      </div>

      <p class="home-card__desc">{{ card.desc }}</p>

      <div
        v-if="card.tags?.length"
        class="home-card__tag-group"
      >
        <span
          v-for="tag in card.tags"
          :key="`${card.postId}-${tag.text}`"
          class="home-card__tag"
          :class="`is-${tag.theme || 'default'}`"
        >
          <LocationIcon
            v-if="tag.theme === 'primary'"
            class="home-card__tag-icon"
          />
          {{ tag.text }}
        </span>
      </div>

      <div
        v-if="card.url"
        class="home-card__footer"
      >
        <div class="footer-author">
          <div
            class="footer-avatar"
            :class="{ 'avatar-anonymous': card.isAnonymous }"
          >
            <img
              v-if="card.avatar && !card.isAnonymous"
              :src="card.avatar"
              :alt="card.nickname"
            />
            <UserAvatarIcon v-else />
          </div>
          <span class="footer-name">{{ card.isAnonymous ? '匿名' : card.nickname }}</span>
          <div
            v-if="card.role === 'teacher'"
            class="teacher-tag-small"
          >
            <EducationIcon />
          </div>
        </div>
        <div class="footer-like">
          <ThumbUpIcon />
          <span class="like-count">{{ card.likeCount }}</span>
        </div>
      </div>

      <div
        v-else
        class="home-card__footer-plain"
      >
        <div class="footer-like-plain">
          <ThumbUpIcon />
          <span class="like-count">{{ card.likeCount }}</span>
        </div>
        <span class="footer-time">{{ card.createdAt }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { EducationIcon, LocationIcon, ThumbUpIcon, UserAvatarIcon } from 'tdesign-icons-vue-next';

defineProps({
  card: {
    type: Object,
    required: true,
  },
});

defineEmits(['click']);
</script>
