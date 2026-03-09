# 前端数据需求反哺文档

> 本文档由 PsyTwin-Pocket（微信小程序端）整理，用于向 Sentinel（Next.js 后端）提出数据字段需求。
> 
> **原则**：只描述"前端需要什么"，不定义"后端如何实现"。

---

## 📋 需求总览

| 优先级 | 功能模块 | 状态 |
|--------|----------|------|
| P0 | 用户登录与认证 | ✅ 已满足 |
| P0 | 心墙动态流 | ⚠️ 部分满足 |
| P0 | 教师端工作台 | ⚠️ 部分满足 |
| P1 | 消息聊天 | ✅ 已满足 |
| P1 | 预约咨询 | 🟡 部分满足 |
| P1 | 通知系统 | ❌ 需补充表 |
| P2 | 评论互动 | ✅ 已满足 |

| P1 | 消息聊天 | ✅ 已满足 |
| P1 | 预约咨询 | 🟡 部分满足 |
| P2 | 评论互动 | ✅ 已满足 |

---

## P0 - 用户登录与认证 (Student)

### 当前数据库字段 *(已于 2026-03-06 核对通过)*
```
id, name, studentNo, className, facultyId, gender, phone, passwordHash, avatar, nickname, role, status, badges, stats, settings, lastLoginAt, createdAt, updatedAt
```

### 前端需求字段

| 字段名 | 类型 | 用途说明 | 必需性 | 数据库状态 |
|--------|------|----------|--------|------------|
| `phone` | String | 手机号登录凭证 | ✅ 必需 | ✅ 已存在 |
| `passwordHash` | String | 密码哈希（或微信 openId） | ✅ 必需 | ✅ 已存在 |
| `avatar` | String (URL) | 用户头像 | ⚠️ 建议有 | ✅ 已存在 |
| `createdAt` | DateTime | 注册时间 | ⚠️ 建议有 | ✅ 已存在 |
| `status` | Enum | 账号状态 | ⚠️ 建议有 | ✅ 已存在 (StudentStatus) |
| `lastLoginAt` | DateTime | 最后登录时间 | ⭕ 可选 | ✅ 已存在 |

### 使用场景
- 登录页：phone + passwordHash 验证
- 我的页面：avatar + name + studentNo 展示
- 注册完成：createdAt 记录

---

## P0 - 心墙动态流 (Post)

### 当前数据库字段 *(已于 2026-03-06 核对通过)*
```
id, authorId, content, images, location, isAnonymous, tags, likeCount, commentCount, viewCount, status, riskScore, createdAt, updatedAt
```

### 前端需求字段

| 字段名 | 类型 | 用途说明 | 必需性 | 数据库状态 |
|--------|------|----------|--------|------------|
| `createdAt` | DateTime | 发布时间 | ✅ 必需 | ✅ 已存在 |
| `updatedAt` | DateTime | 更新时间 | ⭕ 可选 | ✅ 已存在 |
| `likeCount` | Int | 点赞数 | ✅ 必需 | ✅ 已存在 |
| `commentCount` | Int | 评论数 | ✅ 必需 | ✅ 已存在 |
| `status` | Enum | 帖子状态 | ✅ 必需 | ✅ 已存在 (PostStatus) |
| `viewCount` | Int | 浏览量 | ⭕ 可选 | ✅ 已存在 |
| `isLiked` | Boolean | 当前用户是否点赞 | ✅ 必需 | ❌ **需 PostLike 关联表** |
| `isCollected` | Boolean | 当前用户是否收藏 | ✅ 必需 | ❌ **需 PostCollection 关联表** |

### 使用场景
- 首页动态流：createdAt 排序 + likeCount/commentCount 展示
- 发布帖子：status = PENDING（审核中）→ ACTIVE（已通过）
- 用户删除：status = DELETED（软删除）

---

## P0 - 教师端工作台 (Teacher)

### 当前数据库字段 *(已于 2026-03-08 核对通过)*
```
id, teacherId, name, phone, passwordHash, avatar, department, title, qualifications[], workStats, role, status, lastLoginAt, createdAt, updatedAt
```

### 前端需求字段

| 字段名 | 类型 | 用途说明 | 必需性 | 数据库状态 |
|--------|------|----------|--------|------------|
| `teacherId` | String | 工号，唯一标识 | ✅ 必需 | ✅ 已存在 |
| `name` | String | 教师姓名 | ✅ 必需 | ✅ 已存在 |
| `nickname` | String | 教师昵称/展示名 | ⚠️ 建议有 | ❌ **缺失** |
| `phone` | String | 手机号登录 | ✅ 必需 | ✅ 已存在 |
| `avatar` | String (URL) | 头像 | ⚠️ 建议有 | ✅ 已存在 |
| `department` | String | 所属部门 | ✅ 必需 | ✅ 已存在 |
| `title` | String | 职称 | ✅ 必需 | ✅ 已存在 |
| `qualifications` | String[] | 资质认证 | ⚠️ 建议有 | ✅ 已存在 |
| `workStats` | Json | 工作统计 | ✅ 必需 | ✅ 已存在 |
| `role` | Enum | 角色类型 | ✅ 必需 | ✅ 已存在 (UserRole) |
| `status` | Enum | 账号状态 | ⚠️ 建议有 | ✅ 已存在 (TeacherStatus) |

