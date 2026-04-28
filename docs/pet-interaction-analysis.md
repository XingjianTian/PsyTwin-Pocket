# PsyTwin-Pocket 心宠交互逻辑全面分析报告

> **版本**: v1.0
> **生成日期**: 2026-04-28
> **分析范围**: pages/pet/ 全模块 + utils/petWebSocket.js + 相关子页面

---

## 目录

1. [功能架构总览](#一功能架构总览)
2. [核心交互模块详解](#二核心交互模块详解)
   - 2.1 三维状态系统
   - 2.2 心宠精灵渲染与移动
   - 2.3 场景系统
   - 2.4 视图切换系统
   - 2.5 帮助事件系统
   - 2.6 背包系统
   - 2.7 心情日记系统
   - 2.8 WebSocket 实时通信
   - 2.9 全局事件总线
3. [动画系统汇总](#三动画系统汇总)
4. [数据流时序图](#四数据流时序图)
5. [与产品文档对比](#五与产品文档对比)
6. [关键发现与建议](#六关键发现与建议)

---

## 一、功能架构总览

```
PsyTwin-Pocket 心宠模块
├── 主页面: pages/pet/index (四合一视图)
│   ├── 游戏视图 (game) - 状态栏 + 心宠精灵 + 场景背景
│   ├── 世界地图 (map) - 5个一级场景 + 5个二级场景
│   ├── 心宠背包 (bag) - 物品查看（只读）
│   ├── 心情日记 (diary) - 时间线记录
│   └── 帮助事件 (help) - 大型事件处理
│
├── 子页面（备用路由）
│   ├── pages/pet/map/index - 独立地图页面
│   ├── pages/pet/bag/index - 独立背包页面
│   ├── pages/pet/diary/index - 独立日记页面
│   └── pages/pet/events/index - 独立事件页面
│
├── 通信层
│   └── utils/petWebSocket.js - WebSocket 客户端
│
└── 文档
    ├── docs/pet-product-design.md - 产品需求
    ├── docs/pet-api-contract.md - API 契约
    └── docs/pet-ui-complete-design.md - UI 设计
```

---

## 二、核心交互模块详解

### 2.1 三维状态系统

**状态定义** (`pages/pet/index.js` 第 22-34 行):

```javascript
data: {
  mood: 60,      // 心情 0-100，影响表情动画
  energy: 75,    // 能量 0-100，决定活动强度
  social: 45,    // 社交 0-100，影响互动意愿
}
```

**状态波动机制** (第 379-411 行):

| 属性 | 说明 |
|------|------|
| 定时器 | `statusTimer`，每 5 秒执行一次 |
| 波动算法 | `fluctuateValue(value, min, max)`，随机 ±3 |
| 边界限制 | 心情 15-90，能量 20-95，社交 10-85 |

**低值警告** (< 30%):

- 图标抖动动画 (`icon-shake` keyframes)
- 数值文字脉冲 (`text-pulse`)
- 进度条颜色渐变（红 → 绿）

**数据绑定** (WXML):

```xml
<view class="progress-fill mood-fill" style="width: {{mood}}%"></view>
<view class="status-value {{mood < 30 ? 'warning-text' : ''}}">{{mood}}</view>
```

---

### 2.2 心宠精灵渲染与移动

**精灵设计** (`index.less` 第 368-475 行):

- 纯 CSS 绘制：粉色圆形身体 + 黑色眼睛 + 腮红 + 微笑嘴巴 + 💕 蝴蝶结耳朵
- 持续弹跳动画：`sprite-bounce` (0.5 秒循环，上下 4px)

**移动系统** (第 322-376 行):

```javascript
// 边界计算（限制在底部草地区域）
boundary = {
  minX: 50,
  maxX: windowWidth - 50,
  minY: windowHeight * 0.4,
  maxY: windowHeight * 0.55,
};

// 移动定时器：每 3 秒 40% 概率移动
moveTimer = setInterval(() => {
  if (Math.random() < 0.4) {
    this.movePetSmoothly();
  }
}, 3000);

// 平滑移动动画
this.petAnim = wx.createAnimation({
  duration: 1500,
  timingFunction: 'ease-in-out',
});
this.petAnim.left(targetX).top(targetY).step();
```

**场景关联逻辑**:

- 心宠有自己的当前场景 (`petSceneId`)
- 如果 `petSceneId !== currentSceneId`，精灵隐藏，显示"心宠正在 [场景名]"
- 每 15 秒 30% 概率随机切换场景 (`switchPetScene`)
- 切换回用户场景时显示 Toast "心宠回来了！"

---

### 2.3 场景系统

**场景数据结构** (第 78-216 行):

```javascript
// 5 个一级场景
scenes: [
  { id: 'fantasy_space', name: '奇幻空间', icon: '🌲', ... },
  { id: 'dream_house', name: '梦境小屋', icon: '🌙', ... },
  { id: 'open_wilderness', name: '自由旷野', icon: '🌳', ... },
  { id: 'soul_harbor', name: '心灵港湾', icon: '🛋️', ... },
  { id: 'school', name: '学校', icon: '🏫', hasSecondary: true, ... },
]

// 二级场景（学校下 5 个）
secondaryScenes: {
  school: [
    { id: 'library', name: '图书馆', ... },
    { id: 'teaching_building', name: '教学楼', ... },
    { id: 'lab', name: '实验室', ... },
    { id: 'playground', name: '操场', ... },
    { id: 'cafeteria', name: '食堂', ... },
  ]
}
```

**场景切换交互**:

1. **用户主动切换**:
   - 点击地图场景 → 确认弹窗 → 更新 `currentSceneId` → Toast 提示
   - 有二级场景的先进入二级视图（缩放动画过渡）

2. **心宠自主切换**:
   - 随机选择不同于当前的场景
   - 更新 `petSceneId` 和 `petMarkerStyle`
   - 如果切回用户场景，触发"心宠回来了"提示

---

### 2.4 视图切换系统

**五个视图状态** (第 609-632 行):

```javascript
switchView(view) {
  if (this.data.currentView === view) {
    this.setData({ currentView: 'game' }); // 再次点击返回游戏
  } else {
    this.setData({ currentView: view });
  }
}
```

**底部按钮面板**:

| 按钮 | 图标 | 正常状态 | 有事件时 |
|------|------|---------|---------|
| 世界地图 | 🗺️ | 紫色图标 | 不变 |
| 帮助 | 🤝 | 灰色"暂无求助" | 红色脉冲 + 红点 + 事件数 |
| 背包 | 🎒 | 紫色图标 | 不变 |
| 日记 | 📖 | 紫色图标 | 不变 |

**全屏模式** (第 612-617 行):

- 点击 ⛶ 按钮 → 隐藏 TabBar (`eventBus.emit('tabbar-toggle', true)`)
- 游戏视图扩展到全屏
- 显示浮动退出全屏按钮

---

### 2.5 帮助事件系统

**事件触发**:

- **模拟触发**: 每 30 秒 10% 概率 (`startStatusAnimation`)
- **WebSocket 触发**: 服务端推送 `event_trigger` 消息

**事件结构** (第 932-955 行):

```javascript
{
  id: 'evt_001',
  type: 'large',           // large | medium | small
  category: 'emotion',     // emotion | study | social
  title: '考试失利',
  description: '今天数学考试没考好，心情很差...',
  status: 'pending',
  deadline: Date.now() + 24 * 60 * 60 * 1000,
  options: [
    { id: 'opt_1', text: '安慰鼓励', hint: '...', impact: { mood: 15, energy: 5 } },
    { id: 'opt_2', text: '分析原因', hint: '...', impact: { mood: 5, energy: -5 } },
    { id: 'opt_3', text: '陪伴散步', hint: '...', impact: { mood: 10, energy: -10 } },
    { id: 'opt_4', text: '制定计划', hint: '...', impact: { mood: 8, energy: 5 } },
  ],
}
```

**交互流程**:

```
WebSocket 推送 event_trigger
  ↓
帮助按钮闪烁动画 (btn-pulse) + 红点徽章 (badge-bounce)
  ↓
用户点击帮助按钮 → 切换到 help 视图
  ↓
显示事件卡片：标题 + 描述 + 4 个选项
  ↓
用户点击选项 → 确认弹窗 (wx.showModal)
  ↓
确认 → 显示 Loading (wx.showLoading)
  ↓
模拟 API 调用 (setTimeout 1000ms)
  ↓
更新事件状态为 resolved
  ↓
显示成功 Toast (wx.showToast)
```

---

### 2.6 背包系统

**功能定位**: 只读查看（用户不可主动获取 / 使用物品）

**物品类型** (第 644-703 行):

| 物品 | 类型 | 效果 | 来源 |
|------|------|------|------|
| 🥠 幸运饼干 | FOOD | 心情 +10，能量 +5 | 探索发现 |
| 🧸 快乐玩具 | TOY | 心情 +15 | 完成事件 |
| 🍀 幸运四叶草 | DECORATION | 心情 +5 | 森林深处 |
| 🥤 能量饮料 | FOOD | 能量 +20 | 商店购买 |
| 🎁 社交礼物 | GIFT | 社交 +10 | 朋友赠送 |

**交互**:

1. 点击"心宠背包"按钮 → 切换 bag 视图
2. 显示容量条：`used/total`（默认 50 格）
3. 物品网格布局（2 列）
4. 点击物品 → Modal 显示详情（名称、描述、效果、来源、数量）

---

### 2.7 心情日记系统

**日记条目类型**:

- **ACTIVITY** (日常): 起床、上课、吃饭等
- **EVENT** (事件): 考试失利、被表扬等
- **ITEM_FOUND** (发现): 发现物品
- **SOCIAL** (社交): 和朋友互动

**交互** (第 891-905 行):

1. 点击"心情日记"按钮 → 切换 diary 视图
2. 顶部日期选择器（最近 7 天）
3. 点击日期 → 加载该日日记（`diaryDataMap[date]`）
4. 时间线展示：时间点 + 类型标签 + 内容 + 状态变化

**数据生成** (第 730-857 行):

- 使用基于日期种子的确定性随机算法
- 确保同一日期始终生成相同内容
- 随机选择 2-4 个条目，按时间排序

---

### 2.8 WebSocket 实时通信

**文件**: `utils/petWebSocket.js` (343 行)

**连接配置**:

```javascript
const WS_URL = 'ws://localhost:3001/ws/pet';
const HEARTBEAT_INTERVAL = 30000;  // 30 秒心跳
const MAX_RECONNECT_ATTEMPTS = 5;   // 最大重连 5 次
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];
```

**消息类型**:

| 类型 | 方向 | 说明 |
|------|------|------|
| `auth` | C→S | JWT 认证 |
| `auth_success` | S→C | 认证成功 |
| `pet_status` | S→C | 心宠状态更新 |
| `event_trigger` | S→C | 事件触发通知 |
| `scene_sync` | S→C | 场景状态同步（10 秒间隔）|
| `control_state_change` | S→C | 控制权变更（Unity 连接时）|
| `heartbeat` | C→S | 心跳保活 |

**事件监听** (`pages/pet/index.js` 第 231-279 行):

```javascript
_initWebSocket() {
  const ws = getPetWebSocket();
  
  ws.on('pet_status', (payload) => {
    this.setData({
      mood: status.mood,
      energy: status.energy,
      social: status.sociability,
    });
  });
  
  ws.on('event_trigger', (payload) => {
    this.setData({
      hasEvent: true,
      eventCount: this.data.eventCount + 1,
    });
    wx.showModal({ title: payload.title, content: payload.description });
  });
  
  ws.on('reconnect_failed', () => {
    wx.showToast({ title: '连接失败，请检查网络', icon: 'none' });
  });
  
  ws.connect();
}
```

---

### 2.9 全局事件总线

**实现**: `utils/eventBus.js` (20 行)

```javascript
export default function createBus() {
  return {
    events: {},
    on(event, callback) { /* 订阅 */ },
    off(event, callback) { /* 取消订阅 */ },
    emit(event, ...args) { /* 发布 */ },
  };
}
```

**心宠模块使用**:

| 事件 | 触发位置 | 接收处理 |
|------|---------|---------|
| `tabbar-toggle` | `toggleFullscreen`, `onHide`, `onUnload` | `custom-tab-bar/index.js` 显示 / 隐藏 TabBar |
| `pet_status` | WebSocket | 更新三维状态 |
| `event_trigger` | WebSocket | 触发事件通知 |
| `reconnect_failed` | WebSocket | 显示网络错误 |

---

## 三、动画系统汇总

| 动画 | 文件 | 触发条件 | 实现方式 |
|------|------|---------|---------|
| 心宠弹跳 | `index.less` | 持续 | CSS `sprite-bounce` |
| 心宠移动 | `index.js` | 每 3 秒 40% 概率 | `wx.createAnimation` |
| 图标抖动 | `index.less` | 状态值 < 30% | CSS `icon-shake` |
| 文字脉冲 | `index.less` | 状态值 < 30% | CSS `text-pulse` |
| 进度条填充 | `index.less` | 状态变化 | CSS `transition: width` |
| 按钮脉冲 | `index.less` | 有事件时 | CSS `btn-pulse` |
| 红点跳动 | `index.less` | 有事件时 | CSS `badge-bounce` |
| 场景发光 | `index.less` | 当前场景 | CSS `territory-glow` |
| 位置脉冲 | `index.less` | 当前场景 | CSS `marker-pulse` |
| 云朵飘动 | `index.less` | 持续 | CSS `cloud-float` |
| 二级场景弹入 | `index.less` | 进入二级 | CSS `secondary-pop-in` |
| 地图标记移动 | `index.less` | 心宠切换场景 | CSS `transition: all 1.2s` |

---

## 四、数据流时序图

```
用户进入心宠页面
    │
    ▼
onLoad()
├── initGameView() ──→ 计算边界、创建动画、启动移动定时器
├── startStatusAnimation() ──→ 启动状态波动定时器（每 5 秒）
├── _initWebSocket() ──→ 连接 WebSocket、监听事件
├── initBagData() ──→ 加载 Mock 物品数据
├── initDiaryData() ──→ 生成 7 天日记数据
└── initHelpData() ──→ 加载 Mock 事件数据
    │
    ▼
[定时器循环]
├── 每 3 秒: 40% 概率 movePetSmoothly() ──→ 随机移动
├── 每 5 秒: fluctuateValue() ──→ 状态波动
│   ├── 30% 概率 switchPetScene() ──→ 切换场景
│   └── 10% 概率触发事件 ──→ hasEvent = true
└── 每 30 秒: WebSocket 心跳
    │
    ▼
用户交互
├── 点击底部按钮 ──→ switchView() ──→ 切换视图
├── 点击场景 ──→ onSceneTap() ──→ 显示弹窗 / 进入二级
├── 点击物品 ──→ onBagItemTap() ──→ 显示详情 Modal
├── 选择日期 ──→ onDiaryDateSelect() ──→ 加载日记
└── 选择帮助选项 ──→ onHelpOptionSelect() ──→ 解决事件
    │
    ▼
onUnload()
├── clearInterval(statusTimer)
├── clearInterval(moveTimer)
└── _destroyWebSocket() ──→ 断开连接
```

---

## 五、与产品文档对比

根据 `docs/pet-product-design.md`，当前实现状态：

| 功能 | 文档要求 | 实现状态 |
|------|---------|---------|
| 心宠自动生成 | 首次打开自动生成 | ✅ 模拟数据 |
| 心宠自主移动 | AI 驱动随机移动 | ✅ 实现 |
| Canvas 精灵动画 | 8 FPS 像素风 | ⚠️ CSS 动画替代 |
| AI 虚拟宠物 | 3-5 个同屏活动 | ❌ 未实现 |
| 状态栏动画 | 带动画 | ✅ 实现 |
| 事件触发 | 帮助按钮闪烁 + 红点 | ✅ 实现 |
| 事件解决 | 状态更新 + 日记记录 | ✅ 模拟实现 |
| 日记时间线 | 按日期展示 | ✅ 实现 |
| 背包只读 | 查看物品 | ✅ 实现 |
| WebSocket 同步 | 实时状态同步 | ⚠️ 框架完成，待对接真实服务 |
| 自动重连 | 断线后重连 | ✅ 实现 |
| 状态提醒上报 | Sentinel 后台提醒 | ❌ 未实现 |

---

## 六、关键发现与建议

### 6.1 已实现亮点

1. **完整的视图切换系统**：五个视图流畅切换，支持全屏模式
2. **丰富的动画反馈**：10+ 种 CSS 动画，状态变化有视觉反馈
3. **WebSocket 通信框架**：自动重连、心跳、认证机制完善
4. **低状态警告系统**：多维度视觉提示（图标抖动、文字脉冲、进度条变色）

### 6.2 待完善项

1. **真实 API 对接**：所有 API 调用为 TODO 状态（`// TODO: 调用 API 切换场景`）
2. **AI 虚拟宠物**：场景中缺少其他 AI 宠物活动
3. **物品使用功能**：背包物品只能查看，不能"使用"
4. **震动 / 声音反馈**：未发现任何 `wx.vibrateShort` 或音频调用
5. **本地数据持久化**：心宠状态未使用 `wx.setStorage` 保存
6. **触摸交互单一**：仅有 `bindtap`，缺少长按、拖拽等交互

### 6.3 代码结构建议

当前 `pages/pet/index.js` 已达 1006 行，建议：

- 将视图逻辑拆分为独立组件
- 将 Mock 数据提取到 `mock/pet/` 目录
- 创建 `api/pet.js` 统一封装 API 调用

---

**总结**：心宠交互逻辑设计精巧，通过**状态波动 + 自主移动 + 场景切换 + 事件求助**的组合，营造了一个有生命力的虚拟宠物体验。前端使用微信小程序原生能力实现，代码结构清晰，视图切换流畅，动画反馈丰富。主要待完善项是**真实服务端对接**和**AI 虚拟宠物社交**的实现。
