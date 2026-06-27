<template>
  <section class="workbench">
    <header class="workbench-navbar">
      <div></div>
      <div class="workbench-navbar__title">工作台</div>
      <div></div>
    </header>

    <section class="warning-stats-card">
      <div class="warning-stats-header">
        <div class="warning-stats-title">预警看板</div>
        <div class="warning-stats-filter">
          <button
            v-for="item in warningTabs"
            :key="item.value"
            type="button"
            class="filter-item"
            :class="{ active: warningFilter === item.value }"
            @click="warningFilter = item.value"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="warning-stats-numbers">
        <div class="stats-number-item high">
          <div class="stats-number">{{ workbench.warningStats.high }}</div>
          <div class="stats-label">高风险</div>
        </div>
        <div class="stats-number-item medium">
          <div class="stats-number">{{ workbench.warningStats.medium }}</div>
          <div class="stats-label">中风险</div>
        </div>
        <div class="stats-number-item low">
          <div class="stats-number">{{ workbench.warningStats.low }}</div>
          <div class="stats-label">低风险</div>
        </div>
      </div>

      <div class="warning-list-scroll">
        <div class="warning-list">
          <button
            v-for="item in filteredWarnings"
            :key="item.id"
            type="button"
            class="warning-item"
            :class="item.riskLevel"
            @click="router.push('/warnings')"
          >
            <img
              class="warning-avatar"
              :src="item.avatar"
              :alt="item.studentName"
            />
            <div class="warning-info">
              <span class="warning-name">{{ item.studentName }}</span>
              <span class="warning-reason">{{ item.riskReason }}</span>
            </div>
            <div
              class="warning-badge"
              :class="item.riskLevel"
            >
              {{ item.riskLevel === 'high' ? '高' : item.riskLevel === 'medium' ? '中' : '低' }}
            </div>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="view-more"
        @click="router.push('/warnings')"
      >
        <span>查看全部预警</span>
        <ChevronRightIcon />
      </button>
    </section>

    <section class="schedule-card">
      <button
        type="button"
        class="schedule-header"
        @click="scheduleExpanded = !scheduleExpanded"
      >
        <div class="schedule-title-section">
          <div class="schedule-title">今日日程</div>
          <div class="schedule-stats">
            <span class="schedule-stat completed">已完成 {{ workbench.scheduleStats.completed }}</span>
            <span class="schedule-stat upcoming">待进行 {{ workbench.scheduleStats.upcoming }}</span>
            <span
              v-if="workbench.scheduleStats.ongoing > 0"
              class="schedule-stat ongoing"
            >
              进行中 {{ workbench.scheduleStats.ongoing }}
            </span>
          </div>
        </div>
        <component
          :is="scheduleExpanded ? ChevronUpIcon : ChevronDownIcon"
          class="schedule-toggle-icon"
        />
      </button>

      <div class="schedule-list">
        <article
          v-for="(item, index) in visibleSchedules"
          :key="item.id"
          class="schedule-item"
          :class="item.status"
        >
          <div class="schedule-time">
            <span class="time-start">{{ item.startTime }}</span>
            <span class="time-end">{{ item.endTime }}</span>
          </div>
          <div class="schedule-divider">
            <div
              class="schedule-dot"
              :class="item.status"
            ></div>
            <div
              v-if="index < workbench.scheduleList.length - 1"
              class="schedule-line"
            ></div>
          </div>
          <div class="schedule-content">
            <div class="schedule-type-row">
              <span class="schedule-type">{{ item.type === 'counseling' ? '心理咨询' : '值班' }}</span>
              <span class="schedule-status">
                {{ item.status === 'completed' ? '已完成' : item.status === 'ongoing' ? '进行中' : '待进行' }}
              </span>
            </div>
            <div
              v-if="item.studentName"
              class="schedule-detail"
            >
              <img
                class="schedule-avatar"
                :src="item.avatar"
                :alt="item.studentName"
              />
              <span class="schedule-student">{{ item.studentName }}</span>
            </div>
            <span class="schedule-location">📍 {{ item.location }}</span>
            <span
              v-if="item.notes"
              class="schedule-notes"
            >
              {{ item.notes }}
            </span>
          </div>
        </article>
      </div>

      <button
        v-if="!scheduleExpanded && workbench.scheduleList.length > 2"
        type="button"
        class="schedule-collapsed-hint"
        @click="scheduleExpanded = true"
      >
        <span>还有 {{ workbench.scheduleList.length - 2 }} 个日程</span>
        <ChevronDownIcon />
      </button>
    </section>

    <section class="quick-entry-card">
      <div class="quick-entry-title">快捷入口</div>
      <div class="quick-entry-grid">
        <button
          v-for="item in workbench.quickEntries"
          :key="item.name"
          type="button"
          class="quick-entry-item"
        >
          <div
            class="quick-entry-icon"
            :style="{ backgroundColor: `${item.color}20`, color: item.color }"
          >
            <component :is="resolveEntryIcon(item.icon)" />
          </div>
          <span class="quick-entry-name">{{ item.name }}</span>
        </button>
      </div>
    </section>

    <section class="work-stats-card">
      <div class="work-stats-title">本月工作统计</div>
      <div class="work-stats-grid">
        <article class="work-stats-item">
          <div class="work-stats-number">{{ workbench.workStats.thisMonthCounseling }}</div>
          <div class="work-stats-label">本月咨询</div>
          <div class="work-stats-trend up">
            <ArrowUpIcon />
            <span>{{ workbench.workStats.thisMonthCounselingTrend }}%</span>
          </div>
        </article>
        <article class="work-stats-item">
          <div class="work-stats-number">{{ workbench.workStats.totalHours }}</div>
          <div class="work-stats-label">累计时长(小时)</div>
          <div class="work-stats-trend up">
            <ArrowUpIcon />
            <span>{{ workbench.workStats.totalHoursTrend }}%</span>
          </div>
        </article>
        <article class="work-stats-item">
          <div class="work-stats-number">{{ workbench.workStats.resolvedWarnings }}</div>
          <div class="work-stats-label">处理预警</div>
          <div class="work-stats-trend up">
            <ArrowUpIcon />
            <span>{{ workbench.workStats.resolvedWarningsTrend }}%</span>
          </div>
        </article>
        <article class="work-stats-item">
          <div class="work-stats-number">{{ workbench.workStats.satisfactionRate }}</div>
          <div class="work-stats-label">满意度</div>
          <div class="work-stats-trend up">
            <ArrowUpIcon />
            <span>{{ workbench.workStats.satisfactionRateTrend }}</span>
          </div>
        </article>
      </div>
    </section>

    <div class="bottom-padding"></div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ArrowUpIcon,
  CalendarIcon,
  ChartIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  EditIcon,
  NotificationIcon,
  UsergroupIcon,
} from 'tdesign-icons-vue-next';