### workStats Json 结构
```json
{
  "totalCounseling": 156,      // 累计咨询次数
  "totalHours": 234,           // 累计时长（小时）
  "thisMonthCounseling": 12,   // 本月咨询次数
  "satisfactionRate": 4.8      // 平均满意度评分
}
```

### 使用场景
- 工作台顶部：展示 `workStats` 统计数据
- 我的页面：展示 `name`/`title`/`department`/`qualifications`
- 预警处理：通过 `teacherId` 关联分配的预警

---


## P1 - 消息聊天 (ChatSession & ChatMessage)

### ChatSession 当前字段 *(已于 2026-03-06 核对通过)*
```
id, studentId, type, title, lastMessage, lastMessageAt, targetId, targetName, targetAvatar, unreadCount, status, createdAt, updatedAt
```

### ChatSession 需求字段

| 字段名 | 类型 | 用途说明 | 必需性 | 数据库状态 |
|--------|------|----------|--------|------------|
| `createdAt` | DateTime | 会话创建时间 | ✅ 必需 | ✅ 已存在 |
| `status` | Enum | 会话状态 | ✅ 必需 | ✅ 已存在 (SessionStatus) |
| `unreadCount` | Int | 未读消息数 | ✅ 必需 | ✅ 已存在 |
| `targetId` | String | 对方ID | ⚠️ 建议有 | ✅ 已存在 |
| `targetName` | String | 对方名称 | ⚠️ 建议有 | ✅ 已存在 |
| `targetAvatar` | String | 对方头像 | ⚠️ 建议有 | ✅ 已存在 |

### ChatMessage 当前字段 *(已于 2026-03-06 核对通过)*
```
id, sessionId, senderId, type, content, seq, emotionTag, cbtCard, status, isRead, createdAt, updatedAt
```

### ChatMessage 需求字段

| 字段名 | 类型 | 用途说明 | 必需性 | 数据库状态 |
|--------|------|----------|--------|------------|
| `createdAt` | DateTime | 发送时间 | ✅ 必需 | ✅ 已存在 |
| `status` | Enum | 消息状态 | ✅ 必需 | ✅ 已存在 (MessageStatus) |
| `seq` | Int | 消息序号 | ⚠️ 建议有 | ✅ 已存在 |

### 使用场景
- 消息 Tab：ChatSession 列表，显示 targetName + lastMessage + unreadCount
- 聊天详情：ChatMessage 按 createdAt 排序，status 显示已读/未读

---

## P1 - 预约咨询 (Appointment)

### 当前数据库字段 *(已于 2026-03-06 核对通过)*
```
id, studentId, teacherId, roomId, type, date, timeSlot, status, reason, cancelReason, createdAt, updatedAt
```

### 前端需求字段

| 字段名 | 类型 | 用途说明 | 必需性 | 数据库状态 |
|--------|------|----------|--------|------------|
| `status` | Enum | 预约状态 | ✅ 必需 | ✅ 已存在 (AppointmentStatus) |
| `createdAt` | DateTime | 预约创建时间 | ✅ 必需 | ✅ 已存在 |
| `remark` | String | 备注/咨询主题 | ⚠️ 建议有 | ✅ 已存在 (reason 字段) |
| `startTime` | DateTime | 开始时间 | ✅ 必需 | 🟡 需确认格式 (time_slot) |
| `endTime` | DateTime | 结束时间 | ✅ 必需 | 🟡 需确认格式 (time_slot) |
| `location` | String | 地点 | ⚠️ 建议有 | 🟡 需关联 ConsultationRoom 查询 |
| `meetingLink` | String | 线上会议链接 | ⭕ 可选 | ⚠️ 需添加 |
| `feedbackScore` | Int | 评价分数 | ⭕ 可选 | ⚠️ 需添加 |
| `feedbackContent` | String | 评价内容 | ⭕ 可选 | ⚠️ 需添加 |

### 使用场景
- 预约列表：按 createdAt 倒序，status 显示状态标签
- 预约详情：startTime/endTime + location/meetingLink + remark
- 咨询完成：提交 feedbackScore + feedbackContent

---

## P2 - 评论互动 (Comment)

### 当前数据库字段 *(已于 2026-03-06 核对通过)*
```
id, postId, authorId, parentId, replyToId, content, likeCount, status, createdAt, updatedAt
```

### 前端需求字段

| 字段名 | 类型 | 用途说明 | 必需性 | 数据库状态 |
|--------|------|----------|--------|------------|
| `parentId` | String | 父评论ID | ⚠️ 建议有 | ✅ 已存在 |
| `replyToId` | String | 回复对象ID | ⭕ 可选 | ✅ 已存在 |
| `likeCount` | Int | 点赞数 | ⭕ 可选 | ✅ 已存在 |
| `status` | Enum | 评论状态 | ⚠️ 建议有 | ✅ 已存在 (CommentStatus) |

