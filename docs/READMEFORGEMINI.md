# PsyTwin-Pocket 项目完整解析

## 项目概述

PsyTwin-Pocket 是基于 TDesign 微信小程序模板开发的心理咨询/社交平台原型。项目采用 JavaScript + LESS 样式，通过模块化结构组织代码。

## 技术栈

| 技术 | 版本/说明 |
|------|-----------|
| 框架 | 微信小程序原生开发 |
| UI 库 | TDesign Mini Program 1.11.2 |
| 语言 | JavaScript (ES6+) |
| 样式 | LESS |
| 代码规范 | ESLint (airbnb-base) + Prettier |
| 行宽限制 | 120 字符 |

## 项目结构

```
./
├── api/                 # HTTP 请求层
│   └── request.js      # 核心请求工具
├── behaviors/          # WeChat mixins
│   └── useToast.js     # Toast 提示行为
├── components/        # 可复用组件
│   ├── card/          # 卡片组件
│   └── nav/           # 导航栏组件（含侧边栏）
├── config/            # 运行时配置
│   └── index.js       # isMock 开关、baseUrl
├── mock/              # 模拟数据系统
│   ├── index.js       # Mock 入口
│   ├── request.js     # Mock 请求拦截
│   ├── home/          # 首页 Mock
│   ├── search/        # 搜索 Mock
│   ├── login/        # 登录 Mock
│   ├── my/           # 个人中心 Mock
│   ├── dataCenter/   # 数据中心 Mock
│   └── chat.js       # 聊天 Mock (含 WebSocket 模拟)
├── pages/             # 页面目录
│   ├── home/         # 首页 (Tab)
│   ├── message/      # 消息列表 (Tab)
│   ├── my/           # 个人中心 (Tab)
│   ├── search/      # 搜索页 (分包)
│   ├── chat/        # 聊天页 (分包)
│   ├── login/       # 登录页 (分包)
│   ├── loginCode/   # 验证码登录 (分包)
│   ├── dataCenter/  # 数据中心 (分包)
│   ├── setting/     # 设置页 (分包)
│   ├── release/     # 发布页 (分包)
│   └── my/info-edit/ # 信息编辑 (分包)
├── static/           # 静态资源
│   ├── home/        # 首页图片
│   └── chat/        # 聊天头像
└── utils/           # 工具模块
    ├── util.js      # 通用工具
    └── eventBus.js  # 全局事件总线
```

## 入口与全局

### app.js
- 管理应用生命周期
- WebSocket 连接（实时消息）
- 全局事件总线 (`eventBus`)
- 未读消息数量管理
- 自动更新管理器

### app.json
- 3 个主 Tab：home, message, my
- 8 个懒加载分包

### 全局数据 (globalData)
```javascript
{
  userInfo: null,      // 用户信息
  unreadNum: 0,       // 未读消息数
  socket: null         // WebSocket 连接
}
```

## 页面详解

### 1. 首页 (pages/home)
**功能**：展示内容流、轮播图、卡片列表
**API**：
- `GET /home/cards` - 获取卡片列表
- `GET /home/swipers` - 获取轮播图
**组件**：TDesign Message (消息提示)
**数据模型**：
```javascript
{
  url: String,        // 图片地址
  desc: String,       // 描述文本
  tags: Array         // 标签 [{text, theme}]
}
```

### 2. 消息列表 (pages/message)
**功能**：私聊列表、实时消息推送、未读计数
**WebSocket**：实时接收新消息
**API**：
- `fetchMessageList()` - 获取消息列表
- `markMessagesRead(userId)` - 标记已读
**数据模型**：
```javascript
{
  userId: Number,
  name: String,
  avatar: String,
  messages: [{
    messageId: Number,
    from: Number,      // 0=自己, 1=对方
    content: String,
    time: Number,
    read: Boolean
  }]
}
```

### 3. 我的 (pages/my)
**功能**：用户信息展示、服务列表、内容管理入口
**API**：
- `GET /api/getServiceList` - 获取服务列表
- `GET /api/genPersonalInfo` - 获取个人信息
**数据模型**：
```javascript
{
  personalInfo: Object,
  service: Array,
  gridList: [{ name, icon, type, url }],
  settingList: [{ name, icon, type, url }]
}
```

