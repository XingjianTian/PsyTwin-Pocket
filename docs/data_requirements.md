# 前端数据需求反哺文档

> 本文档由 PsyTwin-Pocket（微信小程序端）整理，用于向 Sentinel（Next.js 后端）提出数据字段需求。
> 
> **原则**：只描述"前端需要什么"，不定义"后端如何实现"。

---

## 📋 需求总览

| 优先级 | 功能模块 | 状态 |
|--------|----------|------|
| P0 | 用户登录与认证 | ✅ 已满足 |
| P0 | 心墙动态流 | ✅ 已满足 |
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

### 使用场景
- 首页动态流：createdAt 排序 + likeCount/commentCount 展示
- 发布帖子：status = PENDING（审核中）→ ACTIVE（已通过）
- 用户删除：status = DELETED（软删除）

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
| 2026-03-06 | v1.1 | 核对接口状态，标记数据库已满足字段 *(已于 2026-03-06 与 Sentinel schema 核对)* | PsyTwin-Pocket |

---

**下一步行动**：
1. ✅ ~~田老师审阅确认需求~~ *(已完成)*
2. ✅ ~~转交 Sentinel 后端评估~~ *(已完成 - 数据库符合度 >90%)*
3. 🔄 **Sentinel 补充字段**：Appointment 模型需添加 `meetingLink`, `feedbackScore`, `feedbackContent`
4. 🔄 **Sentinel 确认时段格式**：`time_slot` 字符串 vs `startTime/endTime` DateTime 的 API 转换方案
5. ⏳ PsyTwin-Pocket 按新契约对接
