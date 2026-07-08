# PsyTwin-Pocket 微信小程序

PsyTwin-Pocket 是 PsyTwin 校园心理健康数字孪生方案的移动端入口。当前项目已经不只是 TDesign 小程序模板，而是同时包含学生端、教师端、心宠陪伴系统、本地心宠持续运行服务，以及一个用于桌面演示的 Tauri/Vue 影子实现。

本 README 按当前代码梳理，适合新同学接手、教师演示前排查、以及后续智能体继续开发时快速建立上下文。

## 当前定位

PsyTwin-Pocket 在 PsyTwin 生态里承担 API Consumer 和移动交互层职责：

| 协作项目 | Pocket 的关系 |
| --- | --- |
| PsyTwin-Sentinel | 主要后端。小程序通过 `config/index.js` 的 `baseUrl` 访问 `http://localhost:3000/api/pocket` 这一类接口。真实字段以 Sentinel 契约为准。 |
| PsyTwin-OpenClaw | AI 编排中心。AI 对话可以经 Sentinel 代理到 `/api/openclaw/pocket/chat`。 |
| PsyTwin-Companion | VR/边缘采集网关。Pocket 主要展示预约、VR 记录和干预入口，不直接维护采集服务。 |
| 本项目 `server/` | 心宠持续运行与离线同步服务，默认部署在 `http://42.121.14.189:13002`。 |
| 本项目 `desktop/` | Tauri + Vue 桌面版演示壳，复刻部分小程序页面和接口消费方式。 |

重要边界：

- Pocket 侧只消费 API，不维护 Sentinel 的 Next.js、Prisma、数据库连接或服务端业务代码。
- 写真实网络请求或 Mock 字段前，先读 [docs/api_contract.md](./docs/api_contract.md) 指向的 Sentinel 契约。
- 如果契约没有字段，不要在 Pocket 侧脑补字段，应该让 Sentinel 补充契约。
- 不要在 README、截图、提交说明中公开真实 API Key。当前配置文件里已有 LLM 配置项，后续应迁移到本地私有配置或环境变量。

## 近期更新概览

以下是 2026-06 以来几次主要更新在当前代码中的落点，便于从旧版本接手时快速定位差异：

| 时间 | 更新方向 | 当前状态 |
| --- | --- | --- |
| 2026-06-01 | 心宠背包与帮助事件修复 | 背包独立页和心宠主页都会优先拉取服务端状态，失败时回退到 `petBagItems`；帮助事件会在服务端、主页状态和 `petHelpEvents` 本地缓存之间去重合并，已解决“离开页面后事件丢失”和“物品字段不一致”的问题。 |
| 2026-06-15 | 心宠日记接入 Sentinel | 新增 [api/pet-diary.js](./api/pet-diary.js)，通过 Sentinel 的 `/pet/diary`、`/pet/diary/trigger`、`/pet/diary/test`、`/pet/diary/backfill` 管理模板化日记；心宠服务仍保存 `diaryDataMap`，小程序同步后会回补近 7 天日记。 |
| 2026-06-27 | 桌面端演示壳 | 新增 `desktop/` Tauri + Vue 实现，用于不打开微信开发者工具时演示登录、心墙、AI、预约、工作台、通知、发布等页面；它是独立运行时，不会自动复用小程序页面。 |
| 2026-06-30 | 心宠同步服务部署口径 | `petSyncUrl` 改为 `http://42.121.14.189:13002`，`server/` 默认端口同步为 `13002`，方便多人共享演示同一套心宠离线状态服务。 |
| 2026-06-30 | 心宠游戏 HUD 优化 | `pages/pet/index` 顶部三行状态卡改为单行半透明玻璃 HUD：左侧头像，右侧横向展示心情、能量、社交三项指标，减少对地图视野的占用。 |

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 微信小程序 | 原生小程序 + JavaScript + LESS |
| UI 组件库 | `tdesign-miniprogram` `^1.11.2` |
| 构建配置 | 微信开发者工具，基础库 `3.7.8`，LESS 编译插件 |
| 代码规范 | ESLint `airbnb-base` + Prettier |
| 心宠本地服务 | Node.js + Express + CORS |
| 桌面端演示 | Vite + Vue 3 + Pinia + TDesign Vue Next + Tauri 2 |

## 快速启动

### 1. 小程序

```bash
cd PsyTwin-Pocket
npm install
```

然后用微信开发者工具导入项目根目录。

项目关键信息：

