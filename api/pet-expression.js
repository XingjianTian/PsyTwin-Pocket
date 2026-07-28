import request from './request';

export async function triggerSadPetExpression() {
  try {
    const response = await request('/pet/expression', 'POST', { expression: 'sad' });
    if (response.code !== 0) {
      return { success: false, error: response.message || '心宠表情请求失败' };
    }

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message || '心宠设备暂时不可用' };
  }
}

export default {
  triggerSadPetExpression,
};
