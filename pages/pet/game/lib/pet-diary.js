import request from '../../../../api/request';

function unwrapPetDiaryResponse(response, fallbackMessage) {
  if (response && response.code === 0) {
    return { success: true, data: response.data };
  }

  return {
    success: false,
    error: (response && response.message) || fallbackMessage,
  };
}

export async function fetchPetDiary(date, { ensure = false } = {}) {
  try {
    const params = [];
    if (date) params.push(`date=${encodeURIComponent(date)}`);
    if (ensure) params.push('ensure=true');
    const query = params.length > 0 ? `?${params.join('&')}` : '';
    const response = await request(`/pet/diary${query}`, 'GET');
    return unwrapPetDiaryResponse(response, '获取心宠日记失败');
  } catch (err) {
    return { success: false, error: err.message || '获取心宠日记失败' };
  }
}

export async function triggerPetDiary({ sceneId, date, hour } = {}) {
  try {
    const response = await request('/pet/diary/trigger', 'POST', { sceneId, date, hour });
    return unwrapPetDiaryResponse(response, '触发心宠日记失败');
  } catch (err) {
    return { success: false, error: err.message || '触发心宠日记失败' };
  }
}

export async function testPetDiary({ sceneId, date } = {}) {
  try {
    const response = await request('/pet/diary/test', 'POST', { sceneId, date });
    return unwrapPetDiaryResponse(response, '测试读取心宠日记失败');
  } catch (err) {
    return { success: false, error: err.message || '测试读取心宠日记失败' };
  }
}

export async function backfillPetDiary({ lastOnlineAt, maxDays = 7 } = {}) {
  try {
    const response = await request('/pet/diary/backfill', 'POST', { lastOnlineAt, maxDays });
    return unwrapPetDiaryResponse(response, '补全离线心宠日记失败');
  } catch (err) {
    return { success: false, error: err.message || '补全离线心宠日记失败' };
  }
}

export default {
  fetchPetDiary,
  triggerPetDiary,
  testPetDiary,
  backfillPetDiary,
};
