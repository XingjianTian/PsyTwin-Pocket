# OpenSpecs: PsyTwin Pocket 学生端功能规格说明书

> 最后更新: 2026-03-06
> 文档状态机：`- [x]` 已实现 / `- [ ]` 待开发 / `⚠️` 部分实现



## 1. 模块一：首页 - 心墙 (Home)

### 1.1 页面定位
- **功能**：校园社区内容浏览与互动
- **形态**：类似"校内小红书"的瀑布流社区
- **定位**：日常表达、情感记录、社交互动

### 1.2 核心功能 

#### 1.2.1 内容展示
- [x] 单页瀑布流展示校园动态
  - 实现文件：`pages/home/index.js` - `distributeCards` 函数实现左右列分发
  - 实现文件：`pages/home/index.less` - 瀑布流布局样式
- [x] 下拉刷新
  - 实现文件：`pages/home/index.js` - `onRefresh` 和 `refresh` 方法
  - 使用组件：`t-pull-down-refresh`
- [ ] 上拉加载更多
  - 状态：未实现 `onReachBottom` 方法
  - 备注：当前仅支持下拉刷新



#### 1.2.2 动态卡片
- [x] **发布者信息**：头像、昵称、身份标签（学生/教师）
  - 实现文件：`components/card/card.wxml`
- [x] **内容类型**：纯文字、图文混合
  - 实现文件：`components/card/card.wxml` - 图片网格布局
- ⚠️ **互动按钮**：
  - 点赞：仅静态显示，无点击交互 (`pages/home/index.js` 中无点赞 API 调用)
  - 评论：❌ 未实现（数据模型有 `commentCount` 但无评论入口）
  - 收藏：❌ 未实现（数据模型有 `isCollected` 但无收藏按钮）
- [x] **发布时间**：相对时间显示

- **内容类型**：纯文字、图文混合
- **互动按钮**：点赞、评论、收藏
- **发布时间**：相对时间显示

#### 1.2.3 发布入口 
- [x] 点击右下角 "+" 按钮进入发布流程
  - 实现文件：`pages/release/index.js`, `index.wxml`
- [x] 支持：文字、图片、定位
  - 图片上传：`chooseMedia` 实现
  - 标签选择：支持 `mood`, `study`, `life`, `emotion` 等标签
  - 位置选择：`wx.chooseLocation` 实现
- 点击右下角 "+" 按钮进入发布流程
- 支持：文字、图片、定位

#### 1.2.4 无感检测逻辑 (待实现)
- [ ] 学生浏览停留时间异步上报
- [ ] 点赞、评论文本内容后台 NLP 风险评估
- [ ] 发布内容自动进行抑郁/焦虑倾向打分
- [ ] 高风险内容标记预警（仅后台可见）
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

// Mock 数据路径 ✅ 已实现
GET /mock/student/home/feed
GET /mock/home/getHomeCards
GET /mock/home/getHomeSwipers
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

#### 2.2.1 会话列表 ✅ 已实现基础结构
| 会话 | 类型 | 说明 | 实现状态 |
|------|------|------|----------|
| PsyTwin 树洞助手 | AI | 官方 AI，24/7 响应，通用情绪陪伴 | ✅ 已实现 |
| 咨询师小明 | 真人 | 可预约的真人心理咨询师 | ✅ 已实现 |
| 咨询师小红 | 真人 | 可预约的真人心理咨询师 | ✅ 已实现 |

- 实现文件：`pages/message/index.js`
- 功能：问候语、快捷 Chips 入口（倾诉心情、焦虑/压力大、睡眠、人际关系、学业/考试、心理测试）、最近对话记录
- Mock 数据：`mock/student/message/getSessions.js`
| 会话 | 类型 | 说明 |
|------|------|------|
| PsyTwin 树洞助手 | AI | 官方 AI，24/7 响应，通用情绪陪伴 |
| 咨询师小明 | 真人 | 可预约的真人心理咨询师 |
| 咨询师小红 | 真人 | 可预约的真人心理咨询师 |

#### 2.2.2 聊天窗口功能 ⚠️ 基础框架已实现，高级功能待开发
- [ ] **快捷情绪 Tag**：发送消息前可选择情绪标签（😢难过 😡愤怒 😰焦虑 😴困倦 😊开心）
  - 状态：未实现
  - 备注：当前仅有基础输入框
