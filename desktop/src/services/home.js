import { distributeCards, formatCards } from '@/adapters/home';
import { normalizeCollection, requestPocket, isSuccessResponse, unwrapData } from '@/services/pocket';
import { getStorage, setStorage } from '@/services/storage';

const CUSTOM_POSTS_KEY = 'customPosts';

const baseHomeFeed = [
  {
    id: '1',
    author: {
      id: 'u1',
      nickname: '小晶',
      avatar: 'https://picsum.photos/80/80?random=1',
      role: 'student',
      department: '计算机学院',
    },
    content: {
      text: '期末复习第三天，看书看得眼睛都花了。出来操场转了一圈，改变环境后发现脑子好像清醒了一些！小友伴们期末努力！',
      images: ['https://picsum.photos/400/300?random=11'],
      location: '校园操场',
      isAnonymous: false,
    },
    stats: { likeCount: 38, commentCount: 7, shareCount: 2 },
    createdAt: '30分钟前',
  },
  {
    id: '2',
    author: {
      id: 'u2',
      nickname: '心理老师王',
      avatar: 'https://picsum.photos/80/80?random=2',
      role: 'teacher',
      department: '心理健康中心',
    },
    content: {
      text: '【小贴士】当你感到压力山大的时候，试试 4-7-8 呼吸法：吸气 4 秒 → 憋气 7 秒 → 呼气 8 秒。反复 4 次，就能快速平息焦虑感。',
      images: [],
      location: '',
      isAnonymous: false,
    },
    stats: { likeCount: 126, commentCount: 23, shareCount: 18 },
    createdAt: '2小时前',
  },
  {
    id: '3',
    author: { id: 'u3', nickname: '匿名的你', avatar: '', role: 'student', department: '' },
    content: {
      text: '不知道为什么就是心里沉甸甸的，什么都不想做，但又不知道能跟谁说。发出来只是想让自己轻松一点。',
      images: [],
      location: '',
      isAnonymous: true,
    },
    stats: { likeCount: 89, commentCount: 31, shareCount: 0 },
    createdAt: '1小时前',
  },
];

let remoteFeedCache = [];

function readList(key) {
  try {
    return JSON.parse(getStorage(key, '[]'));
  } catch (error) {
    return [];
  }
}

function writeList(key, value) {
  setStorage(key, JSON.stringify(value));
}

function getDemoAuthor() {
  const role = getStorage('role', 'student');
  const nickname = getStorage('userName', role === 'teacher' ? '王老师' : '张同学');

  return {
    id: `demo-${role}`,
    nickname,
    avatar: role === 'teacher' ? 'https://picsum.photos/80/80?random=1202' : 'https://picsum.photos/80/80?random=1201',
    role,
    department: role === 'teacher' ? '心理健康中心' : '计算机学院',
  };
}

function normalizeRemoteFeed(responseData = {}) {
  const feedData = responseData.follow || responseData.square || [];
  return normalizeCollection(feedData);
}

export function getCachedHomePosts() {
  return remoteFeedCache.length > 0 ? remoteFeedCache : baseHomeFeed;
}

export function getAllHomePosts() {
  const customPosts = readList(CUSTOM_POSTS_KEY);
  return [...customPosts, ...getCachedHomePosts()];
}

export function createHomePost(payload) {
  const customPosts = readList(CUSTOM_POSTS_KEY);
  const nextPost = {
    id: `custom-${Date.now()}`,
    author: getDemoAuthor(),
    content: {
      text: payload.text || '',
      images: payload.images || [],
      location: payload.location || '',
      isAnonymous: Boolean(payload.isAnonymous),
      tags: payload.tags || [],
    },
    stats: {
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
    },
    createdAt: '刚刚',
  };

  customPosts.unshift(nextPost);
  writeList(CUSTOM_POSTS_KEY, customPosts);

  return nextPost;
}

export async function getHomeFeed() {
  try {
    const response = await requestPocket({
      method: 'GET',
      url: '/student/home/feed',
    });

    if (isSuccessResponse(response)) {
      remoteFeedCache = normalizeRemoteFeed(unwrapData(response) || {});
    }
  } catch (error) {
    remoteFeedCache = remoteFeedCache.length > 0 ? remoteFeedCache : baseHomeFeed;
  }

  const cards = formatCards(getAllHomePosts());

  return {
    cards,
    focusCards: cards,
    ...distributeCards(cards),
  };
}
