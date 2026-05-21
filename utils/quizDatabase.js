// utils/quizDatabase.js
// 心理量表题库 —— 以心宠视角包装，用户通过"帮助心宠做选择"完成心理自评
// 量表来源：PHQ-9（抑郁筛查）、GAD-7（焦虑筛查）、社交回避简版

const SCALES = {
  PHQ9: {
    id: 'PHQ9',
    name: '心宠情绪观察',
    category: 'emotion',
    description: '心宠最近两周的情绪状态',
    questions: [
      {
        id: 'phq1',
        text: '最近心宠对平时喜欢的活动（探险、摘蘑菇、看星星）完全提不起兴趣，你觉得它……',
        options: [
          { text: '🌟 和以前一样开心', score: 0 },
          { text: '😔 有几天不太想动', score: 1 },
          { text: '🌧️ 一半以上时间都没精打采', score: 2 },
          { text: '💤 几乎每天都不愿意出门', score: 3 },
        ],
      },
      {
        id: 'phq4',
        text: '心宠最近总觉得特别累，哪怕什么都没做也像跑了一场马拉松，你觉得它……',
        options: [
          { text: '⚡ 精力充沛，活力满满', score: 0 },
          { text: '🥱 偶尔会有点犯困', score: 1 },
          { text: '😪 经常觉得累，不想动弹', score: 2 },
          { text: '🛌 几乎每天都疲惫不堪', score: 3 },
        ],
      },
      {
        id: 'phq6',
        text: '心宠最近是不是很容易责怪自己，觉得自己什么都做不好？',
        options: [
          { text: '😊 它觉得自己很棒', score: 0 },
          { text: '😕 偶尔会有些小失落', score: 1 },
          { text: '😢 经常觉得自己很失败', score: 2 },
          { text: '💔 总是怪自己，觉得自己是负担', score: 3 },
        ],
      },
      {
        id: 'phq9_soft',
        text: '心宠最近对未来的事情好像提不起期待，觉得做什么都没意思？',
        options: [
          { text: '🌈 对未来充满期待', score: 0 },
          { text: '☁️ 偶尔觉得平淡', score: 1 },
          { text: '🌫️ 经常觉得生活没劲', score: 2 },
          { text: '🌑 几乎每天都看不到希望', score: 3 },
        ],
      },
    ],
    scoring: {
      ranges: [
        { max: 3, label: '状态良好', color: 'green', advice: '心宠情绪阳光，继续保持温馨陪伴吧！' },
        { max: 6, label: '轻度低落', color: 'orange', advice: '心宠最近有点累，多带它晒晒太阳、聊聊天~' },
        { max: 12, label: '需要关注', color: 'red', advice: '心宠需要更多关爱，建议预约一次线下心理咨询。' },
      ],
    },
  },

  GAD7: {
    id: 'GAD7',
    name: '心宠担忧观察',
    category: 'study',
    description: '心宠最近两周的担心程度',
    questions: [
      {
        id: 'gad1',
        text: '心宠最近总是担心各种事情（考试、作业、未来），停不下来，你觉得它……',
        options: [
          { text: '😌 什么都不担心，很放松', score: 0 },
          { text: '🤔 偶尔会有点担心', score: 1 },
          { text: '😰 经常担心很多事情', score: 2 },
          { text: '😱 几乎每天都坐立不安，担心个不停', score: 3 },
        ],
      },
      {
        id: 'gad3',
        text: '心宠是不是对各种各样的小事情都担忧过多，比如作业写不完怎么办？',
        options: [
          { text: '✨ 想得开，该玩就玩', score: 0 },
          { text: '📝 偶尔会多想一下', score: 1 },
          { text: '🔄 经常翻来覆去地想', score: 2 },
          { text: '🌀 几乎每件事都要担心很久', score: 3 },
        ],
      },
      {
        id: 'gad5',
        text: '心宠最近是不是坐不住，总是 restless（焦躁），很难安静下来？',
        options: [
          { text: '🧘 能安静专注做一件事', score: 0 },
          { text: '🐿️ 偶尔会有点坐不住', score: 1 },
          { text: '🏃 经常焦躁不安，想跑来跑去', score: 2 },
          { text: '⚡ 几乎静不下来，非常烦躁', score: 3 },
        ],
      },
      {
        id: 'gad6',
        text: '心宠最近是不是很容易变得烦躁或急躁，一点小事就着急？',
        options: [
          { text: '😊 脾气很好，很耐心', score: 0 },
          { text: '😤 偶尔会有点不耐烦', score: 1 },
          { text: '😠 经常因为小事着急', score: 2 },
          { text: '🤯 几乎每天都很容易发火', score: 3 },
        ],
      },
    ],
    scoring: {
      ranges: [
        { max: 3, label: '状态良好', color: 'green', advice: '心宠心态平和，继续保持轻松的节奏！' },
        { max: 6, label: '轻度焦虑', color: 'orange', advice: '心宠最近有点紧张，带它去湖边发发呆吧~' },
        { max: 12, label: '需要关注', color: 'red', advice: '心宠压力有点大，建议预约一次线下放松体验。' },
      ],
    },
  },

  SOCIAL: {
    id: 'SOCIAL',
    name: '心宠社交观察',
    category: 'social',
    description: '心宠最近在社交中的感受',
    questions: [
      {
        id: 'soc1',
        text: '当有其他小精灵在场的时候，心宠会感到紧张或不自在吗？',
        options: [
          { text: '🤗 很自在，喜欢交朋友', score: 0 },
          { text: '😶 偶尔会有点害羞', score: 1 },
          { text: '😓 经常感到紧张不安', score: 2 },
          { text: '😰 几乎每次都会很害怕', score: 3 },
        ],
      },
      {
        id: 'soc2',
        text: '心宠会主动避开需要和其他精灵一起参与的活动吗？',
        options: [
          { text: '🎉 积极参加各种聚会', score: 0 },
          { text: '🏠 偶尔会婉拒邀请', score: 1 },
          { text: '🚪 经常找借口不参加', score: 2 },
          { text: '🔒 几乎从不参与集体活动', score: 3 },
        ],
      },
      {
        id: 'soc3',
        text: '心宠是不是担心自己在别的精灵面前出丑或被嘲笑？',
        options: [
          { text: '💪 自信满满，不在意评价', score: 0 },
          { text: '🙈 偶尔会有点担心', score: 1 },
          { text: '😣 经常害怕被笑话', score: 2 },
          { text: '😢 几乎每天都担心别人怎么看它', score: 3 },
        ],
      },
      {
        id: 'soc4',
        text: '心宠在面对不熟悉的精灵时，是不是很难开口说话或打招呼？',
        options: [
          { text: '👋 主动热情地打招呼', score: 0 },
          { text: '😊 等别人先开口也能聊', score: 1 },
          { text: '🤐 经常沉默，不知说什么', score: 2 },
          { text: '🫥 几乎完全说不出话来', score: 3 },
        ],
      },
    ],
    scoring: {
      ranges: [
        { max: 3, label: '状态良好', color: 'green', advice: '心宠社交达人，继续保持开朗吧！' },
        { max: 6, label: '轻度回避', color: 'orange', advice: '心宠有点害羞，陪它慢慢认识新朋友~' },
        { max: 12, label: '需要关注', color: 'red', advice: '心宠在社交上有些困难，建议预约咨询师聊聊。' },
      ],
    },
  },
};

