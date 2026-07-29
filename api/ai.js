import request from './request';
import config from '../config/index';

const OPENCLAW_API_URL = config.baseUrl.replace('/api/pocket', '/api/openclaw/pocket/chat');
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

/**
 * 调用 OpenAI 兼容格式的大模型服务
 * @param {string} message 用户消息
 * @param {object} options 可选参数
 */
export async function sendToLLM(message, options = {}) {
  const { llm } = config;
  if (!llm || !llm.enabled) {
    return { success: false, error: 'LLM 未启用' };
  }

  // 自动 trim 首尾空白，避免复制粘贴时带入隐藏字符
  const apiKey = (llm.apiKey || '').trim();
  const baseUrl = (llm.baseUrl || '').trim();

  if (!baseUrl || !apiKey) {
    return { success: false, error: 'LLM 配置不完整，请检查 baseUrl 和 apiKey' };
  }

  if (!message || !message.trim()) {
    return { success: false, error: '消息内容不能为空' };
  }

  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const body = {
    model: llm.model,
    messages: [
      { role: 'system', content: options.systemPrompt || llm.systemPrompt || '' },
      { role: 'user', content: message.trim() },
    ],
    temperature: options.temperature ?? llm.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? llm.maxTokens ?? 1024,
  };

  console.log('[LLM] 请求:', { url, model: body.model, message: body.messages[0].content.substring(0, 100) });

  try {
    const response = await wrapRequestWithTimeout(
      new Promise((resolve, reject) => {
        wx.request({
          url,
          method: 'POST',
          data: body,
          dataType: 'json',
          header: {
            'content-type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          success(res) {
            console.log('[LLM] wx.request success:', res.statusCode);
            if (res.statusCode < 200 || res.statusCode >= 300) {
              reject(new Error((res.data && res.data.error && res.data.error.message) || `请求失败 (${res.statusCode})`));
              return;
            }
            resolve(res.data);
          },
          fail(err) {
            console.error('[LLM] wx.request fail:', err);
            reject(err);
          },
        });
      }),
      60000,
    );

    console.log('[LLM] 响应:', JSON.stringify(response).substring(0, 500));

    if (!response || typeof response !== 'object') {
      return { success: false, error: '响应格式异常' };
    }

    if (response.error) {
      return { success: false, error: response.error.message || JSON.stringify(response.error) };
    }

    return { success: true, data: response };
  } catch (err) {
    console.error('[LLM] sendToLLM error:', err);
    return { success: false, error: err.message || '网络请求失败' };
  }
}

export async function sendToTherapist(message, token = DEFAULT_TOKEN) {
  if (!message || !message.trim()) {
    return { success: false, error: '消息内容不能为空' };
  }

  // 启用自有 LLM 后不回退到 OpenClaw，避免配置缺失时出现无关的网络错误
  const { llm } = config;
  if (llm && llm.enabled) {
    return sendToLLM(message, {
      systemPrompt: llm.systemPrompt,
    });
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

  // OpenClaw 直接返回 response 字段
  if (response.response && typeof response.response === 'string') {
    const text = response.response;
    console.log('[AI] extractResponseText 输出 (直接):', text.substring(0, 200));
    return text;
  }

  // Anthropic / MiniMax 格式: content[] 中 type === 'text'
  if (response.content && Array.isArray(response.content)) {
    const textBlock = response.content.find((c) => c.type === 'text');
    if (textBlock && typeof textBlock.text === 'string') {
      const text = textBlock.text;
      console.log('[AI] extractResponseText 输出 (Anthropic):', text.substring(0, 200));
      return text;
    }
  }

  // OpenAI 兼容格式: choices[0].message.content
  if (response.choices && Array.isArray(response.choices) && response.choices[0]) {
    const choice = response.choices[0];
    if (choice.message && typeof choice.message.content === 'string') {
      const text = choice.message.content;
      console.log('[AI] extractResponseText 输出 (OpenAI):', text.substring(0, 200));
      return text;
    }
  }

  // OpenClaw 旧格式: output[0].content[]
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
  sendToLLM,
  extractResponseText,
  getChatMessages,
  getEmotionTags,
};