### 使用场景
- 帖子详情：一级评论列表 + 二级回复折叠
- 评论点赞：likeCount 展示

---

## 📎 附录：枚举类型定义建议

仅供参考，后端可按实际架构调整：

```typescript
// Student.status
enum StudentStatus {
  ACTIVE = 'ACTIVE',       // 正常
  INACTIVE = 'INACTIVE',   // 未激活
  SUSPENDED = 'SUSPENDED'  // 封禁
}

// Post.status
enum PostStatus {
  ACTIVE = 'ACTIVE',       // 正常展示
  PENDING = 'PENDING',     // 审核中
  HIDDEN = 'HIDDEN',       // 隐藏
  DELETED = 'DELETED'      // 软删除
}

// ChatSession.status
enum SessionStatus {
  ACTIVE = 'ACTIVE',       // 进行中
  CLOSED = 'CLOSED',       // 已关闭
  ARCHIVED = 'ARCHIVED'    // 已归档
}

// ChatMessage.status
enum MessageStatus {
  SENDING = 'SENDING',     // 发送中
  SENT = 'SENT',           // 已发送
  DELIVERED = 'DELIVERED', // 已送达
  READ = 'READ',           // 已读
  FAILED = 'FAILED'        // 发送失败
}

// Appointment.status
enum AppointmentStatus {
  PENDING = 'PENDING',       // 待确认
  CONFIRMED = 'CONFIRMED',   // 已确认
  COMPLETED = 'COMPLETED',   // 已完成
  CANCELLED = 'CANCELLED',   // 已取消
  NO_SHOW = 'NO_SHOW'        // 未到场
}
```

---

## 📝 变更日志

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|----------|------|
| 2026-03-06 | v1.0 | 初版，基于 Prisma Studio 结构分析 | PsyTwin-Pocket |
| 2026-03-06 | v1.0 | 初版，基于 Prisma Studio 结构分析 | PsyTwin-Pocket |
| 2026-03-06 | v1.1 | 核对接口状态，标记数据库已满足字段 | PsyTwin-Pocket |
| 2026-03-08 | v1.2 | 完整核对 Prisma Schema，补充教师端与缺失字段分析 *(已于 2026-03-08 与 Sentinel schema 核对)* | PsyTwin-Pocket |

---

**下一步行动** (基于 2026-03-08 Prisma Schema 核对结果)：

1. ✅ ~~田老师审阅确认需求~~ *(已完成)*
2. ✅ ~~转交 Sentinel 后端评估~~ *(已完成 - 数据库符合度约 85%)*
3. ❌ **Sentinel 需补充关键表**（优先级 P0，阻塞性功能）：
   - [ ] `PostLike` 点赞关联表 - 影响心墙点赞功能
   - [ ] `PostCollection` 收藏关联表 - 影响我的收藏功能
   - [ ] `StudentNotification` 学生通知表 - 影响消息通知中心
4. ⚠️ **Sentinel 需补充字段**（优先级 P1）：
   - [ ] `Teacher.nickname` 教师昵称
   - [ ] `Student.joinDate` 入学时间
   - [ ] `ConsultationRoom` 补充服务描述字段或新建 `AppointmentService` 表
5. 🔄 **Sentinel 确认时段格式**：`time_slot` 字符串 vs `startTime/endTime` DateTime 的 API 转换方案
6. ⏳ PsyTwin-Pocket 按新契约对接







---

## 🔴 关键缺失项汇总 *(2026-03-08 核对结果)*

### ❌ 需补充的表（阻塞性）

| 表名 | 用途 | 优先级 | 关联功能 |
|------|------|--------|----------|
| `PostLike` | 帖子点赞关联 | P0 | 心墙点赞/取消点赞 |
| `PostCollection` | 帖子收藏关联 | P0 | 我的收藏列表 |
| `StudentNotification` | 学生通知 | P1 | 消息通知中心 |
| `EmotionTag` | 情绪标签定义 | P2 | 聊天情绪标签 |

### ⚠️ 需补充的字段

| 表名 | 字段 | 用途 | 优先级 |
|------|------|------|--------|
| `Teacher` | `nickname` | 教师昵称展示 | P1 |
| `Student` | `joinDate` | 入学时间 | P2 |
| `ConsultationRoom` | 服务描述字段 | 预约服务列表 | P1 |

### ⚠️ 结构差异说明

1. **预约服务 (AppointmentService)**
   - API 契约定义了服务列表接口，包含 `duration`, `description`, `icon`, `devices[]`
   - 当前 `ConsultationRoom` 表字段不匹配
   - **建议**：在 `ConsultationRoom` 补充字段，或新建 `AppointmentService` 表

2. **学生通知 (Notification)**
   - API 契约需要 `type`, `isRead`, `actionUrl` 字段
   - 当前 `NotificationHistory` 用于系统通知规则历史，不完全匹配
   - **建议**：新建 `StudentNotification` 表专门服务小程序端

