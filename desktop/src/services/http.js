import axios from 'axios';
import { isTauri } from '@tauri-apps/api/core';
import { fetch as tauriFetch } from '@tauri-apps/plugin-http';

import { getBaseUrl, isMockMode } from './config';
import { getStorage } from './storage';

const REQUEST_TIMEOUT = 30000;

const webHttp = axios.create({
  timeout: REQUEST_TIMEOUT,
});

function isAbsoluteUrl(url = '') {
  return /^https?:\/\//i.test(url);
}

function ensureTrailingSlash(url = '') {
  return url.endsWith('/') ? url : `${url}/`;
}

function stripLeadingSlash(path = '') {
  return String(path).replace(/^\/+/, '');
}

function buildHeaders(requestConfig) {
  const token = getStorage('token', '');
  const headers = {
    'Content-Type': 'application/json',
    ...(requestConfig.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function normalizeRequestConfig(requestConfig = {}) {
  const method = String(requestConfig.method || 'GET').toUpperCase();
  const url = requestConfig.url || '';
  const baseURL = requestConfig.baseURL
    || (isMockMode() || isAbsoluteUrl(url) ? '' : getBaseUrl());

  return {
    ...requestConfig,
    method,
    url,
    baseURL,
    timeout: requestConfig.timeout || REQUEST_TIMEOUT,
    headers: buildHeaders(requestConfig),
  };
}

function buildAbsoluteBaseUrl(baseURL = '') {
  if (!baseURL) {
    return `${window.location.origin}/`;
  }

  if (isAbsoluteUrl(baseURL)) {
    return ensureTrailingSlash(baseURL);
  }

  return new URL(ensureTrailingSlash(baseURL), window.location.origin).toString();
}

function buildRequestUrl(requestConfig) {
  const { baseURL, url, params } = requestConfig;
  const targetUrl = isAbsoluteUrl(url)
    ? new URL(url)
    : new URL(stripLeadingSlash(url), buildAbsoluteBaseUrl(baseURL));

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    targetUrl.searchParams.set(key, String(value));
  });

  return targetUrl.toString();
}

async function parseResponseBody(response) {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function createHttpError(message, status, data) {
  const error = new Error(message || '请求失败');
  error.response = {
    status,
    data,
  };
  return error;
}

async function requestViaTauri(requestConfig) {
  const { method, headers, timeout, data } = requestConfig;
  const requestUrl = buildRequestUrl(requestConfig);
  const init = {
    method,
    headers,
    connectTimeout: timeout,
  };

  if (!['GET', 'HEAD'].includes(method) && data !== undefined) {
    init.body = typeof data === 'string' ? data : JSON.stringify(data);
  }

  const response = await tauriFetch(requestUrl, init);
  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw createHttpError(payload?.message || response.statusText, response.status, payload);
  }

  return payload;
}

async function requestViaWeb(requestConfig) {
  const response = await webHttp.request(requestConfig);
  return response.data;
}

export async function request(requestConfig) {
  const nextConfig = normalizeRequestConfig(requestConfig);

  // Tauri 安装版使用原生 HTTP，绕过 WebView 的浏览器级 CORS 限制。
  if (isTauri() && !isMockMode()) {
    return requestViaTauri(nextConfig);
  }

  return requestViaWeb(nextConfig);
}

export default {
  request,
};