import { createFallbackWorkbenchData, getWorkbenchData } from '@/services/workbench';

const router = useRouter();
const warningFilter = ref('all');
const scheduleExpanded = ref(false);
const workbench = ref(createFallbackWorkbenchData());
const warningTabs = [
  { label: '全部', value: 'all' },
  { label: '高风险', value: 'high' },
  { label: '中风险', value: 'medium' },
];

const filteredWarnings = computed(() => {
  if (warningFilter.value === 'all') return workbench.value.warningList;
  return workbench.value.warningList.filter((item) => item.riskLevel === warningFilter.value);
});

const visibleSchedules = computed(() => {
  if (scheduleExpanded.value) {
    return workbench.value.scheduleList;
  }

  return workbench.value.scheduleList.slice(0, 2);
});

const entryIcons = {
  calendar: CalendarIcon,
  chart: ChartIcon,
  edit: EditIcon,
  notification: NotificationIcon,
  usergroup: UsergroupIcon,
};

function resolveEntryIcon(icon) {
  return entryIcons[icon] || ChartIcon;
}

onMounted(async () => {
  workbench.value = await getWorkbenchData();
});
</script>

<style scoped lang="less">
.workbench {
  height: 100%;
  overflow: auto;
  padding: 12px;
  background: #f5f5f5;
}

.workbench-navbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 44px;
  margin: -12px -12px 12px;
  padding: 0 12px;
  background: #ffffff;
}

.workbench-navbar__title {
  color: rgba(0, 0, 0, 0.9);
  text-align: center;
  font-size: 17px;
  font-weight: 600;
}

.warning-stats-card,
.schedule-card,
.quick-entry-card,
.work-stats-card {
  margin-bottom: 10px;
  padding: 16px;
  border-radius: 10px;
  background: #fff;
}

.warning-stats-header,
.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.schedule-header {
  width: 100%;
  text-align: left;
}

