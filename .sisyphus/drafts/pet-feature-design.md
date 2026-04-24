# 心宠功能开发设计文档

## 1. 概述

### 1.1 产品定位
**心宠**是 PsyTwin 口袋版的核心特色功能，它将用户的心理特质具象化为一个虚拟宠物。心宠在虚拟世界中自主生活、学习、社交，是用户内心世界的数字化映射。

### 1.2 核心理念
- **心理映射**：心宠的性格、行为模式反映用户的心理测评结果
- **自主生活**：心宠拥有独立AI，用户不直接控制，仅在大事件时提供协助
- **沉浸体验**：虚拟世界与现实时间同步，营造真实的"云养宠"体验
- **社交连接**：用户的心宠在公共场景中与其他心宠自然交互

---

## 2. 页面结构设计

### 2.1 整体布局

```
┌─────────────────────────────────────┐
│  [状态栏] 心情/能量/社交 + [设置]    │  ← 顶部
├─────────────────────────────────────┤
│                                     │
│     [场景名称：奇幻森林]            │
│                                     │
│         🌳  🏰  🐱                  │
│                                     │
│     [心宠活动区域 - Canvas/WebGL]   │  ← 中间（主体）
│                                     │
│      (其他用户的心宠在活动)         │
│                                     │
├─────────────────────────────────────┤
│  [事件提示] "你的小猫正在上课..."    │  ← 事件流
├─────────────────────────────────────┤
│  [地图按钮] [帮助] [背包] [日记]    │  ← 底部（4个按钮）
└─────────────────────────────────────┘
```

### 2.2 底部按钮设计（仅4个）

| 按钮 | 图标 | 功能 | 说明 |
|------|------|------|------|
| **世界地图** | 🗺️ | 打开场景选择面板 | 切换不同场景，查看心宠位置 |
| **提供帮助** | 🤝 | 处理心宠求助事件 | 大事件时闪烁提醒，日常灰色不可点 |
| **心宠背包** | 🎒 | 查看和管理物品 | 礼物、道具、收集品 |
| **心情日记** | 📖 | 查看心宠日志 | 时间线记录心宠一天的活动 |

---

## 3. 心宠系统

### 3.1 心宠属性

#### 基础属性（由心理测评生成）
```javascript
{
  id: "pet_xxx",
  ownerId: "stu_xxx",
  name: "用户命名",
  species: "cat", // 根据心理类型生成：cat/dog/bird/rabbit/fox
  
  // 核心三维（映射心理状态）
  traits: {
    mood: 60,        // 心情值 0-100
    energy: 75,      // 能量值 0-100
    sociability: 20, // 社交值 0-100
  },
  
  // 性格维度（由MBTI/大五人格映射）
  personality: {
    openness: 70,        // 开放性
    conscientiousness: 60, // 尽责性
    extraversion: 40,     // 外向性
    agreeableness: 80,    // 宜人性
    neuroticism: 30,      // 神经质
  },
  
  // 状态
  state: {
    currentActivity: "attending_class",
    location: { sceneId: "classroom", x: 100, y: 200 },
    moodStatus: "normal", // normal/happy/sad/anxious/excited
    isOnline: true,
    lastUpdate: "2026-04-23T08:00:00Z"
  }
}
```

#### 动态状态
- **心情值**: 影响心宠表情和行为频率
- **能量值**: 决定可执行的活动强度
- **社交值**: 影响与其他心宠互动的意愿

### 3.2 心宠外观生成

根据心理测评结果自动生成：
- **物种**: 内向→猫/兔，外向→狗/狐，神经质高→鸟
- **毛色**: 根据情绪稳定性（冷色/暖色）
- **配饰**: 根据用户兴趣标签
- **行为模式**: 根据人格特质

---

## 4. 场景系统（世界地图）

### 4.1 场景列表

| 场景ID | 名称 | 类型 | 开放时间 | 描述 |
|--------|------|------|----------|------|
| `fantasy_forest` | 奇幻森林 | 探索 | 全天 | 神秘的魔法森林，适合探索和放松 |
| `holy_temple` | 圣灵殿 | 静谧 | 全天 | 神圣庄严的场所，用于冥想和恢复 |
| `counseling_room` | 心理咨询室 | 服务 | 9:00-18:00 | 专业咨询场景，心宠可获得心理支持 |
| `open_forest` | 开放森林 | 社交 | 全天 | 开阔的自然空间，心宠社交的主要场所 |
| `classroom` | 教室 | 学习 | 8:00-22:00 | 上课学习的地方，根据现实课程表安排 |

### 4.2 场景切换

