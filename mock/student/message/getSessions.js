// AI 会话列表
const getSessions = (req) => {
  return {
    success: true,
    message: '获取成功',
    data: [
      {
        id: 'ai-assistant',
        type: 'ai',
        name: 'PsyTwin 树洞助手',
        avatar: 'https://picsum.photos/100/100?random=100',
        lastMessage: '你好！有什么我可以帮你的吗？',
        lastMessageTime: '刚刚',
        unreadCount: 1,
        status: 'online',
      },
      {
        id: 'counselor-1',
        type: 'counselor',
        name: '咨询师小明',
        avatar: 'https://picsum.photos/100/100?random=101',
        lastMessage: '好的，我们下次咨询时间定为周三上午可以吗？',
        lastMessageTime: '昨天',
        unreadCount: 0,
        status: 'online',
      },
      {
        id: 'counselor-2',
        type: 'counselor',
        name: '咨询师小红',
        avatar: 'https://picsum.photos/100/100?random=102',
        lastMessage: '感谢你的信任，期待下次见面～',
        lastMessageTime: '3天前',
        unreadCount: 0,
        status: 'offline',
      },
    ],
  };
};

module.exports = {
  getSessions,
};