- AppID: `wx1ff989a54438596f`
- Project name: `miniprogram-starter`
- 基础库: `3.7.8`
- LESS: 已在 `project.config.json` 的 `useCompilerPlugins` 中启用
- npm 组件: `miniprogram_npm/tdesign-miniprogram` 已存在；如依赖变更，需要在微信开发者工具里重新构建 npm

### 2. Sentinel 后端

默认真实接口地址在 [config/index.js](./config/index.js)：

```js
baseUrl: 'http://localhost:3000/api/pocket'
```

开发时需要确保 Sentinel 在本机或局域网可访问。若要离线开发，可把 `isMock` 设为 `true`，但当前部分页面仍有内联 mock 或旧 mock 路径，联调时应以真实契约为准。

### 3. 心宠持续运行服务

心宠主页、背包、日记、帮助事件会调用 `petSyncUrl`。当前小程序默认连接阿里云服务 `http://42.121.14.189:13002`，服务端默认端口 `13002`。

```bash
cd server
npm install
npm run dev
```

服务数据默认保存在：

```text
~/.psytwin-pet/pet-data.json
```

可用环境变量：

```bash
PORT=13002
MINIMAX_BASE_URL=https://api.minimaxi.com
MINIMAX_API_KEY=你的本地密钥
MINIMAX_MODEL=MiniMax-M2.7
```

常用检查：

```bash
curl http://42.121.14.189:13002/health
curl "http://42.121.14.189:13002/api/pet/status?userId=<petUserId>"
```

### 4. 桌面端演示

`desktop/` 是单独的 Vite/Tauri 演示端，和微信小程序不是同一运行时。

```bash
cd desktop
npm install
npm run dev
```

Vite 默认端口是 `1420`，开发态会把 `/api/pocket` 和 `/api/openclaw` 代理到 `http://127.0.0.1:3000`。

## 目录结构

```text
PsyTwin-Pocket/
├── api/                 # 小程序请求层：通用请求、AI、帖子、通知、心宠同步、心宠日记
├── behaviors/           # 小程序 Behavior，目前主要是 TDesign Toast 封装
├── components/          # 小程序自定义组件：card、nav
├── config/              # 运行时配置：Mock、Sentinel、心宠服务、LLM
├── custom-tab-bar/      # 角色感知的自定义 TabBar
├── desktop/             # Tauri + Vue 桌面演示端
├── docs/                # 项目文档、API 契约入口、心宠系统文档
├── mock/                # 旧版/本地 Mock 数据系统
├── pages/               # 微信小程序页面
├── scripts/             # 资源处理脚本
├── server/              # 心宠持续运行 Express 服务
├── static/              # 静态资源、地图、场景、心宠帧动画、头像
├── utils/               # 事件总线、通用工具、心宠 WebSocket、物品库、量表题库
├── app.js               # 小程序入口
├── app.json             # 页面、分包、TabBar 配置
├── package.json         # 小程序依赖和 lint 脚本
└── project.config.json  # 微信开发者工具配置
```

## 页面地图

### 主包页面

| 页面 | 入口 | 当前职责 |
| --- | --- | --- |
| 心墙 | `pages/home/index` | 拉取 `/student/home/feed`，格式化帖子数据，做双列瀑布流展示，进入帖子详情和发布页。 |
| 心宠 | `pages/pet/index` | 当前最大模块。包含单行玻璃 HUD、心宠动画、地图、场景切换、状态模拟、其他心宠、对话、背包、金币、日记、帮助事件和测评。 |
| 心宠地图 | `pages/pet/map/index` | 旧版/独立地图页，保留地块选择与进入逻辑。 |
| 心宠事件 | `pages/pet/events/index` | 从心宠服务拉取帮助事件，失败时读本地缓存；用户选择方案后会把事件标记为已解决并写回 `petHelpEvents`。 |
| 心宠背包 | `pages/pet/bag/index` | 从服务端状态或本地缓存读取物品，使用 `utils/itemDatabase.js` 的 104 个物品模板补齐名称、图标、稀有度、效果等属性。 |
| 心宠日记 | `pages/pet/diary/index` | 读取服务端 `diaryDataMap`，失败时回退到 `petDiaryMap`，按近 7 天展示日记。 |
| AI | `pages/message/index` | AI 入口页，展示问候语、建议 chip、最近会话，跳转聊天页。 |
| 我的 | `pages/my/index` | 学生/教师双角色个人中心，学生展示心理概览，教师展示资质和工作统计。 |
| 工作台 | `pages/dataCenter/index` | 教师端工作台，预警统计、今日日程、快捷入口、工作统计。 |
| 预约 | `pages/appointment/index` | 学生端预约服务和预约记录，消费 `/student/appointment/services` 与 `/student/appointment/records`。 |

