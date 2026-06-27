# PsyTwin-Pocket 桌面端迁移方案

> 最后更新: 2026-04-06
> 目标: 将当前微信小程序重构为可本地运行、无需微信登录的 Tauri 桌面端演示应用

## 1. 结论

- [x] 已完成当前项目现状盘点 *(已于 2026-04-06 基于 `README.md`、`app.json`、`package.json`、核心页面代码完成)*
- [x] 已确认当前仓库是纯微信小程序工程 *(已于 2026-04-06 确认不存在 `src-tauri/`、Vite、React、Vue 等桌面端基础设施)*
- [x] 已确认迁移方向“可行，但不是直接兼容运行” *(已于 2026-04-06 完成评估)*
- [x] 创建桌面端工程骨架 *(已于 2026-04-06 完成 `desktop/`、Vite、Tauri、路由和布局骨架)*
- [x] 完成核心业务模块适配层 *(已于 2026-04-06 完成桌面端存储、配置与 HTTP 服务骨架)*
- [x] 完成手机画布与底部导航高保真骨架 *(已于 2026-04-06 完成固定手机画布和角色化 `tabbar`)*
- [x] 完成 `login` 与 `home` 页面高保真首版 *(已于 2026-04-06 完成)*
- [x] 完成学生端演示链路迁移 *(已于 2026-04-06 完成 `message`、`chat`、`appointment`、`my`、`post-detail` 首版)*
- [x] 完成教师端演示链路迁移 *(已于 2026-04-06 完成 `dataCenter`、`warnings`、教师态 `my` 首版)*
- [x] 完成演示增强页面首版 *(已于 2026-04-06 完成 `search`、`notification`、`release`，并接通对应入口与本地状态)*
- [x] 完成第二轮视觉收边 *(已于 2026-04-06 收紧 `message`、`my`、`appointment`、`dataCenter`、`warnings` 的关键视觉差异)*
- [ ] 完成本地打包与演示预案

当前判断：

1. **可行**，但前提是把它视为“**桌面端重构**”而不是“把小程序原样塞进 Tauri”。
2. **不建议**尝试兼容 `wx` 运行时或直接复用 WXML/小程序组件。
3. **当前目标**是做一个“**高保真桌面演示版**”，在 Tauri 中尽量 1:1 还原微信小程序前端页面。

## 2. 当前项目现状

### 2.1 技术现状

- 当前应用是微信小程序，入口为 `app.js` + `app.json`
- UI 依赖 `tdesign-miniprogram@^1.11.2`
- 页面逻辑使用 `Page()` / `Component()` / `Behavior()`
- 网络层核心依赖 `wx.request`
- 存储、路由、提示、弹窗依赖 `wx.getStorageSync`、`wx.navigateTo`、`wx.switchTab`、`wx.showToast`、`wx.showModal`
- 当前仓库没有任何 Tauri、Web SPA、Rust 桌面壳基础设施

### 2.2 功能规模

当前已存在的主要页面与模块：

- 学生端：`home`、`message`、`chat`、`appointment`、`my`、`post-detail`、`notification`、`release`、`search`、`login`、`loginCode`
- 教师端：`dataCenter`、`teacher/warning-list`、`teacher/appointment-manage`、`teacher/student-list`
- 其他页面：`assessment`、`vr-record`、`my/info-edit`
- 通用组件：`components/card`、`components/nav`、`custom-tab-bar`
- 通用模块：`api/request.js`、`api/ai.js`、`utils/eventBus.js`、`config/index.js`

### 2.3 可复用与不可复用边界

**可复用较高的部分**

- API 路径设计和业务语义
- 页面级数据结构与字段映射逻辑
- 部分纯 JavaScript 业务逻辑
- `utils/eventBus.js` 这类与平台无关的简单工具
- Mock 数据内容本身

**必须重写的部分**

