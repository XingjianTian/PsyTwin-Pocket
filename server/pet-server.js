/**
 * 心宠离线状态服务器
 * ==================
 * 职责：当小程序关闭时，心宠在服务器上继续"生活"。
 * 小程序启动时拉取服务器计算的当前状态，关闭时推送状态到服务器。
 *
 * 启动: node pet-server.js
 * 默认端口: 3002
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
// 数据文件放在用户主目录下，避免被微信开发者工具的文件监听触发热重载
const DATA_DIR = path.join(require('os').homedir(), '.psytwin-pet');
const DATA_FILE = path.join(DATA_DIR, 'pet-data.json');

// 确保目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ========== 中间件 ==========
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// ========== 常量数据（与 pages/pet/index.js 保持一致）==========

const SCENE_TYPE = {
  FIXED: 'fixed',
  SEMI_FIXED: 'semi',
  VARIABLE: 'variable',
};

const SCENE_TYPE_MAP = {
  teaching_building: SCENE_TYPE.FIXED,
  library: SCENE_TYPE.FIXED,
  cafeteria: SCENE_TYPE.SEMI_FIXED,
  psychological_room: SCENE_TYPE.SEMI_FIXED,
};

const SCENE_ACTIVITIES = {
  bedroom: ['在温暖的被窝里睡懒觉', '躺在床上刷手机', '趴在书桌前写作业', '坐在电脑前打游戏', '躺在床上发呆思考人生', '整理床铺和桌面', '躺着看天花板', '熬夜追剧'],
  dormitory: ['在宿舍里整理东西', '坐在桌前学习', '和室友聊天', '躺在床上休息', '在宿舍里打游戏'],
  teaching_building: ['认真听讲做笔记', '在教室里上课', '和同学讨论问题', '偷偷在课上走神', '积极回答老师提问'],
  library: ['在书架间寻找资料', '安静地阅读书籍', '认真复习功课', '在自习区写作业', '查阅参考书籍'],
  cafeteria: ['挑选喜欢的菜品', '享受美味的午餐', '和朋友一起吃饭聊天', '品尝新出的菜品', '慢慢享受晚餐'],
  playground: ['在操场上跑步锻炼', '打篮球挥洒汗水', '坐在草坪上休息', '和朋友一起运动', '做着拉伸运动'],
  deep_forest: ['在魔法森林中探险', '采集发光的魔法草药', '追踪神秘的森林精灵', '寻找隐藏的宝藏', '观察会说话的树木'],
  crystal_cave: ['探索水晶洞穴的深处', '收集七彩的水晶碎片', '感受水晶的魔法能量', '在水晶丛中冥想', '寻找传说中的魔法石'],
  mushroom_village: ['和蘑菇精灵打招呼', '在蘑菇村落里散步', '品尝精灵特制的蘑菇汤', '帮助小精灵采蘑菇', '参观蘑菇小屋'],
  fairy_lake: ['在湖边欣赏水莲花', '和水精灵一起玩耍', '收集湖中的星光水滴', '坐在湖边静静地冥想', '观察湖中的神奇生物'],
  star_meadow: ['躺在草地上看星星', '收集草地上的星光露珠', '在星空下许愿', '和萤火虫一起跳舞', '欣赏美丽的星空'],
  bonfire_area: ['围坐在篝火旁取暖', '烤棉花糖吃', '和朋友围炉夜话', '看着篝火发呆', '听 firewood 噼啪声'],
  picnic_lawn: ['在草坪上野餐', '铺开野餐垫享受阳光', '品尝美味的三明治', '躺在草坪上晒太阳', '和朋友分享零食'],
  hammock_area: ['在吊床上悠闲地摇晃', '躺在吊上午睡', '坐在吊床上看书', '享受慵懒的午后时光', '在吊床上发呆'],
  stream_side: ['在溪边听流水声', '用小手拨弄清澈的溪水', '在溪边寻找漂亮的石头', '看着溪水发呆', '听鸟鸣和流水声'],
  viewing_platform: ['站在观景台俯瞰美景', '欣赏远处的山峦', '吹着风看风景', '拍照记录美好瞬间', '深呼吸感受大自然'],
  supermarket: ['在超市里挑选零食', '推着购物车逛货架', '对比商品的价格', '发现新口味的饮料', '买了很多好吃的'],
  cinema: ['坐在电影院里看电影', '吃着爆米花等开场', '被电影情节感动哭了', '和朋友讨论剧情', '准备看下一场电影'],
  amusement_park: ['坐过山车尖叫', '在旋转木马上拍照', '排队等玩刺激项目', '吃游乐园的棉花糖', '坐摩天轮看风景'],
  cafe: ['喝着咖啡发呆', '品尝精致的蛋糕', '在咖啡馆里看书', '和朋友聊天喝茶', '听着音乐享受午后'],
  arcade: ['在玩抓娃娃机', '挑战街机高分记录', '和朋友对战游戏', '跳舞机上秀舞姿', '赢了好多游戏币'],
  study_room: ['在书房里阅读书籍', '在书桌前写日记', '翻阅有趣的绘本', '整理书架上的书', '坐在窗边看书'],
  kitchen: ['在厨房里做饭', '烘焙香甜的小饼干', '尝试新的食谱', '煮一杯热茶', '准备美味的点心'],
  garden: ['在花园里浇花', '和蝴蝶追逐嬉戏', '采摘新鲜的鲜花', '躺在花丛中晒太阳', '种植新的花苗'],
  psychological_room: ['在咨询室里倾诉烦恼', '和咨询师聊天', '在舒适的沙发上休息', '整理自己的情绪', '做放松训练'],
};

const WEEKDAY_SCHEDULE = [
  { hour: 0, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 1, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 2, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 3, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 4, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 5, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 6, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 7, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 8, scenes: [{ id: 'teaching_building', weight: 85 }, { id: 'library', weight: 10 }, { id: 'bedroom', weight: 5 }] },
  { hour: 9, scenes: [{ id: 'teaching_building', weight: 85 }, { id: 'library', weight: 10 }, { id: 'bedroom', weight: 5 }] },
  { hour: 10, scenes: [{ id: 'teaching_building', weight: 80 }, { id: 'library', weight: 15 }, { id: 'bedroom', weight: 5 }] },
  { hour: 11, scenes: [{ id: 'teaching_building', weight: 75 }, { id: 'library', weight: 15 }, { id: 'bedroom', weight: 10 }] },
  { hour: 12, scenes: [{ id: 'cafeteria', weight: 70 }, { id: 'picnic_lawn', weight: 20 }, { id: 'mushroom_village', weight: 10 }] },
  { hour: 13, scenes: [{ id: 'library', weight: 50 }, { id: 'teaching_building', weight: 30 }, { id: 'hammock_area', weight: 20 }] },
  { hour: 14, scenes: [{ id: 'library', weight: 55 }, { id: 'teaching_building', weight: 35 }, { id: 'bedroom', weight: 10 }] },
  { hour: 15, scenes: [{ id: 'library', weight: 50 }, { id: 'teaching_building', weight: 30 }, { id: 'playground', weight: 20 }] },
  { hour: 16, scenes: [{ id: 'library', weight: 45 }, { id: 'playground', weight: 35 }, { id: 'teaching_building', weight: 20 }] },
  { hour: 17, scenes: [{ id: 'playground', weight: 40 }, { id: 'picnic_lawn', weight: 30 }, { id: 'stream_side', weight: 20 }, { id: 'bedroom', weight: 10 }] },
  { hour: 18, scenes: [{ id: 'cafeteria', weight: 60 }, { id: 'picnic_lawn', weight: 25 }, { id: 'bonfire_area', weight: 15 }] },
  { hour: 19, scenes: [{ id: 'library', weight: 45 }, { id: 'bedroom', weight: 35 }, { id: 'teaching_building', weight: 20 }] },
  { hour: 20, scenes: [{ id: 'bedroom', weight: 50 }, { id: 'library', weight: 30 }, { id: 'teaching_building', weight: 20 }] },
  { hour: 21, scenes: [{ id: 'bedroom', weight: 60 }, { id: 'library', weight: 25 }, { id: 'star_meadow', weight: 15 }] },
  { hour: 22, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'star_meadow', weight: 20 }, { id: 'dormitory', weight: 10 }] },
  { hour: 23, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
];

const WEEKEND_SCHEDULE = [
  { hour: 0, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 1, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 2, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 3, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 4, scenes: [{ id: 'bedroom', weight: 95 }, { id: 'dormitory', weight: 5 }] },
  { hour: 5, scenes: [{ id: 'bedroom', weight: 90 }, { id: 'dormitory', weight: 10 }] },
  { hour: 6, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
  { hour: 7, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'dormitory', weight: 30 }] },
  { hour: 8, scenes: [{ id: 'bedroom', weight: 60 }, { id: 'picnic_lawn', weight: 25 }, { id: 'deep_forest', weight: 15 }] },
  { hour: 9, scenes: [{ id: 'picnic_lawn', weight: 40 }, { id: 'deep_forest', weight: 35 }, { id: 'bedroom', weight: 25 }] },
  { hour: 10, scenes: [{ id: 'deep_forest', weight: 45 }, { id: 'crystal_cave', weight: 30 }, { id: 'picnic_lawn', weight: 25 }] },
  { hour: 11, scenes: [{ id: 'crystal_cave', weight: 40 }, { id: 'mushroom_village', weight: 35 }, { id: 'picnic_lawn', weight: 25 }] },
  { hour: 12, scenes: [{ id: 'cafeteria', weight: 50 }, { id: 'mushroom_village', weight: 35 }, { id: 'picnic_lawn', weight: 15 }] },
  { hour: 13, scenes: [{ id: 'mushroom_village', weight: 40 }, { id: 'fairy_lake', weight: 35 }, { id: 'hammock_area', weight: 25 }] },
  { hour: 14, scenes: [{ id: 'fairy_lake', weight: 45 }, { id: 'deep_forest', weight: 30 }, { id: 'crystal_cave', weight: 25 }] },
  { hour: 15, scenes: [{ id: 'star_meadow', weight: 40 }, { id: 'viewing_platform', weight: 35 }, { id: 'stream_side', weight: 25 }] },
  { hour: 16, scenes: [{ id: 'viewing_platform', weight: 40 }, { id: 'stream_side', weight: 35 }, { id: 'bonfire_area', weight: 25 }] },
  { hour: 17, scenes: [{ id: 'bonfire_area', weight: 40 }, { id: 'supermarket', weight: 35 }, { id: 'cafe', weight: 25 }] },
  { hour: 18, scenes: [{ id: 'supermarket', weight: 40 }, { id: 'cafeteria', weight: 35 }, { id: 'bonfire_area', weight: 25 }] },
  { hour: 19, scenes: [{ id: 'cafe', weight: 40 }, { id: 'amusement_park', weight: 35 }, { id: 'bedroom', weight: 25 }] },
  { hour: 20, scenes: [{ id: 'bedroom', weight: 50 }, { id: 'arcade', weight: 30 }, { id: 'amusement_park', weight: 20 }] },
  { hour: 21, scenes: [{ id: 'bedroom', weight: 60 }, { id: 'star_meadow', weight: 25 }, { id: 'dormitory', weight: 15 }] },
  { hour: 22, scenes: [{ id: 'bedroom', weight: 70 }, { id: 'star_meadow', weight: 20 }, { id: 'dormitory', weight: 10 }] },
  { hour: 23, scenes: [{ id: 'bedroom', weight: 80 }, { id: 'dormitory', weight: 20 }] },
];

const EVENT_TYPES = ['遇到了小惊喜', '碰到了一点小麻烦', '发现了一些有趣的东西', '感到有点孤单', '突然想吃东西'];

// ========== 工具函数 ==========

function fluctuateValue(value, min, max) {
  const change = (Math.random() - 0.5) * 6;
  let newValue = value + change;
  if (newValue > max) newValue = max;
  if (newValue < min) newValue = min;
  return Math.round(newValue);
}

function weightedRandomScene(sceneWeights) {
  const totalWeight = sceneWeights.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of sceneWeights) {
    random -= item.weight;
    if (random <= 0) return item.id;
  }
  return sceneWeights[0].id;
}

function getSceneBySchedule(date) {
  const hour = date.getHours();
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const schedule = isWeekend ? WEEKEND_SCHEDULE : WEEKDAY_SCHEDULE;
  const hourConfig = schedule.find((item) => item.hour === hour);
  if (!hourConfig || !hourConfig.scenes || hourConfig.scenes.length === 0) {
    return 'bedroom';
  }
  return weightedRandomScene(hourConfig.scenes);
}

function getActivityByScene(sceneId) {
  const activities = SCENE_ACTIVITIES[sceneId];
  if (activities && activities.length > 0) {
    return activities[Math.floor(Math.random() * activities.length)];
  }
  return '在探索这个神秘的地方';
}

function getSceneType(sceneId) {
  return SCENE_TYPE_MAP[sceneId] || SCENE_TYPE.VARIABLE;
}

function getActivityDuration(sceneId) {
  const sceneType = getSceneType(sceneId);
  switch (sceneType) {
    case SCENE_TYPE.FIXED:
      return 40 + Math.floor(Math.random() * 21);
    case SCENE_TYPE.SEMI_FIXED:
      return 20 + Math.floor(Math.random() * 11);
    case SCENE_TYPE.VARIABLE:
    default:
      return 5 + Math.floor(Math.random() * 11);
  }
}

function formatDateToStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimeStr(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// ========== MiniMax API 配置（需与 config/index.js 保持一致）==========

const MINIMAX_CONFIG = {
  baseUrl: process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.com',
  apiKey: process.env.MINIMAX_API_KEY || 'sk-cp-dPU72No3ZJtfuj-3M1mBlq1AuQU--4T51F3a2Wttss59sGVOGuM7UTW07odTBHkOh2uOsHyZc4uLo7gzekqzCH6MHokSaSk7rxif7xX2YDQpHel3O9DA2iY',
  model: process.env.MINIMAX_MODEL || 'MiniMax-M2.7',
  systemPrompt:
    '你是一只陪伴大学生的心理支持宠物，温暖、可爱、略带幽默。你会用第一人称和主人交流，给他情感支持和鼓励。',
};

/**
 * 调用 MiniMax Anthropic 兼容 API
 */
