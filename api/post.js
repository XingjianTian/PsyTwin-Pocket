import request from './request';

/**
 * 获取动态详情
 * @param {string|number} id 动态ID
 */
export const getPostDetail = (id) => request(`/mock/student/home/post-detail?id=${id}`);

/**
 * 点赞/取消点赞
 * @param {string|number} id 动态ID
 */
export const toggleLike = (id) => request(`/mock/student/home/post-like?id=${id}`, 'POST');

/**
 * 发表评论
 * @param {string|number} id 动态ID
 * @param {string} content 评论内容
 */
export const postComment = (id, content) => request(`/mock/student/home/post-comment?postId=${id}`, 'POST', { content });

/**
 * 获取评论列表
 * @param {string|number} id 动态ID
 */
export const getComments = (id) => request(`/mock/student/home/comments?postId=${id}`);