- [ ] **AI 响应**：根据情绪标签推送冥想音频或 CBT 小卡片
  - 状态：未实现
- [ ] **危机干预**：检测到高风险内容时触发预警流程
  - 状态：未实现
- [ ] **聊天记录**：本地存储 + 云端同步
  - 状态：未实现云端同步

- 实现文件：`pages/chat/index.js` - 基础聊天框架
  - ✅ 消息列表展示
  - ✅ 发送消息功能
  - ✅ 键盘处理
  - ✅ 滚动到底部
- Mock 数据：`mock/chat.js`（用户私信数据）
- **快捷情绪 Tag**：发送消息前可选择情绪标签（😢难过 😡愤怒 😰焦虑 😴困倦 😊开心）
- **AI 响应**：根据情绪标签推送冥想音频或 CBT 小卡片
- **危机干预**：检测到高风险内容时触发预警流程
- **聊天记录**：本地存储 + 云端同步

#### 2.2.3 CBT 引导卡片 (待实现)
- [ ] AI 在对话中主动推送认知行为疗法卡片
- [ ] 卡片类型：
  - [ ] 情绪识别卡
  - [ ] 思维记录卡
  - [ ] 认知重构卡
  - [ ] 放松练习卡
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
GET /mock/student/message/sessions ✅ 已实现
GET /mock/student/chat/:sessionId/messages ⚠️ 部分实现（仅模拟数据）
POST /mock/student/chat/send ⚠️ 前端调用存在，后端模拟待完善
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

#### 3.2.1 可预约服务 ✅ 已实现
| 服务 | 类型 | 说明 | 实现状态 |
|------|------|------|----------|
| 心理咨询室 | 线下 | 1v1 真人咨询，50分钟/次 | ✅ 已实现 |
| VR 心理体验 | VR设备 | VR 放松训练、场景暴露 | ✅ 已实现 |
| 团体活动室 | 团体 | 6-10 人团体辅导 | ✅ 已实现 |

- 实现文件：`pages/appointment/index.js`
- 服务类型：`counseling`, `vr`, `group`
| 服务 | 类型 | 说明 |
|------|------|------|
| 心理咨询室 | 线下 | 1v1 真人咨询，50分钟/次 |
| VR 心理体验 | VR设备 | VR 放松训练、场景暴露 |
| 团体活动室 | 团体 | 6-10 人团体辅导 |

#### 3.2.2 预约流程 ✅ 已实现
1. [x] 选择服务类型 - 通过卡片点击选择
2. [x] 选择日期（未来 2 周）- 使用 `picker` 组件
3. [x] 选择时间段 - 格子选择器
4. [x] 填写预约事由（选填）- `textarea` 输入
5. [x] 确认提交 - 提交表单
6. [x] 收到预约成功通知 - `wx.showToast` 提示

- 实现文件：`pages/appointment/index.js` - `handleDateChange`, `handleTimeSelect`, `handleSubmit`
1. 选择服务类型
2. 选择日期（未来 2 周）
3. 选择时间段
4. 填写预约事由（选填）
5. 确认提交
6. 收到预约成功通知

#### 3.2.3 预约规则 ⚠️ 部分实现
- [ ] 心理咨询：需提前 24 小时预约，可取消
  - 状态：前端未验证预约时间限制
- [ ] VR 体验：需提前 12 小时预约
  - 状态：前端未验证预约时间限制
- [ ] 团体活动：需提前 3 天预约
  - 状态：前端未验证预约时间限制
- [ ] 违约超过 3 次：限制预约功能 1 周
  - 状态：未实现
- [x] 签到计时：状态标记已实现
- 心理咨询：需提前 24 小时预约，可取消
- VR 体验：需提前 12 小时预约
- 团体活动：需提前 3 天预约
- 违约超过 3 次：限制预约功能 1 周

#### 3.2.4 预约记录 ✅ 已实现
- [x] 待就诊：显示即将到来的预约
- [x] 已完成：历史预约记录
- [x] 已取消：取消的预约