function callMiniMax(prompt) {
  return new Promise((resolve, reject) => {
    const { baseUrl, apiKey, model, systemPrompt } = MINIMAX_CONFIG;
    if (!apiKey) {
      return reject(new Error('MINIMAX_API_KEY 未配置'));
    }

    const body = JSON.stringify({
      model,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
      temperature: 0.8,
    });

    const parsed = new (require('url').URL)(`${baseUrl}/anthropic/v1/messages`);
    const req = require('https').request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 30000,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log('[MiniMax] 原始响应:', JSON.stringify(json).substring(0, 1200));
            if (json.base_resp && json.base_resp.status_code !== 0) {
              return reject(new Error(json.base_resp.status_msg || `错误码 ${json.base_resp.status_code}`));
            }
            if (json.content && Array.isArray(json.content)) {
              const textBlock = json.content.find((c) => c.type === 'text');
              if (textBlock) {
                console.log('[MiniMax] textBlock 内容:', textBlock.text ? textBlock.text.substring(0, 200) : '【空】');
                return resolve(textBlock.text || '');
              }
              console.log('[MiniMax] 未找到 text 类型 content 块');
              return resolve('');
            }
            console.log('[MiniMax] 响应中无 content 数组');
            resolve('');
          } catch (e) {
            reject(e);
          }
        });
      }
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('请求超时')));
    req.write(body);
    req.end();
  });
}

