import { getAllHomePosts } from './home';
import { normalizeCollection, requestPocket, isSuccessResponse, unwrapData } from './pocket';

const commentsByPostId = {
  '1': [
    {
      id: 'c1',
      author: {
        nickname: '王老师',
        avatar: 'https://picsum.photos/80/80?random=21',
        role: 'teacher',
      },
      createdAt: '20分钟前',
      content: '复习辛苦了，记得给自己一点休息时间。',
      likeCount: 3,
      isLiked: false,
    },
  ],
};

function buildDefaultComments(post) {
  const firstAuthor = post.author.role === 'teacher' ? '同学' : '王老师';
  const firstRole = post.author.role === 'teacher' ? 'student' : 'teacher';

  return [
    {
      id: `${post.id}-default-1`,
      author: {
        nickname: firstAuthor,
        avatar: `https://picsum.photos/80/80?random=${100 + Number(post.id)}`,
        role: firstRole,
      },
      createdAt: '刚刚',
      content: '这条内容我认真看完了，希望你也照顾好自己。',
      likeCount: 0,
      isLiked: false,
    },
  ];
}

export function getFallbackPostDetail(postId = '1') {
  const posts = getAllHomePosts();
  const post = posts.find((item) => item.id === postId) || posts[0];
  const comments = commentsByPostId[post.id] || buildDefaultComments(post);

  return {
    ...post,
    comments,
    stats: {
      ...post.stats,
      commentCount: comments.length,
    },
  };
}

export async function getPostDetail(postId = '1') {
  try {
    const detailResponse = await requestPocket({
      method: 'GET',
      url: `/student/home/posts/${postId}`,
    });

    if (!isSuccessResponse(detailResponse)) {
      return getFallbackPostDetail(postId);
    }

    let comments = [];

    try {
      const commentsResponse = await requestPocket({
        method: 'GET',
        url: `/student/home/posts/${postId}/comments`,
      });

      if (isSuccessResponse(commentsResponse)) {
        const commentsPayload = unwrapData(commentsResponse);
        comments = normalizeCollection(commentsPayload?.comments || commentsPayload);
      }
    } catch (error) {
      comments = [];
    }

    const detail = unwrapData(detailResponse) || {};

    return {
      ...detail,
      comments,
      stats: {
        ...(detail.stats || {}),
        commentCount: comments.length || detail.stats?.commentCount || 0,
      },
    };
  } catch (error) {
    return getFallbackPostDetail(postId);
  }
}

export async function togglePostLike(postId) {
  try {
    const response = await requestPocket({
      method: 'POST',
      url: `/student/home/posts/${postId}/like`,
    });

    if (!isSuccessResponse(response)) {
      return null;
    }

    return unwrapData(response) || null;
  } catch (error) {
    return null;
  }
}

export async function submitPostComment(postId, content) {
  try {
    const response = await requestPocket({
      method: 'POST',
      url: `/student/home/posts/${postId}/comments`,
      data: { content },
    });

    if (!isSuccessResponse(response)) {
      return null;
    }

    return unwrapData(response) || null;
  } catch (error) {
    return null;
  }
}
