<template>
  <section class="appt-page">
    <div class="appt-header">
      <div class="header-title">心理健康预约</div>
      <div class="header-stats">
        <div class="stat-item">
          <div class="stat-num available-color">{{ stats.available }}</div>
          <div class="stat-label">可预约</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num busy-color">{{ stats.busy }}</div>
          <div class="stat-label">使用中</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">{{ stats.total }}</div>
          <div class="stat-label">总资源</div>
        </div>
      </div>
    </div>

    <div class="appt-tabs">
      <button
        type="button"
        class="tab-item"
        :class="{ 'tab-active': currentTab === 'services' }"
        @click="currentTab = 'services'"
      >
        <span>可预约资源</span>
      </button>
      <button
        type="button"
        class="tab-item"
        :class="{ 'tab-active': currentTab === 'records' }"
        @click="currentTab = 'records'"
      >
        <span>我的预约</span>
        <span
          v-if="pendingCount > 0"
          class="tab-badge"
        >
          {{ pendingCount }}
        </span>
      </button>
    </div>

    <div
      v-if="currentTab === 'services'"
      class="tab-content"
    >
      <div class="filter-bar">
        <button
          v-for="item in typeFilters"
          :key="item.value"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip-active': activeFilter === item.value }"
          @click="activeFilter = item.value"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="room-list">
        <article
          v-for="item in filteredServices"
          :key="item.id"
          class="room-card"
        >
          <div class="room-card-header">
            <div
              class="room-icon-wrap"
              :class="`room-icon-${item.type}`"
            >
              <component :is="serviceIcon(item.type)" />
            </div>
            <div class="room-info">
              <div class="room-name">{{ item.name }}</div>
              <div class="room-location">
                <LocationIcon />
                <span>{{ item.location }}</span>
              </div>
            </div>
            <div
              class="status-badge"
              :class="`status-${item.status}`"
            >
              <div class="status-dot"></div>
              <span>{{ statusLabel(item.status) }}</span>
            </div>
          </div>

          <div
            v-if="item.devices.length"
            class="device-list"
          >
            <div
              v-for="device in item.devices"
              :key="device.name"
              class="device-tag"
            >
              <div
                class="device-dot"
                :class="device.online ? 'device-dot-online' : 'device-dot-offline'"
              ></div>
              <span>{{ device.name }}</span>
            </div>
          </div>

          <div
            v-if="item.status === 'busy' && item.currentUser"
            class="session-info"
          >
            <div class="session-user">
              <UserIcon />
              <span>{{ item.currentUser.name }}（{{ item.currentUser.studentId }}）</span>
            </div>
            <div class="session-plan">
              <span class="plan-label">干预方案：</span>
              <span>{{ item.currentUser.plan }}</span>
            </div>
            <div class="session-progress">
              <div class="progress-info">
                <span>已使用 {{ item.currentUser.usedMinutes }} 分钟</span>
                <span>共 {{ item.currentUser.totalMinutes }} 分钟</span>
              </div>
              <div class="progress-bar-wrap">
                <div
                  class="progress-bar-fill"
                  :style="{ width: `${(item.currentUser.usedMinutes / item.currentUser.totalMinutes) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="room-desc">{{ item.description }} · {{ item.duration }}分钟/次</div>

          <div class="room-actions">
            <button
              v-if="item.status === 'available'"
              type="button"
              class="btn-primary"
              @click="openForm(item)"
            >
              <AddIcon />
              <span>立即预约</span>
            </button>
            <div
              v-else-if="item.status === 'busy'"
              class="btn-secondary"
            >
              <span>预约下一时段</span>
            </div>
            <div
              v-else
              class="btn-disabled"
            >
              <span>暂不可用</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div
      v-else
      class="tab-content"
    >
      <div class="filter-bar">
        <button
          v-for="item in statusFilters"
          :key="item.value"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip-active': activeStatusFilter === item.value }"
          @click="activeStatusFilter = item.value"
        >
          {{ item.label }}
        </button>
      </div>

      <div
        v-if="filteredRecords.length"
        class="record-list"
      >
        <article
          v-for="item in filteredRecords"
          :key="item.id"
          class="record-card"
        >
          <div
            class="record-strip"
            :class="`record-strip-${item.status}`"
          ></div>
          <div class="record-body">
            <div class="record-header">
              <div
                class="record-icon-wrap"
                :class="`record-icon-${item.serviceType}`"
              >
                <component :is="serviceIcon(item.serviceType)" />
              </div>
              <div class="record-title-wrap">
                <div class="record-service-name">{{ item.serviceName }}</div>
                <div class="record-location">{{ item.location }}</div>
              </div>
              <div
                class="record-status-tag"
                :class="`tag-${item.status}`"
              >
                {{ recordStatusLabel(item.status) }}
              </div>
            </div>

            <div class="record-datetime">
              <div class="datetime-item">
                <CalendarIcon />
                <span>{{ item.date }}</span>
              </div>
              <div class="datetime-item">
                <TimeIcon />
                <span>{{ item.time }}</span>
              </div>
              <div
                v-if="item.counselor"
                class="datetime-item"
              >
                <UserIcon />
                <span>{{ item.counselor }}</span>
              </div>
            </div>

            <div
              v-if="item.reason"
              class="record-reason"
            >
              <span class="reason-label">事由：</span>
              <span>{{ item.reason }}</span>
            </div>

            <div
              v-if="item.cancelable"
              class="record-actions"
            >
              <button
                type="button"
                class="btn-cancel"
                @click="cancelRecord(item.id)"
              >
                取消预约
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div
      v-if="showForm"
      class="form-mask"
      @click="showForm = false"
    ></div>
    <section
      v-if="showForm"
      class="form-popup form-popup-show"
    >
      <div class="form-handle-bar"></div>
      <div class="form-header">
        <div class="form-title">预约 {{ formData.serviceName }}</div>
        <div class="form-header-actions">
          <button
            type="button"
            class="btn-confirm"
            @click="submitForm"
          >
            确认预约
          </button>
          <button
            type="button"
            class="form-close-btn"
            @click="showForm = false"
          >
            <CloseIcon />
          </button>
        </div>
      </div>

      <div class="form-body">
        <section class="form-section">
          <div class="form-label">
            <CalendarIcon />
            <span>选择日期</span>
          </div>
          <input
            v-model="formData.date"
            class="form-picker-input"
            type="date"
          />
        </section>

        <section class="form-section">
          <div class="form-label">
            <TimeIcon />
            <span>选择时间</span>
          </div>
          <div class="time-grid">
            <button
              v-for="item in currentAvailableTimes"
              :key="item"
              type="button"
              class="time-chip"
              :class="{ 'time-chip-active': formData.time === item }"
              @click="formData.time = item"
            >
              {{ item }}
            </button>
          </div>
        </section>

        <section class="form-section">
          <div class="form-label">
            <EditIcon />
            <span>预约事由（选填）</span>
          </div>
          <textarea
            v-model="formData.reason"
            class="form-textarea"
            placeholder="简单描述您的困扰或需求..."
            maxlength="200"
          ></textarea>
          <div class="textarea-count">{{ formData.reason.length }}/200</div>
        </section>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  AddIcon,
  CalendarIcon,
  CloseIcon,
  EditIcon,
  LocationIcon,
  TimeIcon,
  TvIcon,
  UsergroupIcon,
  UserIcon,
  UserTalkIcon,
} from 'tdesign-icons-vue-next';