### 分包页面

| 分包 | 页面 | 当前职责 |
| --- | --- | --- |
| `pages/login` | `login` | 密码登录，选择学生/教师角色，保存 `access_token` 和 `user_role`。 |
| `pages/loginCode` | `loginCode` | 短信验证码登录。 |
| `pages/chat` | `index` | AI 或咨询师聊天页。AI 模式调用 `api/ai.js`。 |
| `pages/search` | `index` | 搜索历史和热门词，当前仍使用旧 mock 路径。 |
| `pages/release` | `index` | 发布动态 UI 原型，当前保存/发布后回首页提示。 |
| `pages/post-detail` | `index` | 动态详情，读取帖子详情；点赞、评论发送仍是占位。 |
| `pages/assessment` | `index` | 心理测评记录静态展示。 |
| `pages/vr-record` | `index` | VR 体验记录静态展示。 |
| `pages/notification` | `index` | 通知列表、轮询、标记已读、未读数同步。 |
| `pages/setting` | `index` | 设置菜单原型。 |
| `pages/my/info-edit` | `index` | 个人资料编辑页，包含地区数据。 |
| `pages/teacher` | `warning-list/index` | 教师预警列表，含 Mock fallback 和行动菜单。 |
| `pages/teacher` | `appointment-manage/index` | 教师预约管理原型。 |
| `pages/teacher` | `student-list/index` | 教师学生列表、风险筛选、关注/消息入口原型。 |

## 角色与导航

登录页把角色写入：

```text
access_token
user_role = student | teacher
```

[custom-tab-bar/index.js](./custom-tab-bar/index.js) 会读取 `user_role`：

| 角色 | Tab |
| --- | --- |
| student | 心墙、心宠、AI、预约、我的 |
| teacher | 心墙、AI、工作台、我的 |

TabBar 还监听全局事件：

- `unread-num-change`: 更新 AI/通知未读数
- `role-change`: 登录后刷新角色导航
- `tabbar-toggle`: 页面可隐藏/恢复 TabBar

## API 与数据流

### 通用请求层

[api/request.js](./api/request.js) 默认导出 `request(url, method = 'GET', data = {})`。

行为：

- `config.isMock === true` 时，直接返回文件内 `mockResponses`。
- `config.isMock === false` 时，请求 `config.baseUrl + url`。
- 自动读取 `wx.getStorageSync('access_token')` 并写入 `Authorization: Bearer <token>`。
- `401` 会清除 token 并提示重新登录。

注意：旧文档中提到的 `fetch/get/post/update/remove` 不是当前 `api/request.js` 的真实导出，当前代码以默认 `request` 函数为准。

### 主要接口模块

| 文件 | 职责 |
| --- | --- |
| `api/ai.js` | AI 对话。优先走 `config.llm` 的 Anthropic 兼容接口；未启用时走 OpenClaw/Sentinel 代理。也包含聊天历史和情绪标签请求。 |
| `api/post.js` | 动态详情、点赞、评论、评论列表。 |
| `api/notification.js` | 通知列表、标记已读、未读数。 |
| `api/pet-server.js` | 心宠服务的 pull/push/events/quiz。 |
| `api/pet-diary.js` | Sentinel 侧心宠日记触发、测试、回补接口。 |

### 心宠日记接口拆分

当前心宠日记同时涉及 Pocket 自带 `server/` 和 Sentinel：

| 能力 | 请求封装 | 服务端 | 说明 |
| --- | --- | --- | --- |
| 心宠状态里的日记缓存 | `api/pet-server.js` | `petSyncUrl` | `pull/push` 会同步 `diaryDataMap`，用于离线状态合并和独立日记页展示。 |
| 模板化日记读取 | `api/pet-diary.js` | `baseUrl` / Sentinel | `GET /pet/diary` 读取指定日期或默认日期的日记。 |
| 场景触发日记 | `api/pet-diary.js` | `baseUrl` / Sentinel | `POST /pet/diary/trigger` 根据 `sceneId/date/hour` 尝试创建日记。 |
| 手动测试日记 | `api/pet-diary.js` | `baseUrl` / Sentinel | `POST /pet/diary/test` 供开发调试按钮使用。 |
| 离线回补日记 | `api/pet-diary.js` | `baseUrl` / Sentinel | `POST /pet/diary/backfill` 在心宠同步成功后补齐最近离线日期，默认最多 7 天。 |

### 配置项