/**
 * 构建日记 Prompt
 */
function buildDiaryPrompt(state, dateStr) {
  const todayLog = state.activityLog[dateStr] || [];
  const meaningfulLogs = todayLog
    .filter((a) => a.type === 'scene_change' || a.type === 'event' || Math.abs(a.moodDelta || 0) >= 5)
    .slice(0, 8);

  const activities = meaningfulLogs
    .map((a) => {
      switch (a.type) {
        case 'scene_change':
          return `• ${a.time} 来到了${a.scene}`;
        case 'event':
          return `• ${a.time} ${a.desc}${a.moodDelta > 0 ? `（心情+${a.moodDelta}）` : ''}`;
        default:
          return `• ${a.time} ${a.desc || a.type}`;
      }
    })
    .join('\n');

  return `你是"心宠"，一只可爱的虚拟心理伴侣，现在用第一人称写今天的日记。

今天发生了这些事情：
${activities || '• 今天平平淡淡地度过了一天'}

写完后我的心情是：心情${state.mood}分，能量${state.energy}分，社交${state.social}分。

请以第一人称，用温暖、可爱、略带幽默的语气，写一篇150-250字的日记。可以包含小感慨、小期待。只输出日记正文，不要加标题和格式标记。`;
}

/**
 * 调用 MiniMax 生成日记
 */