```
点击[地图按钮]
    ↓
弹出场景选择面板（半透明遮罩）
    ↓
显示5个场景缩略图 + 当前心宠位置
    ↓
选择场景 → 过渡动画 → 加载新场景
    ↓
心宠在新的场景中继续活动
```

### 4.3 场景特性

每个场景拥有：
- **背景图**: 像素风场景背景
- **可交互点**: 椅子、树木、建筑等
- **NPC心宠**: 其他用户的虚拟心宠
- **场景事件**: 该场景特有的小事件
- **天气效果**: 白天/夜晚/雨天等

---

## 5. 时间系统

### 5.1 与现实时间同步

```javascript
const SCHEDULE = {
  // 早间
  "06:00-07:00": { activity: "wake_up", scene: "fantasy_forest", desc: "起床，在森林中苏醒" },
  "07:00-08:00": { activity: "morning_routine", scene: "open_forest", desc: "晨间活动，洗漱早餐" },
  
  // 上午课程
  "08:00-09:40": { activity: "attending_class", scene: "classroom", desc: "第一节课" },
  "09:40-10:00": { activity: "break", scene: "open_forest", desc: "课间休息" },
  "10:00-11:40": { activity: "attending_class", scene: "classroom", desc: "第二节课" },
  "11:40-14:00": { activity: "lunch", scene: "open_forest", desc: "午餐和午休" },
  
  // 下午课程
  "14:00-15:40": { activity: "attending_class", scene: "classroom", desc: "第三节课" },
  "15:40-16:00": { activity: "break", scene: "open_forest", desc: "课间休息" },
  "16:00-17:40": { activity: "attending_class", scene: "classroom", desc: "第四节课" },
  
  // 傍晚
  "17:40-18:30": { activity: "dinner", scene: "open_forest", desc: "晚餐时间" },
  "18:30-19:30": { activity: "free_time", scene: "fantasy_forest", desc: "自由活动时间" },
  
  // 晚间
  "19:30-21:30": { activity: "evening_study", scene: "classroom", desc: "晚自习" },
  "21:30-22:30": { activity: "social", scene: "open_forest", desc: "社交时间" },
  "22:30-23:00": { activity: "relax", scene: "holy_temple", desc: "冥想放松" },
  "23:00-06:00": { activity: "sleeping", scene: "fantasy_forest", desc: "睡觉中..." },
};
```

### 5.2 时间显示

```
当前时间: 14:30
心宠状态: 🎒 正在上课
地点: 教室
下节课: 15:40 课间休息
```

---

## 6. 随机事件系统

### 6.1 事件类型

#### A. 日常小事（自动处理）
- 遇到同学打招呼
- 发现一朵奇怪的花
- 在食堂吃到好吃的
- 课间小憩

#### B. 中型事件（可能影响属性）
- 考试压力大（心情-10）
- 交到新朋友（社交+15）
- 运动过量（能量-20）
- 发现宝藏（获得物品）

#### C. 大型事件（需要用户帮助）⚠️
- **学业危机**: "心宠考试失利，需要你的鼓励"
- **人际冲突**: "心宠和朋友吵架了，需要你的建议"
- **情绪低落**: "心宠感到孤独，需要你陪伴"
- **重大选择**: "心宠面临社团选择，需要你的指导"

### 6.2 事件触发机制

```javascript
// 事件触发器
class EventTrigger {
  // 基于时间的固定事件
  checkTimeBasedEvents(currentTime) {
    // 上课时间自动触发"上课"事件
    // 吃饭时间自动触发"用餐"事件
  }
  
  // 基于属性的随机事件
  checkAttributeEvents(pet) {
    if (pet.traits.mood < 30) {
      // 30%概率触发"情绪低落"事件
      return this.randomTrigger(0.3, "low_mood_event");
    }
    if (pet.traits.energy < 20) {
      return this.randomTrigger(0.4, "tired_event");
    }
  }
  
  // 基于场景的社交事件
  checkSocialEvents(pet, nearbyPets) {
    if (nearbyPets.length > 0 && pet.traits.sociability > 50) {
      return this.randomTrigger(0.5, "social_interaction");
    }
  }
  
  // 稀有随机事件（每天1-3次）
  checkRareEvents() {
    const dailyEventCount = Math.floor(Math.random() * 3) + 1;
    // 从稀有事件池中选择
  }
}
```

### 6.3 事件处理流程