- 全部 WXML 页面结构
- 全部小程序组件声明与 `usingComponents`
- `Page()` / `Component()` / `Behavior()` 生命周期写法
- 所有 `wx.*` 平台 API 调用
- `custom-tab-bar`
- 基于微信容器的登录、跳转、弹窗、上传、图片预览等交互

## 3. 可行性分析

### 3.1 为什么“能做”

- Tauri 本质上是本地桌面壳 + Web 前端，适合把现有业务重建为桌面应用
- 当前仓库的业务逻辑并不重，核心价值在页面流程、数据展示和接口消费，不在微信独占能力
- 项目已有 Mock 数据体系，适合先做离线演示版，降低比赛现场网络不稳定风险
- 当前 API 配置已经区分 `isMock` 与 `baseUrl`，迁移时可以沿用“真实接口 / 本地演示”双模式

### 3.2 为什么“不能直接跑”

- Tauri 不能执行小程序的 WXML/WXSS/Page 运行时
- `tdesign-miniprogram` 是小程序组件库，不是 Web 桌面组件库
- 小程序路由、全局对象、存储和请求接口都依赖微信容器
- 当前代码中的 `wx.request`、`wx.getStorageSync`、`wx.switchTab` 等没有浏览器等价运行时

### 3.3 结论级判断

- **如果目标是比赛演示**：迁移为 Tauri 桌面端是合理方案，优先做“核心功能演示版”
- **如果目标是零成本复用全部小程序代码**：不可行
- **如果目标是保留业务逻辑、重建前端壳**：可行，且是正确路径

## 4. 推荐技术路线

### 4.1 推荐栈

建议采用以下方案：

- 桌面壳：`Tauri v2`
- 前端：`Vite + Vue 3 + JavaScript`
- 路由：`vue-router`
- 状态管理：`Pinia`
- HTTP：`axios` 或 `fetch`
- UI：`TDesign Vue Next`
- 样式：`LESS`

选择理由：

1. Vue 模板写法比 React 更接近当前 WXML 的思维模型，迁移页面更直接。
2. 仍可坚持 JavaScript，不引入 TypeScript，符合当前仓库规范。
3. TDesign Vue Next 只作为补充能力，不作为主要视觉来源；高保真页面以自定义样式复刻为主。
4. Tauri 只负责桌面壳和本地能力，业务仍放在前端 JS 中，适合承载“手机画布式复刻”。

### 4.2 不推荐路线

- 不推荐写一层 `wx` 兼容模拟器，试图直接跑小程序页面
- 不推荐把当前仓库整体强行改造成桌面项目，导致小程序端无法继续维护
- 不推荐第一阶段就接入过多 Tauri 原生能力，比赛演示优先保证稳定和可运行

## 5. 目标架构

建议采用“**双端并存，桌面端独立目录**”方式，并在桌面端内部采用固定手机画布：

```text
.
├── api/                     # 现有小程序 API
├── pages/                   # 现有小程序页面
├── components/              # 现有小程序组件
├── mock/                    # 现有 mock 数据
├── docs/
│   └── Migration.md
├── desktop/                 # 新增：桌面端工程
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.js
│   │   ├── App.vue
│   │   ├── router/
│   │   ├── stores/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── adapters/
│   │   └── styles/
│   └── src-tauri/
│       ├── tauri.conf.json
│       └── src/main.rs
└── shared/                  # 可选：逐步抽离共享逻辑
    ├── constants/
    ├── utils/
    └── mocks/
```

原则：

- 小程序端继续保留，避免一次性“推倒重来”
- 桌面端单独演进，不污染现有小程序运行链路
- 可复用逻辑逐步抽到 `shared/`，而不是一开始就大搬家
- 桌面端默认展示固定手机尺寸画布，优先复刻小程序视觉，不做大屏布局优化

## 6. 平台能力替换表

