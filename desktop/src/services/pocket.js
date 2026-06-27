import { getBaseUrl } from './config';
import http from './http';

export function isSuccessResponse(response) {
  return Boolean(response) && (response.code === 0 || response.code === 200 || response.success === true);
}

export async function requestPocket(config) {
  return http.request({
    baseURL: getBaseUrl(),
    ...config,
  });
}

export function formatNotificationTime(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

export function normalizeCollection(value) {
  if (Array.isArray(value)) {
    return value;
  }

  return [];
}

export function unwrapData(response, expectedKeys = []) {
  const payload = response?.data;

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return payload;
  }

  if (expectedKeys.length > 0 && expectedKeys.some((key) => key in payload)) {
    return payload;
  }

  const nestedPayload = payload.data;
  if (
    nestedPayload
    && typeof nestedPayload === 'object'
    && !Array.isArray(nestedPayload)
    && (expectedKeys.length === 0 || expectedKeys.some((key) => key in nestedPayload))
  ) {
    return nestedPayload;
  }

  return payload;
}
