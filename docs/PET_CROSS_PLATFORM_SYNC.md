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
- [x] Unity 客户端按本契约接入 5 秒轮询。*(已于 2026-07-20 核对现有 HTTP/WebSocket 同步实现)*

客户端应按 `stateVersion` 忽略版本更旧的响应。网络失败时保留最近一次已显示状态，不在客户端自行模拟新状态。

## 所在地显示同步

`state.sceneId` 表示心宠的服务端权威所在地。小程序的玩家观察视角与心宠所在地是两个独立状态：
玩家浏览地图不得移动心宠，服务端位置变化也不得强制改变玩家正在观察的场景。Unity 当前只显示原始
`sceneId`，不切换实际 Unity Scene。

- [x] 小程序使用 `petSceneId` 消费服务端位置且不覆盖 `currentSceneId`。*(已于 2026-07-20 完成代码与自动化测试)*
- [x] 小程序 HTTP 与 WebSocket 共用完整心宠状态应用逻辑。*(已于 2026-07-20 完成代码与自动化测试)*
- [x] Unity HUD 显示服务端下发的原始 `sceneId`。*(已于 2026-07-20 完成代码与 Unity EditMode 测试)*
- [x] `demo_pet` 的 F9 演示序列由服务器临时广播 `picnic_lawn` → `psychological_room`。*(已于 2026-07-21 完成代码与自动化测试)*
- [x] Pocket 在演示序列中强制切换到对应二级观察场景。*(已于 2026-07-21 完成代码与自动化测试)*
- [x] Unity 使用独立 `PetSceneSyncReceiver` 映射到 `Outdoor` 与 `CounselingRoom`，不修改既有 HUD 同步脚本。*(已于 2026-07-21 编译并通过 EditMode 测试)*
- [x] Pocket 兼容旧版状态直接位于 `data` 下的响应。*(已于 2026-07-20 根据线上响应补充回归测试并实现)*
- [ ] 线上心宠服务升级为本文档的 `data.state`、`stateVersion` 和 `updatedAt` 契约。*(2026-07-20 核对线上接口仍为旧响应结构)*
- [ ] 三端使用同一 `userId` 完成所在地端到端联调。*(等待线上契约升级与运行环境联调)*

## 本地 F9 场景演示

1. 运行 `node server/pet-server.js`，并让 Pocket 与 Unity 都使用 `demo_pet`。
2. 在 Unity 初始 Scene 挂载一个 `PetSceneSyncReceiver`，配置 `Server Url`、`demo_pet`，并把户外与咨询室两个 Scene 资源拖入对应字段；两个 Scene 必须加入 Build Settings。
3. Pocket 使用 `localhost:13002`；Unity 若不与服务器同机，在接收器的 `Server Url` 中填写可访问的局域网地址。
4. 聚焦服务器终端并按 F9：立即广播 `picnic_lawn`，3 秒后广播 `psychological_room`。
5. Pocket 刷新，或 Unity 的最后一个场景接收连接断开时，服务器恢复 F9 前的位置。