async function generateAiDiary(state, dateStr) {
  try {
    const prompt = buildDiaryPrompt(state, dateStr);
    const text = await callMiniMax(prompt);
    if (!text || text.trim().length < 20) {
      console.log('[Diary] 生成内容过短，视为失败');
      return null;
    }
    console.log(`[Diary] ${dateStr} 日记生成成功, 长度=${text.length}`);
    return text.trim();
  } catch (err) {
    console.error('[Diary] 生成失败:', err.message);
    return null;
  }
}

// ========== 数据持久化 ==========

const MAX_LOG_RETENTION_DAYS = 7;      // activityLog 保留天数
const MAX_DIARY_RETENTION_DAYS = 30;   // diaryDataMap 保留天数

/**
 * 清理和校验心宠状态数据
 * - 如果时间戳在未来，重置为当前时间
 * - 删除未来日期的数据
 * - 限制 activityLog 保留天数
 * - 限制 diaryDataMap 保留天数
 */
function sanitizeState(state) {
  if (!state) return;
  const nowMs = Date.now();
  const now = new Date();
  const todayStr = formatDateToStr(now);

  // 1. 时间戳校验：如果 lastSyncAt 在未来（允许 60 秒误差），重置为当前时间
  if (state.lastSyncAt > nowMs + 60000) {
    console.warn(`[Sanitize] ${state.userId} lastSyncAt 在未来 (${new Date(state.lastSyncAt).toISOString()})，重置为当前时间`);
    state.lastSyncAt = nowMs;
  }

  // 2. 清理 activityLog：删除未来日期和超过保留天数的旧数据
  if (state.activityLog) {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - MAX_LOG_RETENTION_DAYS);
    const cutoffStr = formatDateToStr(cutoff);

    for (const dateStr of Object.keys(state.activityLog)) {
      if (dateStr > todayStr) {
        console.warn(`[Sanitize] ${state.userId} 删除未来 activityLog: ${dateStr}`);
        delete state.activityLog[dateStr];
      } else if (dateStr < cutoffStr) {
        delete state.activityLog[dateStr];
      }
    }
  }

  // 3. 清理 diaryDataMap：删除未来日期和超过保留天数的旧数据
  if (state.diaryDataMap) {
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - MAX_DIARY_RETENTION_DAYS);
    const cutoffStr = formatDateToStr(cutoff);

    for (const dateStr of Object.keys(state.diaryDataMap)) {
      if (dateStr > todayStr) {
        console.warn(`[Sanitize] ${state.userId} 删除未来日记: ${dateStr}`);
        delete state.diaryDataMap[dateStr];
      } else if (dateStr < cutoffStr) {
        delete state.diaryDataMap[dateStr];
      }
    }
  }
}

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const map = new Map();
      for (const [key, value] of Object.entries(parsed)) {
        // 数据分离：JSON 只存持久化数据，实时状态用默认值
        const state = getDefaultState(key);
        state.diaryDataMap = value.diaryDataMap || {};
        state.bagItems = value.bagItems || [];
        state.coins = typeof value.coins === 'number' ? value.coins : 0;
        state.activityLog = value.activityLog || {};
        // 兼容旧格式：如果 JSON 中有合理的 lastSyncAt，使用它
        if (value.lastSyncAt && value.lastSyncAt > 0 && value.lastSyncAt < Date.now() + 60000) {
          state.lastSyncAt = value.lastSyncAt;
        }
        sanitizeState(state);
        map.set(key, state);
      }
      return map;
    }
  } catch (err) {
    console.error('[Data] 加载数据失败:', err.message);
    if (fs.existsSync(DATA_FILE)) {
      const backupPath = DATA_FILE + '.corrupted.' + Date.now();
      try {
        fs.renameSync(DATA_FILE, backupPath);
        console.log('[Data] 已备份损坏文件到', backupPath);
      } catch (e) {
        // 忽略备份错误
      }
    }
  }
  return new Map();
}