| 配置 | 默认值 | 用途 |
| --- | --- | --- |
| `isMock` | `false` | 是否拦截通用请求并返回本地 mock。 |
| `baseUrl` | `http://localhost:3000/api/pocket` | Sentinel Pocket API。 |
| `petServiceUrl` | `http://localhost:3001` | 预留心宠服务地址。 |
| `petSyncUrl` | `http://42.121.14.189:13002` | 当前心宠持续运行服务地址。 |
| `llm.enabled` | `true` | AI/日记是否优先使用自有 LLM。 |
| `llm.baseUrl` | `https://api.minimaxi.com` | Anthropic 兼容接口地址。 |
| `llm.model` | `MiniMax-M2.7` | 当前 LLM 模型名。 |

## 心宠系统

心宠系统是当前项目最大的新增内容，核心文件是 [pages/pet/index.js](./pages/pet/index.js)。

### 核心能力

- 单行玻璃 HUD：左侧显示主心宠头像，右侧横向展示心情、能量、社交，低数值自动高亮警示。
- 45 帧心宠动画：从 `static/pet/ExportedSprites/` 的 315 张 PNG 中采样。
- 三维状态：`mood`、`energy`、`social`。
- 时间调度：工作日/周末按小时加权选择场景。
- 场景系统：5 个一级地图，二十多个二级场景。
- 行为系统：固定场景、半固定场景、可变场景对应不同活动持续时间。
- 其他心宠：随机生成名字、头像、移动和对话。
- 背包系统：104 个大学校园物品模板，包含稀有度、类型、来源、效果、容量、筛选，并支持服务端状态与本地缓存互补。
- 金币系统：获得/消费记录。
- 活动日志：记录场景、事件、物品发现等行为。
- 心情日记：本地日记、心宠服务 AI 日记、Sentinel 模板日记和离线回补共存，近 7 天在页面展示，服务端保留最近 30 天 `diaryDataMap`。
- 帮助事件：离线过久、状态偏低或随机事件触发“需要帮助”，服务端和本地按事件 ID 去重合并。
- 测评题库：PHQ-9、GAD-7、社交回避简版被包装成“帮助心宠做选择”，每类 4 题，完成后给出分数、等级和建议。
- 共享演示同步：小程序默认连接阿里云 `42.121.14.189:13002`，多人可访问同一心宠同步服务；本地开发可改 `config/index.js` 的 `petSyncUrl`。

### 地图与资源

| 资源 | 位置 |
| --- | --- |
| 一级世界地图 | `static/世界地图/worldmap.png` |
| 二级地图 | `static/二级地图/*.png` |
| 二级场景背景 | `static/二级场景背景图/` |
| 规范化场景图 | `static/scenes/*.png` |
| 心宠头像 | `static/头像/*.png` |
| 心宠帧动画 | `static/pet/ExportedSprites/*.png` |

当前资源数量约：

- 心宠动画 PNG: 315
- 规范化场景图: 25
- 二级地图: 5
- 二级场景背景文件: 31
- 心宠头像: 5
- 背包物品模板: 104

### 心宠服务端

[server/pet-server.js](./server/pet-server.js) 的职责是让小程序关闭后，心宠仍然在服务端“生活”。

主要机制：

- 启动时读取 `~/.psytwin-pet/pet-data.json`。
- 对已有用户补偿服务停机期间的状态变化。
- 每 5 秒对活跃心宠运行一次 tick。
- 记录活动日志、状态变化、背包发现、帮助事件。
- 异步队列触发 AI 日记生成。
- 保存前会清理异常状态：三维数值限制在 0-100，日记保留最近 30 天，过期帮助事件会被过滤。
- `push` 合并时会按日记 ID、活动日志 key、帮助事件 ID 去重，避免多端或离线回传产生重复数据。
- 每 30 秒打印所有心宠状态。

