import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { loginByPassword } from '@/services/auth';
import { isMockMode } from '@/services/config';
import { clearStorage, getStorage, setStorage } from '@/services/storage';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStorage('token', ''));
  const role = ref(getStorage('role', 'student'));
  const phoneNumber = ref(getStorage('phoneNumber', ''));
  const userName = ref(getStorage('userName', role.value === 'teacher' ? '王老师' : '张同学'));

  const isLoggedIn = computed(() => Boolean(token.value));

  async function login(nextRole = 'student', nextPhoneNumber = '', password = '') {
    const response = await loginByPassword(nextPhoneNumber, password);

    if (!response.ok && response.reason === 'business') {
      return {
        ok: false,
        message: response.message,
      };
    }

    if (response.ok) {
      const user = response.data.user || {};

      token.value = response.data.token || '';
      role.value = nextRole;
      phoneNumber.value = nextPhoneNumber;
      userName.value = user.nickname || user.name || (nextRole === 'teacher' ? '王老师' : '张同学');

      setStorage('token', token.value);
      setStorage('role', role.value);
      setStorage('phoneNumber', phoneNumber.value);
      setStorage('userName', userName.value);

      return {
        ok: true,
        mode: 'remote',
      };
    }

    if (!isMockMode()) {
      return {
        ok: false,
        message: response.message || '真实登录失败',
      };
    }

    token.value = 'desktop-demo-token';
    role.value = nextRole;
    phoneNumber.value = nextPhoneNumber;
    userName.value = nextRole === 'teacher' ? '王老师' : '张同学';

    setStorage('token', token.value);
    setStorage('role', role.value);
    setStorage('phoneNumber', phoneNumber.value);
    setStorage('userName', userName.value);

    return {
      ok: true,
      mode: 'demo',
      message: response.message,
    };
  }

  function setRole(nextRole) {
    role.value = nextRole;
    userName.value = nextRole === 'teacher' ? '王老师' : '张同学';
    setStorage('role', role.value);
    setStorage('userName', userName.value);
  }

  function logout() {
    token.value = '';
    role.value = 'student';
    phoneNumber.value = '';
    userName.value = '演示用户';
    clearStorage();
  }

  return {
    isLoggedIn,
    login,
    logout,
    phoneNumber,
    role,
    setRole,
    token,
    userName,
  };
});
