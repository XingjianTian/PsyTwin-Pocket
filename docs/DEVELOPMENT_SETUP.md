# 开发环境搭建指南

> 文档类型: 开发手册
> 适用对象: 新加入的开发者
> 最后更新: 2026-05-19

---

## 目录

1. [前置要求](#1-前置要求)
2. [项目初始化](#2-项目初始化)
3. [微信开发者工具配置](#3-微信开发者工具配置)
4. [后端服务启动](#4-后端服务启动)
5. [开发流程](#5-开发流程)
6. [常见问题](#6-常见问题)

---

## 1. 前置要求

### 1.1 必备工具

| 工具 | 版本 | 用途 | 下载地址 |
|------|------|------|----------|
| **微信开发者工具** | 最新稳定版 | 小程序开发调试 | [官方下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) |
| **Node.js** | 16.x+ | 包管理和构建 | [nodejs.org](https://nodejs.org/) |
| **Git** | 2.x+ | 版本控制 | [git-scm.com](https://git-scm.com/) |

### 1.2 可选工具

| 工具 | 用途 |
|------|------|
| VS Code | 代码编辑（推荐） |
| Postman / Insomnia | API 调试 |
| Python 3.x | 运行图片处理脚本 |

---

## 2. 项目初始化

### 2.1 克隆项目

```bash
git clone <repository-url>
cd PsyTwin-Pocket
```

### 2.2 安装依赖

```bash
npm install
```

### 2.3 安装 TDesign 组件库

```bash
# 如果 miniprogram_npm 目录不存在，需要执行:
npm run dev:weapp
# 或通过微信开发者工具的"工具 → 构建 npm"
```

### 2.4 项目结构确认

```bash
# 检查关键文件是否存在
ls app.js app.json package.json
ls -la miniprogram_npm/tdesign-miniprogram/
```

---

## 3. 微信开发者工具配置

### 3.1 导入项目

1. 打开微信开发者工具
2. 点击"导入项目"
3. 选择 `PsyTwin-Pocket` 目录
4. 输入 AppID: `wx1ff989a54438596f`
5. 选择"不使用云服务"
6. 点击"确定"

### 3.2 项目设置

```json
// project.config.json 关键配置
{
  "appid": "wx1ff989a54438596f",
  "compileType": "miniprogram",
  "libVersion": "3.7.8",
  "packOptions": {
    "ignore": []
  },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "nodeModules": true,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": true,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "useIsolateContext": true,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "disableUseStrict": false,
    "minifyWXML": true,
    "showES6CompileOption": false,
    "useCompilerPlugins": [
      "less"
    ]
  }
}
```

### 3.3 编译配置

确保以下配置正确：

- ✅ `es6: true` - 支持 ES6
- ✅ `enhance: true` - 支持增强编译
- ✅ `useCompilerPlugins: ["less"]` - 支持 LESS
- ✅ `nodeModules: true` - 支持 npm

---

## 4. 后端服务启动

### 4.1 Mock 模式（无需后端）

```javascript
// config/index.js
const config = {
  isMock: true,
};
```

Mock 模式下：
- ✅ 所有 API 返回本地模拟数据
- ✅ WebSocket 使用本地 Mock
- ✅ 适合前端独立开发

### 4.2 真实后端模式

#### 启动 Sentinel（主后端）

```bash
# 在 Sentinel 项目目录
cd ../Sentinel
npm install
npm run dev
# 服务运行在 http://localhost:3000
```

#### 启动心宠服务

```bash
# 在心宠服务目录
cd ../pet-service
npm install
npm run dev
# 服务运行在 http://localhost:3001
```

#### 配置前端连接

```javascript
// config/index.js
const config = {
  isMock: false,
  baseUrl: 'http://localhost:3000/api/pocket',
  petServiceUrl: 'http://localhost:3001',
};
```

### 4.3 局域网测试

```javascript
// 获取本机 IP（Windows）
ipconfig

// 配置局域网地址
const config = {
  baseUrl: 'http://192.168.x.x:3000/api/pocket',
};
```

---

## 5. 开发流程

### 5.1 日常开发

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建功能分支（如需）
git checkout -b feat/xxx

# 3. 安装依赖（如有更新）
npm install

# 4. 启动微信开发者工具
# 导入项目，点击"编译"

# 5. 编写代码...

# 6. 运行 lint 检查
npm run lint

# 7. 自动修复
npm run lint:fix

# 8. 提交代码
git add .
git commit -m "feat: 添加 xxx 功能"
git push origin feat/xxx
```

### 5.2 代码提交规范

```bash
# 功能开发
git commit -m "feat: 添加心墙点赞功能"

# Bug 修复
git commit -m "fix: 修复评论列表加载失败"

# 文档更新
git commit -m "docs: 更新 API 接口文档"

# 代码格式
git commit -m "style: 格式化首页代码"

# 重构
git commit -m "refactor: 优化瀑布流算法"

# 构建/工具
git commit -m "chore: 更新依赖版本"
```

### 5.3 自动生成 CHANGELOG

```bash
# 每次 push 后自动生成
npx auto-changelog -p
```

---

## 6. 常见问题

### 6.1 构建问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| `tdesign-miniprogram` 找不到 | npm 构建未执行 | 点击"工具 → 构建 npm" |
| LESS 编译失败 | 编译器插件未启用 | 检查 `useCompilerPlugins: ["less"]` |
| 代码不更新 | 热重载未生效 | 点击"编译"或重启开发者工具 |
| 包体积过大 | 未使用分包 | 检查 `subpackages` 配置 |

### 6.2 运行时问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| API 请求失败 | Mock 未启用/后端未启动 | 设置 `isMock: true` 或启动后端 |
| 登录跳转循环 | Token 无效 | 清除缓存，重新登录 |
| WebSocket 连接失败 | 心宠服务未启动 | 启动 Pet Service |
| 图片不显示 | 路径错误 | 检查 `static/` 路径 |

### 6.3 代码规范问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| ESLint 报错 | 代码不符合规范 | `npm run lint:fix` |
| Prettier 格式化 | 格式不一致 | `npm run lint:fix-prettier` |
| 提交被阻止 | lint-staged 检查失败 | 修复 lint 错误后重试 |

### 6.4 调试技巧

```javascript
// 开启详细日志
console.log('[Debug]', data);

// 使用微信开发者工具调试器
// 1. 打开"调试器"面板
// 2. 在 Sources 中打断点
// 3. 使用 Console 查看输出

// 查看全局数据
console.log(getApp().globalData);

// 查看当前页面栈
console.log(getCurrentPages());
```

---

## 附录：环境配置速查

### 开发环境

```javascript
// config/index.js
const config = {
  isMock: true,
  baseUrl: '',
  petServiceUrl: '',
};
```

### 联调环境

```javascript
// config/index.js
const config = {
  isMock: false,
  baseUrl: 'http://localhost:3000/api/pocket',
  petServiceUrl: 'http://localhost:3001',
};
```

### 生产环境

```javascript
// config/index.js
const config = {
  isMock: false,
  baseUrl: 'https://api.psytwin.com/api/pocket',
  petServiceUrl: 'https://pet.psytwin.com',
};
```

---

> **相关文档**
> - [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - 项目全景文档
> - [API 使用指南](./API_GUIDE.md) - API 层开发手册
> - [组件开发指南](./COMPONENT_GUIDE.md) - 组件开发手册