// 保存防抖：500ms 内多次调用只写一次
let saveTimer = null;
function saveData(dataMap) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      const persistent = {};
      for (const [userId, state] of dataMap) {
        sanitizeState(state);
        // 只保存持久化数据：日记、物品、金币、活动日志
        // 实时状态（mood/energy/social/sceneId/activity）不写入 JSON
        persistent[userId] = {
          userId: state.userId,
          diaryDataMap: state.diaryDataMap || {},
          bagItems: state.bagItems || [],
          coins: state.coins || 0,
          activityLog: state.activityLog || {},
        };
      }
      const tempFile = DATA_FILE + '.tmp';
      fs.writeFileSync(tempFile, JSON.stringify(persistent, null, 2), 'utf-8');
      fs.renameSync(tempFile, DATA_FILE);
      console.log('[Data] 持久化数据已保存到', DATA_FILE);
    } catch (err) {
      console.error('[Data] 保存数据失败:', err.message);
    }
    saveTimer = null;
  }, 500);
}

// 内存存储
const petData = loadData();

// ========== 持续运行引擎 ==========

const tickContexts = new Map(); // userId -> { tickCount, lastTickHour, lastTickMinute, lastEventTickCount }
const diaryQueue = [];
let isProcessingDiary = false;

/**
 * 异步日记队列处理：在后台逐个调用 MiniMax 生成日记
 * 不阻塞 tick 定时器
 */
async function processDiaryQueue() {
  if (isProcessingDiary || diaryQueue.length === 0) return;
  isProcessingDiary = true;

  while (diaryQueue.length > 0) {
    const { userId, state, dateStr } = diaryQueue.shift();
    console.log(`[DiaryQueue] 为 ${userId} 生成 ${dateStr} 的日记...`);
    const content = await generateAiDiary(state, dateStr);
    if (content) {
      if (!state.diaryDataMap) state.diaryDataMap = {};
      if (!state.diaryDataMap[dateStr]) state.diaryDataMap[dateStr] = [];
      state.diaryDataMap[dateStr].push({
        id: `diary_${dateStr}_${Date.now()}`,
        time: formatTimeStr(new Date()),
        type: 'AI_DIARY',
        content,
        sceneId: state.sceneId,
        moodBefore: Math.max(10, state.mood - 5),
        moodAfter: state.mood,
        energyBefore: Math.max(10, state.energy - 5),
        energyAfter: state.energy,
        socialBefore: Math.max(10, state.social - 5),
        socialAfter: state.social,
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
      });
      saveData(petData);
      console.log(`[DiaryQueue] ✓ ${userId} 的 ${dateStr} 日记生成完成，长度 ${content.length}`);
    }
  }

  isProcessingDiary = false;
}

/**
 * 单次 tick：更新心宠一个时间步的状态
 * 直接修改 state 对象
 */
