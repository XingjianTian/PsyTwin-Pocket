Page({
  data: {
    vrRecords: [
      {
        id: 'vr_001',
        name: '放松训练 - 森林漫步',
        date: '2026-03-18',
        duration: 25,
        status: 'completed',
        mood: '愉悦',
        moodIcon: 'sentiment-satisfied',
      },
      {
        id: 'vr_002',
        name: '减压训练 - 海洋冥想',
        date: '2026-03-15',
        duration: 30,
        status: 'completed',
        mood: '平静',
        moodIcon: 'peace',
      },
      {
        id: 'vr_003',
        name: '情绪调节 - 星空凝视',
        date: '2026-03-12',
        duration: 20,
        status: 'completed',
        mood: '放松',
        moodIcon: 'relaxed',
      },
      {
        id: 'vr_004',
        name: '睡眠引导 - 雨声冥想',
        date: '2026-03-08',
        duration: 35,
        status: 'completed',
        mood: '困倦',
        moodIcon: 'sleep',
      },
    ],
    totalMinutes: 110,
    totalSessions: 4,
  },

  onLoad() {},
});