### 4. 聊天页 (pages/chat)
**功能**：一对一实时聊天
**跳转参数**：`?userId=xxx`

### 5. 搜索页 (pages/search)
**功能**：搜索内容、热门搜索、搜索历史

### 6. 登录页 (pages/login, loginCode)
**功能**：账号密码登录、验证码登录

### 7. 数据中心 (pages/dataCenter)
**功能**：数据统计、会员信息、互动数据

### 8. 设置页 (pages/setting)
**功能**：系统设置、偏好管理

### 9. 发布页 (pages/release)
**功能**：内容发布与编辑

### 10. 信息编辑 (pages/my/info-edit)
**功能**：个人资料修改

## API 层架构

### request.js 核心逻辑
```javascript
// 请求封装
request(url, method, data)
  → 设置 Content-Type: application/json
  → 注入 Authorization: Bearer {token}
  → 调用 wx.request
  → Mock 模式添加 500ms 延迟
  → 统一处理响应状态码
```

### Mock 开关
- 位置：`config/index.js`
- 字段：`isMock: true/false`
- Mock 模式下：请求被拦截返回本地数据，添加延迟模拟网络

### 数据响应格式
```javascript
{
  code: Number,    // 200=成功
  message: String,
  data: Object
}
```

## 可复用组件

### 1. 卡片组件 (components/card)
```javascript
properties: {
  url: String,    // 图片
  desc: String,   // 描述
  tags: Array     // 标签
}
```

### 2. 导航栏组件 (components/nav)
- 支持侧边栏抽屉
- 页面快速导航
- 状态栏高度适配

### 3. Toast 行为 (behaviors/useToast)
```javascript
// 使用方式
Page({
  behaviors: [useToastBehavior],
  onShowToast(selector, message) { ... }
})
```

## Mock 系统

### 结构
```
mock/
├── index.js        # 注册所有 mock 接口
├── request.js      # 请求拦截器
├── home/           # 首页数据
├── search/         # 搜索数据
├── login/          # 登录数据
├── my/             # 个人中心数据
├── dataCenter/     # 数据中心数据
└── chat.js         # 聊天 WebSocket 模拟
```

### 聊天 Mock 特别实现
- `MockSocketTask` 类模拟 WebSocket
- 支持 `onopen`, `onmessage`, `send` 方法
- 模拟 3 秒后自动回复

### 新增 Mock 接口
1. 在对应目录创建 `getXXX.js`
2. 导出默认对象 `{ path, data }`
3. 在 `mock/index.js` 注册

## 开发规范

### 页面文件结构
每个页面必须有 4 个文件：
- `index.js` - 逻辑
- `index.wxml` - 模板
- `index.less` - 样式
- `index.json` - 配置

### import 顺序
1. 微信内置模块
2. 外部第三方库
3. 项目内部工具/行为/配置
4. 同目录模块

### 样式规范
- 使用 LESS
- 共享变量在 `variable.less`
- 禁止 WXML 内联样式
- 2 空格缩进

### 命令
```bash
npm run lint      # 检查代码
npm run lint:fix  # 自动修复
```

## 待设计功能（基于模板）

基于现有模板，以下功能需要重新设计以适配心理咨询/社交平台：

1. **首页** - 改为心理资讯/文章/问答流
2. **消息** - 保留私信功能，增加系统通知
3. **我的** - 增加咨询师认证、订单管理、收藏等
4. **搜索** - 增加心理测试、咨询师搜索
5. **聊天** - 保留，需适配心理咨询场景
6. **登录** - 增加手机号快捷登录
7. **数据中心** - 改为咨询数据/收益统计
8. **发布** - 改为发布文章/问答
9. **设置** - 增加隐私设置、通知设置
10. **信息编辑** - 扩展为个人资料+咨询师资料

## 注意事项

1. 微信小程序需在开发者工具中打开
2. 使用前先 `npm install` 安装依赖
3. 开发阶段确保 `config/index.js` 中 `isMock: true`
4. 切换正式环境时改为 `false` 并配置真实 `baseUrl`
5. 提交前必须运行 `npm run lint`
