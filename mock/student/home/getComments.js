// 获取评论列表
const getComments = (req) => {
  const { postId } = req.data || {};
  console.log('mock getComments postId:', postId);

  const comments = [
    {
      id: 'c1',
      author: { id: 'u4', nickname: '阿强', avatar: 'https://picsum.photos/80/80?random=4', role: 'student' },
      content: '加油！期末必过！',
      likeCount: 5,
      isLiked: false,
      createdAt: '10分钟前',
      replies: [
        {
          id: 'r1',
          author: { id: 'u1', nickname: '小晶', avatar: 'https://picsum.photos/80/80?random=1', role: 'student' },
          toUser: { id: 'u4', nickname: '阿强' },
          content: '谢谢强哥！',
          createdAt: '5分钟前',
        },
      ],
    },
    {
      id: 'c2',
      author: { id: 'u5', nickname: '江南茶', avatar: 'https://picsum.photos/80/80?random=5', role: 'student' },
      content: '我也在操场，怎么没看到你？',
      likeCount: 2,
      isLiked: true,
      createdAt: '15分钟前',
      replies: [],
    },
  ];

  return {
    code: 0,
    message: '获取成功',

    message: '获取成功',
    data: comments,
  };
};

module.exports = { getComments };