function runSingleTick(state, nowMs) {
  const userId = state.userId;
  let ctx = tickContexts.get(userId);
  if (!ctx) {
    ctx = { tickCount: 0, lastTickHour: -1, lastTickMinute: -1, lastEventTickCount: -Infinity };
    tickContexts.set(userId, ctx);
  }

  ctx.tickCount++;
  const date = new Date(nowMs);
  const hour = date.getHours();
  const minute = date.getMinutes();

  // 1. 状态波动（每tick）
  state.mood = fluctuateValue(state.mood, 15, 90);
  state.energy = fluctuateValue(state.energy, 20, 95);
  state.social = fluctuateValue(state.social, 10, 85);

  // 2. 每小时场景切换（整点tick）
  if (hour !== ctx.lastTickHour) {
    ctx.lastTickHour = hour;
    const newScene = getSceneBySchedule(date);
    if (newScene !== state.sceneId) {
      console.log(`  ${formatTimeStr(date)} 心宠来到了「${newScene}」`);
      state.sceneId = newScene;
      state.activity = getActivityByScene(newScene);
      state.activityStartTime = nowMs;
      state.activityDuration = getActivityDuration(newScene);

      const dateStr = formatDateToStr(date);
      if (!state.activityLog) state.activityLog = {};
      if (!state.activityLog[dateStr]) state.activityLog[dateStr] = [];
      state.activityLog[dateStr].push({
        time: formatTimeStr(date),
        type: 'scene_change',
        scene: newScene,
      });
    }
  }

  // 3. 每5分钟行为变化检查
  if (minute % 5 === 0 && minute !== ctx.lastTickMinute) {
    ctx.lastTickMinute = minute;
    const elapsedMin = (nowMs - state.activityStartTime) / (1000 * 60);
    if (elapsedMin >= state.activityDuration) {
      state.activity = getActivityByScene(state.sceneId);
      state.activityStartTime = nowMs;
      state.activityDuration = getActivityDuration(state.sceneId);
    }
  }

  // 4. 随机事件（每6个tick即30秒，10%概率）
  if (ctx.tickCount - ctx.lastEventTickCount >= 6 && Math.random() < 0.1) {
    ctx.lastEventTickCount = ctx.tickCount;
    const eventDesc = EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
    const moodDelta = Math.floor((Math.random() - 0.5) * 10);
    state.mood = Math.max(15, Math.min(90, state.mood + moodDelta));

    const dateStr = formatDateToStr(date);
    console.log(`  ${formatTimeStr(date)} ${eventDesc}`);
    if (!state.activityLog) state.activityLog = {};
    if (!state.activityLog[dateStr]) state.activityLog[dateStr] = [];
    state.activityLog[dateStr].push({
      time: formatTimeStr(date),
      type: 'event',
      desc: eventDesc,
      moodDelta,
    });
  }

  // 5. 每分钟记录状态快照（每12个tick）
  if (ctx.tickCount > 0 && ctx.tickCount % 12 === 0) {
    const dateStr = formatDateToStr(date);
    if (!state.activityLog) state.activityLog = {};
    if (!state.activityLog[dateStr]) state.activityLog[dateStr] = [];
    state.activityLog[dateStr].push({
      time: formatTimeStr(date),
      type: 'status_change',
      mood: state.mood,
      energy: state.energy,
      social: state.social,
    });
  }

  // 6. 日记触发检查（晚间20-23点，安静场景，有活动日志，今天没写过，40%概率）
  let diaryTriggered = false;
  let diaryDateStr = null;
  if (hour >= 20 && hour <= 23) {
    const dateStr = formatDateToStr(date);
    const writingScenes = ['bedroom', 'dormitory', 'library', 'study_room', 'kitchen', 'garden'];
    const isWritingScene = writingScenes.includes(state.sceneId);
    const todayLog = state.activityLog[dateStr] || [];
    const hasDiary = state.diaryDataMap && state.diaryDataMap[dateStr] && state.diaryDataMap[dateStr].length > 0;
    if (isWritingScene && !hasDiary && todayLog.length >= 2 && Math.random() < 0.4) {
      console.log(`  ${formatTimeStr(date)} 心宠想写日记了（今天有 ${todayLog.length} 件事可以写）`);
      diaryTriggered = true;
      diaryDateStr = dateStr;
    }
  }

  state.lastSyncAt = nowMs;

  // 每次 tick 后自动清理过期数据，防止数据无限增长
  sanitizeState(state);

  return { diaryTriggered, dateStr: diaryDateStr };
}

/**
 * 离线进度模拟：服务器启动/加载时，一次性补偿停机期间的所有 tick
 * 内部调用 runSingleTick 多次
 */
async function simulateOfflineProgress(state, nowMs) {
  const TICK_MS = 5000;
  const deltaMs = nowMs - state.lastSyncAt;

  if (deltaMs <= 0 || state.lastSyncAt <= 0) {
    state.lastSyncAt = nowMs;
    return { state, generatedEvents: [], ticks: 0, diaryGenerated: [] };
  }

  const ticks = Math.floor(deltaMs / TICK_MS);
  if (ticks <= 0) {
    state.lastSyncAt = nowMs;
    return { state, generatedEvents: [], ticks: 0, diaryGenerated: [] };
  }

  console.log(`【${state.userId}】服务器停机了 ${Math.round(deltaMs / 60000)} 分钟，为心宠补偿 ${ticks} 个 tick...`);

  const diaryPending = new Set();

  for (let i = 0; i < ticks; i++) {
    const tickTime = state.lastSyncAt + (i + 1) * TICK_MS;
    const result = runSingleTick(state, tickTime);
    if (result.diaryTriggered) {
      diaryPending.add(result.dateStr);
    }
  }

  // 离线补偿结束后，统一生成待处理的日记
  const diaryGenerated = [];
  for (const dateStr of diaryPending) {
    console.log(`  正在帮心宠写 ${dateStr} 的日记...`);
    const diaryContent = await generateAiDiary(state, dateStr);
    if (diaryContent) {
      if (!state.diaryDataMap) state.diaryDataMap = {};
      if (!state.diaryDataMap[dateStr]) state.diaryDataMap[dateStr] = [];
      state.diaryDataMap[dateStr].push({
        id: `diary_${dateStr}_${Date.now()}`,
        time: formatTimeStr(new Date()),
        type: 'AI_DIARY',
        content: diaryContent,
        sceneId: state.sceneId,
        moodBefore: Math.max(10, state.mood - 5),
        moodAfter: state.mood,
        energyBefore: Math.max(10, state.energy - 5),
        energyAfter: state.energy,
        socialBefore: Math.max(10, state.social - 5),
        socialAfter: state.social,
        generatedAt: new Date().toISOString(),
        aiGenerated: true,
      });
      diaryGenerated.push(dateStr);
      console.log(`  ✓ 日记写好了！`);
    }
  }

  state.lastSyncAt = nowMs;
  console.log(`【${state.userId}】补偿完成，共执行 ${ticks} 个 tick，生成 ${diaryGenerated.length} 篇日记`);
  return { state, generatedEvents: [], ticks, diaryGenerated };
}

