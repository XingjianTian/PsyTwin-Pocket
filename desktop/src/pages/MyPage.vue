<template>
  <div class="my-page">
    <section class="my-header">
      <button
        type="button"
        class="header-setting"
      >
        <SettingIcon />
      </button>

      <div class="user-block">
        <div class="user-avatar-wrap">
          <img
            class="user-avatar"
            :src="profile.avatar"
            :alt="profile.nickname"
          />
          <div class="avatar-edit-badge">
            <EditIcon />
          </div>
        </div>
        <div class="user-info">
          <div class="user-name-row">
            <span class="user-name">{{ profile.nickname }}</span>
            <span
              class="role-badge"
              :class="{ 'student-badge': authStore.role !== 'teacher' }"
            >
              {{ authStore.role === 'teacher' ? '教师' : '学生' }}
            </span>
          </div>
          <div class="user-meta">
            <template v-if="authStore.role === 'teacher'">
              <span>{{ profile.department }}</span>
              <span class="meta-dot">·</span>
              <span>{{ profile.teacherId }}</span>
            </template>
            <template v-else>
              <span>{{ profile.department }}</span>
              <span class="meta-dot">·</span>
              <span>{{ profile.studentId }}</span>
            </template>
          </div>
          <div
            v-if="authStore.role === 'teacher'"
            class="user-title"
          >
            {{ profile.title }}
          </div>
          <div
            v-else
            class="user-class"
          >
            {{ profile.className }}
          </div>
        </div>
        <ChevronRightIcon class="my-chevron" />
      </div>

      <div class="stats-bar">
        <template v-if="authStore.role === 'teacher'">
          <div class="stat-item">
            <div class="stat-num">{{ profile.workStats.thisMonthCounseling }}</div>
            <div class="stat-label">本月咨询</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ profile.workStats.totalCounseling }}</div>
            <div class="stat-label">累计咨询</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ profile.workStats.totalHours }}</div>
            <div class="stat-label">总时长(h)</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ profile.workStats.satisfactionRate }}</div>
            <div class="stat-label">满意度</div>
          </div>
        </template>
        <template v-else>
          <div class="stat-item">
            <div class="stat-num">{{ profile.stats.counselingCount }}</div>
            <div class="stat-label">咨询次数</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ profile.stats.vrSessionCount }}</div>
            <div class="stat-label">VR 体验</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ profile.stats.totalMinutes }}</div>
            <div class="stat-label">总时长(分)</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">{{ profile.stats.assessmentCount }}</div>
            <div class="stat-label">测评次数</div>
          </div>
        </template>
      </div>
    </section>

    <section
      v-if="authStore.role !== 'teacher'"
      class="section-card health-card"
    >
      <div class="card-title-row">
        <div class="card-title">
          <HeartIcon />
          <span>心理健康概览</span>
        </div>
        <button
          type="button"
          class="card-action"
        >
          <span>去测评</span>
          <ChevronRightIcon />
        </button>
      </div>

      <div class="health-status-row">
        <div class="risk-badge risk-low">
          <div class="risk-dot"></div>
          <span>心理状态良好</span>
        </div>
        <div class="trend-badge trend-stable">
          <RemoveIcon />
          <span>保持稳定</span>
        </div>
        <div class="last-assessment">上次测评：{{ profile.lastAssessment.date }}</div>
      </div>

      <div class="dimension-list">
        <div
          v-for="dimension in profile.healthOverview.dimensions"
          :key="dimension.name"
          class="dimension-item"
        >
          <div class="dimension-label">{{ dimension.name }}</div>
          <div class="dimension-bar-wrap">
            <div
              class="dimension-bar-fill"
              :class="scoreClass(dimension.score)"
              :style="{ width: `${dimension.score}%` }"
            ></div>
          </div>
          <div
            class="dimension-score"
            :class="`score-text-${scoreClass(dimension.score)}`"
          >
            {{ dimension.score }}
          </div>
        </div>
      </div>

      <div class="assessment-conclusion">
        <InfoCircleIcon />
        <span>{{ profile.lastAssessment.conclusion }}</span>
      </div>
    </section>

    <section
      v-if="authStore.role === 'teacher'"
      class="section-card qualification-card"
    >
      <div class="card-title-row">
        <div class="card-title">
          <CertificateIcon />
          <span>资质认证</span>
        </div>
      </div>
      <div class="qualification-list">
        <div
          v-for="item in profile.qualifications"
          :key="item"
          class="qualification-item"
        >
          <CheckIcon />
          <span>{{ item }}</span>
        </div>
      </div>
    </section>

    <section class="section-card">
      <div class="card-title-row">
        <div class="card-title">
          <ChartIcon />
          <span>快捷功能</span>
        </div>
      </div>
      <div class="grid-list">
        <button
          v-for="item in gridList"
          :key="item.name"
          type="button"
          class="grid-item"
          @click="handleGridTap(item)"
        >
          <div
            class="grid-icon-wrap"
            :class="`grid-icon-${item.color}`"
          >
            <component :is="resolveGridIcon(item.icon)" />
          </div>
          <span class="grid-name">{{ item.name }}</span>
        </button>
      </div>
    </section>

    <section class="section-card">
      <div class="card-title-row">
        <div class="card-title">
          <StarIcon />
          <span>{{ authStore.role === 'teacher' ? '荣誉资质' : '我的成就' }}</span>
        </div>
        <div class="badge-count">{{ earnedBadgeCount }}/{{ profile.badges.length }}</div>
      </div>
      <div class="badge-list">
        <div
          v-for="item in profile.badges"
          :key="item.id"
          class="badge-item"
          :class="{ 'badge-locked': !item.earned }"
        >
          <div class="badge-icon-wrap">
            <component :is="resolveGridIcon(item.icon)" />
          </div>
          <span class="badge-name">{{ item.name }}</span>
        </div>
      </div>
    </section>

    <section class="section-card menu-card">
      <button
        v-for="item in menuList"
        :key="item.name"
        type="button"
        class="menu-item"
        @click="handleMenuTap(item)"
      >
        <div class="menu-left">
          <div
            class="menu-icon-wrap"
            :class="`menu-icon-${item.color}`"
          >
            <component :is="resolveGridIcon(item.icon)" />
          </div>
          <span class="menu-name">{{ item.name }}</span>
        </div>
        <div class="menu-right">
          <span
            v-if="item.badge"
            class="menu-badge"
          >
            {{ item.badge }}
          </span>
          <ChevronRightIcon />
        </div>
      </button>
    </section>

    <section class="logout-section">
      <button
        type="button"
        class="logout-btn"
        @click="handleLogout"
      >
        退出登录
      </button>
    </section>

    <div class="safe-bottom"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  CalendarIcon,
  CertificateIcon,
  ChartIcon,
  ChevronRightIcon,
  CheckIcon,
  EditIcon,
  ErrorIcon,
  HeartIcon,
  InfoCircleIcon,
  LockOnIcon,
  NotificationIcon,
  RemoveIcon,
  ServiceIcon,
  SettingIcon,
  StarIcon,
  TimeIcon,
  UsergroupIcon,
  UserIcon,
  VideoIcon,
} from 'tdesign-icons-vue-next';

