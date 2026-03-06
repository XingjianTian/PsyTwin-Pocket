# AGENTS.md - PsyTwin-Pocket 项目规范

> 最后更新: 2026-03-01

## 概述

PsyTwin-Pocket 是基于 TDesign 框架开发的微信小程序。项目采用 JavaScript 和 LESS 编写，通过模块化结构组织代码。该项目旨在提供一个高性能、易扩展的移动端心理咨询或社交平台原型。

## 目录结构

```
├── api/              # HTTP 请求层和服务定义
├── behaviors/        # 微信小程序 mixins 共享逻辑
├── components/       # 可复用 UI 组件
├── config/           # 运行时配置和环境变量
├── docs/             # 项目文档
├── mock/             # 本地模拟数据系统
├── pages/            # 页面目录
├── static/           # 静态资源
└── utils/            # 工具函数
```

---

## 各模块规范

### api/ - HTTP 请求层

**职责**：封装所有后端服务接口，统一处理 Token 管理、错误拦截和 Mock 切换。

**查找位置**：
- `api/request.js` - 核心请求工具，封装 `wx.request`
- `api/*.js` - 业务服务模块

**规范**：
- 严禁直接调用 `wx.request`，必须通过 API 服务模块
- 使用 `fetch`/`get` 获取数据，`update`/`post` 提交数据，`delete`/`remove` 删除数据
- 所有函数必须返回 Promise，推荐使用 async/await
- 导入顺序：微信内置 → 外部库 → 内部工具 → 同模块

---

### utils/ - 工具函数

**职责**：提供共享的基础逻辑，支持页面、组件和 Behavior。

**查找位置**：
- `utils/util.js` - 通用工具函数（时间格式化、深拷贝、防抖节流等）
- `utils/eventBus.js` - 全局事件总线，解决跨页面通信

**规范**：
- 按需导入，不一次性导入整个模块
- `util.js` 应保持纯函数性质，不直接修改全局变量
- `eventBus` 仅用于全局状态变化（如登录状态同步、未读数更新）
- 页面/组件销毁时必须在 `onUnload`/`detached` 中调用 `eventBus.off` 移除监听器
- 事件名称使用小驼峰命名，如 `userLoginSuccess`

---

### mock/ - 本地模拟数据

**职责**：支持离线开发，前端不依赖后端接口。

**查找位置**：
- `mock/index.js` - 核心入口，注册所有接口
- `mock/request.js` - 请求拦截器，返回模拟数据
- `mock/home/`, `mock/login/`, `mock/my/` 等 - 各功能模块数据

**规范**：
- 启用方式：在 `config/index.js` 中设置 `isMock: true`
- 模拟数据必须对齐真实 API 结构，切换生产环境时无需改代码
- 每个 mock 文件导出 `{ code, data, message }` 格式
- 可加入随机延迟模拟真实网络环境
- 不要在 mock 数据中包含敏感信息

---

### pages/ - 页面目录

**职责**：包含所有页面文件。

**目录结构**：
- **主 Tab 页面**：`home/`、`message/`、`my/`
- **分包页面**：`search/`、`chat/`、`login/`、`loginCode/`、`dataCenter/`、`setting/`、`release/`、`my/info-edit/`

**规范**：
- 每个页面由四个文件组成：`.js`、`.wxml`、`.less`、`.json`
- 界面开发优先使用 `tdesign-miniprogram` 组件库
- 页面样式应通过 LESS 文件定义，禁止在 WXML 中使用内联样式
- 严禁将业务逻辑写在 `app.js` 中
- 逻辑过于复杂时应拆分为独立组件或提取至 `utils`

---

### behaviors/ - 共享逻辑

**职责**：微信小程序的 mixins 机制，复用页面/组件逻辑。

**规范**：
- 通用行为如 `useToast.js`（处理提示）放在此目录
- 页面/组件按需引入所需行为

---

### components/ - UI 组件

**职责**：可复用的 UI 组件，如导航栏、卡片等。

**规范**：
- 组件样式应通过 LESS 文件定义
- 组件配置需在 `usingComponents` 中声明

---

## 全局规范

### 语言与样式
- **语言**：仅使用 JavaScript，禁止引入 TypeScript
- **样式**：使用 LESS，共享变量定义在 `variable.less`
- **缩进**：2 空格

### 代码规范
- **ESLint**：遵循 `airbnb-base`
- **Prettier**：单引号、分号、所有项保留尾随逗号
- **行宽限制**：120 字符
- **导入顺序**：内置模块 → 外部模块 → 内部模块

