# PsyTwin-Pocket 微信小程序

基于 TDesign 开发的心理咨询/社交平台微信小程序 - 学生端心友圈功能。

## 项目简介

PsyTwin-Pocket 是一个面向学生的心理健康咨询与社交平台小程序，提供心友圈动态、消息聊天、个人中心等功能。

## 技术栈

- **框架**: 微信小程序 (WeChat Mini Program)
- **UI 组件库**: TDesign Mini Program v1.11.2
- **样式**: LESS
- **代码规范**: ESLint (airbnb-base) + Prettier

## 目录结构

```
├── api/                    # HTTP 请求层和服务定义
├── behaviors/              # 微信小程序 mixins 共享逻辑
├── components/             # 可复用 UI 组件
├── config/                 # 运行时配置和环境变量
├── mock/                   # 本地模拟数据系统
├── pages/                  # 页面目录
│   ├── home/               # 首页 tab
│   ├── message/            # 消息 tab
│   ├── my/                 # 我的 tab
│   └── (分包)              # 搜索、聊天、登录等分包页面
├── static/                 # 静态资源 (图标、图片)
└── utils/                  # 工具函数
```

## 功能模块

- **首页**: 心友圈动态流、发布功能
- **消息**: 聊天消息列表
- **我的**: 个人中心、设置
- **搜索**: 帖子/用户搜索
- **聊天**: 私信聊天
- **登录**: 手机号登录、验证码登录
- **数据中心**: 数据统计图表
- **信息编辑**: 个人信息编辑

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发预览

1. 打开[微信开发者工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)
2. 导入整个项目
3. 构建 npm 包
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

## 基础库版本

最低基础库版本 `^2.6.5`

## 开源协议

MIT License

## GitHub

- 仓库地址: https://github.com/XingjianTian/PsyTwin-Pocket
