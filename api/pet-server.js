/**
 * 心宠服务器同步 API
 * ==================
 * 封装与 pet-server 的通信，负责小程序启动时拉取状态、关闭时推送状态。
 */

import config from '../config/index';

const { petSyncUrl } = config;

/**
 * 从服务器拉取心宠当前状态（包含离线进度计算）
 * @param {string} userId 用户ID（建议用 openid 或本地生成的 uuid）
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function pullPetState(userId) {
  if (!userId) {
    return { success: false, error: '缺少 userId' };
  }

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `${petSyncUrl}/api/pet/pull`,
        method: 'POST',
        data: { userId },
        dataType: 'json',
        header: { 'content-type': 'application/json' },
        success(res) {
          resolve(res.data);
        },
        fail(err) {
          reject(err);
        },
      });
    });

    if (response.code !== 0) {
      return { success: false, error: response.message || '拉取失败' };
    }

    console.log('[PetServer] pull 成功:', response.data);
    return { success: true, data: response.data };
  } catch (err) {
    console.error('[PetServer] pull 失败:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

/**
 * 将当前心宠状态推送到服务器
 * @param {string} userId 用户ID
 * @param {object} state 当前状态对象
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function pushPetState(userId, state) {
  if (!userId || !state) {
    return { success: false, error: '缺少 userId 或 state' };
  }

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `${petSyncUrl}/api/pet/push`,
        method: 'POST',
        data: { userId, state },
        dataType: 'json',
        header: { 'content-type': 'application/json' },
        success(res) {
          resolve(res.data);
        },
        fail(err) {
          reject(err);
        },
      });
    });

    if (response.code !== 0) {
      return { success: false, error: response.message || '推送失败' };
    }

    console.log('[PetServer] push 成功');
    return { success: true };
  } catch (err) {
    console.error('[PetServer] push 失败:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

export default {
  pullPetState,
  pushPetState,
};