| 小程序能力 | 当前用法 | 桌面端替代 |
|---|---|---|
| `wx.request` | 统一请求层、AI 请求 | `axios` / `fetch` |
| `wx.getStorageSync` / `wx.setStorageSync` | Token、角色、本地状态 | `localStorage` 或 Tauri Store |
| `wx.removeStorageSync` / `wx.clearStorageSync` | 登出清理 | `localStorage` / Tauri Store |
| `wx.navigateTo` / `wx.switchTab` / `wx.reLaunch` | 页面跳转 | `vue-router` |
| `wx.showToast` | 提示 | TDesign Message / Notify |
| `wx.showModal` | 确认弹窗 | TDesign Dialog |
| `wx.showLoading` / `wx.hideLoading` | 加载态 | 组件内 loading / 全局 loading store |
| `wx.previewImage` | 图片预览 | Web Lightbox / Image Viewer |
| `wx.makePhoneCall` | 教师端电话联系 | 改为复制号码 / 外部链接 / 显示不可用 |
| `wx.getWindowInfo` | 状态栏高度 | 普通 CSS 布局，不再依赖状态栏 |
| `wx.nextTick` | 更新后滚动 | `nextTick` |
| `getApp()` | 全局状态 | Pinia / 单例 store |
| `getCurrentPages()` | 当前路由推断 | `vue-router` 当前路由 |

## 7. 页面迁移优先级

### 7.1 P0：比赛演示必须覆盖

- [x] 登录页 `login` *(已于 2026-04-06 完成桌面首版)*
- [x] 首页心墙 `home` *(已于 2026-04-06 完成桌面首版)*
- [x] 帖子详情 `post-detail` *(已于 2026-04-06 完成桌面首版)*
- [x] AI 对话列表入口 `message` *(已于 2026-04-06 完成桌面首版)*
- [x] AI 聊天页 `chat` *(已于 2026-04-06 完成桌面首版)*
- [x] 预约页 `appointment` *(已于 2026-04-06 完成桌面首版)*
- [x] 个人中心 `my` *(已于 2026-04-06 完成桌面首版)*
- [x] 教师工作台 `dataCenter` *(已于 2026-04-06 完成桌面首版)*
- [x] 教师预警列表 `teacher/warning-list` *(已于 2026-04-06 完成桌面首版)*

这批页面足够支撑“学生端 + 教师端 + AI + 预约 + 风险预警”的主叙事。

### 7.2 P1：增强演示完整性

- [x] 通知页 `notification` *(已于 2026-04-06 完成桌面首版)*
- [ ] 教师预约管理 `teacher/appointment-manage`
- [ ] 教师学生列表 `teacher/student-list`
- [x] 搜索页 `search` *(已于 2026-04-06 完成桌面首版)*
- [x] 发布页 `release` *(已于 2026-04-06 完成桌面首版)*

### 7.3 P2：可暂缓

- [ ] `assessment`
- [ ] `vr-record`
- [ ] `my/info-edit`
- [ ] `loginCode`

如果比赛现场不演示这些链路，可以先做占位页或延后。

## 8. 推荐迁移步骤

### 阶段一：建立桌面端基础设施

- [x] 在根目录新增 `desktop/` *(已于 2026-04-06 完成)*
- [x] 初始化 `Tauri + Vite + Vue 3 + JavaScript` *(已于 2026-04-06 完成)*
- [ ] 配置 `LESS`、ESLint、Prettier
- [x] 建立 `router`、`stores`、`services`、`pages`、`components` 目录 *(已于 2026-04-06 完成)*
- [x] 搭建基础布局：侧边导航 / 顶部栏 / 主内容区 *(已于 2026-04-06 完成)*
- [ ] 跑通 `tauri dev` 与本地打包 *(已于 2026-04-06 完成前端构建与 Tauri Rust 编译校验，GUI 启动待实际本机运行确认)*

阶段目标：

- 本地无需微信即可启动
- 具备手机画布式页面壳
- 具备高保真复刻的承载基础

### 阶段二：抽离平台无关逻辑