```
事件触发
    ↓
判断事件级别
    ↓
┌─────────┬──────────┬──────────┐
│ 日常小事 │ 中型事件  │ 大型事件  │
└────┬────┴────┬─────┴────┬─────┘
     ↓         ↓          ↓
自动处理   自动+属性变化  推送给用户
     ↓         ↓          ↓
记录日志   记录日志      [帮助按钮闪烁]
                        用户点击处理
                            ↓
                        选择应对方式
                            ↓
                        影响心宠属性
                            ↓
                        记录事件结果
```

---

## 7. 社交系统

### 7.1 心宠间交互

当多个心宠在同一场景时：

```javascript
// 心宠A看到心宠B
if (distance(petA, petB) < INTERACTION_RANGE) {
  // 根据性格决定是否交互
  if (petA.personality.extraversion > 50 || petB.personality.extraversion > 50) {
    // 发起交互
    const interaction = generateInteraction(petA, petB);
    // 交互类型：打招呼、聊天、一起活动、分享物品
  }
}
```

### 7.2 交互类型

| 交互 | 触发条件 | 效果 |
|------|----------|------|
| 打招呼 | 靠近时 | 双方心情+1 |
| 聊天 | 性格外向 | 双方社交+2 |
| 一起学习 | 在教室 | 学习效率提升 |
| 分享食物 | 携带食物 | 心情+3，友谊值+1 |
| 安慰 | 对方心情低 | 对方心情+5 |

### 7.3 友谊系统

```javascript
{
  friendshipId: "fs_xxx",
  petA: "pet_001",
  petB: "pet_002",
  level: 3, // 1-10级
  interactionCount: 25,
  lastInteraction: "2026-04-23T10:30:00Z",
  memories: [
    { date: "2026-04-20", event: "一起在森林探险" },
    { date: "2026-04-21", event: "分享午餐" }
  ]
}
```

---

## 8. 用户交互设计

### 8.1 四个按钮详解

#### 1️⃣ 世界地图 🗺️
```
点击 → 弹出场景面板
        ↓
┌──────────────────────────────┐
│  世界地图                      │
│  ┌─────┐ ┌─────┐ ┌─────┐    │
│  │奇幻 │ │圣灵 │ │咨询 │    │
│  │森林 │ │殿   │ │室   │    │
│  └─────┘ └─────┘ └─────┘    │
│  ┌─────┐ ┌─────┐             │
│  │开放 │ │教室 │             │
│  │森林 │ │     │             │
│  └─────┘ └─────┘             │
│                               │
│  你的心宠当前在: 教室 📍      │
│  状态: 正在上课               │
└──────────────────────────────┘
```

#### 2️⃣ 提供帮助 🤝
```
正常状态: 灰色图标，显示"暂无求助"

有事件时: 
  - 图标闪烁 ✨
  - 红点通知 🔴
  - 显示事件数量 "3个求助"

点击后:
  - 显示待处理事件列表
  - 每个事件有简短描述
  - 点击进入处理界面

处理界面:
  ┌─────────────────────────────┐
  │  ❤️ 心宠求助                  │
  │                             │
  │  "我今天考试没考好，          │
  │   心情好差..."               │
  │                             │
  │  [选择回应方式]               │
  │  ┌─────────┐ ┌─────────┐   │
  │  │ 安慰鼓励 │ │ 分析原因 │   │
  │  └─────────┘ └─────────┘   │
  │  ┌─────────┐ ┌─────────┐   │
  │  │ 讲个笑话 │ │ 静静陪伴 │   │
  │  └─────────┘ └─────────┘   │
  └─────────────────────────────┘
```

#### 3️⃣ 心宠背包 🎒
```
功能:
- 查看心宠拥有的物品
- 使用道具（食物、玩具等）
- 查看收集品

物品类型:
- 食物: 恢复能量、提升心情
- 玩具: 提升心情、触发特殊动作
- 礼物: 送给其他心宠，提升友谊
- 收集品: 场景探索获得，纯展示
```

#### 4️⃣ 心情日记 📖
```
时间线显示:

今天 2026-04-23
├─ 08:00 🌅 起床，精神满满 (+5能量)
├─ 08:30 📚 去教室上课
├─ 10:00 ☕ 课间休息，遇到小花打招呼
├─ 12:00 🍱 午餐时间，吃了好吃的 (+3心情)
├─ 14:00 😰 [求助事件] 考试没考好
│         → 你选择了"安慰鼓励"
│         → 心情恢复 (+15心情) ❤️
├─ 16:00 🎮 自由活动，在森林探险
└─ 18:00 🍽️ 晚餐时间

昨天 2026-04-22
├─ ...
```

---

## 9. 技术架构

### 9.1 前端架构

