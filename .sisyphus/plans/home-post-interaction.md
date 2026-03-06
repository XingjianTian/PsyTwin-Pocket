# 工作计划：心墙动态详情、点赞、评论功能完善

> 创建时间: 2026-03-06
> 计划类型: 功能完善
> 优先级: 高

---

## 一、需求概述

### 目标
完善首页「心墙」Tab 的动态交互功能，实现：
1. **动态详情页** - 点击卡片可查看完整内容和评论区
2. **点赞功能** - 点击点赞图标有交互效果（状态切换、数字变化、动画）
3. **评论功能** - 在详情页可查看评论列表并发表新评论

### 当前状态
- ✅ 瀑布流展示、下拉刷新、发布入口已实现
- ⚠️ 点赞仅静态显示，无点击交互
- ❌ 评论功能未实现（数据模型有 `commentCount` 但无入口）
- ❌ 无动态详情页

---

## 二、PRD 更新内容（需同步到 OPENSPECS_STUDENT.md）

### 2.1 动态卡片模块更新

在 `#### 1.2.2 动态卡片` 部分添加：

```markdown
- [x] **点击卡片进入详情** ⭐ 新增
  - 入口：`pages/home/index.wxml` - card 组件点击事件
  - 详情页：`pages/post-detail/index` - 查看完整内容
```

### 2.2 新增章节：动态详情页

在 `1.2.2` 后新增 `1.2.2.1 动态详情页`：

```markdown
#### 1.2.2.1 动态详情页 (新增) ⭐
**功能定位**：查看动态完整内容、点赞、评论、分享

**页面结构**：
```
pages/post-detail/
├── index.js      # 页面逻辑：加载详情、点赞、评论
├── index.wxml    # 页面结构
├── index.less    # 页面样式
└── index.json    # 页面配置
```

**核心功能**：
- [ ] **头部信息**：发布者头像、昵称、发布时间、更多操作
- [ ] **内容展示**：文字完整显示、图片网格（支持预览）、标签
- [ ] **互动操作栏**（底部固定）：
  - 点赞按钮：点击切换状态，数字+1/-1，图标变色
  - 评论按钮：点击聚焦输入框
  - 收藏按钮：点击切换收藏状态
  - 分享按钮：触发微信分享
- [ ] **评论区**：
  - 评论列表：头像、昵称、内容、时间
  - 评论输入：底部输入框，支持发送
  - 空状态：暂无评论提示

**数据模型扩展**：
```javascript
{
  id: String,
  author: { id, nickname, avatar, role, department },
  content: { text, images[], location, isAnonymous },
  stats: { likeCount, commentCount, shareCount },
  isLiked: Boolean,
  isCollected: Boolean,
  createdAt: String,
  comments: [{
    id: String,
    author: { id, nickname, avatar, role },
    content: String,
    createdAt: String,
    likeCount: Number,
    isLiked: Boolean
  }]
}
```

**Mock 接口**：
```
GET /mock/student/home/post/:id       # 获取动态详情
POST /mock/student/home/post/:id/like  # 点赞/取消点赞
POST /mock/student/home/post/:id/comment # 发表评论
```
```

### 2.3 新增章节：点赞功能

```markdown
#### 1.2.2.2 点赞功能 (新增) ⭐
**功能描述**：
- 点击点赞图标切换点赞状态
- 未点赞 → 已点赞：图标变填充 + 主题色 + 数字+1
- 已点赞 → 未点赞：图标恢复线框 + 灰色 + 数字-1
- 动画效果：点击时轻微放大（scale 1.2 → 1.0）

**实现位置**：
- 列表页：`components/card/index.js` - 添加 `onLikeTap` 方法
- 详情页：`pages/post-detail/index.js` - 点赞交互
```

### 2.4 新增章节：评论功能

```markdown
#### 1.2.2.3 评论功能 (新增) ⭐
**功能描述**：
- 详情页底部展示评论列表
- 支持发表评论（文本输入）
- 评论实时显示在列表顶部

**页面组件**：
```
详情页
├── 内容区（可滚动）
│   ├── 动态内容
│   └── 评论列表
└── 底部固定输入栏
    ├── 输入框（t-input）
    └── 发送按钮
```
```

---

## 三、执行策略

### 3.1 并行执行分组