- [x] 将请求逻辑从 `wx.request` 改造成桌面端 `services/http.js` *(已于 2026-04-06 完成基础版)*
- [x] 将 Token 与角色存储封装为 `services/storage.js` *(已于 2026-04-06 完成基础版)*
- [x] 将全局事件与会话状态迁移到 Pinia *(已于 2026-04-06 完成 `authStore`、`appStore` 骨架)*
- [x] 把可复用的格式化函数、数据转换函数抽到 `desktop/src/adapters/` 或 `shared/` *(已于 2026-04-06 创建 `adapters/` 目录入口)*
- [ ] 将现有 mock 数据改造成桌面端可直接消费的数据源

阶段目标：

- 桌面端不再依赖 `wx.*`
- 数据流与状态流可以独立运行

### 阶段三：先迁学生端主链路

- [x] 迁移登录页 *(已于 2026-04-06 完成高保真首版)*
- [x] 迁移首页瀑布流与帖子详情 *(已于 2026-04-06 完成首版并接通详情页链路)*
- [x] 迁移 AI 会话入口与聊天页 *(已于 2026-04-06 完成首版)*
- [x] 迁移预约页 *(已于 2026-04-06 完成首版)*
- [x] 迁移个人中心 *(已于 2026-04-06 完成首版)*

当前进展：

- [x] `login` 页面已完成高保真首版 *(已于 2026-04-06 完成)*
- [x] `home` 页面已完成高保真首版 *(已于 2026-04-06 完成)*
- [x] `post-detail` *(已于 2026-04-06 完成第一版)*
- [x] `message` *(已于 2026-04-06 完成第一版)*
- [x] `appointment` *(已于 2026-04-06 完成第一版)*
- [x] `my` *(已于 2026-04-06 完成第一版)*
- [x] `search` *(已于 2026-04-06 完成第一版，并接通首页搜索入口)*
- [x] `notification` *(已于 2026-04-06 完成第一版，并接通个人中心通知入口)*
- [x] `release` *(已于 2026-04-06 完成第一版，并接入本地发帖与草稿能力)*

实施建议：

- 先还原页面结构与样式，再接入逻辑
- 首页中的 `formatCards`、`distributeCards` 可直接迁移为组合式函数
- 聊天页要先保留“AI 单聊”能力，WebSocket 实时通信可放到后续
- 预约页优先复刻现有列表、筛选、弹窗表单逻辑

### 阶段四：迁教师端主链路

- [x] 迁移教师工作台 *(已于 2026-04-06 完成首版)*
- [x] 迁移预警列表 *(已于 2026-04-06 完成首版)*
- [ ] 迁移预约管理
- [ ] 迁移学生列表

实施建议：

- 教师端大量使用 Mock，本身非常适合做离线展示
- `wx.makePhoneCall` 这类动作不要硬迁，直接改为“展示联系方式”或“复制号码”

### 阶段五：补齐桌面演示能力

- [ ] 增加启动页或角色选择页
- [ ] 增加演示模式开关：`mock` / `real API`
- [ ] 增加空态、错误态、断网提示
- [ ] 增加“重置演示数据”能力
- [ ] 生成 macOS 安装包或便携版

阶段目标：

- 现场演示不依赖微信
- 现场演示不依赖稳定网络
- 现场操作路径固定，可控

## 9. 模块级迁移策略

### 9.1 请求层

现状：

- `api/request.js` 同时承担 Mock 分发与真实请求
- 真实请求依赖 `wx.request`
- Token 注入直接依赖 `wx.getStorageSync`

迁移方案：

- 新建 `desktop/src/services/http.js`
- 新建 `desktop/src/services/auth.js`
- 将“请求发送”和“业务 API 封装”分层
- 保留当前 API path 设计，不改业务接口语义

建议拆分：

- `services/http.js`：基础请求实例、超时、拦截器
- `services/api/*.js`：业务 API
- `services/mock/*.js`：演示数据源

### 9.2 状态管理

现状：

- 小程序使用 `getApp().globalData` + `eventBus`

迁移方案：

