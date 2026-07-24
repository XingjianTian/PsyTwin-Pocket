# demo_pet 场景快捷演示设计

> 设计日期：2026-07-21

## 目标

为本地心宠服务器增加仅面向 `demo_pet` 的 F9 演示快捷键。触发后，服务器继续作为唯一状态源，使用现有 `pet_status` 消息依次驱动 Unity 与微信小程序：先进入户外场景，3 秒后进入心理咨询室并保持，直到演示客户端断开。

该功能用于演示 Unity 当前已有的两个场景，不改变正式生活调度的场景集合，也不增加客户端向服务器控制心宠位置的能力。

## 场景映射

| 演示阶段 | 服务端 `sceneId` | 小程序一级场景 | 小程序二级场景 | Unity 场景 |
|---|---|---|---|---|
| 第一阶段 | `picnic_lawn` | `open_wilderness`（自由旷野） | `picnic_lawn`（野餐草坪） | 户外 |
| 第二阶段 | `psychological_room` | `school`（学校） | `psychological_room`（心理咨询室） | 咨询室 |

Unity 的实际场景切换映射由 Unity 端维护；服务器与小程序只传递和消费原始 `sceneId`。

## 触发与生命周期

1. 本地服务器在支持终端按键输入时监听 F9。
2. F9 只操作 `demo_pet`，不影响其他用户。
3. 首次进入演示时保存 `demo_pet` 当前正常位置相关字段；如果演示已经激活，则保留首次快照，只取消尚未结束的演示计时器。
4. 立即把演示位置设为 `picnic_lawn`，递增 `stateVersion`、更新 `updatedAt`，并向 `demo_pet` 的小程序和 Unity 连接广播标准 `pet_status`。
5. 3 秒后把演示位置设为 `psychological_room`，再次递增版本并广播。
6. 第二阶段保持生效，不设置自动恢复计时器。
7. 重复按 F9 时，从 `picnic_lawn` 重新开始并重置 3 秒计时，但不得用演示位置覆盖首次保存的正常位置快照。
8. `pocket` 客户端断开时立即结束演示；Unity 可能同时存在 HUD 与独立场景接收器连接，因此仅在最后一个 `unity` 连接断开时结束演示。结束时恢复 F9 前保存的正常位置，递增版本，并向仍在线的 `demo_pet` 客户端广播恢复状态。
9. 因此，小程序刷新或 Unity 停止运行都会结束本次演示；重新连接后读取正常服务器状态。

## 服务端设计

演示状态与正式生活状态分开管理。服务器保留一份内存态演示上下文，至少包含：

- 是否正在演示；
- F9 前的位置快照；
- 当前演示阶段；
- 3 秒切换计时器。

服务端复用现有 `broadcastPetStatus`，不新增 WebSocket 消息类型。演示期间，正常 tick 可以继续更新心情、精力、社交和其他生活字段，但不得用整点调度覆盖演示位置。持久化时必须用首次快照替换内存中的演示位置，防止 5 秒保存任务把演示场景写入 JSON。演示结束时恢复保存的位置字段，随后正式调度继续接管。

若标准输入不是 TTY，服务器跳过快捷键注册并输出提示，不影响 HTTP、WebSocket 或定时 tick。Ctrl+C 等既有终端行为必须保持可用。

## 小程序设计

小程序继续通过现有 HTTP 与 WebSocket 权威状态入口消费 `sceneId`。新增一个只对 `demo_pet` 生效的演示视角规则：

- 收到 `picnic_lawn` 时，更新心宠真实位置，并强制设置 `currentSceneId = picnic_lawn`、`mapLevel = secondary`、`activePrimarySceneId = open_wilderness`；
- 收到 `psychological_room` 时，更新心宠真实位置，并强制设置 `currentSceneId = psychological_room`、`mapLevel = secondary`、`activePrimarySceneId = school`；
- 其他场景仍沿用“心宠位置与玩家观察视角分离”的正式规则；
- 非 `demo_pet` 用户永远不触发强制观察视角。