```
第 1 波（基础设施 - 可并行）：
├── 任务 1: 创建动态详情页文件结构
├── 任务 2: 扩展 Mock 数据（评论数据、详情接口）
├── 任务 3: 扩展数据模型（isLiked, isCollected, comments）
└── 任务 4: 更新 API 模块（详情、点赞、评论接口）

第 2 波（核心功能 - 依赖第1波）：
├── 任务 5: 实现动态详情页（内容展示）
├── 任务 6: 实现评论区组件
├── 任务 7: 实现点赞功能（详情页 + 列表页）
└── 任务 8: 实现评论发表功能

第 3 波（联调优化 - 依赖第2波）：
├── 任务 9: 卡片组件添加点击跳转
├── 任务 10: 详情页返回刷新列表状态
├── 任务 11: 动画效果优化
└── 任务 12: PRD 文档状态同步更新
```

### 3.2 依赖关系

- 任务 5 依赖：任务 1, 2, 4
- 任务 6 依赖：任务 1, 2
- 任务 7 依赖：任务 3, 4
- 任务 8 依赖：任务 6, 4
- 任务 9 依赖：任务 5
- 任务 10 依赖：任务 5, 7
- 任务 11 依赖：任务 7
- 任务 12 依赖：所有任务完成

---

## 四、详细任务清单

### 任务 1: 创建动态详情页文件结构
**分类**: quick
**预估耗时**: 15分钟

**工作内容**：
1. 创建 `pages/post-detail/` 目录
2. 创建四个基础文件：
   - `index.js` - 页面逻辑框架
   - `index.wxml` - 页面结构框架
   - `index.less` - 基础样式
   - `index.json` - 页面配置（使用 TDesign 组件）
3. 在 `app.json` 中注册页面路径

**文件模板**：
```javascript
// pages/post-detail/index.js
Page({
  data: {
    postId: '',
    postDetail: null,
    comments: [],
    inputValue: '',
    isLiked: false,
    likeCount: 0,
    isCollected: false,
  },
  
  onLoad(options) {
    this.setData({ postId: options.id });
    this.loadPostDetail();
    this.loadComments();
  },
  
  async loadPostDetail() { /* 加载详情 */ },
  async loadComments() { /* 加载评论 */ },
  onLikeTap() { /* 点赞 */ },
  onCommentTap() { /* 评论 */ },
  onInputChange(e) { /* 输入处理 */ },
  onSendComment() { /* 发送评论 */ },
});
```

**验收标准**：
- [ ] `pages/post-detail/` 目录存在
- [ ] 四个文件创建成功
- [ ] `app.json` 中已注册 `"pages/post-detail/index"`
- [ ] 页面可以正常跳转（可空白）

---

### 任务 2: 扩展 Mock 数据
**分类**: quick
**预估耗时**: 30分钟

**工作内容**：
1. 在 `mock/student/home/` 目录下创建：
   - `getPostDetail.js` - 动态详情数据
   - `getComments.js` - 评论列表数据
   - `postLike.js` - 点赞接口
   - `postComment.js` - 发表评论接口

2. 更新 `mock/student/home/index.js` 注册新接口

**数据格式**：
```javascript
// getPostDetail.js
const getPostDetail = (req) => {
  const { id } = req.params;
  return {
    success: true,
    data: {
      id,
      author: { /* ... */ },
      content: { /* ... */ },
      stats: { likeCount: 38, commentCount: 7, shareCount: 2 },
      isLiked: false,
      isCollected: false,
      createdAt: '30分钟前',
    }
  };
};

// getComments.js
const getComments = () => ({
  success: true,
  data: [
    {
      id: 'c1',
      author: { id: 'u10', nickname: '小明', avatar: '...', role: 'student' },
      content: '说得真好，感同身受！',
      createdAt: '10分钟前',
      likeCount: 5,
      isLiked: false,
    }
  ]
});
```

**验收标准**：
- [ ] 四个 mock 文件创建完成
- [ ] mock 数据格式正确
- [ ] 接口注册成功
- [ ] 可通过 request 调用获取数据

---

### 任务 3: 扩展数据模型
**分类**: quick
**预估耗时**: 15分钟

**工作内容**：
1. 更新 `pages/home/index.js` 的 `formatCards` 方法：
   - 添加 `isLiked` 字段映射
   - 添加 `commentCount` 字段映射

