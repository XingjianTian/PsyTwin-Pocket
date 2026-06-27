import { getBaseUrl } from './config';
import http from './http';
import { isSuccessResponse, normalizeCollection, requestPocket, unwrapData } from './pocket';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '深夜了';
  if (hour < 11) return '早上好';
  if (hour < 13) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
}

const chips = [
  {
    id: 1,
    icon: 'heart',
    color: 'purple',
    title: '我想倾诉一下心情',
    desc: '好呀，我们聊聊吧',
    prompt: '我想聊聊今天的心情',
  },
  {
    id: 2,
    icon: 'help-circle',
    color: 'blue',
    title: '我感到焦虑',
    desc: '听起来你并不好受，找找应对方法',
    prompt: '我最近感到很焦虑和压力很大，想和你聊聊',
  },
  {
    id: 3,
    icon: 'moon',
    color: 'teal',
    title: '睡眠不好怎么办',
    desc: '失眠、多梦、睡不着的困扰',
    prompt: '我最近睡眠质量很差，有什么改善方法吗？',
  },
  {
    id: 4,
    icon: 'usergroup',
    color: 'green',
    title: '人际关系的烦恼',
    desc: '和朋友、室友、家人的矛盾',
    prompt: '我最近在人际关系上有些困扰，想和你聊聊',
  },
];

function getOpenClawUrl() {
  return getBaseUrl().replace('/api/pocket', '/api/openclaw/pocket/chat');
}

function extractResponseText(response) {
  if (!response || typeof response !== 'object') {
    return '';
  }

  if (typeof response.response === 'string') {
    return response.response;
  }

  const message = Array.isArray(response.output) ? response.output[0] : null;
  const contentList = Array.isArray(message?.content) ? message.content : [];
  const textContent = contentList.find((item) => item.type === 'output_text');
  return textContent?.text || '';
}

export async function getMessageOverview(userName = '同学') {
  try {
    const [userResponse, sessionResponse] = await Promise.all([
      requestPocket({
        method: 'GET',
        url: '/student/my/info',
      }),
      requestPocket({
        method: 'GET',
        url: '/student/message/sessions',
      }),
    ]);

    const userPayload = isSuccessResponse(userResponse) ? unwrapData(userResponse) || {} : {};
    const sessionsPayload = isSuccessResponse(sessionResponse) ? unwrapData(sessionResponse) : [];
    const remoteUserName = userPayload.nickname || userPayload.name || userName;
    const sessionData = normalizeCollection(sessionsPayload?.sessions || sessionsPayload);
    const aiSession = sessionData.find((item) => String(item.type || '').toLowerCase() === 'ai');

    return {
      greeting: getGreeting(),
      userName: remoteUserName,
      chips,
      hasHistory: Boolean(aiSession?.lastMessage),
      lastMessage: aiSession?.lastMessage || '',
    };
  } catch (error) {
    return {
      greeting: getGreeting(),
      userName,
      chips,
      hasHistory: true,
      lastMessage: '你上次提到最近睡眠很浅，我们可以继续聊聊入睡前的状态。',
    };
  }
}

export async function sendToAi(content) {
  const message = content.trim();

  if (!message) {
    return {
      from: 1,
      content: '请输入消息内容',
      time: Date.now(),
    };
  }

  try {
    const response = await http.request({
      method: 'POST',
      url: getOpenClawUrl(),
      data: {
        agentId: 'Therapist',
        message,
      },
    });

    const text = extractResponseText(response);
    return {
      from: 1,
      content: text || '我收到了你的消息。你可以继续多说一点，我会陪你一起梳理。',
      time: Date.now(),
    };
  } catch (error) {
    const errorMessage = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || '网络请求失败';
    return {
      from: 1,
      content: `AI 暂时无法回复：${errorMessage}`,
      time: Date.now(),
    };
  }
}
