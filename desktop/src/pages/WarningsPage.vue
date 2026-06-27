<template>
  <section class="warning-list-page">
    <MiniTopBar
      title="预警列表"
      fallback="/data-center"
    />

    <div class="tabs-wrapper">
      <button
        v-for="item in tabs"
        :key="item.key"
        type="button"
        class="warning-tab"
        :class="{ active: activeTab === item.key }"
        @click="activeTab = item.key"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="warning-list">
      <article
        v-for="item in warningList"
        :key="item.id"
        class="warning-item"
        :class="item.riskLevel"
      >
        <div class="warning-header">
          <img
            class="warning-avatar"
            :src="item.avatar"
            :alt="item.studentName"
          />
          <div class="warning-student">
            <span class="student-name">{{ item.studentName }}</span>
            <span class="trigger-time">{{ item.triggeredAt }}</span>
          </div>
          <div
            class="warning-status-tag"
            :class="item.riskLevel"
          >
            {{ item.riskLevel === 'high' ? '高风险' : item.riskLevel === 'medium' ? '中风险' : '低风险' }}
          </div>
        </div>

        <div class="warning-content">
          <div class="warning-reason">
            <ErrorCircleFilledIcon />
            <span>{{ item.riskReason }}</span>
          </div>
          <div class="trigger-source">
            <span class="source-label">触发来源:</span>
            <span class="source-value">{{ sourceText(item.triggerSource) }}</span>
          </div>
        </div>

        <div
          v-if="item.lastAction"
          class="last-action"
        >
          <TimeIcon />
          <span>{{ item.lastAction.content }}</span>
          <span class="action-time">{{ item.lastAction.time }}</span>
        </div>

        <div class="warning-actions">
          <button
            type="button"
            class="warning-action-btn"
          >
            {{ activeTab === 'pending' ? '立即处理' : activeTab === 'processing' ? '继续跟进' : '查看详情' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { ErrorCircleFilledIcon, TimeIcon } from 'tdesign-icons-vue-next';

import MiniTopBar from '@/components/MiniTopBar.vue';
import { getWarningsByTab } from '@/services/workbench';

const activeTab = ref('pending');
const warningList = ref([]);
const tabs = [
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '处理中' },
  { key: 'resolved', label: '已解决' },
];

function sourceText(source) {
  if (source === 'chat') return 'AI对话';
  if (source === 'post') return '心墙动态';
  if (source === 'assessment') return '心理测评';
  return '行为数据';
}

async function loadWarnings() {
  warningList.value = await getWarningsByTab(activeTab.value);
}

watch(activeTab, () => {
  loadWarnings();
});

onMounted(() => {
  loadWarnings();
});
</script>

<style scoped lang="less">
.warning-list-page {
  height: 100%;
  overflow: auto;
  background: #f5f5f5;
}

.tabs-wrapper {
  display: flex;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.warning-tab {
  position: relative;
  flex: 1;
  height: 44px;
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}

.warning-tab.active {
  color: #0052d9;
  font-weight: 600;
}

.warning-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 28px;
  height: 3px;
  border-radius: 999px;
  transform: translateX(-50%);
  background: #0052d9;
}

.warning-list {
  padding: 12px;
}

.warning-item {
  margin-bottom: 10px;
  padding: 14px;
  border-left: 4px solid transparent;
  border-radius: 8px;
  background: #fff;
}

.warning-item.high {
  border-left-color: #f5222d;
}

.warning-item.medium {
  border-left-color: #fa8c16;
}

.warning-item.low {
  border-left-color: #52c41a;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.warning-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
}

.warning-student {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.student-name {
  color: rgba(0, 0, 0, 0.88);
  font-size: 15px;
  font-weight: 600;
}

.trigger-time {
  color: rgba(0, 0, 0, 0.42);
  font-size: 12px;
}

.warning-status-tag {
  padding: 4px 8px;
  border-radius: 999px;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.warning-status-tag.high {
  background: #f5222d;
}

.warning-status-tag.medium {
  background: #fa8c16;
}

.warning-status-tag.low {
  background: #52c41a;
}

.warning-content {
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #f8f8f8;
}

.warning-reason {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  line-height: 1.6;
}

.warning-reason :deep(svg) {
  flex-shrink: 0;
  margin-top: 1px;
  color: #ff4d4f;
}

.trigger-source,
.last-action {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 12px;
}

.source-label {
  color: rgba(0, 0, 0, 0.38);
}

.last-action {
  padding: 10px 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
}

.action-time {
  margin-left: auto;
  color: rgba(0, 0, 0, 0.32);
}

.warning-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