2. 更新 `components/card/index.js` 的 `properties`：
   - 添加 `isLiked: Boolean`
   - 添加 `commentCount: Number`
   - 添加 `postId: String`

**代码变更**：
```javascript
// pages/home/index.js - formatCards
return {
  id: item.id,
  // ... 其他字段
  isLiked: item.isLiked || false,
  commentCount: item.stats?.commentCount || 0,
};

// components/card/index.js
properties: {
  postId: String,
  // ... 其他字段
  isLiked: Boolean,
  commentCount: Number,
}
```

**验收标准**：
- [ ] `formatCards` 返回包含 `isLiked` 和 `commentCount`
- [ ] `card` 组件 props 定义更新
- [ ] 首页渲染正常，无报错

---

### 任务 4: 更新 API 模块
**分类**: quick
**预估耗时**: 20分钟

**工作内容**：
1. 创建或更新 `api/post.js` 文件：
   - `getPostDetail(id)` - 获取动态详情
   - `toggleLike(id)` - 点赞/取消点赞
   - `postComment(id, content)` - 发表评论
   - `getComments(id)` - 获取评论列表

**接口定义**：
```javascript
import request from './request';

export const getPostDetail = (id) => 
  request(`/mock/student/home/post/${id}`);

export const toggleLike = (id) => 
  request(`/mock/student/home/post/${id}/like`, { method: 'POST' });

export const postComment = (id, content) => 
  request(`/mock/student/home/post/${id}/comment`, { 
    method: 'POST', 
    data: { content } 
  });

export const getComments = (id) => 
  request(`/mock/student/home/post/${id}/comments`);
```

**验收标准**：
- [ ] `api/post.js` 文件创建
- [ ] 四个 API 函数导出
- [ ] 在页面中可正常导入调用

---

### 任务 5: 实现动态详情页（内容展示）
**分类**: visual-engineering
**预估耗时**: 60分钟

**工作内容**：
1. **页面结构** (`index.wxml`)：
   - 顶部导航栏（返回按钮 + 标题）
   - 发布者信息区（头像、昵称、发布时间、更多按钮）
   - 内容区（文字 + 图片网格）
   - 互动数据栏（点赞数、评论数、分享数）

2. **页面样式** (`index.less`)：
   - 整体布局：白色背景、圆角卡片
   - 图片网格：1张全宽、2张并排、3+张九宫格
   - 标签样式：位置标签、话题标签

3. **页面逻辑** (`index.js`)：
   - `loadPostDetail()`：调用 API 加载详情
   - 图片预览：`wx.previewImage`

**WXML 结构**：
```xml
<view class="post-detail">
  <!-- 发布者信息 -->
  <view class="post-header">
    <image class="author-avatar" src="{{postDetail.author.avatar}}" />
    <view class="author-info">
      <text class="author-name">{{postDetail.author.nickname}}</text>
      <text class="post-time">{{postDetail.createdAt}}</text>
    </view>
    <t-icon name="more" bindtap="onMoreTap" />
  </view>
  
  <!-- 内容区 -->
  <view class="post-content">
    <text class="post-text">{{postDetail.content.text}}</text>
    <view class="image-grid">
      <image wx:for="{{postDetail.content.images}}" 
             src="{{item}}" 
             bindtap="previewImage" 
             data-index="{{index}}" />
    </view>
  </view>
  
  <!-- 互动数据 -->
  <view class="post-stats">
    <text>{{postDetail.stats.likeCount}} 赞</text>
    <text>{{postDetail.stats.commentCount}} 评论</text>
  </view>
</view>
```

**验收标准**：
- [ ] 页面结构完整，显示发布者、内容、图片
- [ ] 图片可点击预览
- [ ] 样式符合设计规范
- [ ] 加载状态处理（loading / 错误提示）

---

### 任务 6: 实现评论区组件
**分类**: visual-engineering
**预估耗时**: 60分钟

**工作内容**：
1. **评论列表** (`index.wxml`)：
   - 评论项：头像、昵称、身份标签、内容、时间、点赞
   - 空状态提示："暂无评论，来抢沙发吧~"
   - 分割线分隔

2. **评论输入栏**（底部固定）：
   - 输入框（placeholder: "写下你的评论..."）
   - 发送按钮（主题色）
   - 输入时键盘适配