// ========== 默认初始状态 ==========

function getDefaultState(userId) {
  const now = Date.now();
  return {
    userId,
    mood: 60,
    energy: 75,
    social: 45,
    sceneId: 'bedroom',
    activity: '在温暖的床上休息',
    activityStartTime: now,
    activityDuration: 10,
    activityLog: {},
    coins: 0,
    bagItems: [],
    diaryDataMap: {},
    lastSyncAt: now,
  };
}

// ========== API 路由 ==========

/**
 * POST /api/pet/pull
 * 小程序启动时调用，直接读取服务器内存中的实时状态
 * 心宠状态由全局引擎持续更新，不需要离线模拟
 */
app.post('/api/pet/pull', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ code: 400, message: '缺少 userId' });
  }

  let state = petData.get(userId);
  if (!state) {
    console.log(`[API] 新用户 ${userId}，创建默认状态`);
    state = getDefaultState(userId);
    petData.set(userId, state);
    saveData(petData);
  }

  const nowMs = Date.now();
  const idleMin = Math.floor((nowMs - state.lastSyncAt) / 60000);

  console.log(`【${userId}】主人打开了小程序，拉取心宠实时状态 | 在${state.sceneId}「${state.activity}」| 心情${state.mood} 精力${state.energy} 社交${state.social} | 离线${idleMin}分钟`);

  res.json({
    code: 0,
    message: 'success',
    data: {
      state,
      diaryGenerated: [],
      offlineSeconds: idleMin * 60,
    },
  });
});

/**
 * POST /api/pet/push
 * 小程序关闭/隐藏时调用，同步当前状态到服务器
 */
app.post('/api/pet/push', (req, res) => {
  const { userId, state } = req.body;
  if (!userId || !state) {
    return res.status(400).json({ code: 400, message: '缺少 userId 或 state' });
  }

  // 智能合并：保留服务器和小程序双方的日记、活动日志
  const existing = petData.get(userId) || {};

  // 合并日记：按日期分组，同一天的去重（按 id）
  const mergedDiary = {};
  const allDiarySources = [existing.diaryDataMap, state.diaryDataMap];
  for (const src of allDiarySources) {
    if (!src) continue;
    for (const [date, entries] of Object.entries(src)) {
      if (!mergedDiary[date]) mergedDiary[date] = [];
      const existingIds = new Set(mergedDiary[date].map((e) => e.id));
      for (const entry of entries) {
        if (entry.id && !existingIds.has(entry.id)) {
          mergedDiary[date].push(entry);
          existingIds.add(entry.id);
        } else if (!entry.id) {
          // 无 id 的条目直接追加（兜底）
          mergedDiary[date].push(entry);
        }
      }
    }
  }

  // 合并活动日志：按日期分组，去重（按时间+类型+描述）
  const mergedActivityLog = {};
  const allLogSources = [existing.activityLog, state.activityLog];
  for (const src of allLogSources) {
    if (!src) continue;
    for (const [date, entries] of Object.entries(src)) {
      if (!mergedActivityLog[date]) mergedActivityLog[date] = [];
      const existingKeys = new Set(mergedActivityLog[date].map((e) => `${e.time}_${e.type}_${e.desc || ''}`));
      for (const entry of entries) {
        const key = `${entry.time}_${entry.type}_${entry.desc || ''}`;
        if (!existingKeys.has(key)) {
          mergedActivityLog[date].push(entry);
          existingKeys.add(key);
        }
      }
    }
  }

  const merged = {
    ...existing,
    ...state,
    diaryDataMap: mergedDiary,
    activityLog: mergedActivityLog,
    userId,
    lastSyncAt: Date.now(),
  };

  petData.set(userId, merged);
  saveData(petData);

  console.log(`【${userId}】主人离开了，心宠状态已保存：${merged.activity}，心情${merged.mood}分`);

  res.json({ code: 0, message: 'success' });
});

/**
 * GET /api/pet/status
 * 调试接口：查看指定用户的当前状态
 */
app.get('/api/pet/status', (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ code: 400, message: '缺少 userId' });
  }
  const state = petData.get(userId);
  if (!state) {
    return res.status(404).json({ code: 404, message: '用户未找到' });
  }
  res.json({ code: 0, data: state });
});

/**
 * POST /api/pet/test-diary
 * 调试接口：直接测试 MiniMax API 日记生成
 */
