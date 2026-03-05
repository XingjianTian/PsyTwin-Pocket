# PsyTwin Pocket 双端实施计划

## 项目现状

> 最后更新: 2026-03-02

### 当前实现状态

| 组件 | 当前状态 | 说明 |
|------|---------|------|
| TabBar | 4 标签 (心墙/AI/工作台/我的) | 已实现双套 Tab |
| 登录 | 基础登录页面 | 需添加角色选择 UI |
| Mock | 统一 mock 路径 | 部分实现 student/teacher 双套 |
| UserInfo | 基础用户信息 | 需添加 role 字段 |
| WebSocket | 基础 chat 模拟 | 计划添加情绪标签/CBT/预警 |

### 已实现页面

```
pages/
├── home/           # 心墙 - 动态流
├── message/        # AI - 对话列表
├── my/            # 我的 - 个人中心(含教师徽章)
├── dataCenter/    # 工作台 - 数据统计
├── appointment/   # 预约 - 心理咨询/VR设备预约
├── search/        # 搜索 - 帖子/用户搜索
├── chat/          # 聊天 - 私信聊天
├── login/         # 登录 - 手机号登录
├── loginCode/     # 验证码登录
├── setting/       # 设置 - 系统设置
└── release/       # 发布 - 发布动态
```

---

## 阶段一：基础设施 (Foundation)

### 1.1 数据模型扩展
- [ ] T1.1.1: mock/my/getPersonalInfo.js - 添加 role 字段 (student/teacher)
- [ ] T1.1.2: mock/login/postPasswordLogin.js - 返回 role 字段
- [ ] T1.1.3: app.js globalData - 确认 userInfo 结构含 role

### 1.2 登录流程改造
- [ ] T1.2.1: pages/login/login.wxml - 添加角色选择器 (学生/教师 Radio)
- [ ] T1.2.2: pages/login/login.js - 提交时携带 role 参数
- [ ] T1.2.3: pages/login/login.wxss - 角色选择器样式

### 1.3 登录后路由跳转
- [ ] T1.3.1: pages/login/login.js - 根据 role 跳转到对应首页
- [ ] T1.3.2: app.json - 添加教师端首页配置

**依赖**: T1.1 → T1.2 → T1.3

---

## 阶段二：动态 TabBar

### 2.1 Tab 配置重构
- [x] T2.1.1: custom-tab-bar/index.js - 从 app.globalData 读取 role
- [x] T2.1.2: custom-tab-bar/index.js - 根据 role 返回不同 tabList
- [x] T2.1.3: custom-tab-bar/index.wxml - 动态渲染 tab 项

### 2.2 Tab 图标准备
- [ ] T2.2.1: static/tabbar/ - 创建 student 端图标
- [ ] T2.2.2: static/tabbar/ - 创建 teacher 端图标
- [ ] T2.2.3: custom-tab-bar/index.json - 动态切换图标路径

### 2.3 页面映射

| 角色 | Tab 1 | Tab 2 | Tab 3 | Tab 4 |
|------|-------|-------|-------|-------|
| 学生 | 心墙 | AI | 预约 | 我的 |
| 教师 | 心墙 | AI | 工作台 | 我的 |

---

## 阶段三：学生端页面

> 📄 详细规格说明见 [OPENSPECS_STUDENT.md](./docs/OPENSPECS_STUDENT.md)

### 3.1 首页 - 心墙 ✅ 已实现
- [x] T3.1.1: pages/home/index.js - 双栏瀑布流展示
- [x] T3.1.2: pages/home/index.wxml - 卡片组件渲染
- [x] T3.1.3: mock/student/home/getFeed.js - 动态数据

### 3.2 AI 对话页 ✅ 已实现
- [x] T3.2.1: pages/message/index.js - AI 对话列表入口
- [x] T3.2.2: pages/message/index.wxml - 展示 AI 咨询师列表

### 3.3 预约页 ✅ 已实现
- [x] T3.3.1: pages/appointment/index.js - 心理咨询/VR设备预约
- [x] T3.3.2: pages/appointment/index.wxml - 预约表单

### 3.4 我的页 - 档案/设置 
- [x] T3.4.1: pages/my/index.js - 用户信息 + 功能菜单
- [x] T3.4.2: pages/my/index.wxml - 宫格菜单渲染
- [x] T3.4.3: mock/my/getStudentProfile.js - 档案数据

---

## 阶段四：教师端页面

> 📄 详细规格说明见 [OPENSPECS_TEACHER.md](./docs/OPENSPECS_TEACHER.md)