import { fetchProfile, getGridList, getMenuList, getProfile } from '@/services/profile';
import { useAppStore } from '@/stores/app';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const appStore = useAppStore();
const router = useRouter();

const profile = ref(getProfile(authStore.role));
const gridList = computed(() => getGridList(authStore.role));
const menuList = computed(() => getMenuList(authStore.role).map((item) => {
  if (item.name !== '消息通知') {
    return item;
  }

  return {
    ...item,
    badge: appStore.unreadCount > 0 ? String(appStore.unreadCount) : '',
  };
}));
const earnedBadgeCount = computed(() => (profile.value.badges || []).filter((item) => item.earned).length);

const iconMap = {
  calendar: CalendarIcon,
  certificate: CertificateIcon,
  chart: ChartIcon,
  check: CheckIcon,
  edit: EditIcon,
  error: ErrorIcon,
  heart: HeartIcon,
  'lock-on': LockOnIcon,
  notification: NotificationIcon,
  service: ServiceIcon,
  setting: SettingIcon,
  star: StarIcon,
  time: TimeIcon,
  user: UserIcon,
  usergroup: UsergroupIcon,
  video: VideoIcon,
};

function resolveGridIcon(icon) {
  return iconMap[icon] || UserIcon;
}

function scoreClass(score) {
  if (score >= 80) return 'good';
  if (score >= 60) return 'ok';
  return 'low';
}

function handleGridTap(item) {
  if (item.route) {
    router.push(item.route);
  }
}