3. **样式** (`index.less`)：
   - 评论区标题："评论 (数量)"
   - 评论项样式：头像 64rpx、昵称 28rpx、内容 26rpx
   - 输入栏：固定底部、安全区适配

**WXML 结构**：
```xml
<!-- 评论区 -->
<view class="comments-section">
  <view class="comments-header">评论 ({{comments.length}})</view>
  
  <view class="comment-list">
    <view wx:for="{{comments}}" wx:key="id" class="comment-item">
      <image class="comment-avatar" src="{{item.author.avatar}}" />
      <view class="comment-body">
        <view class="comment-meta">
          <text class="comment-author">{{item.author.nickname}}</text>
          <text wx:if="{{item.author.role === 'teacher'}}" class="teacher-badge">教师</text>
        </view>
        <text class="comment-content">{{item.content}}</text>
        <view class="comment-footer">
          <text class="comment-time">{{item.createdAt}}</text>
          <view class="comment-like" bindtap="onCommentLike" data-id="{{item.id}}">
            <t-icon name="thumb-up" size="24rpx" color="{{item.isLiked ? '#7c3aed' : '#9ca3af'}}" />
            <text>{{item.likeCount}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
  
  <!-- 空状态 -->
  <view wx:if="{{comments.length === 0}}" class="empty-state">
    <t-icon name="chat" size="48rpx" color="#ccc" />
    <text>暂无评论，来抢沙发吧~</text>
  </view>
</view>

<!-- 底部输入栏 -->
<view class="comment-input-bar">
  <t-input 
    value="{{inputValue}}" 
    placeholder="写下你的评论..."
    bindchange="onInputChange"
  />
  <t-button theme="primary" size="small" bindtap="onSendComment">发送</t-button>
</view>
```

**验收标准**：
- [ ] 评论列表正常显示
- [ ] 空状态提示正确
- [ ] 输入栏固定在底部
- [ ] 键盘弹出时输入栏跟随

---

### 任务 7: 实现点赞功能
**分类**: quick
**预估耗时**: 45分钟

**工作内容**：
1. **详情页点赞** (`pages/post-detail/index.js`)：
   - `onLikeTap()` 方法：调用 API、更新状态、播放动画
   - 状态切换：`isLiked` 取反，`likeCount` +/- 1
   - 动画：点击时图标 scale 1.2 → 1.0

2. **列表页点赞** (`components/card/index.js`)：
   - 添加 `onLikeTap()` 方法
   - 阻止冒泡（`catchtap`）
   - 触发事件通知父组件：`this.triggerEvent('like', { id: postId, isLiked: !isLiked })`
   - 局部更新状态

3. **图标状态**：
   - 未点赞：`name="thumb-up"` 线框图标，颜色 `#9ca3af`
   - 已点赞：`name="thumb-up"` 填充图标，颜色 `#7c3aed`

**代码实现**：
```javascript
// pages/post-detail/index.js
async onLikeTap() {
  const { postId, isLiked, likeCount } = this.data;
  
  // 乐观更新
  this.setData({
    isLiked: !isLiked,
    likeCount: isLiked ? likeCount - 1 : likeCount + 1,
  });
  
  try {
    await toggleLike(postId);
  } catch (error) {
    // 失败回滚
    this.setData({
      isLiked: isLiked,
      likeCount: likeCount,
    });
    wx.showToast({ title: '操作失败', icon: 'none' });
  }
},

// components/card/index.js
methods: {
  onLikeTap(e) {
    e.stopPropagation(); // 阻止冒泡
    const { postId, isLiked, likeCount } = this.data;
    
    this.setData({
      isLiked: !isLiked,
      likeCount: isLiked ? likeCount - 1 : likeCount + 1,
    });
    
    this.triggerEvent('like', {
      id: postId,
      isLiked: !isLiked,
      likeCount: isLiked ? likeCount - 1 : likeCount + 1,
    });
  },
}
```

**验收标准**：
- [ ] 点击点赞图标状态切换
- [ ] 数字 +/- 1 正确
- [ ] 图标颜色变化（灰 → 紫）
- [ ] 列表页点赞不触发卡片点击
- [ ] API 调用成功/失败处理正确

---

### 任务 8: 实现评论发表功能
**分类**: quick
**预估耗时**: 30分钟

