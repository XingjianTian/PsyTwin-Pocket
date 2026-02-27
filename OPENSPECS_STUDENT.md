# OpenSpecs: PsyTwin Pocket 学生端功能规格说明书

## 1. 模块一：首页 - 心友圈 (Home)

### 1.1 页面定位
- **功能**：校园社区内容浏览与互动
- **形态**：类似"校内小红书"的瀑布流社区
- **定位**：日常表达、情感记录、社交互动

### 1.2 核心功能

#### 1.2.1 内容分类 Tab
| Tab | 说明 | 可见性 |
|-----|------|--------|
| 关注 | 关注用户发布的动态 | 需登录 |
| 校园广场 | 全校公开动态 | 公开 |
| 树洞 | 匿名发布的私密动态 | 仅自己可见 |

#### 1.2.2 动态卡片
- **发布者信息**：头像、昵称、身份标签（学生/教师）
- **内容类型**：纯文字、图文混合、视频
- **互动按钮**：点赞、评论、收藏、分享
- **发布时间**：相对时间显示（刚刚、N分钟前、N小时前）

#### 1.2.3 发布入口
- 点击右下角 "+" 按钮进入发布流程
- 支持：文字（500字内）、图片（最多9张）、定位

#### 1.2.4 无感检测逻辑
- 学生浏览停留时间异步上报
- 点赞、评论文本内容后台 NLP 风险评估
- 发布内容自动进行抑郁/焦虑倾向打分
- 高风险内容标记预警（仅后台可见）

### 1.3 数据模型

```javascript
// 动态卡片数据
{
  id: String,
  author: {
    id: String,
    nickname: String,
    avatar: String,
    role: 'student' | 'teacher',
    department: String
  },
  content: {
    text: String,
    images: String[], // 图片 URL 数组
    location: String,
    isAnonymous: Boolean
  },
  stats: {
    likeCount: Number,
    commentCount: Number,
    shareCount: Number
  },
  isLiked: Boolean,
  isCollected: Boolean,
  createdAt: String, // ISO 时间
  riskScore: Number // 风险评分（后台）
}

// Mock 数据路径
GET /mock/student/home/feed
```

### 1.4 交互流程
```
用户进入 → 加载关注流 → 下拉刷新 → 上拉加载更多
     ↓
点击卡片 → 查看详情 → 点赞/评论/收藏
     ↓
点击发布 → 选择类型 → 编辑内容 → 发布成功 → 刷新列表
```

---

## 2. 模块二：AI 对话页 (AI Chat)

### 2.1 页面定位
- **功能**：AI 心理咨询与陪伴
- **形态**：会话列表 + 聊天窗口
- **定位**：7×24 小时 AI 情绪陪伴、心理疏导

### 2.2 核心功能

#### 2.2.1 会话列表
| 会话 | 类型 | 说明 |
|------|------|------|
| PsyTwin 树洞助手 | AI | 官方 AI，24/7 响应，通用情绪陪伴 |
| 咨询师小明 | 真人 | 可预约的真人心理咨询师 |
| 咨询师小红 | 真人 | 可预约的真人心理咨询师 |

#### 2.2.2 聊天窗口功能
- **快捷情绪 Tag**：发送消息前可选择情绪标签（😢难过 😡愤怒 😰焦虑 😴困倦 😊开心）
- **AI 响应**：根据情绪标签推送冥想音频或 CBT 小卡片
- **危机干预**：检测到高风险内容时触发预警流程
- **聊天记录**：本地存储 + 云端同步

#### 2.2.3 CBT 引导卡片
- AI 在对话中主动推送认知行为疗法卡片
- 卡片类型：
  - 情绪识别卡
  - 思维记录卡
  - 认知重构卡
  - 放松练习卡

### 2.3 数据模型

```javascript
// 会话列表项
{
  id: String,
  type: 'ai' | 'counselor',
  name: String,
  avatar: String,
  lastMessage: String,
  lastMessageTime: String,
  unreadCount: Number,
  status: 'online' | 'offline'
}

// 聊天消息
{
  id: String,
  sessionId: String,
  sender: 'user' | 'ai' | 'counselor',
  type: 'text' | 'emotionTag' | 'cbtCard' | 'audio',
  content: String,
  emotionTag: String, // 情绪标签
  sentimentScore: Number, // 情绪分数 -1~1
  alertLevel: 'none' | 'low' | 'medium' | 'high',
  createdAt: String
}

// CBT 卡片
{
  id: String,
  type: 'emotion' | 'thought' | 'cognitive' | 'relaxation',
  title: String,
  content: String,
  action: String // 点击后的动作
}

// Mock 数据路径
GET /mock/student/message/sessions
GET /mock/student/chat/:sessionId/messages
POST /mock/student/chat/send
```

### 2.4 交互流程
```
进入页面 → 加载会话列表 → 点击会话进入聊天
     ↓
发送消息 → 选择情绪标签 → AI 响应
     ↓
AI 推送 CBT 卡片 → 用户点击 → 执行引导
     ↓
检测高风险 → 触发预警 → 提示寻求帮助
```

---

## 3. 模块三：预约页 (Appointment)

### 3.1 页面定位
- **功能**：预约心理咨询室及 VR 心理设备
- **形态**：服务列表 + 预约表单 + 预约记录
- **定位**：线下心理服务的在线预约入口

