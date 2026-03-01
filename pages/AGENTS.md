# AGENTS.md

## 概述
本目录管理 PsyTwin-Pocket 的所有页面文件，涵盖了三个核心主 Tab 页以及多个功能分包。

## 目录结构
- **主 Tab 页面**:
  - `home/`: 首页，展示核心内容流。
  - `message/`: 消息页，管理私聊和通知列表。
  - `my/`: 个人中心，展示用户信息与功能入口。
- **懒加载分包**:
  - `search/`: 搜索功能。
  - `chat/`: 实时聊天对话界面。
  - `login/`, `loginCode/`: 登录流程与验证码校验。
  - `dataCenter/`: 数据统计与展示中心。
  - `setting/`: 系统设置与偏好管理。
  - `release/`: 内容发布与编辑。
  - `my/info-edit/`: 个人资料修改。

## 查找位置
- **首页**: `pages/home/index.js` + `.wxml` + `.less` + `.json`
- **消息**: `pages/message/index.js` + `.wxml` + `.less` + `.json`
- **我的**: `pages/my/index.js` + `.wxml` + `.less` + `.json`
- **聊天**: `pages/chat/index.js` + `.wxml` + `.less` + `.json`

## 规范
- 每个页面必须由四个文件组成：`.js`, `.wxml`, `.less`, `.json`。
- 模块导入需严格遵循根目录 `docs/AGENTS.md` 中的 `import/order` 规则。
- 界面开发优先使用 `tdesign-miniprogram` 组件库。
- 页面样式应通过 LESS 文件定义，禁止在 WXML 中使用内联样式。

## 注意事项
- 严禁将页面特定的业务逻辑写在 `app.js` 中。
- 保持页面文件简洁。如果逻辑过于复杂，应拆分为独立组件或提取至 `utils`。
- 确保在 `.json` 文件中正确配置分包所需的第三方组件。
- 页面间的跳转应使用统一的导航工具类，避免硬编码路径。