```
PsyTwin-Pocket (微信小程序)
│
├─ pages/pet/
│  ├─ index.js      # 页面逻辑
│  ├─ index.wxml    # 页面结构
│  ├─ index.less    # 页面样式
│  └─ components/   # 子组件
│     ├─ status-bar/     # 状态栏
│     ├─ scene-viewer/   # 场景渲染
│     ├─ event-panel/    # 事件面板
│     ├─ map-panel/      # 地图面板
│     ├─ help-modal/     # 帮助弹窗
│     └─ diary-view/     # 日记视图
│
├─ behaviors/petAI.js    # 心宠AI行为
├─ utils/petEngine.js    # 心宠引擎
└─ mock/pet/             # 模拟数据
```

### 9.2 后端架构

```
PsyTwin-Sentinel (Next.js)
│
├─ app/api/pocket/pet/
│  ├─ status/route.ts       # 获取心宠状态
│  ├─ interact/route.ts     # 用户交互
│  ├─ events/route.ts       # 事件处理
│  ├─ scene/change/route.ts # 场景切换
│  └─ diary/route.ts        # 日记记录
│
├─ lib/pet/
│  ├─ engine.ts        # 心宠引擎核心
│  ├─ eventGenerator.ts # 事件生成器
│  ├─ schedule.ts      # 时间表管理
│  └─ social.ts        # 社交系统
│
└─ prisma/schema.prisma  # 数据库模型
```

### 9.3 实时通信

```
WebSocket 通道: /ws/pet

消息类型:
- pet_status_update   # 心宠状态更新
- pet_event_trigger   # 事件触发
- pet_interaction     # 心宠间交互
- scene_sync          # 场景同步
- user_help_request   # 用户帮助请求
```

---

## 10. 数据结构

### 10.1 数据库模型

```prisma
// 心宠表
model Pet {
  id            String   @id @default(cuid())
  ownerId       String   // 关联学生ID
  name          String
  species       String   // cat/dog/bird/rabbit/fox
  
  // 性格特质
  openness      Int      @default(50)
  conscientiousness Int  @default(50)
  extraversion  Int      @default(50)
  agreeableness Int      @default(50)
  neuroticism   Int      @default(50)
  
  // 动态状态
  mood          Int      @default(60)
  energy        Int      @default(75)
  sociability   Int      @default(20)
  
  // 位置信息
  currentScene  String   @default("fantasy_forest")
  positionX     Float    @default(0)
  positionY     Float    @default(0)
  
  // 状态
  currentActivity String @default("idle")
  isOnline      Boolean  @default(true)
  
  // 时间戳
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  lastActionAt  DateTime @default(now())
  
  // 关系
  owner         Student  @relation(fields: [ownerId], references: [id])
  inventory     PetItem[]
  events        PetEvent[]
  friendships   Friendship[]
  diary         DiaryEntry[]
}

// 事件表
model PetEvent {
  id          String   @id @default(cuid())
  petId       String
  type        String   // daily/medium/large
  title       String
  description String
  status      String   @default("pending") // pending/processing/completed
  
  // 事件影响
  moodChange   Int     @default(0)
  energyChange Int     @default(0)
  socialChange Int     @default(0)
  
  // 用户回应
  userResponse String?  // 用户选择的回应方式
  responseTime DateTime?
  
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
  
  pet         Pet      @relation(fields: [petId], references: [id])
}

// 友谊表
model Friendship {
  id                String   @id @default(cuid())
  petAId            String
  petBId            String
  level             Int      @default(1)
  interactionCount  Int      @default(0)
  lastInteraction   DateTime @default(now())
  
  petA              Pet      @relation("FriendshipA", fields: [petAId], references: [id])
  petB              Pet      @relation("FriendshipB", fields: [petBId], references: [id])
}

// 日记条目
model DiaryEntry {
  id          String   @id @default(cuid())
  petId       String
  date        DateTime
  content     String
  activity    String
  sceneId     String
  moodBefore  Int
  moodAfter   Int
  
  pet         Pet      @relation(fields: [petId], references: [id])
}

// 心宠物品
model PetItem {
  id          String   @id @default(cuid())
  petId       String
  itemType    String   // food/toy/gift/collectible
  name        String
  description String
  quantity    Int      @default(1)
  effect      Json?    // { mood: +10, energy: +5 }
  
  pet         Pet      @relation(fields: [petId], references: [id])
}
```

---

## 11. API 接口设计

### 11.1 心宠状态获取

