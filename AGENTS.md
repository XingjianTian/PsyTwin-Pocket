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

### 静态资源与图片使用规范（重要）

**微信小程序背景图限制**：
微信小程序的 CSS **不支持**使用 `background-image` 引用本地图片文件（jpg/png），仅支持网络图片（https://）或 base64。因此，所有需要背景图的场景必须使用 `<image>` 标签实现。

**正确做法（必须使用）**：

1. **WXML 结构**：使用 `<image>` 标签作为背景层
```xml
<view class="container">
  <image class="bg-image" src="/static/xxx.png" mode="scaleToFill"></image>
  <!-- 内容层 -->
</view>
```

2. **LESS 样式**：
```less
.container {
  position: relative;
  overflow: hidden;  // 关键：实现圆角裁剪
  border-radius: 20rpx;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;  // 置于内容层下方
}
```

3. **图片显示模式**：
   - `mode="scaleToFill"`：强制拉伸填满容器（无白边，可能变形）
   - `mode="aspectFill"`：保持比例裁剪填满（可能裁切内容）
   - **推荐**：根据设计需求选择，UI 背景图优先使用 `scaleToFill`

4. **图片格式建议**：
   - 需要透明背景：使用 **PNG** 格式
   - 不需要透明：使用 **JPG** 格式（体积更小）
   - 图标类：使用 **PNG** 或 **SVG**（如支持）

5. **文件存放位置**：
   - 所有静态资源必须放在 `static/` 目录下
   - 按功能分子目录：`static/home/`、`static/pet/`、`static/icons/` 等
   - 命名规范：`功能_描述.格式`，如 `b1.png`、`bg_navbar.png`

**错误做法（严禁）**：
```less
// ❌ 错误：微信小程序不支持本地 background-image
.container {
  background-image: url('/static/xxx.png');  // 无效！
}
```

---

### 背景图替换标准操作流程（SOP）

> **适用场景**：需要为页面/组件/面板替换AI生成的背景图

#### 步骤 1：测量实际UI尺寸比例

**不要假设设计稿尺寸**，必须查看实际代码：

```bash
# 查看目标容器的实际尺寸（WXML + LESS）
# 重点关注：
# - 容器宽度（通常由 left/right 或 width 决定）
# - 容器高度（由 padding + 内容撑开，或固定 height）
```

**实际比例计算公式**：
```
实际比例 = 容器宽度 / 容器实际高度
```

**常见误区**：
- ❌ 设计稿写 180rpx，不等于实际高度就是 180rpx
- ✅ 必须查看 LESS 中 padding、line-height、font-size 等撑开的实际高度

**心宠按钮面板实际比例示例**：
```
宽度 = 750rpx - 24rpx - 24rpx = 702rpx
高度 ≈ 112rpx (由 padding + 图标 + 文字撑开)
实际比例 = 702 : 112 ≈ 6.3 : 1
```

---

#### 步骤 2：AI生图比例转换（16:9 → 实际比例）

**问题**：多数AI生图工具只支持 16:9 比例

**解决方案**：在 16:9 画布内生成居中的UI元素，上下留透明边

**计算方法**：
```javascript
// 计算UI在16:9画布中的高度占比
const canvasRatio = 16/9;      // 1.78
const targetRatio = 6.3/1;     // 实际UI比例（示例）
const uiHeightPercent = (9/16) / (1/targetRatio) * 100;  // 28.2%
const marginPercent = (100 - uiHeightPercent) / 2;        // 35.9%
```

**结果**：
| 画布尺寸 (16:9) | UI目标尺寸 | UI占高度 | 上下留白 |
|---|---|---|---|
| 1024×576 | 1024×163 | **28.2%** | 35.9% each |
| 1920×1080 | 1920×305 | **28.2%** | 35.9% each |

---

#### 步骤 3：AI生图Prompt模板

```
CRITICAL: The UI element must be extremely wide and flat.
Aspect ratio is 6.3:1 (width:height).

The canvas is 16:9, but the actual UI content occupies only
the center 28% of the total height.

LAYOUT STRUCTURE:
- Total canvas: 16:9 ratio (e.g., 1920x1080)
- Active UI zone: Center horizontal strip, height = 28% of canvas
- Top margin: 36% (transparent or simple fade)
- Bottom margin: 36% (transparent or simple fade)
- All visual elements MUST stay within the center 28% zone

UI DESIGN:
- Shape: Rounded rectangle with 28px corner radius
- Background: Linear gradient #667eea to #764ba2 at 135 degrees
- Shadow: 0px 8px 32px rgba(102, 126, 234, 0.25)
- Border: 2px inner border rgba(255, 255, 255, 0.3)

DECORATIONS (within center strip only):
- Top-left: Semi-transparent white star (24px, rotated 15°)
- Top-right: Two white dots (12px and 8px diameter)
- Bottom: Thin wavy line (1px)

TRANSPARENCY:
- Areas outside the rounded rectangle must be transparent (alpha=0)
- Top and bottom margins must be transparent

Export as PNG with transparency.
```

---

#### 步骤 4：图片裁剪（去除上下透明边）

