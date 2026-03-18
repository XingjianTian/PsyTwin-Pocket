Page({
  data: {
    assessments: [
      {
        id: 'assess_001',
        name: 'SCL-90 症状自评量表',
        description: '全面评估心理健康状态',
        date: '2026-03-15',
        status: 'completed',
        score: 72,
        level: '良好',
        levelColor: 'green',
      },
      {
        id: 'assess_002',
        name: '焦虑自评量表 (SAS)',
        description: '评估焦虑程度',
        date: '2026-03-10',
        status: 'completed',
        score: 45,
        level: '正常',
        levelColor: 'green',
      },
      {
        id: 'assess_003',
        name: '抑郁自评量表 (SDS)',
        description: '评估抑郁程度',
        date: '2026-03-05',
        status: 'completed',
        score: 38,
        level: '正常',
        levelColor: 'green',
      },
    ],
  },

  onLoad() {},
});