- 实现文件：`pages/appointment/index.js` - `renderAppointmentRecords`
- 功能：支持取消预约（状态更新为 cancelled）
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

// Mock 数据路径 ✅ 已实现
GET /mock/student/appointment/services
POST /mock/student/appointment/book
GET /mock/student/appointment/records
DELETE /mock/student/appointment/:id
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

#### 4.2.1 用户信息卡片 ✅ 已实现
- [x] 头像、昵称、身份标签
  - 实现文件：`pages/my/index.wxml`
- [x] 角色标识（学生/教师）
  - 显示字段：`role: 'student'` 或 `'teacher'`
- [ ] 绑定手机号
  - 状态：数据模型中有，UI 未显示
- 头像、昵称、身份标签
- 角色标识（学生/教师）
- 绑定手机号

#### 4.2.2 宫格菜单（学生端）
| 功能 | 说明 | 入口 | 实现状态 |
|------|------|------|----------|
| [x] 我的档案 | 个人心理档案 | /pages/my/info-edit | ✅ 已实现 |
| [x] 服务预约 | 预约记录 | /pages/appointment | ✅ 已实现 |
| [ ] 心理测评 | 量表测评入口 | /pages/assessment | ❌ 未实现（URL 为空） |
| [ ] VR 记录 | VR 体验历史 | /pages/vr-records | ❌ 未实现（URL 为空） |
| [ ] 我的收藏 | 收藏的动态 | /pages/my/collections | ❌ 未实现 |
| [ ] 消息通知 | 系统通知列表 | /pages/my/notifications | ❌ 未实现 |

- 实现文件：`pages/my/index.js` - `gridItems` 数组定义
- 备注：未实现功能点击显示 "功能开发中" toast
| 功能 | 说明 | 入口 |
|------|------|------|
| 我的档案 | 个人心理档案 | /pages/my/info-edit |
| 服务预约 | 预约记录 | /pages/appointment |
| 心理测评 | 量表测评入口 | /pages/assessment (待开发) |
| VR 记录 | VR 体验历史 | /pages/vr-records (待开发) |
| 我的收藏 | 收藏的动态 | /pages/my/collections (待开发) |
| 消息通知 | 系统通知列表 | /pages/my/notifications (待开发) |

#### 4.2.3 个人档案 ⚠️ 部分实现
- [x] 基础信息：姓名、学号、院系、班级
  - 实现文件：`pages/my/index.js` - 用户信息展示
- ⚠️ 心理档案：
  - [x] 近期情绪报告 - 心理健康概览卡显示趋势
  - [x] 风险等级 - 显示 `low`/`medium`/`high`
  - [x] 咨询记录 - 统计栏显示 `counselingCount`
  - [ ] 测评历史 - 未完整实现

- 实现文件：`pages/my/info-edit/index.js` - 个人信息编辑
- 活动统计：咨询次数、VR 体验、总时长、测评次数
- 心理健康概览：四维度得分（情绪稳定性、睡眠质量、社交活跃度、学业压力）
- 基础信息：姓名、学号、院系、班级
- 心理档案：
  - 近期情绪报告
  - 风险等级
  - 咨询记录
  - 测评历史

#### 4.2.4 设置 ⚠️ 部分实现
- [ ] 消息通知开关
- [ ] 隐私设置（匿名发布）
- [ ] 清除缓存
- [x] 退出登录
  - 实现文件：`pages/setting/index.js` - 显示确认弹窗后跳转登录页

- 实现文件：`pages/setting/index.js`
- 备注：通用设置、通知设置、深色模式、字体大小等功能 URL 为空
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

// Mock 数据路径 ✅ 已实现
GET /mock/student/my/info
GET /mock/student/my/profile
GET /mock/student/my/records
PUT /mock/student/my/info
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
| 标签 | 图标 | 颜色 | 分数 | 实现状态 |
|------|------|------|------|----------|
| 开心 | 😊 | #52C41A | 1.0 | ❌ 未实现 |
| 平静 | 😌 | #1890FF | 0.5 | ❌ 未实现 |
| 难过 | 😢 | #FAAD14 | -0.5 | ❌ 未实现 |
| 焦虑 | 😰 | #FF4D4F | -0.7 | ❌ 未实现 |
| 愤怒 | 😡 | #F5222D | -0.8 | ❌ 未实现 |