- 使用 Pinia 管理：
  - `authStore`
  - `chatStore`
  - `appStore`
  - `appointmentStore`

### 9.3 路由与导航

现状：

- `app.json` + `tabBar` + `custom-tab-bar`
- 页面通过 `wx.navigateTo` / `wx.switchTab`

迁移方案：

- 使用 `vue-router`
- 用桌面布局替代小程序 tabbar
- 学生端和教师端共用壳，但根据角色渲染不同导航菜单

### 9.4 UI 组件

现状：

- 依赖 `tdesign-miniprogram`

迁移方案：

- 使用 `TDesign Vue Next`
- 自定义重写以下组件：
  - 瀑布流卡片
  - 顶部导航
  - 角色化侧边栏 / 底部导航替代
  - 聊天气泡区域

### 9.5 AI 聊天

现状：

- `api/ai.js` 中 `sendToTherapist` 直接调用 `wx.request`
- 聊天页里混合了页面状态与消息滚动控制

迁移方案：

- 先保留 HTTP 请求式 AI 对话
- 将消息列表、发送状态、滚动控制拆成独立组件和 store
- WebSocket 如果不是比赛刚需，可以放到第二阶段

## 10. 风险与规避措施

### 10.1 主要风险

- [ ] 风险：误判为“可以直接复用小程序页面”
- [ ] 风险：首阶段范围过大，试图 1:1 完整迁移全部页面
- [ ] 风险：比赛现场网络不稳定，真实 API 不可用
- [ ] 风险：Tauri 环境、Rust 工具链、Node 版本在演示机上不一致
- [ ] 风险：微信特有交互迁移后体验不一致

### 10.2 对策

- [ ] 明确本项目是“重构”不是“兼容运行”
- [ ] 先做 P0 页面，P1/P2 延后
- [ ] 默认提供 Mock 演示模式
- [ ] 提前在演示设备上完成安装包验证
- [ ] 所有关键链路准备本地固定演示数据

## 11. 演示版实施建议

### 11.1 建议的 MVP 目标

- [x] 学生身份登录 *(已于 2026-04-06 完成演示首版)*
- [x] 浏览心墙列表与帖子详情 *(已于 2026-04-06 完成演示首版)*
- [x] 发起 AI 对话并收到返回 *(已于 2026-04-06 完成演示首版)*
- [x] 查看和提交预约 *(已于 2026-04-06 完成演示首版)*
- [x] 切换教师身份 *(已于 2026-04-06 完成演示首版)*
- [x] 查看教师工作台和预警列表 *(已于 2026-04-06 完成演示首版)*

### 11.2 建议暂不纳入首版

- [ ] 真正的微信登录
- [ ] 小程序特有生命周期完全仿真
- [ ] 上传、拍照、分享、手机号拨打等平台动作的 1:1 复制
- [ ] 复杂原生插件接入

## 12. 迁移完成定义

只有同时满足以下条件，才视为桌面迁移完成：

- [ ] 应用可在本地通过 Tauri 启动
- [ ] 不依赖微信开发者工具
- [ ] 不依赖微信登录
- [ ] P0 页面全部可访问
- [ ] 至少支持 Mock 演示模式
- [ ] 核心链路在断网情况下仍可演示
- [ ] 已生成桌面安装包或便携运行包
- [ ] 文档状态与代码状态同步更新

## 13. 最终建议

本项目最合适的做法不是“给微信小程序套一层桌面壳”，而是：

1. 保留现有小程序仓库结构不动；
2. 在同仓库新增 `desktop/` 子工程；
3. 用 `Tauri + Vue 3 + JavaScript` 重建桌面演示版，并以固定手机画布高保真复刻小程序页面；
4. 先迁核心链路，优先还原登录页、首页、底部导航和关键卡片组件；
5. 比赛结束后，再决定是否继续做完整桌面产品化。

这条路径的优点是既能脱离微信开发者工具，又能最大程度保留你比赛演示时原本的小程序观感。
