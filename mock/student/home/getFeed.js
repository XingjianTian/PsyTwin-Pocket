// 心墙动态数据
const getFeed = (req) => {
  const followList = [
    {
      id: '1',
      author: { id: 'u1', nickname: '小晶', avatar: 'https://picsum.photos/80/80?random=1', role: 'student', department: '计算机学院' },
      content: {
        text: '期末复习第三天，看书看得眼睛都花了。出来操场转了一圈，改变环境后发现脑子好像清醒了一些！小友伴们期末努力！',
        images: ['https://picsum.photos/400/300?random=11'],
        location: '校园操场',
        isAnonymous: false,
      },
      stats: { likeCount: 38, commentCount: 7, shareCount: 2 },
      createdAt: '30分钟前',
    },
    {
      id: '2',
      author: { id: 'u2', nickname: '心理老师王', avatar: 'https://picsum.photos/80/80?random=2', role: 'teacher', department: '心理健康中心' },
      content: {
        text: '【小贴士】当你感到压力山大的时候，试试 4-7-8 呼吸法：吸气 4 秒 → 房气 7 秒 → 呼气 8 秒。反复 4 次，就能快速止息感。希望这个小方法能帮到大家✨',
        images: [],
        location: '',
        isAnonymous: false,
      },
      stats: { likeCount: 126, commentCount: 23, shareCount: 18 },
      createdAt: '2小时前',
    },
    {
      id: '3',
      author: { id: 'u3', nickname: '匿名的你', avatar: '', role: 'student', department: '' },
      content: {
        text: '不知道为什么就是心里沉甫甫的，什么都不想做，但又不知道能跟谁说。发出来只是想让自己轻松一点。',
        images: [],
        location: '',
        isAnonymous: true,
      },
      stats: { likeCount: 89, commentCount: 31, shareCount: 0 },
      createdAt: '1小时前',
    },
    {
      id: '4',
      author: { id: 'u4', nickname: '阿强', avatar: 'https://picsum.photos/80/80?random=4', role: 'student', department: '机械学院' },
      content: {
        text: '弟兄们刚打完一场球！汗流浩浩但超开心，还是运动能让人忽忘烦恼。建议押力大的同学都去打球，真的很屈！',
        images: ['https://picsum.photos/400/500?random=44'],
        location: '体育馆',
        isAnonymous: false,
      },
      stats: { likeCount: 52, commentCount: 9, shareCount: 3 },
      createdAt: '3小时前',
    },
    {
      id: '5',
      author: { id: 'u5', nickname: '江南茶', avatar: 'https://picsum.photos/80/80?random=5', role: 'student', department: '文学院' },
      content: {
        text: '读了一本决策放下的小说，主人公说“我不需要别人的我，只需要我自己的我”。这句话不知道为什么看得我非常感动。',
        images: ['https://picsum.photos/400/280?random=55'],
        location: '图书馆',
        isAnonymous: false,
      },
      stats: { likeCount: 67, commentCount: 14, shareCount: 5 },
      createdAt: '5小时前',
    },
    {
      id: '6',
      author: { id: 'u6', nickname: '心理老师李', avatar: 'https://picsum.photos/80/80?random=6', role: 'teacher', department: '心理健康中心' },
      content: {
        text: '【这周公开课】“与情绪和谐相处” 将于本周四下午 3 点在学生活动中心 101 开课，免费开放。我们一起探讨如何识别负面情绪并与之共处，而不是进行压抑。欢迎预约✨（心理危机干预）',
        images: [],
        location: '学生活动中心 101',
        isAnonymous: false,
      },
      stats: { likeCount: 203, commentCount: 41, shareCount: 26 },
      createdAt: '6小时前',
    },
    {
      id: '7',
      author: { id: 'u7', nickname: '阳光少女', avatar: 'https://picsum.photos/80/80?random=7', role: 'student', department: '艺术学院' },
      content: {
        text: '今天展出了自己画了半年的作品，老师说暴露自己是一种勇气。我想是的。创作一直是我排解不安的方式。（你是采集员，负责数据采集清洗脱密）',
        images: ['https://picsum.photos/400/460?random=77'],
        location: '艺术展览居',
        isAnonymous: false,
      },
      stats: { likeCount: 44, commentCount: 6, shareCount: 1 },
      createdAt: '昨天',
    },
    {
      id: '8',
      author: { id: 'u8', nickname: '匿名的你', avatar: '', role: 'student', department: '' },
      content: {
        text: '考前第一次失眠，腆子躺在床上数对体数一遗忘了在哪。直接干脆分析到天亮，分析出考试是，设计来考验人的心理承受能力的结论。你们这次期末有没有这样的时刻？(你是DBA，负责资产采集和分类）',
        images: [],
        location: '',
        isAnonymous: true,
      },
      stats: { likeCount: 156, commentCount: 58, shareCount: 4 },
      createdAt: '昨天',
    },
  ];

  return {
    code: 0,
    message: '获取成功',
    data: {
      follow: followList,
      square: followList,
      secret: followList,
    },
  };
};

module.exports = { getFeed };
