# PsyTwin-Pocket 微信小程序

基于 TDesign 开发的心理咨询/社交平台微信小程序 - 学生端心墙功能。

## 项目简介

PsyTwin-Pocket 是一个面向学生的心理健康咨询与社交平台小程序，提供心墙动态、消息聊天、个人中心等功能。

## 技术栈

- **框架**: 微信小程序 (WeChat Mini Program)
- **基础库版本**: ^2.6.5
- **UI 组件库**: TDesign Mini Program v1.11.2
- **样式**: LESS
- **代码规范**: ESLint (airbnb-base) + Prettier
- **后端**: Sentinel (NestJS + Prisma + PostgreSQL)
- **AI 服务**: OpenClaw Gateway (Therapist 子代理)

## 目录结构

```
├── api/                    # HTTP 请求层和服务定义
├── behaviors/              # 微信小程序 mixins 共享逻辑
├── components/             # 可复用 UI 组件
├── config/                 # 运行时配置和环境变量
├── docs/                   # 项目文档
├── mock/                   # 本地模拟数据系统
├── pages/                  # 页面目录
│   ├── home/               # 首页 tab（心墙）
│   ├── message/            # 消息 tab（AI 会话列表）
│   ├── my/                 # 我的 tab（个人中心）
│   ├── dataCenter/         # 工作台 tab（教师端统计）
│   ├── appointment/        # 预约 tab
│   ├── chat/               # 聊天页面（分包）
│   ├── search/             # 搜索页面（分包）
│   ├── login/              # 登录页面（分包）
│   ├── loginCode/          # 验证码登录（分包）
│   ├── setting/            # 设置页面（分包）
│   ├── release/            # 发布动态（分包）
│   ├── assessment/         # 心理测评（分包）
│   ├── vr-record/          # VR 记录（分包）
│   ├── notification/       # 消息通知（分包）
│   ├── teacher/            # 教师端页面（分包）
│   │   ├── warning-list/   # 预警列表
│   │   ├── appointment-manage/ # 预约管理
│   │   └── student-list/   # 学生管理
│   └── ...
├── static/                 # 静态资源 (图标、图片)
└── utils/                  # 工具函数
```

## 功能模块

### 已实现功能 ✅

- **首页**: 心墙动态流、发布功能、瀑布流布局
- **消息**: 聊天消息列表、AI 心理治疗师对话（OpenClaw Therapist）
- **我的**: 个人中心、设置、心理测评、VR 记录
- **搜索**: 帖子/用户搜索
- **聊天**: 私信聊天、AI 心理咨询
- **登录**: 手机号登录、验证码登录、动态 TabBar 切换
- **数据中心**: 数据统计图表
- **信息编辑**: 个人信息编辑
- **消息通知**: 通知列表、已读标记（后端已联调）
- **心理测评**: 测评记录展示
- **VR 记录**: VR 体验记录展示
- **预约**: 心理咨询预约、服务预约

### 教师端功能

- **工作台**: 数据统计图表、预警管理
- **学生管理**: 学生列表、预警处理
- **预约管理**: 预约确认、日程管理
- **我的**: 个人信息、设置

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发预览

1. 打开[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)
2. 导入整个项目
3. 构建 npm 包（点击工具栏"构建 npm"）
4. 预览示例

### 代码检查

```bash
# 运行 ESLint 检查
npm run lint

# 自动修复大部分 lint 错误
npm run lint:fix
```

### 配置说明

- `config/index.js`: 切换 `isMock` 标志或修改 API 端点
  - `isMock: true` - 使用本地 Mock 数据
  - `isMock: false` - 连接 Sentinel 后端
  - `baseUrl`: 后端 API 地址（默认 `http://localhost:3000/api/pocket`）

### 注意事项

- **主包体积限制**：整个小程序所有分包大小不超过 30M，单个分包/主包大小不能超过 2M
- **安全区域适配**：所有页面已添加刘海屏适配（`env(safe-area-inset-top)`）
- **分包加载**：非 TabBar 页面已配置为分包，优化首屏加载速度
- **教师端页面**：`pages/teacher/` 目录为教师端功能，已配置为独立分包

## 基础库版本

最低基础库版本 `^2.6.5`

## 开源协议

MIT License

## GitHub

- 仓库地址: https://github.com/XingjianTian/PsyTwin-Pocket