该规则不向服务器回写位置，也不恢复客户端本地生活调度。

## Unity 设计

Unity 由新增的独立 `PetSceneSyncReceiver` 消费同一 `pet_status.payload.status.sceneId`，不修改 `PetStatusPayload.cs`、`PetStatusSyncPanel.cs` 或 `SceneController.cs`。接收器固定映射：

- `picnic_lawn` → `SceneType.Outdoor`；
- `psychological_room` → `SceneType.CounselingRoom`。

实际加载复用现有 `SceneController.LoadScene`。接收器自身跨 Scene 持久化，并保存最后一个待切换目标；如果 3 秒后的咨询室状态在户外仍加载时到达，它会等当前加载完成后继续切换，不能丢弃咨询室状态。

接收器必须挂载在 Unity 初始 Scene 的 GameObject 上，并在 Inspector 显式配置 `Server Url`、`Pet User Id`、户外 Scene 资源和咨询室 Scene 资源。两个 Scene 使用资源引用而非手写名称；编辑器在 `OnValidate` 中保存资源路径，因此 Scene 改名或移动后重新保存配置即可同步路径。运行时接收器直接按路径异步加载目标 Scene，并通过 `DontDestroyOnLoad` 常驻。本次服务器不发送 Unity 专用场景名，也不依赖 `SceneController.sceneConfigs`。

## 并发与异常处理

- F9 连按：取消旧计时器，以最后一次按键为准。
- 3 秒内客户端断开：取消计时器并恢复正常位置，禁止延迟回调再次切到咨询室。
- 没有 `demo_pet` 状态或没有连接：不启动演示，输出可读提示。
- 非演示用户断开：不影响 `demo_pet` 演示。
- 状态版本：每次演示切换和恢复都必须产生更大的 `stateVersion`。
- 服务器关闭：演示上下文只存在内存，不写入持久化 JSON。

## 测试与验收

- [x] F9 仅改变 `demo_pet`，不改变其他用户。*(已于 2026-07-21 通过服务端自动化测试)*
- [x] 第一次广播的 `sceneId` 为 `picnic_lawn`。*(已于 2026-07-21 通过服务端自动化测试)*
- [x] 3 秒后的广播为 `psychological_room`，且没有自动恢复。*(已于 2026-07-21 通过服务端自动化测试)*
- [x] 连按 F9 不产生重叠计时器或过期回调。*(已于 2026-07-21 通过服务端自动化测试)*
- [x] 演示期间正常 tick 不覆盖演示位置。*(已于 2026-07-21 完成源码接线检查)*
- [x] Pocket 刷新或最后一个 Unity 接收连接断开后恢复演示前位置。*(已于 2026-07-21 通过服务端自动化测试)*
- [x] 小程序收到 `picnic_lawn` 后强制显示自由旷野的野餐草坪。*(已于 2026-07-21 通过小程序自动化测试)*
- [x] 小程序收到 `psychological_room` 后强制显示学校的心理咨询室。*(已于 2026-07-21 通过小程序自动化测试)*
- [x] 服务器控制台不显示 F9 的账号、地点及切换时序；触发失败时仅显示模糊提示。*(已于 2026-07-21 通过服务端自动化测试)*
- [x] 非 `demo_pet` 的服务端位置更新不强制改变玩家观察视角。*(已于 2026-07-21 通过小程序自动化测试)*
- [ ] Unity 依次收到相同版本序列的 `picnic_lawn` 与 `psychological_room`，并完成对应场景切换。

## 非目标

- 不允许小程序或 Unity 主动改变心宠权威位置。
- 不把演示位置写入持久化 JSON。
- 不为 Unity 新增专用 WebSocket 协议。
- 不修改其他用户的正常生活调度。
- 不增加可配置演示序列、管理后台或生产环境远程控制入口。
