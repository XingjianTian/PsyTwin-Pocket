import request from './request';

const OPENCLAW_API_URL = 'http://localhost:3000/api/openclaw/pocket/chat';
const DEFAULT_TOKEN = '123456';

function wrapRequestWithTimeout(promise, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('请求超时，请检查网络连接'));
    }, timeoutMs);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function sendToTherapist(message, token = DEFAULT_TOKEN) {
  if (!message || !message.trim()) {
    return { success: false, error: '消息内容不能为空' };
  }

  console.log('[AI] sendToTherapist 请求:', { agentId: 'Therapist', message: message.trim(), token });

  try {
    const response = await wrapRequestWithTimeout(
      new Promise((resolve, reject) => {
        wx.request({
          url: OPENCLAW_API_URL,
          method: 'POST',
          data: {
            agentId: 'Therapist',
            message: message.trim(),
            token,
          },
          dataType: 'json',
          header: { 'content-type': 'application/json' },
          success(res) {
            console.log('[AI] wx.request success:', res.statusCode, res.data);
            resolve(res.data);
          },
          fail(err) {
            console.error('[AI] wx.request fail:', err);
            reject(err);
          },
        });
      }),
    );

    console.log('[AI] sendToTherapist 响应:', JSON.stringify(response).substring(0, 500));

    if (!response || typeof response !== 'object') {
      return { success: false, error: '响应格式异常' };
    }

    if (response.error) {
      return { success: false, error: response.error.message || '请求失败' };
    }

    return { success: true, data: response };
  } catch (err) {
    console.error('[AI] sendToTherapist error:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

export function extractResponseText(response) {
  console.log('[AI] extractResponseText 输入:', JSON.stringify(response).substring(0, 300));

  if (!response || typeof response !== 'object') {
    console.log('[AI] extractResponseText: response 不是对象');
    return '';
  }

  if (response.response && typeof response.response === 'string') {
    const text = response.response;
    console.log('[AI] extractResponseText 输出 (直接):', text.substring(0, 200));
    return text;
  }

  if (!response.output || !Array.isArray(response.output) || !response.output[0]) {
    console.log('[AI] extractResponseText: output 结构异常', response.output);
    return '';
  }

  const message = response.output[0];
  if (!message.content || !Array.isArray(message.content)) {
    console.log('[AI] extractResponseText: content 结构异常');
    return '';
  }

  const textContent = message.content.find((c) => c.type === 'output_text');
  const text = textContent && textContent.text ? textContent.text : '';
  console.log('[AI] extractResponseText 输出:', text.substring(0, 200));
  return text;
}

export async function getChatMessages(sessionId, options = {}) {
  const { beforeId, limit = 20 } = options;

  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (beforeId) {
      params.append('beforeId', beforeId);
    }

    const response = await request(`/student/chat/${sessionId}/messages?${params.toString()}`, 'GET');

    if (response.code !== 0 && response.code !== 200) {
      return { success: false, error: response.message || '获取消息失败' };
    }

    return { success: true, data: (response.data && response.data.messages) || [] };
  } catch (err) {
    console.error('[AI] getChatMessages error:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

export async function getEmotionTags() {
  try {
    const response = await request('/student/chat/emotion-tags', 'GET');

    if (response.code !== 0 && response.code !== 200) {
      return { success: false, error: response.message || '获取情绪标签失败' };
    }

    return { success: true, data: response.data || [] };
  } catch (err) {
    console.error('[AI] getEmotionTags error:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

export default {
  sendToTherapist,
  extractResponseText,
  getChatMessages,
  getEmotionTags,
};
