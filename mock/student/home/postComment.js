// 发表评论
const postComment = (req) => {
  const { postId, content, replyToId } = req.data || {};
  console.log('mock postComment postId:', postId, 'content:', content);

  return {
    code: 0,
    message: '发表成功',

    message: '发表成功',
    data: {
      id: 'c' + Date.now(),
      author: { id: 'u_current', nickname: '我', avatar: 'https://picsum.photos/80/80?random=10', role: 'student' },
      content: content,
      likeCount: 0,
      isLiked: false,
      createdAt: '刚刚',
      replies: [],
    },
  };
};

module.exports = { postComment };