### 5.2 预警级别
| 级别 | 颜色 | 说明 | 动作 | 实现状态 |
|------|------|------|------|----------|
| 低风险 | 绿色 | 情绪波动正常 | 正常记录 | ⚠️ 数据模型存在，后台逻辑待实现 |
| 中风险 | 橙色 | 持续负面情绪 | AI 增强关注 | ❌ 未实现 |
| 高风险 | 红色 | 自伤/自杀倾向 | 立即预警 + 干预 | ❌ 未实现 |

---

## 6. 教师端功能概览

### 6.1 工作台 (dataCenter) ✅ 基础功能已实现
- [x] 统计图表：
  - [x] 整体情况 - 会员数据图表
  - [x] 互动情况 - 互动数据图表
  - [x] 完播率 - 完成率数据图表
  - [x] 地区分布 - 区域数据图表
- [ ] 预警列表 - 未实现
- [ ] 预警级别展示 - 未实现

- 实现文件：`pages/dataCenter/index.js`
- Mock 数据：`mock/dataCenter/` 目录
- 动态 TabBar：通过 `custom-tab-bar/index.js` 实现角色切换

### 6.2 动态 TabBar ✅ 已实现
- 学生端 Tab：心墙、AI、预约、我的
- 教师端 Tab：心墙、AI、工作台、我的
- 实现方式：根据登录角色动态渲染 TabBar 列表

---

## 7. 后续扩展

### 7.1 待开发功能（按优先级）

#### 高优先级
- [ ] 心墙：上拉加载更多、评论功能、收藏功能、点赞交互
- [ ] AI 对话：情绪标签、AI 响应、CBT 卡片、危机干预
- [ ] 预约：预约规则验证（提前时间限制）、违约限制

#### 中优先级
- [ ] 我的页面：心理测评、VR 记录、我的收藏、消息通知
- [ ] 教师端：预警列表、预警级别、排班管理
- [ ] 消息通知系统：系统通知、预约提醒

#### 低优先级
- [ ] 匿名树洞详情页
- [ ] 无感检测逻辑：浏览停留时间、NLP 风险评估
- [ ] 个人档案：完整测评历史、咨询记录详情

### 7.2 依赖后端
- [ ] NLP 情绪分析服务
- [ ] 风险评估模型
- [ ] 预约排程系统
- [ ] 消息推送服务
- [ ] AI 对话服务（LLM 接入）

---

## 8. 实现状态汇总

| 模块 | 整体完成度 | 主要已实现功能 | 主要待实现功能 |
|------|------------|----------------|----------------|
| 首页-心墙 | 70% | 瀑布流、下拉刷新、发布入口、Mock 数据 | 上拉加载、评论、收藏、点赞交互 |
| AI 对话 | 40% | 会话列表、基础聊天框架 | 情绪标签、CBT 卡片、危机干预、AI 响应 |
| 预约 | 85% | 服务列表、预约流程、预约记录 | 预约规则验证、违约限制 |
| 我的 | 65% | 用户信息、我的档案、设置框架 | 心理测评、VR 记录、收藏、消息通知 |
| 教师端-工作台 | 60% | 统计图表、动态 TabBar | 预警列表、预警级别、排班管理 |

---

*文档状态机更新记录：*
- *2026-03-06: 基于代码实际实现情况全面更新，标注所有功能的实现状态*


| 标签 | 图标 | 颜色 | 分数 |
|------|------|------|------|
| 开心 | 😊 | #52C41A | 1.0 |
| 平静 | 😌 | #1890FF | 0.5 |
| 难过 | 😢 | #FAAD14 | -0.5 |
| 焦虑 | 😰 | #FF4D4F | -0.7 |
| 愤怒 | 😡 | #F5222D | -0.8 |

### 5.2 预警级别
| 级别 | 颜色 | 说明 | 动作 |
|------|------|------|------|
| 低风险 | 绿色 | 情绪波动正常 | 正常记录 |
| 中风险 | 橙色 | 持续负面情绪 | AI 增强关注 |
| 高风险 | 红色 | 自伤/自杀倾向 | 立即预警 + 干预 |

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
