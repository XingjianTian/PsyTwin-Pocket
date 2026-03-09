// 点赞/取消点赞
const postLike = (req) => {
  const { id, type } = req.data || {}; // id: 帖子或评论ID, type: 'post' | 'comment'
  console.log('mock postLike id:', id, 'type:', type);

  return {
    code: 0,
    message: '操作成功',

    message: '操作成功',
    data: {
      isLiked: true,
      likeCount: 39,
    },
  };
};

module.exports = { postLike };