**工作内容**：
1. 输入框绑定：`bindinput` 更新 `inputValue`
2. 发送按钮点击：`onSendComment()`
3. 发表评论逻辑：
   - 验证输入非空
   - 调用 `postComment(id, content)`
   - 成功后添加到评论列表顶部
   - 清空输入框
   - 显示成功提示

**代码实现**：
```javascript
// pages/post-detail/index.js
onInputChange(e) {
  this.setData({ inputValue: e.detail.value });
},

async onSendComment() {
  const { postId, inputValue, comments } = this.data;
  
  if (!inputValue.trim()) {
    wx.showToast({ title: '请输入评论内容', icon: 'none' });
    return;
  }
  
  try {
    const res = await postComment(postId, inputValue.trim());
    
    // 添加到列表顶部
    const newComment = {
      id: res.data.id,
      author: res.data.author, // 当前用户信息
      content: inputValue.trim(),
      createdAt: '刚刚',
      likeCount: 0,
      isLiked: false,
    };
    
    this.setData({
      comments: [newComment, ...comments],
      inputValue: '',
    });
    
    wx.showToast({ title: '评论成功', icon: 'success' });
  } catch (error) {
    wx.showToast({ title: '评论失败', icon: 'none' });
  }
},
```

**验收标准**：
- [ ] 输入框可正常输入
- [ ] 空内容提示"请输入评论内容"
- [ ] 发送后评论显示在列表顶部
- [ ] 输入框清空
- [ ] 显示成功/失败提示

---

### 任务 9: 卡片组件添加点击跳转
**分类**: quick
**预估耗时**: 20分钟

**工作内容**：
1. 更新 `components/card/index.wxml`：
   - 给根元素添加 `bindtap="onCardTap"`

2. 更新 `components/card/index.js`：
   - 添加 `onCardTap()` 方法
   - 触发事件：`this.triggerEvent('tap', { id: postId })`

3. 更新 `pages/home/index.wxml`：
   - card 组件添加 `bind:tap="onCardTap"`
   - 传递 `data-id="{{item.id}}"`

4. 更新 `pages/home/index.js`：
   - 添加 `onCardTap(e)` 方法
   - 跳转到详情页：`wx.navigateTo({ url: '/pages/post-detail/index?id=' + id })`

**代码实现**：
```javascript
// pages/home/index.js
onCardTap(e) {
  const { id } = e.detail;
  wx.navigateTo({
    url: `/pages/post-detail/index?id=${id}`,
  });
},
```

**验收标准**：
- [ ] 点击卡片触发跳转
- [ ] 正确传递动态 ID
- [ ] 详情页加载对应内容

---

### 任务 10: 详情页返回刷新列表状态
**分类**: quick
**预估耗时**: 20分钟

**工作内容**：
1. 在 `pages/post-detail/index.js` 中：
   - 使用 `getOpenerEventChannel()` 或页面栈通信
   - 或者使用全局事件总线通知首页刷新

2. 推荐方案 - 页面栈刷新：
```javascript
// pages/post-detail/index.js - onUnload
onUnload() {
  // 获取上一页（首页）实例
  const pages = getCurrentPages();
  const homePage = pages[pages.length - 2];
  
  if (homePage && homePage.refreshPostStatus) {
    homePage.refreshPostStatus(this.data.postId, {
      isLiked: this.data.isLiked,
      likeCount: this.data.likeCount,
      commentCount: this.data.comments.length,
    });
  }
}

// pages/home/index.js
refreshPostStatus(postId, newStatus) {
  // 更新 leftList 和 rightList 中对应卡片的状态
  const updateList = (list) => {
    return list.map(item => {
      if (item.id === postId) {
        return { ...item, ...newStatus };
      }
      return item;
    });
  };
  
  this.setData({
    leftList: updateList(this.data.leftList),
    rightList: updateList(this.data.rightList),
  });
}
```

**验收标准**：
- [ ] 从详情页返回首页
- [ ] 首页对应卡片点赞状态同步
- [ ] 首页对应卡片点赞数同步
- [ ] 首页对应卡片评论数同步

---

### 任务 11: 动画效果优化
**分类**: visual-engineering
**预估耗时**: 30分钟