.schedule-toggle-icon {
  color: rgba(0, 0, 0, 0.42);
  font-size: 18px;
}

.warning-stats-title,
.schedule-title,
.quick-entry-title,
.work-stats-title {
  color: rgba(0, 0, 0, 0.88);
  font-size: 16px;
  font-weight: 600;
}

.warning-stats-filter,
.schedule-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-item,
.schedule-stat {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
}

.filter-item {
  color: rgba(0, 0, 0, 0.45);
}

.filter-item.active {
  background: rgba(0, 82, 217, 0.1);
  color: #0052d9;
}

.schedule-stat.completed {
  background: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.schedule-stat.upcoming {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.schedule-stat.ongoing {
  background: rgba(114, 46, 209, 0.1);
  color: #722ed1;
}

.warning-stats-numbers {
  display: flex;
  justify-content: space-around;
  padding: 14px 0;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.stats-number-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-number {
  font-size: 28px;
  font-weight: 700;
}

.stats-number-item.high .stats-number {
  color: #f5222d;
}

.stats-number-item.medium .stats-number {
  color: #fa8c16;
}

.stats-number-item.low .stats-number {
  color: #52c41a;
}

.stats-label {
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
}

.warning-list-scroll {
  overflow: auto;
}

.warning-list {
  display: flex;
  gap: 8px;
  padding-bottom: 4px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 240px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  background: #f8f8f8;
}

.warning-item.high {
  border-color: rgba(245, 34, 45, 0.1);
  background: rgba(245, 34, 45, 0.06);
}

.warning-item.medium {
  border-color: rgba(250, 140, 22, 0.1);
  background: rgba(250, 140, 22, 0.06);
}

.warning-avatar,
.schedule-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.warning-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.warning-name,
.schedule-type {
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  font-weight: 600;
}

.warning-reason,
.time-end,
.schedule-location,
.schedule-notes {
  overflow: hidden;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.warning-badge {
  padding: 3px 8px;
  border-radius: 8px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.warning-badge.high {
  background: #f5222d;
}

.warning-badge.medium {
  background: #fa8c16;
}

.warning-badge.low {
  background: #52c41a;
}

.view-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  color: #0052d9;
  font-size: 13px;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.schedule-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.schedule-item.completed {
  opacity: 0.7;
}

.schedule-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 52px;
  flex-shrink: 0;
}

.time-start {
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  font-weight: 600;
}

.schedule-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 18px;
}

.schedule-dot {
  width: 10px;
  height: 10px;
  border: 2px solid #fff;
  border-radius: 50%;
}

.schedule-dot.completed {
  background: #52c41a;
  box-shadow: 0 0 0 2px #52c41a;
}

.schedule-dot.upcoming {
  background: #1890ff;
  box-shadow: 0 0 0 2px #1890ff;
}

.schedule-dot.ongoing {
  background: #722ed1;
  box-shadow:
    0 0 0 2px #722ed1,
    0 0 0 5px rgba(114, 46, 209, 0.16);
}

.schedule-line {
  width: 2px;
  flex: 1;
  margin: 6px 0;
  background: rgba(0, 0, 0, 0.08);
}

.schedule-content {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  background: #f8f8f8;
}

.schedule-type-row,
.schedule-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.schedule-type-row {
  justify-content: space-between;
}

.schedule-status {
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.5);
  font-size: 11px;
}

.schedule-collapsed-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.48);
  font-size: 12px;
}

.schedule-student {
  color: rgba(0, 0, 0, 0.72);
  font-size: 13px;
}

.quick-entry-grid,
.work-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.work-stats-grid {
  grid-template-columns: repeat(2, 1fr);
}

.quick-entry-item,
.work-stats-item {
  padding: 12px;
  border-radius: 8px;
  background: #f8f8f8;
  text-align: center;
}

.quick-entry-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin: 0 auto 8px;
  border-radius: 8px;
  font-size: 22px;
}

.quick-entry-name,
.work-stats-label {
  color: rgba(0, 0, 0, 0.65);
  font-size: 12px;
}

.work-stats-number {
  color: rgba(0, 0, 0, 0.88);
  font-size: 24px;
  font-weight: 700;
}

.work-stats-trend {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  margin-top: 6px;
  color: #52c41a;
  font-size: 11px;
}

.bottom-padding {
  height: 8px;
}
</style>
