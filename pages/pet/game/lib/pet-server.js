/**
 * 心宠服务器同步 API
 * ==================
 * 封装与 pet-server 的通信，负责小程序启动时拉取状态、关闭时推送状态。
 */

import config from '../../../../config/index';

const { demoMode, petSyncUrl, petDemoUserId } = config;

function createDemoDiaryMap() {
  const map = {};
  const templates = [
    ['08:20', 'ACTIVITY', '清晨散步', '今天在校园里慢慢走了一圈，空气很舒服。'],
    ['12:40', 'ITEM_FOUND', '发现一片叶子', '捡到了一片形状很特别的叶子，想把它收藏起来。'],
    ['18:30', 'SOCIAL', '遇见新朋友', '在草坪上认识了新的小伙伴，一起聊了很久。'],
    ['21:10', 'AI_DIARY', '今天的小结', '今天有认真生活，也有好好休息，明天继续加油。'],
  ];
  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateKey = date.toISOString().split('T')[0];
    map[dateKey] = templates.map((item, index) => ({
      id: `pet-diary-${dayOffset}-${index}`,
      time: item[0],
      type: item[1],
      title: item[2],
      content: item[3],
      sceneId: index % 2 === 0 ? 'bedroom' : 'picnic_lawn',
      dateKey,
      mood: 82,
      energy: 76,
      source: 'demo',
    }));
  }
  return map;
}

function createDemoEvents() {
  return [
    {
      id: 'demo-event-study',
      type: 'daily',
      category: 'study',
      severity: 'medium',
      title: '复习任务有点多',
      description: '心宠看起来有些紧张，想和你一起把任务拆成更小的步骤。',
      status: 'pending',
      deadline: Date.now() + 12 * 60 * 60 * 1000,
      options: [
        { id: 'plan', text: '一起列个小计划', hint: '把任务拆分后逐个完成' },
        { id: 'rest', text: '先休息十分钟', hint: '短暂休息后再重新开始' },
      ],
    },
    {
      id: 'demo-event-social',
      type: 'daily',
      category: 'social',
      severity: 'low',
      title: '想认识新朋友',
      description: '心宠在草坪上遇见了新伙伴，想邀请你一起打招呼。',
      status: 'pending',
      deadline: Date.now() + 24 * 60 * 60 * 1000,
      options: [
        { id: 'hello', text: '主动打个招呼', hint: '一次轻松友好的尝试' },
        { id: 'observe', text: '先在旁边看看', hint: '按自己的节奏来就好' },
      ],
    },
  ];
}

function createDemoPetState(userId = petDemoUserId) {
  const now = Date.now();
  return {
    userId,
    mood: 82,
    energy: 76,
    social: 69,
    sceneId: 'bedroom',
    activity: '正在房间里放松',
    activityStartTime: now - 20 * 60 * 1000,
    activityDuration: 45,
    stateVersion: now,
    updatedAt: now,
    coins: 268,
    diaryDataMap: createDemoDiaryMap(),
    helpEvents: createDemoEvents(),
    activityLog: [
      { id: 'activity-1', time: '08:20', icon: 'sunny', title: '晨间散步', description: '在校园里呼吸了新鲜空气' },
      { id: 'activity-2', time: '12:40', icon: 'search', title: '发现收藏', description: '捡到一片形状特别的叶子' },
      { id: 'activity-3', time: '18:30', icon: 'usergroup', title: '认识朋友', description: '在草坪上和新伙伴聊天' },
    ],
  };
}

/**
 * 从服务器拉取心宠当前状态（包含离线进度计算）
 * @param {string} userId 用户ID（建议用 openid 或本地生成的 uuid）
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function pullPetState(userId) {
  if (demoMode) {
    return { success: true, data: { state: createDemoPetState(userId || petDemoUserId) } };
  }

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
 * 读取服务端权威心宠状态。
 * @param {string} userId 演示心宠用户 ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function fetchPetStatus(userId = petDemoUserId) {
  if (demoMode) {
    const state = createDemoPetState(userId);
    return {
      success: true,
      data: {
        state,
        serverTime: state.updatedAt,
        updatedAt: state.updatedAt,
        stateVersion: state.stateVersion,
      },
    };
  }

  if (!userId) {
    return { success: false, error: '缺少 userId' };
  }

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `${petSyncUrl}/api/pet/status`,
        method: 'GET',
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
      return { success: false, error: response.message || '读取状态失败' };
    }

    return { success: true, data: response.data };
  } catch (err) {
    console.error('[PetServer] status 读取失败:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

export function getConfiguredPetUserId() {
  return petDemoUserId;
}

/**
 * 将当前心宠状态推送到服务器
 * @param {string} userId 用户ID
 * @param {object} state 当前状态对象
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function pushPetState(userId, state) {
  if (demoMode) return { success: true };

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

/**
 * 从服务器获取帮助事件列表（预警模拟）
 * @param {string} userId 用户ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function fetchPetEvents(userId) {
  if (demoMode) return { success: true, data: { events: createDemoEvents() } };

  if (!userId) {
    return { success: false, error: '缺少 userId' };
  }

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `${petSyncUrl}/api/pet/events`,
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
      return { success: false, error: response.message || '获取事件失败' };
    }

    console.log('[PetServer] fetchEvents 成功:', response.data);
    return { success: true, data: response.data };
  } catch (err) {
    console.error('[PetServer] fetchEvents 失败:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

/**
 * 从服务器获取随机测评题目
 * @param {string} category 事件分类: emotion | study | social
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function fetchPetQuiz(category) {
  if (demoMode) return { success: false, error: '演示模式使用本地量表' };

  if (!category) {
    return { success: false, error: '缺少 category' };
  }

  try {
    const response = await new Promise((resolve, reject) => {
      wx.request({
        url: `${petSyncUrl}/api/pet/quiz`,
        method: 'POST',
        data: { category },
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
      return { success: false, error: response.message || '获取题目失败' };
    }

    console.log('[PetServer] fetchQuiz 成功:', response.data);
    return { success: true, data: response.data };
  } catch (err) {
    console.error('[PetServer] fetchQuiz 失败:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

export default {
  pullPetState,
  fetchPetStatus,
  pushPetState,
  fetchPetEvents,
  fetchPetQuiz,
  getConfiguredPetUserId,
};