import { getAppointmentOverview } from '@/services/appointment';

const services = ref([]);
const records = ref([]);
const stats = reactive({
  available: 0,
  busy: 0,
  total: 0,
});
const currentTab = ref('services');
const activeFilter = ref('all');
const activeStatusFilter = ref('all');
const showForm = ref(false);
const currentAvailableTimes = ref([]);
const formData = reactive({
  date: '',
  reason: '',
  serviceId: null,
  serviceName: '',
  time: '',
});

const typeFilters = [
  { label: '全部', value: 'all' },
  { label: '线下咨询', value: 'counseling' },
  { label: 'VR 体验', value: 'vr' },
  { label: '团体辅导', value: 'group' },
];

const statusFilters = [
  { label: '全部', value: 'all' },
  { label: '待就诊', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已完成', value: 'completed' },
  { label: '已取消', value: 'cancelled' },
];

const filteredServices = computed(() => {
  if (activeFilter.value === 'all') return services.value;
  return services.value.filter((item) => item.type === activeFilter.value);
});

const filteredRecords = computed(() => {
  if (activeStatusFilter.value === 'all') return records.value;
  return records.value.filter((item) => item.status === activeStatusFilter.value);
});

const pendingCount = computed(
  () => records.value.filter((item) => item.status === 'pending' || item.status === 'confirmed').length,
);

function serviceIcon(type) {
  if (type === 'vr') return TvIcon;
  if (type === 'group') return UsergroupIcon;
  return UserTalkIcon;
}

function statusLabel(status) {
  if (status === 'available') return '可用';
  if (status === 'busy') return '使用中';
  return '维护中';
}

function recordStatusLabel(status) {
  if (status === 'pending') return '待就诊';
  if (status === 'confirmed') return '已确认';
  if (status === 'completed') return '已完成';
  return '已取消';
}

function openForm(item) {
  formData.serviceId = item.id;
  formData.serviceName = item.name;
  formData.date = '';
  formData.time = '';
  formData.reason = '';
  currentAvailableTimes.value = item.availableTimes || [];
  showForm.value = true;
}

function submitForm() {
  if (!formData.date || !formData.time) {
    MessagePlugin.warning('请选择日期和时间');
    return;
  }

  records.value = [
    {
      id: Date.now(),
      serviceId: formData.serviceId,
      serviceName: formData.serviceName,
      serviceType: services.value.find((item) => item.id === formData.serviceId)?.type || 'counseling',
      date: formData.date,
      time: formData.time,
      status: 'pending',
      reason: formData.reason,
      cancelable: true,
      location: services.value.find((item) => item.id === formData.serviceId)?.location || '',
      counselor: '待分配',
    },
    ...records.value,
  ];
  showForm.value = false;
  currentTab.value = 'records';
  MessagePlugin.success('预约成功');
}

function cancelRecord(id) {
  records.value = records.value.map((item) =>
    item.id === id ? { ...item, status: 'cancelled', cancelable: false } : item,
  );
  MessagePlugin.success('已取消');
}

async function loadAppointmentData() {
  const overview = await getAppointmentOverview();
  services.value = overview.services || [];
  records.value = overview.records || [];
  Object.assign(stats, overview.stats || { available: 0, busy: 0, total: 0 });
}

onMounted(() => {
  loadAppointmentData();
});
</script>

<style scoped lang="less">
.appt-page {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #f3f3f3;
}

.appt-header {
  padding: 24px 16px 20px;
  background: linear-gradient(135deg, #7c3aed 0%, #9f67fa 100%);
}

.header-title {
  margin-bottom: 16px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.header-stats {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.stat-num.available-color {
  color: #a7f3d0;
}

.stat-num.busy-color {
  color: #fde68a;
}

.stat-label {
  color: rgba(255, 255, 255, 0.72);
  font-size: 11px;
}

.stat-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.25);
}

.appt-tabs {
  display: flex;
  flex-shrink: 0;
  background: #ffffff;
  border-bottom: 1px solid #ececec;
  z-index: 2;
}

.tab-item {
  position: relative;
  display: inline-flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 4px;
  height: 44px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
}

.tab-item.tab-active {
  color: #7c3aed;
  font-weight: 600;
}

.tab-item.tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 28px;
  height: 3px;
  border-radius: 999px;
  transform: translateX(-50%);
  background: #7c3aed;
}

.tab-badge {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
}

.tab-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-bottom: 88px;
}

