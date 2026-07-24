# 心宠所在地跨端显示同步设计

> 设计日期：2026-07-20

## 目标

服务端继续作为心宠状态的唯一事实源。微信小程序和 Unity 使用相同的 `userId` 消费同一份
`sceneId`：小程序用它更新心宠的真实所在地，Unity 暂时只把原始 `sceneId` 显示在 HUD 文本中。

## 状态边界

- `sceneId` 是服务端下发的心宠真实所在地，客户端不得自行改写或重新计算。
- 小程序的 `petSceneId` 表示心宠真实所在地，只能由服务端状态更新。
- 小程序的 `currentSceneId` 表示玩家当前观察的场景，只能由玩家的地图浏览行为更新。
- 玩家浏览其他场景不会移动心宠，也不会被服务端位置更新强制拉回心宠所在场景。
- Unity 当前不加载或切换 Unity Scene，只显示服务端原始 `sceneId`。

## 数据契约

现有 HTTP 与 WebSocket 状态载荷继续使用以下字段：

```json
{
  "sceneId": "teaching_building",
  "activity": "正在上课",
  "activityStartTime": 1710000000000,
  "activityDuration": 45,
  "stateVersion": 123,
  "updatedAt": 1710000005000
}
```

本功能不增加中文场景名字段。Unity 直接显示 `sceneId`；小程序继续使用本地场景配置将 `sceneId`
解析成现有中文名称和图标。若服务端下发未知 `sceneId`，Unity 原样显示，小程序使用原始值作为名称并
保留默认图标，避免客户端伪造契约字段。

## 小程序设计

### 统一状态入口

HTTP 初始快照、5 秒兜底轮询和 WebSocket `pet_status` 必须进入同一个权威状态应用方法。该方法：

1. 按 `stateVersion` 忽略旧状态；
2. 更新 `mood`、`energy`、`social`；
3. 更新 `petSceneId`、`petSceneName`、`petActivity`、活动时间和持续时间；
4. 更新地图中心宠标记；
5. 不修改 `currentSceneId`。

### 显示行为

- 玩家观察的场景与心宠所在地相同时，现有 `petSceneId === currentSceneId` 条件显示心宠精灵。
- 两者不同时，当前观察场景不显示主心宠，但地图标记反映服务器下发的真实所在地。
- 玩家主动进入心宠所在场景后，心宠精灵自然出现。
- 网络失败时保留最后一次成功状态，不启动本地位置调度。

## Unity 设计

`PetStatusPayload` 已包含 `PetState.sceneId`，不修改网络协议。`PetStatusSyncPanel` 新增可序列化的
`TMP_Text sceneText` 引用，并在现有 `ApplyState(PetState state)` 中设置：

```csharp
sceneText.text = state.sceneId ?? string.Empty;
```

HTTP 和 WebSocket 已共用 `ApplyState`，因此无需新增请求、协程或消息类型。未在 Inspector 绑定
`sceneText` 时沿用现有空引用安全跳过逻辑，不影响已有三维状态 HUD。

## 错误处理与一致性

- 两端继续使用同一个 `petUserId`，演示环境为 `demo_pet`。
- 只应用版本号不小于当前版本的状态，防止迟到响应回滚 UI。
- WebSocket 用于实时更新，HTTP 用于首次加载、轮询兜底和重连后的最终校准。
- Pocket 在服务端升级期间兼容状态字段直接位于 `data` 下的旧 HTTP 响应；新版 `data.state` 仍是目标契约。
- 空 `sceneId` 在 Unity 显示为空；小程序保留最后一个有效位置，避免切换到不存在的资源路径。
- 日志应包含 `sceneId`，方便核对小程序和 Unity 是否消费了同一版本。

## 测试与验收

- [ ] 小程序单元测试证明位置补丁包含 `petSceneId`，且不包含 `currentSceneId`。
- [ ] 小程序 HTTP 状态更新能移动地图标记，但不改变玩家观察视角。
- [ ] 小程序 WebSocket 状态更新与 HTTP 使用相同的位置应用逻辑。
- [ ] Unity EditMode 测试证明 `ApplyState` 将原始 `sceneId` 写入场景文本。
- [ ] Unity Inspector 未绑定场景文本时不抛出异常，已有 HUD 同步不受影响。
- [ ] 使用同一 `userId` 联调时，小程序地图标记与 Unity HUD 显示相同的原始 `sceneId`。
- [x] Pocket 能从线上旧版直接 `data.sceneId` 响应读取所在地。*(已于 2026-07-20 完成回归测试)*

## 非目标

- 不由 Unity 加载、卸载或切换实际 Unity Scene。
- 不允许玩家通过小程序观察视角改变心宠所在地。
- 不增加中文场景映射到 Unity。
- 不修改服务端调度算法、tick 周期或位置生成逻辑。
- 不恢复客户端本地自动场景调度。
