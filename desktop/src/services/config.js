import { getStorage } from './storage';

export const DEFAULT_MODE = 'real';
export const DEFAULT_BASE_URL = import.meta.env.DEV ? '/api/pocket' : 'http://localhost:3000/api/pocket';

export function getRuntimeMode() {
  return getStorage('mode', DEFAULT_MODE);
}

export function isMockMode() {
  return getRuntimeMode() === 'mock';
}

export function getBaseUrl() {
  const storedBaseUrl = getStorage('baseUrl', '');

  if (!storedBaseUrl) {
    return DEFAULT_BASE_URL;
  }

  // 开发态优先走 Vite 代理，规避 Sentinel 当前 Pocket API 未放行 CORS 的问题。
  if (import.meta.env.DEV && storedBaseUrl === 'http://localhost:3000/api/pocket') {
    return '/api/pocket';
  }

  return storedBaseUrl;
}