**工作内容**：
1. **点赞按钮动画**：
```less
.footer-like {
  transition: transform 0.2s ease;
  
  &.liked {
    animation: likeBounce 0.3s ease;
  }
}

@keyframes likeBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

2. **卡片点击反馈**：
```less
.home-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  
  &:active {
    transform: scale(0.98);
  }
}
```

3. **评论添加动画**（可选）：
```less
.comment-item {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**验收标准**：
- [ ] 点赞时有弹跳动画
- [ ] 卡片点击有缩放反馈
- [ ] 动画流畅，不卡顿

---

### 任务 12: PRD 文档状态同步更新
**分类**: writing
**预估耗时**: 20分钟

**工作内容**：
1. 更新 `docs/OPENSPECS_STUDENT.md`：
   - 更新 `1.2.2 动态卡片` 章节：添加详情入口、点赞、评论状态
   - 添加 `1.2.2.1 动态详情页` 章节
   - 添加 `1.2.2.2 点赞功能` 章节
   - 添加 `1.2.2.3 评论功能` 章节
   - 更新实现状态汇总表

2. 更新要点：
```markdown
#### 1.2.2 动态卡片
- [x] **发布者信息**：头像、昵称、身份标签（学生/教师）
- [x] **内容类型**：纯文字、图文混合
- [x] **点击卡片进入详情** ⭐ 已实现
- [x] **点赞功能** ⭐ 已实现（列表页 + 详情页）
- [x] **评论入口** ⭐ 已实现（详情页评论区）
- [ ] 收藏功能（数据模型存在，UI待实现）
- [x] **发布时间**：相对时间显示

新增章节详见 PRD 更新内容部分...
```

3. 更新 `docs/CHANGELOG.md`：
```markdown
## 2026-03-06
### 新增
- 心墙动态详情页（pages/post-detail）
- 点赞功能：列表页 + 详情页支持点赞/取消点赞
- 评论功能：详情页支持查看评论列表和发表评论
- Mock 接口：详情、点赞、评论
```

**验收标准**：
- [ ] PRD 文档更新完成
- [ ] 实现状态标记正确（- [x]）
- [ ] CHANGELOG 添加记录

---

## 五、技术要点

### 5.1 数据流设计
```
首页列表
  ↓ 点击卡片
detail页面 (onLoad加载详情和评论)
  ↓ 点赞/评论
call API → 本地状态更新 → 通知首页刷新 (onUnload)
```

### 5.2 关键交互细节
1. **点赞防抖**：点击后 500ms 内禁止重复点击
2. **评论输入**：获取焦点时滚动到底部
3. **图片预览**：使用 `wx.previewImage` 实现
4. **返回刷新**：通过页面栈通信同步状态

### 5.3 样式规范
- 主题色：`#7c3aed` (purple-primary)
- 头像尺寸：发布者 80rpx，评论者 64rpx
- 文字大小：标题 32rpx，正文 28rpx，辅助 24rpx
- 间距：使用 8rpx 基数（16rpx, 24rpx, 32rpx...）

---

## 六、风险与注意事项

### 6.1 潜在风险
1. **页面栈深度**：微信小程序限制页面栈 10 层，详情页需考虑返回逻辑
2. **图片加载**：详情页图片较多时需考虑懒加载
3. **键盘遮挡**：评论输入时键盘可能遮挡输入框

### 6.2 注意事项
1. 点赞状态需要持久化（后续接真实 API 时需同步）
2. 评论列表可能需要分页加载（当前先实现基础功能）
3. 匿名用户头像和昵称的处理要统一

---

## 七、验收标准汇总

### 功能验收
- [ ] 点击卡片跳转到详情页
- [ ] 详情页显示完整内容（文字、图片、发布者）
- [ ] 图片可点击预览
- [ ] 点赞按钮可点击，状态切换正常
- [ ] 点赞数字随状态变化
- [ ] 评论列表正常显示
- [ ] 可发表评论并实时显示
- [ ] 返回首页后状态同步

### 代码验收
- [ ] 代码符合 ESLint 规范
- [ ] Mock 数据格式正确
- [ ] API 接口定义清晰
- [ ] 组件化设计合理

### 文档验收
- [ ] PRD 更新完成
- [ ] CHANGELOG 更新
- [ ] 代码注释完整

---

## 八、执行命令

```bash
# 开始执行计划
/start-work home-post-interaction

# 或分阶段执行
/start-work home-post-interaction-phase1  # 第1波任务
/start-work home-post-interaction-phase2  # 第2波任务
/start-work home-post-interaction-phase3  # 第3波任务
```

---

*计划制定完成，等待执行指令*