### 3.2 核心功能

#### 3.2.1 可预约服务
| 服务 | 类型 | 说明 |
|------|------|------|
| 心理咨询室 | 线下 | 1v1 真人咨询，50分钟/次 |
| VR 心理体验 | VR设备 | VR 放松训练、场景暴露 |
| 团体活动室 | 团体 | 6-10 人团体辅导 |

#### 3.2.2 预约流程
1. 选择服务类型
2. 选择日期（未来 2 周）
3. 选择时间段
4. 填写预约事由（选填）
5. 确认提交
6. 收到预约成功通知

#### 3.2.3 预约规则
- 心理咨询：需提前 24 小时预约，可取消
- VR 体验：需提前 12 小时预约
- 团体活动：需提前 3 天预约
- 违约超过 3 次：限制预约功能 1 周

#### 3.2.4 预约记录
- 待就诊：显示即将到来的预约
- 已完成：历史预约记录
- 已取消：取消的预约

### 3.3 数据模型

```javascript
// 预约服务
{
  id: String,
  name: String,
  type: 'counseling' | 'vr' | 'group',
  description: String,
  duration: Number, // 分钟
  availableTimes: String[], // 可预约时间段
  location: String,
  icon: String
}

// 预约记录
{
  id: String,
  serviceId: String,
  serviceName: String,
  date: String, // YYYY-MM-DD
  time: String, // HH:mm
  status: 'pending' | 'completed' | 'cancelled' | 'expired',
  reason: String,
  createdAt: String,
  cancelable: Boolean
}

// Mock 数据路径
GET /mock/student/appointment/services
POST /mock/student/appointment/book
GET /mock/student/appointment/records
DELETE /mock/student/appointment/:id
```

### 3.4 交互流程
```
进入页面 → 查看可预约服务列表
     ↓
点击服务 → 查看详情 → 立即预约
     ↓
选择日期 → 选择时间 → 填写事由 → 确认
     ↓
预约成功 → 推送通知 → 加入待就诊列表
     ↓
就诊当天 → 签到 → 计时开始
```

---

## 4. 模块四：我的页 (Profile)

### 4.1 页面定位
- **功能**：个人档案管理与功能入口
- **形态**：用户信息 + 宫格菜单 + 设置
- **定位**：心理档案查看、服务记录、个人设置

### 4.2 核心功能

#### 4.2.1 用户信息卡片
- 头像、昵称、身份标签
- 角色标识（学生/教师）
- 绑定手机号

#### 4.2.2 宫格菜单（学生端）
| 功能 | 说明 | 入口 |
|------|------|------|
| 我的档案 | 个人心理档案 | /pages/my/info-edit |
| 服务预约 | 预约记录 | /pages/appointment |
| 心理测评 | 量表测评入口 | /pages/assessment |
| VR 记录 | VR 体验历史 | /pages/vr-records |
| 我的收藏 | 收藏的动态 | /pages/my/collections |
| 消息通知 | 系统通知列表 | /pages/my/notifications |

#### 4.2.3 个人档案
- 基础信息：姓名、学号、院系、班级
- 心理档案：
  - 近期情绪报告
  - 风险等级
  - 咨询记录
  - 测评历史

#### 4.2.4 设置
- 消息通知开关
- 隐私设置（匿名发布）
- 清除缓存
- 退出登录

### 4.3 数据模型

```javascript
// 用户信息
{
  id: String,
  nickname: String,
  avatar: String,
  phone: String,
  role: 'student' | 'teacher',
  studentId: String,
  department: String,
  className: String,
  profile: {
    riskLevel: 'low' | 'medium' | 'high',
    lastAssessment: String,
    counselingCount: Number,
    vrSessionCount: Number
  }
}

// Mock 数据路径
GET /mock/student/my/info
GET /mock/student/my/profile
GET /mock/student/my/records
PUT /mock/student/my/info
```

### 4.4 交互流程
```
进入页面 → 加载用户信息 + 菜单列表
     ↓
点击菜单 → 跳转对应页面
     ↓
点击头像 → 编辑资料
     ↓
点击设置 → 调整配置
     ↓
点击退出 → 确认 → 跳转登录页
```

---

## 5. 通用组件规格

### 5.1 情绪标签
```
| 标签 | 图标 | 颜色 | 分数 |
|------|------|------|------|
| 开心 | 😊 | #52C41A | 1.0 |
| 平静 | 😌 | #1890FF | 0.5 |
| 难过 | 😢 | #FAAD14 | -0.5 |
| 焦虑 | 😰 | #FF4D4F | -0.7 |
| 愤怒 | 😡 | #F5222D | -0.8 |
```

### 5.2 预警级别
```
| 级别 | 颜色 | 说明 | 动作 |
|------|------|------|------|
| 低风险 | 绿色 | 情绪波动正常 | 正常记录 |
| 中风险 | 橙色 | 持续负面情绪 | AI 增强关注 |
| 高风险 | 红色 | 自伤/自杀倾向 | 立即预警 + 干预 |
```

---

## 6. 后续扩展

### 6.1 待开发功能
- 心理测评模块（量表库）
- VR 体验记录
- 匿名树洞详情页
- 消息通知系统

### 6.2 依赖后端
- NLP 情绪分析服务
- 风险评估模型
- 预约排程系统
- 消息推送服务
