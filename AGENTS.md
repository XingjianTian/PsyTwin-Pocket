# AGENTS.md

## 概述
PsyTwin-Pocket 是基于 TDesign 框架开发的微信小程序。项目采用 JavaScript 和 LESS 编写，通过模块化结构组织代码，包含 API 调用、共享行为和工具函数。该项目旨在提供一个高性能、易扩展的移动端心理咨询或社交平台原型。

## 目录结构
- **api/**: HTTP 请求层和服务定义。
- **behaviors/**: 微信小程序 mixins 共享逻辑，例如 `useToast.js`。
- **components/**: 导航栏、卡片等可复用 UI 组件。
- **config/**: 运行时配置和环境变量。
- **mock/**: 本地模拟数据系统，用于离线开发。
- **pages/**: 包含主 tab 页和所有分包目录。
    - **pages/home**, **pages/message**, **pages/my**: 三个主 Tab 页面。
    - **分包目录**: 包含 search, chat, login, loginCode, dataCenter, setting, release, my/info-edit。
- **static/**: 图标、图片等静态资源。
- **utils/**: `util.js` 和 `eventBus.js` 等工具模块。

## 查找位置
- **app.js**: 程序入口。管理生命周期、WebSocket 连接和全局事件总线。
- **app.json**: 定义页面路径、tabBar 配置和分包边界。
- **config/index.js**: 切换 `isMock` 标志或修改 API 端点的核心位置。
- **pages/**: 包含三个主 tab（home, message, my）和八个分包。分包包括搜索（search）、聊天（chat）、登录（login, loginCode）、数据中心（dataCenter）、设置（setting）、发布（release）以及个人信息编辑（my/info-edit）。

## 代码地图
- **全局状态**: 通过 `app.js` 和 `utils/eventBus.js` 进行管理。
- **数据流**: 页面调用 `api/` 中的函数，这些函数统一使用 request 工具。
- **UI 逻辑**: 组件通常从 `behaviors/` 导入行为，处理显示提示等通用任务。

## 规范
- **语言**: 仅使用 JavaScript。禁止引入 TypeScript。
- **样式**: 使用 LESS 编写。共享变量定义在 `variable.less` 中。
- **代码检查**: 遵循 `airbnb-base` 和 Prettier。行宽限制为 120 字符。
- **格式化**: 使用单引号、分号，所有项保留尾随逗号。缩进使用 2 空格。
- **导入顺序**: 依次为内置模块、外部模块、内部模块。
- **全局对象**: 直接访问 `wx`, `App`, `Page`, `Component`, `getCurrentPages`, `getApp`。

## 注意事项
- 避免在代码中硬编码本应放在 `config/` 中的字符串。
- 不要在 WXML 文件中使用内联样式。
- 提交代码前必须运行 lint 检查。

## 命令
- `npm run lint`: 运行 ESLint 检查样式违规。
- `npm run lint:fix`: 自动修复大部分 lint 错误。

## 笔记
- 项目使用 TDesign 小程序版 1.11.2。
- GitHub Actions 会在每次拉取请求时自动运行 lint。
- 测试真实 API 前，请确认 `config/index.js` 中的 `isMock` 设置正确。