.filter-bar {
  display: flex;
  gap: 8px;
  padding: 12px 12px 4px;
  overflow: auto;
}

.filter-chip {
  flex-shrink: 0;
  height: 28px;
  padding: 0 12px;
  border: 1px solid #e7e7e7;
  border-radius: 14px;
  background: #fff;
  color: rgba(0, 0, 0, 0.62);
  font-size: 12px;
}

.filter-chip-active {
  border-color: #7c3aed;
  background: #ede9fe;
  color: #7c3aed;
  font-weight: 600;
}

.room-list,
.record-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px 12px 12px;
}

.room-card,
.record-card {
  overflow: hidden;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
}

.room-card {
  padding: 14px;
}

.room-card-header,
.record-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.room-icon-wrap,
.record-icon-wrap {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  flex-shrink: 0;
  font-size: 18px;
}

.room-icon-counseling,
.record-icon-counseling {
  background: #ede9fe;
  color: #7c3aed;
}

.room-icon-vr,
.record-icon-vr {
  background: #dbeafe;
  color: #3b82f6;
}

.room-icon-group,
.record-icon-group {
  background: #d1fae5;
  color: #10b981;
}

.room-info,
.record-title-wrap {
  flex: 1;
  min-width: 0;
}

.room-name,
.record-service-name {
  color: rgba(0, 0, 0, 0.88);
  font-size: 15px;
  font-weight: 600;
}