```
GET /api/pocket/pet/status

Request:
  Headers: { Authorization: "Bearer <token>" }

Response:
  {
    "code": 0,
    "data": {
      "pet": {
        "id": "pet_xxx",
        "name": "咪咪",
        "species": "cat",
        "traits": {
          "mood": 60,
          "energy": 75,
          "sociability": 20
        },
        "state": {
          "currentActivity": "attending_class",
          "location": {
            "sceneId": "classroom",
            "x": 100,
            "y": 200
          }
        }
      },
      "currentScene": {
        "id": "classroom",
        "name": "教室",
        "otherPets": [
          { "id": "pet_yyy", "name": "旺财", "species": "dog", "x": 150, "y": 180 }
        ]
      },
      "schedule": {
        "currentPeriod": "14:00-15:40",
        "activity": "attending_class",
        "nextActivity": "break",
        "nextTime": "15:40"
      }
    }
  }
```

### 11.2 处理求助事件

```
POST /api/pocket/pet/events/{eventId}/respond

Request:
  {
    "responseType": "comfort", // comfort/analyze/joke/accompany
    "message": "加油，下次会更好！"
  }

Response:
  {
    "code": 0,
    "data": {
      "result": {
        "moodChange": +15,
        "energyChange": +5,
        "message": "心宠感受到了你的鼓励，心情变好了！"
      }
    }
  }
```

### 11.3 获取日记

```
GET /api/pocket/pet/diary?date=2026-04-23

Response:
  {
    "code": 0,
    "data": {
      "entries": [
        {
          "time": "08:00",
          "activity": "wake_up",
          "content": "起床，精神满满",
          "moodChange": +5
        },
        {
          "time": "14:00",
          "activity": "event",
          "content": "考试没考好，心情低落",
          "eventId": "evt_xxx",
          "moodChange": -20
        }
      ]
    }
  }
```

---

## 12. 开发阶段

### Phase 1: 基础框架（2周）
- [ ] 心宠基础数据结构
- [ ] 页面UI框架（状态栏 + 场景区域 + 4个按钮）
- [ ] 场景切换功能
- [ ] 基础时间系统

### Phase 2: AI引擎（2周）
- [ ] 心宠自主行为AI
- [ ] 属性变化系统
- [ ] 日程管理系统
- [ ] 基础事件触发

### Phase 3: 社交系统（1周）
- [ ] 多心宠同场景显示
- [ ] 心宠间交互逻辑
- [ ] 友谊系统

### Phase 4: 事件系统（1周）
- [ ] 随机事件生成器
- [ ] 事件分级系统
- [ ] 用户帮助交互
- [ ] 事件结果影响

### Phase 5: 完善体验（1周）
- [ ] 背包系统
- [ ] 心情日记
- [ ] 动画效果
- [ ] 音效反馈
- [ ] 性能优化

---

## 13. 像素风UI设计规范

### 13.1 色彩方案

```css
/* 主色调 */
--primary: #6B5B95;      /* 紫罗兰 - 神秘梦幻 */
--secondary: #88B04B;    /* 草木绿 - 自然生机 */
--accent: #F7CAC9;       /* 樱花粉 - 温柔治愈 */

/* 状态色 */
--mood: #FF6B6B;         /* 心情 - 红色 */
--energy: #FECA57;       /* 能量 - 黄色 */
--social: #48DBFB;       /* 社交 - 蓝色 */

/* 场景色 */
--forest: #2ECC71;       /* 森林绿 */
--temple: #9B59B6;       /* 神殿紫 */
--classroom: #E67E22;    /* 教室橙 */

/* 中性色 */
--bg-dark: #2C3E50;      /* 深色背景 */
--bg-light: #ECF0F1;     /* 浅色背景 */
--text-primary: #2C3E50; /* 主文字 */
--text-secondary: #7F8C8D; /* 次要文字 */
```

### 13.2 字体

- 中文: 像素字体（如"站酷快乐体"）
- 英文: "Press Start 2P" 或 "VT323"
- 字号: 标题 32rpx，正文 26rpx，小字 22rpx

### 13.3 组件风格

```
按钮风格:
┌─────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← 像素边框
│  ▓ 对话      ▓  │  ← 内边距
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓  │
└─────────────────┘

卡片风格:
╔═════════════════╗
║  ┌───────────┐  ║
║  │   🐱      │  ║
║  └───────────┘  ║
║  心宠名称        ║
╚═════════════════╝
```

---

## 14. 待确认事项

1. **场景渲染技术**: Canvas 2D / WebGL / 像素图拼接？
2. **实时同步频率**: 心宠状态多久同步一次？
3. **离线支持**: 用户离线时心宠是否继续活动？
4. **多设备登录**: 同一账号多设备登录如何处理？
5. **心宠寿命**: 是否有寿命限制？毕业后的处理？

---

**文档版本**: v1.0  
**创建日期**: 2026-04-23  
**状态**: 设计阶段