**Python脚本（自动裁剪）**：
```python
from PIL import Image

def crop_16_9_to_target(input_path, output_path, target_ratio=6.3):
    """
    从16:9图片中裁剪出目标比例的UI
    target_ratio: 宽/高比例（如 6.3 表示 6.3:1）
    """
    img = Image.open(input_path)
    width, height = img.size
    
    # 计算目标高度
    target_height = int(width / target_ratio)
    top = (height - target_height) // 2
    
    # 裁剪中间区域
    cropped = img.crop((0, top, width, top + target_height))
    cropped.save(output_path)
    print(f"✓ Cropped to {width}x{target_height} ({target_ratio}:1)")

# 使用示例
crop_16_9_to_target("ai_generated_16_9.png", "final_ui_bg.png", target_ratio=6.3)
```

**在线工具替代**：
- Photopea（免费在线PS）：裁剪工具 + 固定比例
- Remove.bg：上传后调整画布尺寸
- Mac Preview：工具 → 裁剪 → 选择区域

---

#### 步骤 5：代码实现（替换背景）

**WXML 结构**：
```xml
<!-- 按钮面板 -->
<view class="button-panel">
  <!-- 背景图 -->
  <image class="button-panel-bg" src="/static/b1.png" mode="scaleToFill"></image>
  
  <!-- 内容层（按钮等） -->
  <view class="btn-item">...</view>
  <view class="btn-item">...</view>
</view>
```

**LESS 样式**：
```less
.button-panel {
  position: absolute;      // 或 relative/fixed，根据需求
  left: 24rpx;
  right: 24rpx;
  bottom: 80rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;     // 垂直居中内容
  padding: 10rpx 16rpx;
  border-radius: 20rpx;    // 圆角
  overflow: hidden;        // 关键：裁剪背景图圆角
  z-index: 100;
}

.button-panel-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;             // 置于内容层下方
}
```

**关键要点**：
- ✅ 使用 `<image>` 标签，不要用 CSS `background-image`
- ✅ `mode="scaleToFill"` 强制填满（无白边）
- ✅ 外层容器 `overflow: hidden` 实现圆角裁剪
- ✅ 背景图 `z-index: -1` 置于最底层
- ✅ 内容层默认 z-index 高于背景图

---

#### 步骤 6：验证清单

- [ ] 图片已放入 `static/` 目录
- [ ] 图片格式为 PNG（需要透明）或 JPG（不透明）
- [ ] WXML 中使用 `<image>` 标签
- [ ] LESS 中不使用 `background-image`
- [ ] 容器有 `overflow: hidden` 和 `border-radius`
- [ ] 背景图有 `position: absolute` 和 `z-index: -1`
- [ ] 编译后无白边/透明边
- [ ] 文字在背景图上清晰可读

---

#### 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 背景图不显示 | 使用了 CSS `background-image` | 改用 `<image>` 标签 |
| 图片两侧有白边 | `mode="aspectFill"` 保留比例 | 改用 `mode="scaleToFill"` |
| 圆角外有图片溢出 | 容器缺少 `overflow: hidden` | 添加 `overflow: hidden` |
| 文字被背景图覆盖 | z-index 层级错误 | 背景图 `z-index: -1` |
| 图片拉伸变形 | 原始比例与容器差异过大 | 重新生成合适比例的图片 |
| AI生成的图片比例不对 | Prompt 未指定留白比例 | 按步骤2计算并明确指定 |

---

#### 实际案例：心宠按钮面板背景替换

**背景**：为心宠页面底部四个按钮（世界地图、需要帮助、心宠背包、心情日记）替换AI生成的蓝紫渐变背景。

**执行过程**：
1. **测量**：实际容器宽度 702rpx，高度约 112rpx，比例 **6.3:1**
2. **计算**：16:9 画布中 UI 只占中间 **28%** 高度，上下各留 **36%**
3. **生图**：使用修正后的 Prompt，要求AI在16:9画布内生成居中的扁平UI
4. **裁剪**：使用 Python 脚本从 1920×1080 裁剪出 1920×305（6.3:1）
5. **替换**：将 `b1.png` 放入 `static/` 目录
6. **代码**：
   - WXML 添加 `<image class="button-panel-bg" src="/static/b1.png" mode="scaleToFill">`
   - LESS 添加 `.button-panel-bg { position: absolute; z-index: -1; }`
7. **验证**：编译后背景正确显示，文字清晰，无白边

**成果**：成功替换背景，所有后续UI背景替换均遵循此SOP。

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
| changelog | **每次 push 后自动生成** - 使用 auto-changelog |

### 提交信息规范（Conventional Commits）

每次 commit 必须遵循以下标签规范，用于自动生成 CHANGELOG：

| 标签 | 说明 | 示例 |
|------|------|------|
| `feat:` | 新功能 | `feat: 添加心墙点赞功能` |
| `fix:` | 修复 bug | `fix: 修复评论列表加载失败` |
| `docs:` | 文档更新 | `docs: 更新 API 接口文档` |
| `style:` | 代码格式 | `style: 格式化首页代码` |
| `refactor:` | 重构 | `refactor: 优化瀑布流算法` |
| `test:` | 测试 | `test: 添加登录单元测试` |
| `chore:` | 构建/工具 | `chore: 更新依赖版本` |

### 正确流程
```
1. 完成代码修改
2. 询问用户："是否提交并推送？"（提供提交信息摘要）
3. 用户确认后执行 commit + push
4. **自动生成 CHANGELOG**：npx auto-changelog -p
5. 提交 CHANGELOG 更新（如有变更）
```

### 错误流程（禁止）
- ❌ 自动 commit
- ❌ 自动 push
- ❌ 在完成任务后自动执行 git push
- ❌ 无测试配置 (建议添加 Vitest)
- ❌ 无CI/CD流水线
- ❌ next.config.mjs 忽略TS错误需修复
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