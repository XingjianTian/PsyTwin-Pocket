// 获取动态详情
const getPostDetail = (req) => {
  const { id } = req.data || {};
  console.log('mock getPostDetail id:', id);

  // 模拟数据
  const posts = [
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
      isLiked: false,
      isCollected: false,
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
        text: '【小贴士】当你感到压力山大的时候，试试 4-7-8 呼吸法：吸气 4 秒 → 房气 7 秒 → 呼气 8 秒。反复 4 次，就能快速止息感。希望这个小方法能帮到大家✨',
        images: [],
        location: '',
        isAnonymous: false,
      },
      stats: { likeCount: 126, commentCount: 23, shareCount: 18 },
      isLiked: true,
      isCollected: true,
      createdAt: '2小时前',
    },
  ];

  const post = posts.find((p) => p.id === id) || posts[0];

  return {
    code: 200,
    success: true,
    message: '获取成功',
    data: post,
  };
};

module.exports = { getPostDetail };
