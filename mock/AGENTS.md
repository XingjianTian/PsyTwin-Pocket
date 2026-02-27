# Mock 系统

## 概述
本地模拟数据系统。它支持离线开发，让前端不依赖后端接口。

## 查找位置
- **mock/index.js**: 核心入口。这里负责初始化和注册所有接口。
- **mock/request.js**: 请求处理器。它拦截网络请求并返回模拟数据。
- **mock/home/**: 首页相关数据。
- **mock/search/**: 搜索功能数据。
- **mock/login/**: 登录流程数据。
- **mock/my/**: 个人中心数据。
- **mock/dataCenter/**: 数据中心统计。

## 规范
1. 启用方式。在 `config/index.js` 中把 `isMock` 设为 `true` 即可。
2. 结构一致。模拟数据必须对齐真实 API 结构。这样切换到生产环境时不需要改代码。
3. 导出格式。每个 mock 文件都要导出类 JSON 对象。
4. 延迟模拟。可以在处理器中加入随机延迟，模拟真实网络环境。

## 新增 Mock 数据
首先在对应的功能目录下创建 JS 文件。
接着定义一个包含 `code`, `data`, `message` 的对象。
导出该对象。
最后在 `mock/index.js` 中引入并注册。

## 示例结构
```javascript
export default {
  code: 0,
  data: {
    list: [],
    total: 0,
  },
  message: 'success',
};
```

## 注意事项
确保字段名与后端文档完全一致。
不要把敏感信息写在 mock 数据里。
所有的 mock 文件都应该放在 `mock/` 目录下。
避免在业务代码中直接引用 mock 文件。
拦截逻辑由 `mock/request.js` 统一处理。

## 调试建议
开发者可以在控制台查看 mock 接口的调用日志。
如果接口返回 404，请检查 `mock/index.js` 中的路径注册是否正确。
修改 mock 数据后，通常需要重新编译小程序以生效。
