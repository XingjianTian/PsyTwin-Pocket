# F9 心宠对话三端同步配置手册

> 适用仓库：PsyTwin-Pocket、PsyTwin-Sentinel、U3DAvatar  
> 同步用户：`demo_pet`  
> 本地服务端口：`13002`

## 1. 功能效果

心宠服务器运行后按 F9，服务器依次发布以下权威状态：

1. `0s`：进入 `picnic_lawn`，主心宠与小暖出现。
2. `0s`：进入户外场景的同时，主心宠立即说“小暖，今天的风好舒服呀。”
3. `5.2s`：小暖回答“是呀，和你聊一会儿，心情都变好了。”
4. `10s`：切换到 `psychological_room`。

Pocket、Sentinel 和 Unity 都只消费 `pet_status.payload.status.demoConversation`，台词与时序仅在 Pocket 仓库的本地心宠服务器中维护。

## 2. 环境要求

- Node.js 18 或更高版本。
- 微信开发者工具。
- Sentinel 所需的 Node.js 与数据库环境。
- Unity `2022.3.62f2c1`。
- 三端跨机调试时，所有设备需位于同一局域网，且服务器电脑防火墙允许 TCP `13002`。

## 3. 启动心宠同步服务器

在 PsyTwin-Pocket 仓库执行：

```powershell
cd server
npm install
npm start
```

服务启动后默认开启稳定演示模式，并打印 `---启动---`：`demo_pet` 始终位于教学楼（教室），但心情、能量和社交仍按服务器 tick 模拟。保持该 PowerShell 窗口处于焦点，按 F8 可关闭并打印 `---关闭---`，再次按 F8 则重新开启。按 F9 始终启动原有的场景切换模拟测试；若 F8 模式已开启，F9 会直接进入该测试序列，并在结束后恢复首次保存的位置。Unity、Pocket 或 Sentinel 没有启动时也可以触发；客户端后续连接时会读取服务器当前阶段。

如果终端不支持 TTY 原始按键输入，服务器会跳过 F8/F9 注册并在控制台给出提示。请使用普通 PowerShell 或 Windows Terminal 前台启动。

## 4. Pocket 配置

编辑 `config/index.js`：

```js
petSyncUrl: 'http://localhost:13002',
petDemoUserId: 'demo_pet',
```

如果在微信真机或另一台电脑上调试，`localhost` 必须改为运行心宠服务器的电脑局域网 IP：

```js
petSyncUrl: 'http://192.168.1.100:13002',
petDemoUserId: 'demo_pet',
```

微信开发者工具本地调试时，需要勾选“不校验合法域名、web-view、TLS 版本以及 HTTPS 证书”。真机发布时应使用已备案的 HTTPS/WSS 地址。

演示期间 Pocket 会：

- 隐藏户外场景中所有普通随机心宠。
- 左侧显示花环完整立绘的小暖。
- 右下显示 `static/pet/ExportedSprites` 主心宠序列帧。
- 只显示服务器当前指定说话者的 F9 专用对话框。

## 5. Sentinel 配置

在 PsyTwin-Sentinel 根目录的 `.env.local` 中设置心宠服务器 IP：

```dotenv
NEXT_PUBLIC_PET_SYNC_HOST="127.0.0.1"
```

跨机调试示例：

```dotenv
NEXT_PUBLIC_PET_SYNC_HOST="192.168.1.100"
```

代码会自动组装 `ws://<HOST>:13002/ws/pet`。如果 Sentinel 通过 HTTPS 打开，浏览器会禁止 `ws://` 混合内容，此时需要配置完整 WSS 地址：

```dotenv
NEXT_PUBLIC_PET_SYNC_WS_URL="wss://pet-sync.example.com/ws/pet"
```

配置修改后必须重启 Sentinel 开发服务：

```powershell
npm install
npm run dev
```

演示页面为 `stu-test` 学生的心宠页面，它会以 `demo_pet` 身份连接心宠服务器。

## 6. Unity 配置

### 6.1 场景切换

继续使用现有 `PetSceneSyncReceiver.cs`：

- `picnic_lawn` 映射到户外/Test1 场景。
- `psychological_room` 映射到心理咨询室场景。
- 确保两个 Scene 已加入 Build Settings。

### 6.2 对话接收

1. 将 `PetDemoConversationSync.cs` 放入 Unity 项目的 `Assets/_Project/Scripts/Dialogue/` 目录。
2. 在户外/Test1 场景新建一个空 GameObject，挂载 `PetDemoConversationSync`。
3. 将主心宠的 TMP Text 拖到 `Main Pet Dialogue Text`。
4. 将小暖的 TMP Text 拖到 `Companion Pet Dialogue Text`。
5. `Pet User Id` 保持 `demo_pet`。
6. 服务器与 Unity 同机时，`Server Url` 使用 `http://localhost:13002`。
7. 跨机调试时，改为 `http://<服务器局域网IP>:13002`。

两个 TMP Text 建议初始内容为空。脚本启用和离开场景时都会清空文本，当 `speaker=main` 时只写入主心宠 Text，当 `speaker=companion` 时只写入小暖 Text。

## 7. 推荐联调顺序

1. 启动 Pocket 仓库的 `server/pet-server.js`。
2. 启动 Pocket，确认心宠页可连接。
3. 启动 Sentinel，打开 `stu-test` 心宠页面。
4. 启动 Unity，确保 `PetSceneSyncReceiver` 已连接。
5. 回到心宠服务器终端，按 F9。
6. 确认三端依次显示户外、两句固定对话和心理咨询室。

## 8. 常见问题

### F9 没反应

- 确认运行服务的终端处于焦点。
- 确认使用的是支持 TTY 的 PowerShell/Windows Terminal。
- 确认服务器中已存在 `demo_pet` 状态。

### Pocket 或 Sentinel 没有同步

- 不要在真机上使用 `localhost`。
- 在浏览器开发者工具中检查 WebSocket 是否连接到 `/ws/pet`。
- 确认用户 ID 为 `demo_pet`。
- 确认防火墙开放 `13002`。

### Unity 切换场景但没有文字

- 确认 `PetDemoConversationSync` 挂在实际加载的户外/Test1 场景中。
- 确认两个 Inspector TMP Text 引用已拖入。
- 确认 TMP Text 对象和 Canvas 处于激活状态。
- 确认 `Server Url` 与 `Pet User Id` 和其他两端一致。

### 小暖没说完就切场景

当前服务器固定在 `5.2s` 发布小暖台词，`10s` 切场景，回复保留 `4.8s`。如果本地表现不一致，先停止旧服务器进程，再用最新代码重启 `npm start`。

## 9. 验证命令

Pocket 同步回归测试：

```powershell
npm run test:pet-sync
```

Sentinel 实时消息解析测试：

```powershell
node --import tsx --test lib/pet-live-sync.test.ts
npm run build
```
