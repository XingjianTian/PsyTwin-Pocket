# 心宠跨端状态同步契约

> 服务端是唯一状态源；Unity 与微信小程序只读拉取，不向服务端推送心宠状态。

## 演示配置

两端必须使用同一个演示用户 ID：`demo_pet`。

小程序配置位置：`config/index.js` 的 `petDemoUserId`；Unity 端将该值作为请求参数 `userId`。

## 状态接口

```http
GET http://42.121.14.189:13002/api/pet/status?userId=demo_pet
```

响应中的 `data.state` 是完整权威状态，`data.serverTime` 是服务端当前时间，`data.updatedAt` 是状态更新时间，`data.stateVersion` 是单调递增版本号。

```json
{
  "code": 0,
  "data": {
    "state": {
      "userId": "demo_pet",
      "mood": 60,
      "energy": 75,
      "social": 45,
      "sceneId": "bedroom",
      "activity": "在温暖的床上休息",
      "activityStartTime": 1710000000000,
      "activityDuration": 10,
      "stateVersion": 12,
      "updatedAt": 1710000005000
    },
    "serverTime": 1710000005000,
    "updatedAt": 1710000005000,
    "stateVersion": 12
  }
}
```

## 同步状态

- [x] 服务端每 5 秒执行一次状态 tick。*(已于 2026-07-14 统一为唯一状态源)*
- [x] 小程序每 5 秒读取一次状态。*(已于 2026-07-14 接入)*
- [x] 小程序回到前台时立即读取一次。*(已于 2026-07-14 接入)*
- [x] 小程序停止本地三维状态随机变化。*(已于 2026-07-14 移除)*
- [x] 小程序停止本地自动场景调度。*(已于 2026-07-14 移除)*
- [x] 服务端持久化完整状态并在重启后恢复。*(已于 2026-07-14 接入)*
- [x] 客户端不再使用 `push` 覆盖服务端状态。*(已于 2026-07-14 接入只读模式)*
- [ ] Unity 客户端按本契约接入 5 秒轮询。*(等待 Unity 工程接入)*

客户端应按 `stateVersion` 忽略版本更旧的响应。网络失败时保留最近一次已显示状态，不在客户端自行模拟新状态。
