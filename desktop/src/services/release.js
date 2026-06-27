import { getStorage, setStorage } from '@/services/storage';
import { createHomePost } from '@/services/home';

const RELEASE_DRAFT_KEY = 'releaseDraft';

export const releaseTags = ['期末复习', '情绪记录', '校园生活', '匿名分享', '自我成长', '求助'];

export const presetImages = [
  'https://picsum.photos/400/300?random=601',
  'https://picsum.photos/400/360?random=602',
  'https://picsum.photos/400/420?random=603',
  'https://picsum.photos/400/320?random=604',
];

export function getReleaseDraft() {
  try {
    const draft = JSON.parse(getStorage(RELEASE_DRAFT_KEY, '{}'));
    return {
      text: draft.text || '',
      selectedTags: Array.isArray(draft.selectedTags) ? draft.selectedTags : [],
      images: Array.isArray(draft.images) ? draft.images : [],
      location: draft.location || '',
      isAnonymous: Boolean(draft.isAnonymous),
    };
  } catch (error) {
    return {
      text: '',
      selectedTags: [],
      images: [],
      location: '',
      isAnonymous: false,
    };
  }
}

export function saveReleaseDraft(draft) {
  setStorage(RELEASE_DRAFT_KEY, JSON.stringify(draft));
}

export function clearReleaseDraft() {
  setStorage(RELEASE_DRAFT_KEY, JSON.stringify({}));
}

export function publishRelease(payload) {
  const post = createHomePost(payload);
  clearReleaseDraft();
  return post;
}
