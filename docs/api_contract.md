# PsyTwin-Sentinel API 契约入口

Pocket 是 PsyTwin 生态的微信小程序端 API Consumer。真实 API 字段、路径和响应结构以 Sentinel 侧契约为准：

- [PsyTwin-Sentinel API 契约](../../PsyTwin-Sentinel/docs/api_contract.md)

使用规则：

- 写网络请求或 Mock 前，先阅读上面的 Sentinel 契约。
- 如果契约缺少前端需要的字段，不要在 Pocket 侧自行补字段，先通知 Sentinel 补充契约。
- Pocket 侧只消费 API，不维护服务端逻辑、Prisma 或 Next.js 代码。
# F9 心宠对话演示扩展（2026-07-27）

`pet_status.payload.status` 可选包含短生命周期字段 `demoConversation`，由本地心宠服务器在 F9 演示期间权威下发：

```json
{
  "demoConversation": {
    "active": true,
    "phase": "meeting | line_1 | line_2",
    "speaker": "main | companion",
    "text": "当前台词",
    "companion": {
      "id": "demo_companion",
      "name": "小暖",
      "avatar": "/static/头像/xxx.png"
    }
  }
}
```

- `meeting` 阶段可以省略 `speaker` 和 `text`。
- 进入 `psychological_room` 或演示结束时，`demoConversation` 为 `null` 或不存在。
- 客户端只读消费该字段，不得回写对话阶段。
