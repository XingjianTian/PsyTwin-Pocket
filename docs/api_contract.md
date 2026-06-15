# PsyTwin-Sentinel API 契约入口

Pocket 是 PsyTwin 生态的微信小程序端 API Consumer。真实 API 字段、路径和响应结构以 Sentinel 侧契约为准：

- [PsyTwin-Sentinel API 契约](../../PsyTwin-Sentinel/docs/api_contract.md)

使用规则：

- 写网络请求或 Mock 前，先阅读上面的 Sentinel 契约。
- 如果契约缺少前端需要的字段，不要在 Pocket 侧自行补字段，先通知 Sentinel 补充契约。
- Pocket 侧只消费 API，不维护服务端逻辑、Prisma 或 Next.js 代码。