### 4.1 心墙 ✅ 已实现
- [x] T4.1.1: pages/home/index.js - 复用首页
- [x] T4.1.2: pages/home/index.wxml - 动态流展示

### 4.2 AI 对话页 ✅ 已实现
- [x] T4.2.1: pages/message/index.js - AI 对话列表入口
- [x] T4.2.2: pages/message/index.wxml - AI 咨询师列表
- **注意**：当前文案偏学生端，需优化

### 4.3 工作台（数据统计） 
- [x] T4.3.1: pages/dataCenter/index.js - 统计页面
- [x] T4.3.2: pages/dataCenter/index.wxml - 统计图表（整体情况/互动情况/完播率）
- [x] T4.3.3: mock/dataCenter/ - 统计数据接口
- **注意**：预警功能待实现（见阶段五）

### 4.4 我的页 - 角色标识 
- [x] T4.4.1: pages/my/index.js - 显示角色标识（教师徽章）
- [x] T4.4.2: pages/my/index.wxml - 通用功能菜单
- **注意**：排班功能待实现


---

## 阶段五：高级功能（预警/情绪/CBT）

### 5.1 预警系统
- [ ] T5.1.1: mock/workbench/warnings.js - 学生预警数据
- [ ] T5.1.2: mock/workbench/warningLevels.js - 预警级别定义
- [ ] T5.1.3: pages/dataCenter/index.wxml - 按颜色区分预警级别
- [ ] T5.1.4: app.js WebSocket - 实时推送预警通知

### 5.2 情绪标签系统
- [ ] T5.2.1: mock/chat/emotionTags.js - 情绪标签数据
- [ ] T5.2.2: pages/chat/index.wxml - 消息携带情绪标签

### 5.3 CBT 卡片功能
- [ ] T5.3.1: mock/chat/cbtCards.js - CBT 引导卡片数据
- [ ] T5.3.2: pages/chat/index.wxml - AI 对话中嵌入 CBT 卡片
- [ ] T5.3.3: components/cbt-card/ - 创建 CBT 卡片组件

---

## 阶段六：Mock 数据双套

### 目录结构
```
mock/
├── student/           # 学生端数据
│   ├── home/getFeed.js
│   ├── message/getSessions.js
│   └── my/profile.js
├── teacher/           # 教师端数据
│   ├── workbench/warnings.js
│   ├── workbench/stats.js
│   └── my/schedule.js
└── index.js           # 根据 role 动态导入
```

### Mock 路由适配
- [ ] T6.1.1: mock/index.js - 根据当前 role 选择数据源
- [ ] T6.1.2: api/request.js - 传递 role 参数到 mock

---

## 依赖关系

```
阶段一 ─┬─ T1.1.1 ─ T1.1.2 ─ T1.1.3
        │
        ├─ T1.2.1 ─ T1.2.2 ─ T1.2.3
        │
        └─ T1.3.1 ─ T1.3.2

阶段二 ─┬─ T2.1.1 ─ T2.1.2 ─ T2.1.3
        │
        └─ T2.2.1 ─ T2.2.2 ─ T2.2.3

阶段三 (依赖 T1.3) - 已完成
阶段四 (依赖 T2.1) - 已完成
阶段五 (依赖 T3/T4)
阶段六 (独立)
```

---

## 风险点

### 高风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| TabBar 缓存 | 切换角色后 Tab 不刷新 | 使用 wx.reLaunch 而非 wx.switchTab |
| Mock 数据冲突 | 双端数据混淆 | 严格目录分离 + role 参数校验 |
| WebSocket 断连 | 实时功能失效 | 添加重连机制 + 状态提示 |

### 中风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| 页面栈混乱 | navigateBack 异常 | 统一使用 wx.reLaunch 跳转 |
| 角色切换 | 需重新登录 | 首次登录后持久化 role |

---

## 建议实施顺序

1. 基础设施 (阶段一) - 核心数据流
2. TabBar (阶段二) - 门面组件
3. 学生端 (阶段三) - MVP 功能
4. 教师端 (阶段四) - 完整双端
5. 高级功能 (阶段五) - 预警/情绪/CBT
6. Mock 双套 (阶段六) - 数据隔离

---

## 待确认问题

1. 角色切换：登录后不允许切换角色，通过学校手机号确认身份（后端返回 role），切换需重新登录
2. 现有页面复用：优先改造现有页面，最小改动原则
3. 交付方式：分阶段实现，优先交付 MVP
