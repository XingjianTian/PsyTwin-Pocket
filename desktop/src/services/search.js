import { formatCards } from '@/adapters/home';
import { getAllHomePosts } from '@/services/home';
import { getStorage, setStorage } from '@/services/storage';

const SEARCH_HISTORY_KEY = 'searchHistory';

const popularWords = [
  '焦虑缓解',
  '失眠怎么办',
  '期末压力',
  '情绪管理',
  '校园树洞',
  '心理老师',
];

function readHistory() {
  try {
    const value = JSON.parse(getStorage(SEARCH_HISTORY_KEY, '[]'));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function writeHistory(historyWords) {
  setStorage(SEARCH_HISTORY_KEY, JSON.stringify(historyWords));
}

export async function getSearchPanelData() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 100);
  });

  return {
    historyWords: readHistory(),
    popularWords,
  };
}

export function saveSearchWord(searchValue) {
  const keyword = searchValue.trim();
  if (!keyword) {
    return readHistory();
  }

  const historyWords = readHistory().filter((item) => item !== keyword);
  historyWords.unshift(keyword);
  const trimmed = historyWords.slice(0, 8);
  writeHistory(trimmed);
  return trimmed;
}

export function removeSearchWord(index) {
  const historyWords = readHistory();
  historyWords.splice(index, 1);
  writeHistory(historyWords);
  return historyWords;
}

export function clearSearchWords() {
  writeHistory([]);
  return [];
}

export async function searchPosts(searchValue) {
  const keyword = searchValue.trim().toLowerCase();

  if (!keyword) {
    return [];
  }

  await new Promise((resolve) => {
    window.setTimeout(resolve, 120);
  });

  const filteredPosts = getAllHomePosts().filter((item) => {
    const text = item.content?.text || '';
    const nickname = item.author?.nickname || '';
    const department = item.author?.department || '';
    const location = item.content?.location || '';

    return [text, nickname, department, location].some((field) => field.toLowerCase().includes(keyword));
  });

  return formatCards(filteredPosts);
}
