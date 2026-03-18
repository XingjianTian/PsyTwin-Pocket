# PsyTwin Pocket API 契约文档

> **文档版本**: v1.1.0  
> **最后更新**: 2026-03-18  
> **适用范围**: Sentinel 后端 - app/ 目录  
> **状态**: 开发中

---

## 📋 目录

1. [基础规范](#基础规范)
2. [认证授权](#认证授权)
3. [学生端 API](#学生端-api)
4. [教师端 API](#教师端-api)
5. [通用 API](#通用-api)
6. [数据模型](#数据模型)
7. [状态码规范](#状态码规范)
8. [WebSocket 实时通信](#websocket-实时通信)

---

## 基础规范

### Base URL

```
开发环境: http://localhost:3000/api/pocket
测试环境: https://api-test.psytwin.com/api/pocket
生产环境: https://api.psytwin.com/api/pocket
```

### 请求格式

- **Content-Type**: `application/json`
- **字符编码**: UTF-8
- **时间格式**: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ)

### 通用响应结构

```typescript
{
  code: number;      // 状态码，0 表示成功
  message: string;   // 提示信息
  data: any;         // 响应数据
}
```

---

## 认证授权

### Token 机制

使用 JWT (JSON Web Token) 进行身份认证。

**请求头**: 
```
Authorization: Bearer <access_token>
```

### 登录接口

#### 密码登录
```http
POST /auth/login/password
```

**请求体**:
```json
{
  "phone": "13800138000",
  "password": "hashed_password"
}
```

**响应**:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 7200,
    "user": {
      "id": "user_001",
      "nickname": "小明",
      "avatar": "https://...",
      "role": "student" | "teacher",
      "phone": "138****8000"
    }
  }
}
```

#### 验证码登录
```http
POST /auth/login/code
```

**请求体**:
```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

#### 发送验证码
```http
POST /auth/sms/send
```

**请求体**:
```json
{
  "phone": "13800138000",
  "type": "login" | "register" | "reset"
}
```

---

## 学生端 API

### 1. 心墙模块 (Home)

#### 1.1 获取动态列表
```http
GET /student/home/feed
```

**查询参数**:
```typescript
{
  type: 'follow' | 'square' | 'secret';  // 关注流/广场/树洞，默认 square
  page: number;                          // 页码，默认 1
  limit: number;                         // 每页数量，默认 20
  lastId?: string;                       // 最后一条记录ID，用于游标分页
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "post_001",
        "author": {
          "id": "user_001",
          "nickname": "小晶",
          "avatar": "https://picsum.photos/80/80?random=1",
          "role": "student",
          "department": "计算机学院"
        },
        "content": {
          "text": "期末复习第三天...",
          "images": ["https://picsum.photos/400/300?random=11"],
          "location": "校园操场",
          "isAnonymous": false
        },
        "stats": {
          "likeCount": 38,
          "commentCount": 7,
          "shareCount": 2
        },
        "isLiked": false,
        "isCollected": false,
        "createdAt": "2026-03-07T10:30:00Z",
        "riskScore": 0.15
      }
    ],
    "pagination": {
      "hasMore": true,
      "nextCursor": "post_001",
      "total": 156
    }
  }
}
```

#### 1.2 获取动态详情
```http
GET /student/home/posts/:id
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "id": "post_001",
    "author": { ... },
    "content": { ... },
    "stats": { ... },
    "isLiked": false,
    "isCollected": false,
    "createdAt": "2026-03-07T10:30:00Z"
  }
}
```

#### 1.3 发布动态
```http
POST /student/home/posts
```

**请求体**:
```json
{
  "content": {
    "text": "今天心情不错...",
    "images": ["https://...", "https://..."],
    "location": "图书馆",
    "isAnonymous": false
  },
  "tags": ["mood", "study"]
}
```

**响应**:
```json
{
  "code": 0,
  "message": "发布成功",
  "data": {
    "id": "post_new_001",
    "createdAt": "2026-03-07T12:00:00Z"
  }
}
```

#### 1.4 点赞/取消点赞
```http
POST /student/home/posts/:id/like
```

**响应**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "isLiked": true,
    "likeCount": 39
  }
}
```

#### 1.5 收藏/取消收藏
```http
POST /student/home/posts/:id/collect
```

**响应**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "isCollected": true
  }
}
```

#### 1.6 获取评论列表
```http
GET /student/home/posts/:id/comments
```

**查询参数**:
```typescript
{
  page: number;
  limit: number;
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "comment_001",
        "author": {
          "id": "user_002",
          "nickname": "心理老师王",
          "avatar": "https://...",
          "role": "teacher"
        },
        "content": "加油！",
        "createdAt": "2026-03-07T11:00:00Z",
        "likeCount": 5
      }
    ],
    "total": 23
  }
}
```

#### 1.7 发表评论
```http
POST /student/home/posts/:id/comments
```

**请求体**:
```json
{
  "content": "写得真好！",
  "parentId": null  // 回复评论时使用
}
```

---

### 2. AI 对话模块 (Message/Chat)

#### 2.1 获取会话列表
```http
GET /student/message/sessions
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    {
      "id": "ai-assistant",
      "type": "ai",
      "name": "PsyTwin 树洞助手",
      "avatar": "https://picsum.photos/100/100?random=100",
      "lastMessage": "你好！有什么我可以帮你的吗？",
      "lastMessageTime": "2026-03-07T12:00:00Z",
      "unreadCount": 1,
      "status": "online"
    },
    {
      "id": "counselor-1",
      "type": "counselor",
      "name": "咨询师小明",
      "avatar": "https://picsum.photos/100/100?random=101",
      "lastMessage": "好的，我们下次咨询时间...",
      "lastMessageTime": "2026-03-06T15:30:00Z",
      "unreadCount": 0,
      "status": "online"
    }
  ]
}
```

#### 2.2 获取聊天消息
```http
GET /student/chat/:sessionId/messages
```

**查询参数**:
```typescript
{
  beforeId?: string;  // 游标，获取更早的消息
  limit: number;      // 默认 20
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "messages": [
      {
        "id": "msg_001",
        "sessionId": "ai-assistant",
        "sender": "ai",
        "type": "text",
        "content": "你好！我是 PsyTwin 树洞助手...",
        "emotionTag": null,
        "sentimentScore": 0,
        "alertLevel": "none",
        "createdAt": "2026-03-07T10:00:00Z"
      },
      {
        "id": "msg_002",
        "sessionId": "ai-assistant",
        "sender": "user",
        "type": "text",
        "content": "最近感觉有点焦虑...",
        "emotionTag": "anxious",
        "sentimentScore": -0.6,
        "alertLevel": "low",
        "createdAt": "2026-03-07T10:01:00Z"
      }
    ],
    "hasMore": true
  }
}
```

#### 2.3 发送消息
```http
POST /student/chat/send
```

**请求体**:
```json
{
  "sessionId": "ai-assistant",
  "content": "最近学习压力很大",
  "type": "text",
  "emotionTag": "anxious"  // 可选：sad, angry, anxious, tired, happy
}
```

**响应**:
```json
{
  "code": 0,
  "message": "发送成功",
  "data": {
    "id": "msg_new_001",
    "createdAt": "2026-03-07T12:00:00Z"
  }
}
```

#### 2.4 获取情绪标签列表
```http
GET /student/chat/emotion-tags
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    { "id": "happy", "icon": "😊", "label": "开心", "color": "#52C41A", "score": 1.0 },
    { "id": "calm", "icon": "😌", "label": "平静", "color": "#1890FF", "score": 0.5 },
    { "id": "sad", "icon": "😢", "label": "难过", "color": "#FAAD14", "score": -0.5 },
    { "id": "anxious", "icon": "😰", "label": "焦虑", "color": "#FF4D4F", "score": -0.7 },
    { "id": "angry", "icon": "😡", "label": "愤怒", "color": "#F5222D", "score": -0.8 }
  ]
}
```

#### 2.5 发送消息给 AI 心理治疗师 (OpenClaw Therapist)
```http
POST /openclaw/agent-chat
```

**说明**: 通过 Sentinel 代理转发到 OpenClaw Gateway，与 Therapist 子代理进行对话

**请求体**:
```json
{
  "agentId": "Therapist",
  "message": "用户输入的消息",
  "token": "123456"
}
```

**字段说明**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| agentId | string | 是 | 固定值 `Therapist` |
| message | string | 是 | 用户发送的消息内容 |
| token | string | 否 | 默认 `123456` |

**响应**:
```json
{
  "id": "resp_xxx",
  "object": "chat.completion",
  "created_at": 1679123456789,
  "status": "completed",
  "model": "openclaw:Therapist",
  "output": [
    {
      "type": "message",
      "id": "msg_xxx",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "AI 心理治疗师的回复内容"
        }
      ],
      "status": "completed"
    }
  ]
}
```

---

### 3. 预约模块 (Appointment)

#### 3.1 获取服务列表
```http
GET /student/appointment/services
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "心理咨询室 A01",
      "type": "counseling",
      "description": "专业心理咨询师一对一深度咨询",
      "duration": 50,
      "location": "学生活动中心 3 层",
      "icon": "counseling",
      "status": "available",
      "currentUser": null,
      "devices": [
        { "name": "Pico 4 Enterprise", "online": true },
        { "name": "小米手环 9", "online": true }
      ],
      "availableTimes": ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00"]
    }
  ]
}
```

#### 3.2 获取可预约时间段
```http
GET /student/appointment/services/:id/slots
```

**查询参数**:
```typescript
{
  date: string;  // YYYY-MM-DD
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "date": "2026-03-10",
    "slots": [
      { "time": "09:00", "available": true },
      { "time": "09:30", "available": false },
      { "time": "10:00", "available": true }
    ]
  }
}
```

#### 3.3 创建预约
```http
POST /student/appointment/book
```

**请求体**:
```json
{
  "serviceId": 1,
  "date": "2026-03-10",
  "time": "14:00",
  "reason": "最近睡眠质量较差..."
}
```

**响应**:
```json
{
  "code": 0,
  "message": "预约成功",
  "data": {
    "id": "booking_001",
    "status": "pending",
    "createdAt": "2026-03-07T12:00:00Z"
  }
}
```

#### 3.4 获取预约记录
```http
GET /student/appointment/records
```

**查询参数**:
```typescript
{
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  page: number;
  limit: number;
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "booking_001",
        "serviceId": 1,
        "serviceName": "心理咨询室 A01",
        "serviceType": "counseling",
        "date": "2026-03-08",
        "time": "14:00",
        "status": "pending",
        "reason": "最近睡眠质量较差...",
        "createdAt": "2026-03-05T10:00:00Z",
        "cancelable": true,
        "location": "学生活动中心 3 层",
        "counselor": "王老师"
      }
    ],
    "total": 5
  }
}
```

#### 3.5 取消预约
```http
DELETE /student/appointment/:id
```

**响应**:
```json
{
  "code": 0,
  "message": "取消成功",
  "data": {
    "status": "cancelled"
  }
}
```

---

### 4. 我的模块 (My)

#### 4.1 获取用户信息
```http
GET /student/my/info
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "id": "stu001",
    "nickname": "小明同学",
    "avatar": "https://picsum.photos/200/200?random=200",
    "phone": "138****8888",
    "role": "student",
    "studentId": "2023001001",
    "department": "计算机学院",
    "className": "软件工程 2301 班",
    "joinDate": "2023-09",
    "healthOverview": {
      "riskLevel": "low",
      "riskScore": 0.15,
      "trend": "improving",
      "dimensions": [
        { "name": "情绪状态", "score": 82 },
        { "name": "睡眠质量", "score": 74 },
        { "name": "压力管理", "score": 68 },
        { "name": "社交关系", "score": 88 }
      ]
    },
    "stats": {
      "counselingCount": 2,
      "vrSessionCount": 5,
      "assessmentCount": 3,
      "totalMinutes": 185,
      "lastActiveDate": "2026-03-01"
    }
  }
}
```

#### 4.2 获取用户档案
```http
GET /student/my/profile
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "basicInfo": {
      "name": "小明同学",
      "studentId": "2023001001",
      "department": "计算机学院",
      "className": "软件工程 2301 班"
    },
    "psychologicalProfile": {
      "riskLevel": "low",
      "riskScore": 0.15,
      "trend": "improving",
      "lastAssessment": "2026-01-15",
      "assessmentType": "SCL-90"
    },
    "records": {
      "counselingCount": 2,
      "lastCounseling": "2026-01-10",
      "vrSessionCount": 5,
      "lastVrSession": "2026-02-20"
    }
  }
}
```

#### 4.3 更新用户信息
```http
PUT /student/my/info
```

**请求体**:
```json
{
  "nickname": "新昵称",
  "avatar": "https://...",
  "department": "计算机学院",
  "className": "软件工程 2302 班"
}
```

#### 4.4 获取我的收藏
```http
GET /student/my/collections
```

**查询参数**:
```typescript
{
  page: number;
  limit: number;
}
```

**响应**: 同动态列表数据结构

#### 4.5 获取消息通知
```http
GET /student/my/notifications
```

**查询参数**:
```typescript
{
  type?: 'system' | 'appointment' | 'warning';
  isRead?: boolean;
  page: number;
  limit: number;
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "notif_001",
        "type": "appointment",
        "title": "预约成功",
        "content": "您预约的 3月8日 心理咨询室 A01 已确认",
        "isRead": false,
        "createdAt": "2026-03-07T10:00:00Z",
        "actionUrl": "/pages/appointment/index"
      }
    ],
    "unreadCount": 3
  }
}
```

#### 4.6 标记通知已读
```http
PUT /student/my/notifications/:id/read
```

#### 4.7 发送通知（供 Sentinel 调用）
```http
POST /student/my/notifications
```

**说明**: 此接口供 Sentinel 后端在检测到预警等事件时，主动向学生推送通知

**请求体**:
```json
{
  "userId": "stu-xiaoming",
  "type": "warning",
  "title": "风险预警",
  "content": "您最近的情绪波动较大，建议进行心理咨询或测评",
  "actionUrl": ""
}
```

**字段说明**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 目标用户 ID |
| type | string | 是 | 通知类型: `system`/`appointment`/`warning` |
| title | string | 是 | 通知标题 |
| content | string | 是 | 通知内容 |
| actionUrl | string | 否 | 点击后跳转的页面路径 |

**响应**:
```json
{
  "code": 0,
  "message": "发送成功",
  "data": {
    "id": "notif_new_xxx"
  }
}
```

#### 4.8 获取成就徽章
```http
GET /student/my/badges
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "name": "初次咨询",
      "icon": "chat",
      "earned": true,
      "desc": "完成首次心理咨询",
      "earnedAt": "2026-01-10T10:00:00Z"
    }
  ]
}
```

---

## 教师端 API

### 1. 工作台模块 (Workbench)

#### 1.1 获取预警列表
```http
GET /teacher/workbench/warnings
```

**查询参数**:
```typescript
{
  level?: 'high' | 'medium' | 'low';  // 风险等级筛选
  status?: 'pending' | 'processing' | 'resolved';
  page: number;
  limit: number;
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "summary": {
      "high": 3,
      "medium": 5,
      "low": 12
    },
    "list": [
      {
        "id": "warn_001",
        "studentId": "stu_001",
        "studentName": "张三",
        "avatar": "https://...",
        "riskLevel": "high",
        "riskReason": "连续3天负面情绪，情绪分数-0.85",
        "triggerSource": "chat",
        "triggeredAt": "2026-03-07T08:00:00Z",
        "status": "pending",
        "assignedTo": "teacher_001",
        "lastAction": {
          "type": "message",
          "content": "已发送关心消息",
          "time": "2026-03-07T09:00:00Z"
        }
      }
    ]
  }
}
```

#### 1.2 获取预警详情
```http
GET /teacher/workbench/warnings/:id
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "id": "warn_001",
    "student": {
      "id": "stu_001",
      "name": "张三",
      "avatar": "https://...",
      "studentId": "2023001001",
      "department": "计算机学院",
      "riskHistory": [...]
    },
    "triggerContent": {
      "type": "chat",
      "content": "最近感觉很累，不想活了...",
      "context": [...]
    },
    "riskLevel": "high",
    "riskReason": "检测到自杀倾向关键词",
    "triggeredAt": "2026-03-07T08:00:00Z",
    "status": "pending",
    "history": [...]
  }
}
```

#### 1.3 处理预警
```http
POST /teacher/workbench/warnings/:id/action
```

**请求体**:
```json
{
  "actionType": "call" | "message" | "appointment" | "note",
  "content": "已电话联系学生，情况稳定",
  "status": "processing" | "resolved"
}
```

#### 1.4 获取今日日程
```http
GET /teacher/workbench/schedule/today
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    {
      "id": "schedule_001",
      "type": "counseling",
      "title": "心理咨询",
      "studentName": "张三",
      "startTime": "10:00",
      "endTime": "10:50",
      "location": "心理咨询室 A01",
      "status": "upcoming",
      "notes": "考前焦虑咨询"
    }
  ]
}
```

#### 1.5 更新日程状态
```http
PUT /teacher/workbench/schedule/:id/status
```

**请求体**:
```json
{
  "status": "ongoing" | "completed" | "cancelled",
  "notes": "咨询纪要..."
}
```

#### 1.6 获取工作统计
```http
GET /teacher/workbench/stats
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "thisMonthCounseling": 12,
    "totalCounseling": 156,
    "totalHours": 234,
    "thisMonthWarnings": 8,
    "satisfactionRate": 4.8
  }
}
```

#### 1.7 获取咨询趋势
```http
GET /teacher/workbench/stats/trend
```

**查询参数**:
```typescript
{
  period: 'week' | 'month' | 'quarter' | 'year';
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "period": "month",
    "labels": ["1月", "2月", "3月"],
    "counselingCount": [10, 12, 8],
    "counselingHours": [8.5, 10, 6.5]
  }
}
```

---

### 2. 学生管理模块 (Students)

#### 2.1 获取学生列表
```http
GET /teacher/students
```

**查询参数**:
```typescript
{
  keyword?: string;        // 搜索关键词(姓名/学号)
  riskLevel?: string;      // 风险等级筛选
  isFollowed?: boolean;    // 是否关注
  page: number;
  limit: number;
}
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "stu_001",
        "name": "张三",
        "studentId": "2023001001",
        "avatar": "https://...",
        "department": "计算机学院",
        "riskLevel": "medium",
        "lastCounseling": "2026-03-01T10:00:00Z",
        "isFollowed": true
      }
    ],
    "total": 156
  }
}
```

#### 2.2 获取学生档案
```http
GET /teacher/students/:id/profile
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "basicInfo": { ... },
    "psychologicalProfile": { ... },
    "counselingHistory": [...],
    "assessmentHistory": [...],
    "riskHistory": [...],
    "activityLog": [...]
  }
}
```

#### 2.3 关注/取消关注学生
```http
POST /teacher/students/:id/follow
```

**响应**:
```json
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "isFollowed": true
  }
}
```

---

### 3. 预约管理模块 (Appointments)

#### 3.1 获取所有预约
```http
GET /teacher/appointments
```

**查询参数**:
```typescript
{
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date?: string;  // YYYY-MM-DD
  page: number;
  limit: number;
}
```

**响应**: 同学生端预约记录数据结构

#### 3.2 确认预约
```http
PUT /teacher/appointments/:id/confirm
```

**响应**:
```json
{
  "code": 0,
  "message": "确认成功",
  "data": {
    "status": "confirmed"
  }
}
```

#### 3.3 拒绝预约
```http
PUT /teacher/appointments/:id/reject
```

**请求体**:
```json
{
  "reason": "该时段已约满，请选择其他时间"
}
```

---

### 4. 排班管理模块 (Schedule)

#### 4.1 获取排班设置
```http
GET /teacher/schedule/settings
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "weeklySchedule": [
      {
        "day": "monday",
        "slots": [
          { "start": "09:00", "end": "12:00", "available": true },
          { "start": "14:00", "end": "17:00", "available": true }
        ]
      }
    ],
    "specialDates": [
      {
        "date": "2026-03-08",
        "type": "holiday",
        "note": "妇女节放假"
      }
    ],
    "rules": {
      "advanceBookingHours": 24,
      "maxPerDay": 4
    }
  }
}
```

#### 4.2 更新排班设置
```http
PUT /teacher/schedule/settings
```

**请求体**: 同获取响应结构

---

### 5. 教师我的模块

#### 5.1 获取教师信息
```http
GET /teacher/my/info
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "id": "teacher_001",
    "nickname": "王老师",
    "avatar": "https://...",
    "phone": "138****8888",
    "role": "teacher",
    "teacherId": "T2023001",
    "department": "心理健康中心",
    "title": "心理咨询师",
    "qualifications": ["国家二级心理咨询师", "注册心理师"],
    "workStats": {
      "totalCounseling": 156,
      "totalHours": 234,
      "thisMonthCounseling": 12,
      "satisfactionRate": 4.8
    }
  }
}
```

#### 5.2 更新教师信息
```http
PUT /teacher/my/info
```

#### 5.3 获取预警设置
```http
GET /teacher/settings/warning-rules
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "highRiskThreshold": -0.8,
    "mediumRiskThreshold": -0.5,
    "consecutiveNegativeDays": 3,
    "activityDropThreshold": 50,
    "notifyMethods": ["push", "sms"]
  }
}
```

#### 5.4 更新预警设置
```http
PUT /teacher/settings/warning-rules
```

---

## 通用 API

### 文件上传

#### 上传图片
```http
POST /common/upload/image
```

**请求**: multipart/form-data
```
file: <binary>
type: 'post' | 'avatar' | 'chat'
```

**响应**:
```json
{
  "code": 0,
  "message": "上传成功",
  "data": {
    "url": "https://cdn.psytwin.com/images/xxx.jpg",
    "width": 800,
    "height": 600
  }
}
```

### 首页轮播图

```http
GET /common/home/swipers
```

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": [
    {
      "id": 1,
      "image": "/static/home/swiper0.png",
      "link": "/pages/appointment/index",
      "title": "心理咨询预约"
    }
  ]
}
```

### 个人信息详情

#### 获取个人详细信息
```http
GET /api/pocket/genPersonalInfo
```

**请求说明**: 需要 JWT 认证，返回当前用户的详细个人信息（姓名、性别、生日、地址、个人简介、照片墙等）

**响应**:
```json
{
  "code": 0,
  "message": "获取成功",
  "data": {
    "name": "小明同学",
    "gender": 0,
    "birth": "2000-01-01",
    "address": ["110000", "110100"],
    "introduction": "我是一个乐观开朗的学生...",
    "photos": [
      "https://cdn.psytwin.com/photos/xxx1.jpg",
      "https://cdn.psytwin.com/photos/xxx2.jpg"
    ]
  }
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 用户名 |
| gender | number | 性别: 0=男, 1=女, 2=保密 |
| birth | string | 生日，格式 YYYY-MM-DD |
| address | string[] | 地址编码数组 [省份编码, 城市编码] |
| introduction | string | 个人简介，最多 50 字符 |
| photos | string[] | 照片墙 URL 列表 |

#### 更新个人详细信息
```http
PUT /api/pocket/genPersonalInfo
```

**请求体**:
```json
{
  "name": "新昵称",
  "gender": 0,
  "birth": "2000-06-01",
  "address": ["110000", "110100"],
  "introduction": "更新后的个人简介",
  "photos": ["https://cdn.psytwin.com/photos/new.jpg"]
}
```

**响应**:
```json
{
  "code": 0,
  "message": "更新成功",
  "data": null
}
```

---

## 数据模型

### User (用户)
```typescript
interface User {
  id: string;
  nickname: string;
  avatar: string;
  phone: string;
  role: 'student' | 'teacher';
  createdAt: string;
  updatedAt: string;
}
```

### Student (学生)
```typescript
interface Student extends User {
  role: 'student';
  studentId: string;
  department: string;
  className: string;
  healthOverview: {
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    trend: 'improving' | 'stable' | 'declining';
    dimensions: Array<{
      name: string;
      score: number;
    }>;
  };
  stats: {
    counselingCount: number;
    vrSessionCount: number;
    assessmentCount: number;
    totalMinutes: number;
    lastActiveDate: string;
  };
}
```

### Teacher (教师)
```typescript
interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
  department: string;
  title: string;
  qualifications: string[];
  workStats: {
    totalCounseling: number;
    totalHours: number;
    thisMonthCounseling: number;
    satisfactionRate: number;
  };
}
```

### Post (动态)
```typescript
interface Post {
  id: string;
  author: {
    id: string;
    nickname: string;
    avatar: string;
    role: 'student' | 'teacher';
    department: string;
  };
  content: {
    text: string;
    images: string[];
    location: string;
    isAnonymous: boolean;
  };
  stats: {
    likeCount: number;
    commentCount: number;
    shareCount: number;
  };
  isLiked: boolean;
  isCollected: boolean;
  createdAt: string;
  riskScore: number;
}
```

### Comment (评论)
```typescript
interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    nickname: string;
    avatar: string;
    role: 'student' | 'teacher';
  };
  content: string;
  parentId: string | null;
  createdAt: string;
  likeCount: number;
}
```

### ChatSession (聊天会话)
```typescript
interface ChatSession {
  id: string;
  type: 'ai' | 'counselor';
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'online' | 'offline';
}
```

### ChatMessage (聊天消息)
```typescript
interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'ai' | 'counselor';
  type: 'text' | 'emotionTag' | 'cbtCard' | 'audio';
  content: string;
  emotionTag?: string;
  sentimentScore: number;
  alertLevel: 'none' | 'low' | 'medium' | 'high';
  createdAt: string;
}
```

### AppointmentService (预约服务)
```typescript
interface AppointmentService {
  id: number;
  name: string;
  type: 'counseling' | 'vr' | 'group';
  description: string;
  duration: number;
  location: string;
  icon: string;
  status: 'available' | 'busy' | 'maintenance';
  currentUser: {
    name: string;
    studentId: string;
    plan: string;
    usedMinutes: number;
    totalMinutes: number;
  } | null;
  devices: Array<{
    name: string;
    online: boolean;
  }>;
  availableTimes: string[];
}
```

### AppointmentRecord (预约记录)
```typescript
interface AppointmentRecord {
  id: string;
  serviceId: number;
  serviceName: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  createdAt: string;
  cancelable: boolean;
  location: string;
  counselor: string | null;
}
```

### Warning (预警)
```typescript
interface Warning {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskReason: string;
  triggerSource: 'chat' | 'post' | 'assessment' | 'behavior';
  triggeredAt: string;
  status: 'pending' | 'processing' | 'resolved';
  assignedTo: string;
  lastAction: {
    type: 'call' | 'message' | 'appointment' | 'note';
    content: string;
    time: string;
  };
}
```

---

## 状态码规范

### 成功状态
| 状态码 | 说明 |
|--------|------|
| 0 | 操作成功 |
| 200 | 请求成功（HTTP 标准） |

### 客户端错误 (4xx)
| 状态码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，Token 无效或过期 |
| 403 | 禁止访问，权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如重复预约） |
| 422 | 业务逻辑错误 |

### 服务端错误 (5xx)
| 状态码 | 说明 |
|--------|------|
| 500 | 服务器内部错误 |
| 502 | 网关错误 |
| 503 | 服务不可用 |

---

## WebSocket 实时通信

### 连接地址

```
wss://api.psytwin.com/ws/chat?token=<access_token>
```

### 消息格式

**客户端发送**:
```json
{
  "type": "message",
  "data": {
    "sessionId": "ai-assistant",
    "content": "你好",
    "emotionTag": "happy"
  }
}
```

**服务器推送**:
```json
{
  "type": "message",
  "data": {
    "id": "msg_xxx",
    "sessionId": "ai-assistant",
    "sender": "ai",
    "content": "你好！有什么可以帮助你的吗？",
    "createdAt": "2026-03-07T12:00:00Z"
  }
}
```

### 消息类型

| 类型 | 说明 |
|------|------|
| `message` | 聊天消息 |
| `typing` | 对方正在输入 |
| `read` | 消息已读 |
| `error` | 错误通知 |
| `ping/pong` | 心跳检测 |

---

## 文档状态机

| 模块 | 状态 | 备注 |
|------|------|------|
| 认证授权 | ✅ | 已定义 |
| 学生端-心墙 | ✅ | 已定义 |
| 学生端-AI对话 | ✅ | 已定义，含 OpenClaw Therapist 集成 |
| 学生端-预约 | ✅ | 已定义 |
| 学生端-我的 | ✅ | 已定义 |
| 学生端-消息通知 | ✅ 前端已实现 | 后端待 Sentinel 实现 |
| 教师端-工作台 | ✅ | 已定义 |
| 教师端-学生管理 | ✅ | 已定义 |
| 教师端-预约管理 | ✅ | 已定义 |
| 教师端-排班管理 | ✅ | 已定义 |
| 通用API | ✅ | 已定义 |
| 通用API-个人信息详情 | ⏳ | 待 Sentinel 实现 |
| 数据模型 | ✅ | 已定义 |
| WebSocket | ✅ | 已定义 |

---

*文档创建时间: 2026-03-07*  
*最后更新: 2026-03-18*  
*创建者: Sisyphus (AI Agent)*  
*基于: PRD_STUDENT.md + PRD_TEACHER.md + 现有 Mock 数据*