app.post('/api/pet/test-diary', async (req, res) => {
  const { userId } = req.body;
  const testUserId = userId || 'test_user';

  // 构造一个带活动日志的测试状态
  const today = formatDateToStr(new Date());
  const state = {
    userId: testUserId,
    mood: 65,
    energy: 70,
    social: 50,
    sceneId: 'bedroom',
    activity: '在温暖的床上休息',
    activityStartTime: Date.now(),
    activityDuration: 10,
    activityLog: {
      [today]: [
        { time: '09:00', type: 'scene_change', scene: '图书馆' },
        { time: '11:30', type: 'event', desc: '完成了一份作业', moodDelta: 5 },
        { time: '12:00', type: 'scene_change', scene: '食堂' },
        { time: '14:00', type: 'event', desc: '和朋友聊了会儿天', moodDelta: 3 },
        { time: '16:00', type: 'scene_change', scene: '操场' },
        { time: '18:00', type: 'scene_change', scene: 'bedroom' },
      ],
    },
    diaryDataMap: {},
    lastSyncAt: Date.now(),
  };

  console.log(`[Test] 开始为 ${testUserId} 测试日记生成...`);
  const startTime = Date.now();
  const diaryContent = await generateAiDiary(state, today);
  const elapsed = Date.now() - startTime;

  if (diaryContent) {
    console.log(`[Test] 日记生成成功, 耗时 ${elapsed}ms, 长度 ${diaryContent.length}`);
    res.json({
      code: 0,
      message: 'success',
      data: {
        diaryContent,
        userId: testUserId,
        date: today,
        elapsedMs: elapsed,
      },
    });
  } else {
    console.log(`[Test] 日记生成失败, 耗时 ${elapsed}ms`);
    res.json({ code: 500, message: '日记生成失败', data: null });
  }
});

/**
 * GET /health
 * 健康检查
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), users: petData.size });
});

// ========== 全局持续运行引擎 ==========
// 服务器启动时，先补偿停机时间，再启动定时器
(async function initEngine() {
  console.log('[Engine] 启动心宠持续运行引擎...');
  const nowMs = Date.now();

  for (const [userId, state] of petData) {
    await simulateOfflineProgress(state, nowMs);
  }
  saveData(petData);

  console.log('[Engine] 停机补偿完成，启动实时 tick 定时器（每 5 秒）');

  // 每 5 秒为所有活跃心宠执行一次 tick
  setInterval(() => {
    const now = Date.now();
    for (const [userId, state] of petData) {
      // 跳过超过 24 小时不活跃的用户
      if (now - state.lastSyncAt > 24 * 3600 * 1000) continue;

      const result = runSingleTick(state, now);
      if (result.diaryTriggered) {
        diaryQueue.push({ userId, state, dateStr: result.dateStr });
        processDiaryQueue();
      }
    }
    saveData(petData);
  }, 5000);
})();

// ========== 定时状态播报 ==========
setInterval(() => {
  if (petData.size === 0) return;
  console.log('');
  console.log('--- 心宠们在做什么 ---');
  for (const [userId, state] of petData) {
    const diaryCount = Object.values(state.diaryDataMap || {}).reduce((sum, arr) => sum + arr.length, 0);
    const idleMin = Math.floor((Date.now() - state.lastSyncAt) / 60000);
    console.log(`  ${userId.slice(0, 16)} | 在${state.sceneId}「${state.activity}」| 心情${state.mood} 精力${state.energy} 社交${state.social} | 日记${diaryCount}篇 | 离线${idleMin}分钟`);
  }
  console.log('');
}, 30000);

// ========== 启动 ==========
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  心宠持续运行服务器已启动`);
  console.log(`  端口: ${PORT}`);
  console.log(`  数据文件: ${DATA_FILE}`);
  console.log(`  当前用户: ${petData.size}`);
  console.log(`  引擎模式: 全局 setInterval，每 5 秒 tick`);
  console.log(`  日记模式: 异步队列，触发后后台调用 MiniMax`);
  console.log(`===============================================`);
  console.log('');
  console.log('API 端点:');
  console.log(`  POST http://localhost:${PORT}/api/pet/test-diary     - 测试日记生成`);
  console.log(`  POST http://localhost:${PORT}/api/pet/pull           - 拉取实时状态（直接读取内存）`);
  console.log(`  POST http://localhost:${PORT}/api/pet/push           - 推送状态`);
  console.log(`  GET  http://localhost:${PORT}/api/pet/status?userId=xxx  - 查看状态`);
  console.log(`  GET  http://localhost:${PORT}/health                 - 健康检查`);
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ 错误：端口 ${PORT} 已被占用`);
    console.error('   可能是之前的服务器进程还在运行。');
    console.error('');
    console.error('   解决方案（在 PowerShell 中执行）：');
    console.error('   Get-NetTCPConnection -LocalPort 3002 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }');
    console.error('');
    console.error('   或者手动结束所有 node.exe 进程，然后重新启动服务器。\n');
    process.exit(1);
  }
  console.error('服务器启动错误:', err);
  process.exit(1);
});
