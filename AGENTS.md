# AGENTS.md - PsyTwin-Pocket 项目规范

> 最后更新: 2026-03-01

## 概述

PsyTwin-Pocket 是基于 TDesign 框架开发的微信小程序。项目采用 JavaScript 和 LESS 编写，通过模块化结构组织代码。该项目旨在提供一个高性能、易扩展的移动端心理咨询或社交平台原型。

## 目录结构

```
├── api/              # HTTP 请求层和服务定义
├── behaviors/        # 微信小程序 mixins 共享逻辑
├── components/       # 可复用 UI 组件
├── config/           # 运行时配置和环境变量
├── docs/             # 项目文档
├── mock/             # 本地模拟数据系统
├── pages/            # 页面目录
├── static/           # 静态资源
└── utils/            # 工具函数
```

---

## 各模块规范

### api/ - HTTP 请求层

**职责**：封装所有后端服务接口，统一处理 Token 管理、错误拦截和 Mock 切换。

**查找位置**：
- `api/request.js` - 核心请求工具，封装 `wx.request`
- `api/*.js` - 业务服务模块

**规范**：
- 严禁直接调用 `wx.request`，必须通过 API 服务模块
- 使用 `fetch`/`get` 获取数据，`update`/`post` 提交数据，`delete`/`remove` 删除数据
- 所有函数必须返回 Promise，推荐使用 async/await
- 导入顺序：微信内置 → 外部库 → 内部工具 → 同模块

---

### utils/ - 工具函数

**职责**：提供共享的基础逻辑，支持页面、组件和 Behavior。

**查找位置**：
- `utils/util.js` - 通用工具函数（时间格式化、深拷贝、防抖节流等）
- `utils/eventBus.js` - 全局事件总线，解决跨页面通信

**规范**：
- 按需导入，不一次性导入整个模块
- `util.js` 应保持纯函数性质，不直接修改全局变量
- `eventBus` 仅用于全局状态变化（如登录状态同步、未读数更新）
- 页面/组件销毁时必须在 `onUnload`/`detached` 中调用 `eventBus.off` 移除监听器
- 事件名称使用小驼峰命名，如 `userLoginSuccess`

---

### mock/ - 本地模拟数据

**职责**：支持离线开发，前端不依赖后端接口。

**查找位置**：
- `mock/index.js` - 核心入口，注册所有接口
- `mock/request.js` - 请求拦截器，返回模拟数据
- `mock/home/`, `mock/login/`, `mock/my/` 等 - 各功能模块数据

**规范**：
- 启用方式：在 `config/index.js` 中设置 `isMock: true`
- 模拟数据必须对齐真实 API 结构，切换生产环境时无需改代码
- 每个 mock 文件导出 `{ code, data, message }` 格式
- 可加入随机延迟模拟真实网络环境
- 不要在 mock 数据中包含敏感信息

---

### pages/ - 页面目录

**职责**：包含所有页面文件。

**目录结构**：
- **主 Tab 页面**：`home/`、`message/`、`my/`
- **分包页面**：`search/`、`chat/`、`login/`、`loginCode/`、`dataCenter/`、`setting/`、`release/`、`my/info-edit/`

**规范**：
- 每个页面由四个文件组成：`.js`、`.wxml`、`.less`、`.json`
- 界面开发优先使用 `tdesign-miniprogram` 组件库
- 页面样式应通过 LESS 文件定义，禁止在 WXML 中使用内联样式
- 严禁将业务逻辑写在 `app.js` 中
- 逻辑过于复杂时应拆分为独立组件或提取至 `utils`

---

### behaviors/ - 共享逻辑

**职责**：微信小程序的 mixins 机制，复用页面/组件逻辑。

**规范**：
- 通用行为如 `useToast.js`（处理提示）放在此目录
- 页面/组件按需引入所需行为

---

### components/ - UI 组件

**职责**：可复用的 UI 组件，如导航栏、卡片等。

**规范**：
- 组件样式应通过 LESS 文件定义
- 组件配置需在 `usingComponents` 中声明

---

## 全局规范

### 语言与样式
- **语言**：仅使用 JavaScript，禁止引入 TypeScript
- **样式**：使用 LESS，共享变量定义在 `variable.less`
- **缩进**：2 空格

### 代码规范
- **ESLint**：遵循 `airbnb-base`
- **Prettier**：单引号、分号、所有项保留尾随逗号
- **行宽限制**：120 字符
- **导入顺序**：内置模块 → 外部模块 → 内部模块

### 全局对象
可直接访问：`wx`, `App`, `Page`, `Component`, `getCurrentPages`, `getApp`

### 注意事项
- 避免在代码中硬编码本应放在 `config/` 中的字符串
- 不要在 WXML 文件中使用内联样式
- 提交代码前必须运行 lint 检查

---

## 命令

```bash
# 安装依赖
npm install

# 运行 lint 检查
npm run lint

# 自动修复 lint 错误
npm run lint:fix
```

---

## 技术栈

- **框架**：微信小程序
- **UI 组件库**：TDesign Mini Program v1.11.2
- **基础库版本**：^2.6.5

---

## 其他

- GitHub Actions 会在每次 PR 时自动运行 lint
- 测试真实 API 前，请确认 `config/index.js` 中的 `isMock` 设置正确
