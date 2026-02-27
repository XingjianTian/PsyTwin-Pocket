// 心友圈动态数据
const getFeed = (req) => {
  const followList = [
    {
      id: '1',
      author: { id: 'u1', nickname: '小明', avatar: '', role: 'student', department: '计算机学院' },
      content: { text: '今天天气真好，适合散步～', images: [], location: '校园操场', isAnonymous: false },
      stats: { likeCount: 12, commentCount: 3, shareCount: 1 },
      createdAt: '2小时前',
    },
    {
      id: '2',
      author: { id: 'u2', nickname: '心理老师王', avatar: '', role: 'teacher', department: '心理健康中心' },
      content: {
        text: '最近大家学习压力都很大，记得适当放松哦～有任何心理困扰可以来找我聊聊。',
        images: [],
        location: '',
        isAnonymous: false,
      },
      stats: { likeCount: 45, commentCount: 8, shareCount: 2 },
      createdAt: '5小时前',
    },
    {
      id: '3',
      author: { id: 'u3', nickname: '小红', avatar: '', role: 'student', department: '文学院' },
      content: { text: '今天考试考砸了，心情不太好...', images: [], location: '', isAnonymous: false },
      stats: { likeCount: 23, commentCount: 15, shareCount: 0 },
      createdAt: '1小时前',
    },
    {
      id: '4',
      author: { id: 'u4', nickname: '阿强', avatar: '', role: 'student', department: '机械学院' },
      content: { text: '刚打完篮球，好累但是好开心！', images: [], location: '体育馆', isAnonymous: false },
      stats: { likeCount: 18, commentCount: 5, shareCount: 1 },
      createdAt: '3小时前',
    },
  ];

  return {
    success: true,
    message: '获取成功',
    data: {
      follow: followList,
      square: followList,
      secret: followList,
    },
  };
};

module.exports = { getFeed };
