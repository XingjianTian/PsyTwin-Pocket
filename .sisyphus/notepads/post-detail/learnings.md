# 学习心得 - 动态详情页初始化

## 1. 页面结构规范
- 遵循 `AGENTS.md` 规范，使用 JavaScript 和 LESS。
- 页面作为分包（subpackage）注册在 `app.json` 中，以优化小程序首屏加载速度。
- 引用了 TDesign 的 `t-icon`, `t-input`, `t-button` 组件。

## 2. 逻辑设计
- `onLoad` 接收 `id` 参数并存储为 `postId`。
- 预留了 `loadPostDetail` 和 `loadComments` 异步方法，后续将对接 Mock 数据或真实 API。
- 底部操作栏采用 `fixed` 布局，确保在长内容滚动时依然可用。

## 3. 遇到的问题
- 在 `app.json` 编辑过程中遇到了 hash 冲突，已通过重新读取文件并确认内容解决。
- 确认分包配置中 `root` 路径与实际目录一致。