function handleMenuTap(item) {
  if (item.route) {
    router.push(item.route);
    return;
  }

  MessagePlugin.info(`${item.name}将在下一轮继续细化`);
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

async function loadProfile() {
  profile.value = await fetchProfile(authStore.role);
}

watch(
  () => authStore.role,
  () => {
    profile.value = getProfile(authStore.role);
    loadProfile();
  },
);

onMounted(() => {
  loadProfile();
});
</script>

<style scoped lang="less">
.my-page {
  height: 100%;
  overflow: auto;
  background: #f3f3f3;
  padding-bottom: 88px;
}

.my-header {
  position: relative;
  padding: 44px 16px 0;
  background: linear-gradient(135deg, #7c3aed 0%, #9f67fa 100%);
}

.header-setting {
  position: absolute;
  top: 26px;
  right: 16px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 18px;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.user-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
}

.avatar-edit-badge {
  position: absolute;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border: 1px solid #fff;
  border-radius: 50%;
  background: #7c3aed;
  color: #fff;
  font-size: 10px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.user-name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

.role-badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
}

.role-badge.student-badge {
  background: rgba(255, 255, 255, 0.15);
}

.user-meta,
.user-class,
.user-title {
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
}

.meta-dot {
  opacity: 0.5;
}

.user-title {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
}

.my-chevron {
  color: rgba(255, 255, 255, 0.6);
  font-size: 18px;
}

.stats-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin: 0 -16px;
  border-radius: 10px 10px 0 0;
  background: rgba(255, 255, 255, 0.12);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}

.stat-label {
  color: rgba(255, 255, 255, 0.68);
  font-size: 10px;
}

.stat-divider {
  width: 1px;
  height: 22px;
  background: rgba(255, 255, 255, 0.22);
}

.section-card {
  margin: 10px 12px 0;
  padding: 14px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title,
.card-action {
  display: flex;
  align-items: center;
  gap: 6px;
}

.card-title {
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  font-weight: 600;
}

.card-action,
.badge-count {
  color: #7c3aed;
  font-size: 11px;
}

.health-status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.risk-badge,
.trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.risk-badge.risk-low {
  background: #d1fae5;
  color: #10b981;
}

.risk-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.trend-badge.trend-stable {
  background: #e0e7ff;
  color: #6366f1;
}

.last-assessment {
  color: rgba(0, 0, 0, 0.42);
  font-size: 11px;
}

.dimension-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dimension-item {
  display: grid;
  grid-template-columns: 64px 1fr 28px;
  align-items: center;
  gap: 8px;
}

.dimension-label {
  color: rgba(0, 0, 0, 0.66);
  font-size: 11px;
}

.dimension-bar-wrap {
  overflow: hidden;
  height: 7px;
  border-radius: 999px;
  background: #f3f4f6;
}

.dimension-bar-fill {
  height: 100%;
  border-radius: 999px;
}

.dimension-bar-fill.good {
  background: #10b981;
}

.dimension-bar-fill.ok {
  background: #f59e0b;
}

.dimension-bar-fill.low {
  background: #ef4444;
}

.dimension-score {
  text-align: right;
  font-size: 11px;
  font-weight: 600;
}

.score-text-good {
  color: #10b981;
}

.score-text-ok {
  color: #f59e0b;
}

.score-text-low {
  color: #ef4444;
}

.assessment-conclusion,
.qualification-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 12px;
  color: rgba(0, 0, 0, 0.48);
  font-size: 11px;
  line-height: 1.6;
}

.qualification-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.qualification-item {
  margin-top: 0;
  color: rgba(0, 0, 0, 0.74);
}

.qualification-item :deep(svg) {
  color: #52c41a;
}

.grid-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.grid-icon-wrap,
.menu-icon-wrap {
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 20px;
}

.grid-icon-wrap {
  width: 40px;
  height: 40px;
}

.menu-icon-wrap {
  width: 34px;
  height: 34px;
  font-size: 17px;
}

.grid-icon-purple,
.menu-icon-purple {
  background: #ede9fe;
  color: #7c3aed;
}

.grid-icon-blue,
.menu-icon-blue {
  background: #dbeafe;
  color: #3b82f6;
}

.grid-icon-green,
.menu-icon-green {
  background: #d1fae5;
  color: #10b981;
}

.grid-icon-orange,
.menu-icon-orange {
  background: #fef3c7;
  color: #f59e0b;
}

.menu-icon-gray {
  background: #f3f4f6;
  color: rgba(0, 0, 0, 0.45);
}

.grid-name,
.badge-name {
  color: rgba(0, 0, 0, 0.72);
  text-align: center;
  font-size: 11px;
}

.badge-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px 8px;
}

.badge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.badge-item.badge-locked {
  opacity: 0.5;
}

.badge-icon-wrap {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f7f2ff;
  color: #7c3aed;
  font-size: 17px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
}

.menu-item:last-child {
  border-bottom: 0;
}

.menu-left,
.menu-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.menu-name {
  color: rgba(0, 0, 0, 0.82);
  font-size: 13px;
}

.menu-badge {
  padding: 1px 7px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
}

.logout-section {
  padding: 12px;
}

.logout-btn {
  width: 100%;
  height: 42px;
  border-radius: 10px;
  background: #fff;
  color: #ef4444;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.safe-bottom {
  height: 12px;
}
</style>
