# 组件开发指南

> 文档类型: 开发手册
> 适用对象: 前端开发者
> 最后更新: 2026-05-19

---

## 目录

1. [设计原则](#1-设计原则)
2. [自定义组件](#2-自定义组件)
3. [TDesign 组件库](#3-tdesign-组件库)
4. [组件开发规范](#4-组件开发规范)
5. [组件使用示例](#5-组件使用示例)
6. [自定义 TabBar](#6-自定义-tabbar)
7. [最佳实践](#7-最佳实践)

---

## 1. 设计原则

```
┌─────────────────────────────────────────────────────────┐
│                   组件设计原则                           │
├─────────────────────────────────────────────────────────┤
│ 1. 优先使用 TDesign 组件库，减少自定义组件               │
│ 2. 组件样式通过 LESS 文件定义                            │
│ 3. 禁止在 WXML 中使用内联样式                            │
│ 4. 组件需在 usingComponents 中声明                       │
│ 5. 复杂逻辑应提取到 Behavior 或 utils                    │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 自定义组件

### 2.1 现有组件清单

| 组件 | 路径 | 用途 | 复杂度 |
|------|------|------|--------|
| **Card** | `components/card/` | 心墙瀑布流卡片 | 中 |
| **Nav** | `components/nav/` | 导航栏（含抽屉/搜索） | 高 |

### 2.2 Card 组件

#### 属性定义

```javascript
// components/card/index.js
Component({
  properties: {
    postId: String,
    url: String,
    desc: String,
    tags: Array,
    nickname: String,
    avatar: String,
    role: String,
    department: String,
    isAnonymous: Boolean,
    likeCount: Number,
    createdAt: String,
  },
});
```

#### 使用示例

```xml
<!-- pages/home/index.wxml -->
<card
  post-id="{{item.id}}"
  url="{{item.imageUrl}}"
  desc="{{item.content}}"
  tags="{{item.tags}}"
  nickname="{{item.author.nickname}}"
  avatar="{{item.author.avatar}}"
  role="{{item.author.role}}"
  department="{{item.author.department}}"
  is-anonymous="{{item.isAnonymous}}"
  like-count="{{item.likeCount}}"
  created-at="{{item.createdAt}}"
/>
```

#### 内部依赖

```json
// components/card/index.json
{
  "component": true,
  "usingComponents": {
    "t-image": "tdesign-miniprogram/image/image",
    "t-tag": "tdesign-miniprogram/tag/tag",
    "t-icon": "tdesign-miniprogram/icon/icon"
  }
}
```

### 2.3 Nav 组件

#### 属性定义

```javascript
// components/nav/index.js
Component({
  properties: {
    navType: {
      type: String,
      value: 'title',  // 'title' | 'search'
    },
    title: String,
  },
});
```

#### 使用示例

```xml
<!-- 标题模式 -->
<nav nav-type="title" title="心墙" />

<!-- 搜索模式 -->
<nav nav-type="search" />
```

#### 内部依赖

```json
// components/nav/index.json
{
  "component": true,
  "usingComponents": {
    "t-navbar": "tdesign-miniprogram/navbar/navbar",
    "t-icon": "tdesign-miniprogram/icon/icon",
    "t-drawer": "tdesign-miniprogram/drawer/drawer",
    "t-search": "tdesign-miniprogram/search/search"
  }
}
```

---

## 3. TDesign 组件库

### 3.1 全局注册

```json
// app.json
{
  "usingComponents": {
    "t-toast": "tdesign-miniprogram/toast/toast"
  }
}
```

### 3.2 常用组件速查

#### 基础组件

| 组件 | 路径 | 用途 |
|------|------|------|
| Button | `t-button` | 按钮 |
| Icon | `t-icon` | 图标 |
| Image | `t-image` | 图片（支持懒加载） |
| Text | `t-text` | 文本 |
| Link | `t-link` | 链接 |

#### 布局组件

| 组件 | 路径 | 用途 |
|------|------|------|
| Row/Col | `t-row` / `t-col` | 栅格布局 |
| Grid | `t-grid` / `t-grid-item` | 宫格 |
| Divider | `t-divider` | 分割线 |
| Sticky | `t-sticky` | 吸顶 |

#### 导航组件

| 组件 | 路径 | 用途 |
|------|------|------|
| Navbar | `t-navbar` | 导航栏 |
| TabBar | `t-tab-bar` / `t-tab-bar-item` | 底部标签栏 |
| Tabs | `t-tabs` / `t-tab-panel` | 选项卡 |
| Steps | `t-steps` / `t-step-item` | 步骤条 |
| Drawer | `t-drawer` | 抽屉 |
| SideBar | `t-side-bar` / `t-side-bar-item` | 侧边栏 |

#### 表单组件

| 组件 | 路径 | 用途 |
|------|------|------|
| Input | `t-input` | 输入框 |
| Textarea | `t-textarea` | 多行输入 |
| Search | `t-search` | 搜索框 |
| Checkbox | `t-checkbox` / `t-checkbox-group` | 复选框 |
| Radio | `t-radio` / `t-radio-group` | 单选框 |
| Switch | `t-switch` | 开关 |
| Picker | `t-picker` | 选择器 |
| DateTimePicker | `t-date-time-picker` | 日期时间选择器 |
| Calendar | `t-calendar` | 日历 |
| Cascader | `t-cascader` | 级联选择器 |
| Rate | `t-rate` | 评分 |
| Slider | `t-slider` | 滑块 |
| Stepper | `t-stepper` | 步进器 |
| Upload | `t-upload` | 上传 |

#### 反馈组件

| 组件 | 路径 | 用途 |
|------|------|------|
| Toast | `t-toast` | 轻提示 |
| Message | `t-message` | 消息通知 |
| Dialog | `t-dialog` | 对话框 |
| ActionSheet | `t-action-sheet` | 动作面板 |
| Loading | `t-loading` | 加载 |
| Overlay | `t-overlay` | 遮罩层 |
| Popup | `t-popup` | 弹出层 |
| PullDownRefresh | `t-pull-down-refresh` | 下拉刷新 |
| SwipeCell | `t-swipe-cell` | 滑动操作 |

#### 数据展示

| 组件 | 路径 | 用途 |
|------|------|------|
| Avatar | `t-avatar` | 头像 |
| Badge | `t-badge` | 徽标 |
| Cell | `t-cell` / `t-cell-group` | 单元格 |
| Collapse | `t-collapse` / `t-collapse-panel` | 折叠面板 |
| CountDown | `t-count-down` | 倒计时 |
| Empty | `t-empty` | 空状态 |
| Progress | `t-progress` | 进度条 |
| Skeleton | `t-skeleton` | 骨架屏 |
| Tag | `t-tag` | 标签 |
| Swiper | `t-swiper` / `t-swiper-item` | 轮播 |
| ImageViewer | `t-image-viewer` | 图片预览 |

#### 聊天组件

| 组件 | 路径 | 用途 |
|------|------|------|
| Chat | `t-chat` | 聊天容器 |
| ChatSender | `t-chat-sender` | 消息发送器 |
| ChatContent | `t-chat-content` | 消息内容 |
| ChatItem | `t-chat-item` | 单条消息 |
| ChatActionBar | `t-chat-action-bar` | 操作栏 |

---

## 4. 组件开发规范

### 4.1 文件结构

每个组件必须包含四个文件：

```
components/my-component/
├── index.js      # 组件逻辑
├── index.json    # 组件配置
├── index.wxml    # 组件模板
└── index.less    # 组件样式
```

### 4.2 组件配置 (`index.json`)

```json
{
  "component": true,
  "usingComponents": {
    "t-button": "tdesign-miniprogram/button/button"
  }
}
```

### 4.3 组件逻辑 (`index.js`)

```javascript
// components/my-component/index.js
Component({
  // 外部样式类
  externalClasses: ['my-class'],
  
  // 属性定义
  properties: {
    title: {
      type: String,
      value: '默认标题',
    },
    count: {
      type: Number,
      value: 0,
    },
    list: {
      type: Array,
      value: [],
    },
    active: {
      type: Boolean,
      value: false,
    },
  },
  
  // 内部数据
  data: {
    expanded: false,
  },
  
  // 生命周期
  lifetimes: {
    attached() {
      console.log('组件挂载');
    },
    detached() {
      console.log('组件卸载');
    },
  },
  
  // 方法
  methods: {
    handleTap() {
      this.setData({ expanded: !this.data.expanded });
      this.triggerEvent('change', { expanded: this.data.expanded });
    },
  },
});
```

### 4.4 组件模板 (`index.wxml`)

```xml
<!-- components/my-component/index.wxml -->
<view class="my-component my-class">
  <view class="header" bind:tap="handleTap">
    <text class="title">{{title}}</text>
    <t-icon name="{{expanded ? 'chevron-up' : 'chevron-down'}}" />
  </view>
  <view class="content" wx:if="{{expanded}}">
    <slot />
  </view>
</view>
```

### 4.5 组件样式 (`index.less`)

```less
/* components/my-component/index.less */
@import '../../variable.less';

.my-component {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
  
  .content {
    margin-top: 16rpx;
  }
}
```

### 4.6 命名规范

| 项目 | 规范 | 示例 |
|------|------|------|
| 组件目录 | 小写 + 连字符 | `my-component` |
| 属性名 | 小驼峰 | `postId`, `isActive` |
| WXML 属性 | 小写 + 连字符 | `post-id`, `is-active` |
| 事件名 | 小驼峰 | `onChange`, `onSubmit` |
| 样式类 | 小写 + 连字符 | `.my-component`, `.header-title` |

---

## 5. 组件使用示例

### 5.1 在页面中使用组件

```json
// pages/example/index.json
{
  "usingComponents": {
    "my-component": "../../components/my-component/index"
  }
}
```

```xml
<!-- pages/example/index.wxml -->
<my-component
  title="示例标题"
  count="{{count}}"
  list="{{list}}"
  active="{{true}}"
  bind:change="onComponentChange"
>
  <view>插槽内容</view>
</my-component>
```

### 5.2 常用组合模式

#### 卡片 + 按钮

```xml
<view class="card-list">
  <view class="card" wx:for="{{list}}" wx:key="id">
    <t-image src="{{item.url}}" mode="aspectFill" />
    <view class="card-content">
      <text class="title">{{item.title}}</text>
      <text class="desc">{{item.desc}}</text>
    </view>
    <t-button theme="primary" size="small" bind:tap="handleAction">
      操作
    </t-button>
  </view>
</view>
```

#### 表单 + 验证

```xml
<view class="form">
  <t-input
    label="用户名"
    placeholder="请输入用户名"
    value="{{form.username}}"
    bind:change="onUsernameChange"
    status="{{errors.username ? 'error' : ''}}"
    tips="{{errors.username}}"
  />
  <t-input
    label="密码"
    type="password"
    placeholder="请输入密码"
    value="{{form.password}}"
    bind:change="onPasswordChange"
  />
  <t-button theme="primary" block bind:tap="handleSubmit">
    提交
  </t-button>
</view>
```

#### 列表 + 加载状态

```xml
<t-pull-down-refresh value="{{refreshing}}" bind:refresh="onRefresh">
  <view class="list">
    <view class="item" wx:for="{{list}}" wx:key="id">
      {{item.name}}
    </view>
  </view>
  <t-loading wx:if="{{loading}}" theme="circular" size="40rpx" />
  <t-divider wx:if="{{!hasMore}}" content="没有更多了" />
</t-pull-down-refresh>
```

---

## 6. 自定义 TabBar

### 6.1 配置

```json
// app.json
{
  "tabBar": {
    "custom": true,
    "list": [
      { "pagePath": "pages/home/index", "text": "心墙" },
      { "pagePath": "pages/pet/index", "text": "心宠" },
      { "pagePath": "pages/message/index", "text": "AI" },
      { "pagePath": "pages/dataCenter/index", "text": "工作台" },
      { "pagePath": "pages/appointment/index", "text": "预约" },
      { "pagePath": "pages/my/index", "text": "我的" }
    ]
  }
}
```

### 6.2 角色区分

| 角色 | 显示 Tab |
|------|----------|
| 学生 | 心墙、心宠、AI、工作台、预约、我的 |
| 教师 | 心墙、AI、工作台、我的 |

### 6.3 事件监听

```javascript
// custom-tab-bar/index.js
Component({
  attached() {
    // 监听未读数变化
    getApp().eventBus.on('unread-num-change', this.updateUnreadNum);
    
    // 监听角色变化
    getApp().eventBus.on('role-change', this.updateRole);
    
    // 监听 TabBar 显隐
    getApp().eventBus.on('tabbar-toggle', this.toggleTabBar);
  },
  
  detached() {
    getApp().eventBus.off('unread-num-change', this.updateUnreadNum);
    getApp().eventBus.off('role-change', this.updateRole);
    getApp().eventBus.off('tabbar-toggle', this.toggleTabBar);
  },
});
```

---

## 7. 最佳实践

### 7.1 性能优化

| 建议 | 说明 |
|------|------|
| 使用 `t-image` 替代原生 `image` | 支持懒加载和占位图 |
| 使用 `lazyCodeLoading` | 按需加载组件代码 |
| 分包加载 | 非主包页面放入 subpackages |
| 避免大数据绑定 | 列表数据分页加载 |
| 及时清理事件监听 | 页面卸载时移除 eventBus 监听 |

### 7.2 样式规范

| ✅ 应该 | ❌ 不应该 |
|---------|----------|
| 使用 LESS 预处理器 | 使用原生 CSS |
| 使用 `rpx` 单位 | 使用 `px` |
| 样式写在 `.less` 文件 | 内联样式 |
| 使用 `overflow: hidden` 裁剪 | 图片溢出容器 |
| 使用 `<image>` 标签做背景 | CSS `background-image` |

### 7.3 注意事项

| 注意点 | 说明 |
|--------|------|
| 路径别名 | `~/*` 映射到 `/*` |
| 组件引用路径 | 相对路径，如 `../../components/card/index` |
| TDesign 版本 | 当前使用 `^1.11.2`，升级前需验证兼容性 |
| 基础库版本 | 最低 `2.6.5`，部分组件可能需要更高版本 |

---

> **相关文档**
> - [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - 项目全景文档
> - [API 使用指南](./API_GUIDE.md) - API 层开发手册
