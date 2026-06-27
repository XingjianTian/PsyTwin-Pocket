<template>
  <section class="login-container">
    <div class="login-header">
      <div class="gradient-bg">
        <div class="gradient-circle circle-1"></div>
        <div class="gradient-circle circle-2"></div>
        <div class="gradient-circle circle-3"></div>
      </div>

      <div class="brand-section">
        <div class="logo-wrapper">
          <div class="logo-icon">
            <img
              src="/psytwin.jpg"
              alt="心图 Logo"
            />
          </div>
        </div>
        <div class="brand-name">心图·口袋</div>
        <div class="brand-tagline">PsyTwin·Pocket</div>
      </div>
    </div>

    <div class="login-card">
      <h1 class="card-title">欢迎回来</h1>
      <p class="card-subtitle">请登录您的账号</p>

      <div class="input-group">
        <div class="input-label">
          <MobileIcon />
          <span>手机号</span>
        </div>
        <div class="input-wrapper">
          <span class="input-prefix">+86</span>
          <input
            v-model="phoneNumber"
            class="custom-input"
            type="text"
            maxlength="11"
            placeholder="请输入手机号"
          />
        </div>
      </div>

      <div class="input-group">
        <div class="input-label">
          <LockOnIcon />
          <span>密码</span>
        </div>
        <div class="input-wrapper">
          <input
            v-model="password"
            class="custom-input"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
          />
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            <BrowseIcon v-if="showPassword" />
            <BrowseOffIcon v-else />
          </button>
        </div>
      </div>

      <div class="role-section">
        <div class="section-title">选择身份</div>
        <div class="role-grid">
          <button
            type="button"
            class="role-card"
            :class="{ active: selectedRole === 'student' }"
            @click="selectedRole = 'student'"
          >
            <div class="role-icon-wrapper student-bg">
              <UserAvatarIcon />
            </div>
            <span class="role-name">学生</span>
            <span class="role-desc">Student</span>
            <CheckCircleFilledIcon
              v-if="selectedRole === 'student'"
              class="check-icon"
            />
          </button>

          <button
            type="button"
            class="role-card"
            :class="{ active: selectedRole === 'teacher' }"
            @click="selectedRole = 'teacher'"
          >
            <div class="role-icon-wrapper teacher-bg">
              <UserListIcon />
            </div>
            <span class="role-name">教职工</span>
            <span class="role-desc">Teacher</span>
            <CheckCircleFilledIcon
              v-if="selectedRole === 'teacher'"
              class="check-icon"
            />
          </button>
        </div>
      </div>

      <div class="login-button-wrapper">
        <button
          type="button"
          class="login-btn"
          :class="{ disabled: !canSubmit }"
          :disabled="!canSubmit"
          @click="handleLogin"
        >
          <span class="btn-text">登 录</span>
          <ArrowRightIcon class="btn-icon" />
        </button>
      </div>

      <div class="login-options">
        <button
          type="button"
          class="option-link"
          @click="showDeveloping('验证码登录')"
        >
          验证码登录
        </button>
        <div class="divider"></div>
        <button
          type="button"
          class="option-link"
          @click="showDeveloping('注册账号')"
        >
          注册账号
        </button>
      </div>
    </div>

    <div class="login-footer">
      <span class="footer-text">PsyTwin Pocket 心理健康服务平台</span>
      <span class="footer-version">v1.0.0</span>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import {
  ArrowRightIcon,
  BrowseIcon,
  BrowseOffIcon,
  CheckCircleFilledIcon,
  LockOnIcon,
  MobileIcon,
  UserAvatarIcon,
  UserListIcon,
} from 'tdesign-icons-vue-next';

import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const phoneNumber = ref('');
const password = ref('');
const selectedRole = ref('');
const showPassword = ref(false);
const loading = ref(false);

const canSubmit = computed(() => phoneNumber.value && password.value && selectedRole.value);

async function handleLogin() {
  if (!canSubmit.value) {
    MessagePlugin.warning('请填写手机号、密码并选择身份');
    return;
  }

  loading.value = true;
  const result = await authStore.login(selectedRole.value, phoneNumber.value, password.value);
  loading.value = false;

  if (!result.ok) {
    MessagePlugin.error(result.message || '登录失败');
    return;
  }

  if (result.mode === 'demo') {
    MessagePlugin.warning(`真实登录未接通，已回退演示模式：${result.message || '网络不可用'}`);
  }

  router.push(selectedRole.value === 'teacher' ? '/data-center' : '/home');
}

function showDeveloping(label) {
  MessagePlugin.info(`${label}开发中`);
}
</script>