.room-location,
.record-location {
  display: flex;
  align-items: center;
  gap: 3px;
  color: rgba(0, 0, 0, 0.42);
  font-size: 11px;
}

.room-location :deep(svg) {
  font-size: 14px;
}

.status-badge,
.record-status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;
  flex-shrink: 0;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-available {
  background: #d1fae5;
  color: #10b981;
}

.status-available .status-dot {
  background: #10b981;
}

.status-busy {
  background: #fef3c7;
  color: #f59e0b;
}

.status-busy .status-dot {
  background: #f59e0b;
}

.status-maintenance {
  background: #fee2e2;
  color: #ef4444;
}

.status-maintenance .status-dot {
  background: #ef4444;
}

.device-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.device-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  background: #f3f3f3;
  color: rgba(0, 0, 0, 0.62);
  font-size: 11px;
}

.device-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.device-dot-online {
  background: #10b981;
}

.device-dot-offline {
  background: #9ca3af;
}

.session-info {
  margin-bottom: 10px;
  padding: 12px;
  border-radius: 10px;
  background: #fef3c7;
}

.session-user,
.progress-info,
.datetime-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.session-user {
  margin-bottom: 6px;
  color: rgba(0, 0, 0, 0.82);
  font-size: 13px;
  font-weight: 600;
}

.session-plan,
.room-desc,
.progress-info,
.record-reason,
.datetime-item {
  color: rgba(0, 0, 0, 0.52);
  font-size: 11px;
  line-height: 1.6;
}

.progress-info {
  justify-content: space-between;
}

.progress-bar-wrap {
  overflow: hidden;
  height: 6px;
  margin-top: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 999px;
  background: #f59e0b;
}

.room-actions,
.record-actions {
  margin-top: 12px;
}

.btn-primary,
.btn-secondary,
.btn-disabled,
.btn-cancel,
.btn-confirm,
.comment-send-btn,
.warning-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 36px;
  padding: 0 14px;
  border-radius: 18px;
  font-size: 12px;
  font-weight: 600;
}

.btn-primary,
.btn-confirm {
  background: linear-gradient(135deg, #7c3aed 0%, #9f67fa 100%);
  color: #fff;
}

.btn-secondary {
  background: #f3f4f6;
  color: rgba(0, 0, 0, 0.72);
}

.btn-disabled {
  background: #f3f4f6;
  color: rgba(0, 0, 0, 0.36);
}

.btn-cancel {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
}

.record-card {
  display: flex;
}

.record-strip {
  width: 4px;
  flex-shrink: 0;
}

.record-strip-pending {
  background: #3b82f6;
}

.record-strip-confirmed {
  background: #7c3aed;
}

.record-strip-completed {
  background: #10b981;
}

.record-strip-cancelled {
  background: #9ca3af;
}

.record-body {
  flex: 1;
  padding: 14px;
}

.record-datetime {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}

.tag-pending {
  background: #dbeafe;
  color: #3b82f6;
}

.tag-confirmed {
  background: #ede9fe;
  color: #7c3aed;
}

.tag-completed {
  background: #d1fae5;
  color: #10b981;
}

.tag-cancelled {
  background: #f3f4f6;
  color: #9ca3af;
}

.form-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  z-index: 10;
}

.form-popup {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 11;
  padding: 10px 14px 20px;
  border-radius: 10px 10px 0 0;
  background: #fff;
}

.form-handle-bar {
  width: 40px;
  height: 4px;
  margin: 0 auto 12px;
  border-radius: 999px;
  background: #e5e7eb;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.form-title {
  color: rgba(0, 0, 0, 0.88);
  font-size: 17px;
  font-weight: 700;
}

.form-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-close-btn {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  color: rgba(0, 0, 0, 0.5);
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-height: 48vh;
  margin-top: 14px;
  overflow: auto;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.74);
  font-size: 13px;
  font-weight: 600;
}

.form-picker-input,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  background: #f9fafb;
  font-size: 14px;
}

.form-textarea {
  min-height: 92px;
  resize: none;
}

.time-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-chip {
  height: 34px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: rgba(0, 0, 0, 0.66);
  font-size: 12px;
}

.time-chip-active {
  border-color: #7c3aed;
  background: #ede9fe;
  color: #7c3aed;
  font-weight: 600;
}

.textarea-count {
  margin-top: 6px;
  color: rgba(0, 0, 0, 0.36);
  text-align: right;
  font-size: 11px;
}
</style>