接口：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/pet/pull` | 小程序启动/显示时拉取实时状态，并补偿离线进度。 |
| `POST` | `/api/pet/push` | 小程序隐藏/退出时推送状态，服务端合并日记、日志、事件和背包。 |
| `POST` | `/api/pet/events` | 根据当前状态生成帮助事件。 |
| `POST` | `/api/pet/quiz` | 根据事件分类返回随机量表题。 |
| `POST` | `/api/pet/test-diary` | 调试 AI 日记生成。 |
| `GET` | `/api/pet/status?userId=xxx` | 查看指定用户状态。 |
| `GET` | `/health` | 健康检查。 |

当前 HTTP 接口是心宠同步的主路径；[utils/petWebSocket.js](./utils/petWebSocket.js) 保留了 WebSocket 客户端、自动重连和事件分发逻辑，适合作为后续实时同步扩展入口，但当前 `server/` 主要暴露的是上述 REST 接口。

### 心宠本地缓存键

| Key | 用途 |
| --- | --- |
| `petUserId` | 本地生成的心宠用户 ID。 |
| `petBagItems` | 背包缓存。 |
| `petDiaryMap` | 日记缓存。 |
| `petHelpEvents` | 帮助事件缓存。 |

## 桌面端演示

`desktop/` 是独立 Vue/Tauri 应用，适合不方便打开微信开发者工具时做评审演示。

已实现页面：

- `/login`
- `/home`
- `/message`
- `/chat`
- `/appointment`
- `/my`
- `/data-center`
- `/warnings`
- `/post-detail`
- `/search`
- `/notification`
- `/release`

桌面端使用 `desktop/src/services/*` 封装接口，`desktop/src/stores/auth.js` 和 `desktop/src/stores/app.js` 维护角色、token、未读数等状态。它不是小程序代码的构建产物，功能接近但实现独立。

## 静态资源规范

微信小程序本地图片不要写成 LESS/CSS `background-image: url('/static/xxx.png')`。本地背景图应使用 `<image>` 作为背景层：

```xml
<view class="panel">
  <image class="panel-bg" src="/static/example.png" mode="scaleToFill"></image>
  <view class="panel-content">...</view>
</view>
```

```less
.panel {
  position: relative;
  overflow: hidden;
}

.panel-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
```

资源建议：

- 页面资源按功能放到 `static/home/`、`static/chat/`、`static/pet/`、`static/scenes/`。
- 需要透明背景用 PNG。
- 大型 AI 场景图要控制尺寸，避免小程序包体膨胀。
- macOS 产生的 `.DS_Store`、`._*` 不应作为交付资源。

## 开发规范

### 代码风格

- JavaScript + LESS，当前小程序侧不使用 TypeScript。
- 缩进 2 空格。
- 优先使用 TDesign 小程序组件。
- 公共样式变量放在 [variable.less](./variable.less)。
- 共享逻辑优先放 `utils/` 或 `behaviors/`，不要塞进 `app.js`。

### 请求规范

- 通用 Sentinel 请求走 `api/request.js`。
- 心宠持续运行服务走 `api/pet-server.js`。
- AI 对话走 `api/ai.js`。
- 不要在页面里散落新的 `wx.request`，除非是在现有低层 API 封装里维护特殊协议。

### 文档规范

- 跨端接口以 Sentinel 契约为准。
- 新增页面、路由、服务、缓存键后，同步更新 README 或 `docs/`。
- OpenSpecs/任务类文档如果用 `- [ ]` / `- [x]` 追踪状态，代码落地后要同步回写。

## 常用命令

```bash
# 小程序依赖
npm install

# 小程序 lint
npm run lint

# 自动修复
npm run lint:fix

# 心宠服务
cd server
npm install
npm run dev

# 桌面端
cd desktop
npm install
npm run dev
```

## 已知注意事项

- 当前 `config/index.js` 和 `server/pet-server.js` 包含 LLM 配置项。后续应把真实密钥迁移到本地私有配置或环境变量，不要继续扩散到文档和提交说明。
- `api/request.js` 目前同时包含请求封装和一大段内置 mock 数据；如果后续清理，应先用测试或接口契约锁定行为。
- 部分教师端页面仍使用内联 mock 数据，真实联调前需要按 Sentinel 契约接入接口。
- `pages/post-detail/index.js` 中点赞、评论发送仍是占位逻辑。
- `pages/search/index.js` 仍请求旧路径 `/api/searchHistory`、`/api/searchPopular`，和当前 `/api/pocket` 契约风格不完全一致。
- `pages/pet/bag/index.js` 的 `formatEffect` 仍检查 `effect.sociability`，而当前物品模板使用 `effect.social`；展示社交效果时可能需要后续统一字段名。
- `desktop/` 不是小程序构建产物，更新小程序页面时不会自动同步桌面端。

## 更多文档

- [docs/README.md](./docs/README.md): 文档索引
- [docs/PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md): 旧版项目全景文档
- [docs/API_GUIDE.md](./docs/API_GUIDE.md): API 请求层说明，部分内容需按当前代码刷新
- [docs/PET_SYSTEM.md](./docs/PET_SYSTEM.md): 心宠系统专项文档
- [docs/api_contract.md](./docs/api_contract.md): Sentinel API 契约入口
