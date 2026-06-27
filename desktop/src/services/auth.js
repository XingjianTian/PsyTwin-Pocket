import { requestPocket, isSuccessResponse } from './pocket';

export async function loginByPassword(phone, password) {
  try {
    const response = await requestPocket({
      method: 'POST',
      url: '/auth/login/password',
      data: {
        phone,
        password,
      },
    });

    if (!isSuccessResponse(response)) {
      return {
        ok: false,
        reason: 'business',
        message: response?.message || '登录失败',
      };
    }

    return {
      ok: true,
      data: response.data || {},
    };
  } catch (error) {
    return {
      ok: false,
      reason: error?.response ? 'business' : 'network',
      message: error?.response?.data?.message || error?.message || '登录失败',
    };
  }
}

export async function getCurrentUser() {
  try {
    const response = await requestPocket({
      method: 'GET',
      url: '/auth/me',
    });

    if (!isSuccessResponse(response)) {
      return null;
    }

    return response.data || null;
  } catch (error) {
    return null;
  }
}