/**
 * 根据事件分类获取对应量表
 * @param {string} category - 事件分类: emotion | study | social
 * @returns {Object} 量表定义对象
 */
function getScaleForCategory(category) {
  const map = {
    emotion: 'PHQ9',
    study: 'GAD7',
    social: 'SOCIAL',
  };
  const scaleId = map[category] || 'PHQ9';
  return SCALES[scaleId];
}

/**
 * 计算量表得分与结果
 * @param {string} scaleId - 量表ID
 * @param {Array} answers - 答案数组，每项为 { score: number }
 * @returns {Object} { total, max, label, color, advice }
 */
function calculateScore(scaleId, answers) {
  const scale = SCALES[scaleId];
  if (!scale) {
    return { total: 0, max: 0, label: '未知', color: 'gray', advice: '' };
  }
  const total = answers.reduce((sum, a) => sum + (a.score || 0), 0);
  const max = scale.questions.length * 3;
  const result = scale.scoring.ranges.find((r) => total <= r.max)
    || scale.scoring.ranges[scale.scoring.ranges.length - 1];
  return {
    total,
    max,
    label: result.label,
    color: result.color,
    advice: result.advice,
  };
}

/**
 * 获取所有量表列表（用于展示）
 * @returns {Array}
 */
function getScaleList() {
  return Object.values(SCALES).map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    questionCount: s.questions.length,
  }));
}

module.exports = {
  SCALES,
  getScaleForCategory,
  calculateScore,
  getScaleList,
};