### 全局对象
可直接访问：`wx`, `App`, `Page`, `Component`, `getCurrentPages`, `getApp`

### 注意事项
- 避免在代码中硬编码本应放在 `config/` 中的字符串
- 不要在 WXML 文件中使用内联样式
- 提交代码前必须运行 lint 检查

---

## 命令

```bash
# 安装依赖
npm install

# 运行 lint 检查
npm run lint

# 自动修复 lint 错误
npm run lint:fix
```

---

## 技术栈

- **框架**：微信小程序
- **UI 组件库**：TDesign Mini Program v1.11.2
- **基础库版本**：^2.6.5

---

## 其他

- GitHub Actions 会在每次 PR 时自动运行 lint
- 测试真实 API 前，请确认 `config/index.js` 中的 `isMock` 设置正确

## GIT 操作规则

**重要**：所有 Git 操作（commit + push）只需用户**确认一次**即可执行。

| 操作 | 规则 |
|------|------|
| commit + push | 工作完成后询问用户是否提交并推送 |
| branch | 如需创建分支，先询问用户 |

### 正确流程
```
1. 完成代码修改
2. 询问用户："是否提交并推送？"（提供提交信息摘要）
3. 用户确认后执行 commit + push
```

### 错误流程（禁止）
- ❌ 自动 commit
- ❌ 自动 push
- ❌ 在完成任务后自动执行 git push
- 无测试配置 (建议添加 Vitest)
- 无CI/CD流水线
- next.config.mjs 忽略TS错误需修复

## OPENSPECS 文档状态机同步规范 (Docs as a State Machine)

### 【总则】
- 为彻底消除“文档漂移（Documentation Drift）”，本项目的 OpenSpecs 规范文档（包括但不限于 PRD、API 规范、架构设计）不仅是说明书，也是多智能体协作的全局状态机与动态任务看板。
- 任何功能开发、联调结果、页面接通状态都必须与 OpenSpecs 文档状态同步更新。

### 【AI 智能体执行准则】

#### 1. 统一追踪语法（强制）
- 必须使用 Markdown 任务列表语法：
  - `- [ ]`：待开发 / 待修复 / 未完成
  - `- [x]`：已开发 / 已接通 / 测试通过

#### 2. 计划者（Prometheus）读取拦截
- 在任何新会话或新任务规划前，必须优先检索关联 OpenSpecs 文档。
- 自动跳过所有 `- [x]` 已完成节点，仅提取 `- [ ]` 未完成节点生成后续计划，避免重复建设。

#### 3. 执行者（Atlas / Hephaestus）强制回写
- 当代码逻辑落地、数据库联调成功或 UI 组件重构完成后，必须主动触发“文档回写”。
- 回写要求：将对应条目从 `- [ ]` 改为 `- [x]`。
- 备注要求：在已完成条目后追加斜体完成备注，例如：`*(已于 2026-03-06 联调通过本地数据库)*`。

#### 4. 主指挥官（Sisyphus）最终审查
- 在任务汇报完成前，必须全局校验“代码变动”与“文档状态”双向绑定。
- 严禁出现“代码已改但文档仍为 `- [ ]`”的失步状态。

#### 5. 适用范围
- 本规范对本仓库全部智能体生效，默认纳入任务完成定义（Definition of Done）。

**【跨端协作与 API 消费规范 (API Consumer)】**
本项目作为 PsyTwin 生态的移动端特种部队，如果涉及真实数据，非用户要求的MOCK数据，需逐步完善至来源于 Sentinel 后台。为了确保跨端联调的绝对安全，所有智能体必须严格遵守以下契约纪律：
1. **边界隔离**：绝对禁止在此项目中编写任何 Node.js 服务端逻辑、Prisma 数据库连接或 Next.js 代码。本项目的网络请求仅限使用 `wx.request`。
2. **绝对服从契约 (Contract Obedience)**：
   - 在编写任何网络请求代码或配置 Mock 数据时，**必须且只能**读取docs目录下的 `api_contract.md` 软链接文件。
   - 严禁 AI 凭借经验“脑补”或“猜测”后端接口的字段名。
   - 如果发现现有的前端 TDesign UI 组件需要的字段在 `api_contract.md` 中不存在，不允许自行伪造数据，必须在控制台向人类开发者报告：“当前契约缺少 XXX 字段，请通知 Sentinel 后端补充”。