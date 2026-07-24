# 心宠所在地跨端显示同步 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让小程序按服务端 `sceneId` 更新心宠真实所在地但保留玩家观察视角，并让 Unity HUD 显示相同的原始 `sceneId`。

**Architecture:** 服务端仍是唯一状态源。Pocket 将 HTTP 与 WebSocket 状态归一化后交给同一位置应用逻辑，严格分离 `petSceneId` 与 `currentSceneId`；Unity 复用现有 `PetState.sceneId` 和 `ApplyState`，仅增加一个 TextMesh Pro 文本绑定。

**Tech Stack:** 微信小程序 JavaScript、Node.js `node:test`、Unity 2022.3.62f2c1、C#、TextMesh Pro、Unity Test Framework

## Global Constraints

- Pocket 只消费服务端状态，不新增 Node.js、Prisma 或 Next.js 服务端逻辑。
- 真实字段只能来自 Sentinel `docs/api_contract.md`，不得在客户端新增推测字段。
- `petSceneId` 是服务端权威位置；`currentSceneId` 是玩家观察视角，两者不得互相覆盖。
- Unity 只显示原始 `sceneId`，不做中文映射，不切换实际 Unity Scene。
- 保留两个工作区中所有现有未提交改动；不得覆盖 Unity 场景、预制体或 Pocket `server/pet-server.js` 的用户改动。
- 每个仓库的 commit/push 都必须先获得用户一次确认；计划中的提交步骤是待确认操作，不得自动执行。

---

### Task 1: Pocket 权威位置补丁

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/utils/pet-sync.test.cjs`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/utils/pet-sync.js`

**Interfaces:**
- Consumes: `PetState` 风格对象和可选的 `{ name, icon }` 场景信息。
- Produces: `createPetLocationPatch(state, sceneInfo): object`，返回仅属于心宠的显示字段，不返回 `currentSceneId`。

- [x] **Step 1: 写入失败测试** *(已于 2026-07-20 验证测试因函数缺失而失败)*

在 `utils/pet-sync.test.cjs` 导入 `createPetLocationPatch`，并添加：

```javascript
test('builds a server-owned pet location patch without changing the observer scene', () => {
  const patch = createPetLocationPatch(
    {
      sceneId: 'teaching_building',
      activity: '正在上课',
      activityStartTime: 1000,
      activityDuration: 45,
    },
    { name: '教学楼', icon: '🏫' },
  );

  assert.deepEqual(patch, {
    petSceneId: 'teaching_building',
    petSceneName: '教学楼',
    petActivity: '正在上课',
    activityStartTime: 1000,
    currentActivityDuration: 45,
  });
  assert.equal(Object.hasOwn(patch, 'currentSceneId'), false);
});

test('does not replace the last valid location with an empty scene id', () => {
  assert.deepEqual(createPetLocationPatch({ sceneId: '' }, null), {});
});
```

- [x] **Step 2: 运行测试并确认因函数缺失而失败** *(已于 2026-07-20 完成红灯验证)*

Run:

```powershell
npm run test:pet-sync
```

Expected: FAIL，错误指出 `createPetLocationPatch` 未定义或不是函数。

- [x] **Step 3: 实现最小位置补丁函数** *(已于 2026-07-20 完成)*

在 `utils/pet-sync.js` 添加并导出：

```javascript
function createPetLocationPatch(state = {}, sceneInfo = null) {
  if (!state.sceneId) {
    return {};
  }

  return {
    petSceneId: state.sceneId,
    petSceneName: sceneInfo ? sceneInfo.name : state.sceneId,
    petActivity: state.activity,
    activityStartTime: state.activityStartTime,
    currentActivityDuration: state.activityDuration,
  };
}
```

并在 `module.exports` 中加入 `createPetLocationPatch`。

- [x] **Step 4: 运行同步测试并确认通过** *(已于 2026-07-20 通过 8 项同步测试)*

Run:

```powershell
npm run test:pet-sync
```

Expected: 所有 `server/pet-state.test.cjs` 与 `utils/pet-sync.test.cjs` 测试 PASS。

- [ ] **Step 5: 经用户确认后提交 Pocket 工具层改动**

```powershell
git add utils/pet-sync.js utils/pet-sync.test.cjs
git commit -m "feat: add authoritative pet location patch"
```

### Task 2: Pocket HTTP 与 WebSocket 共用位置应用逻辑

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/pages/pet/index.js:1479`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/pages/pet/index.js:1590`
- Test: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/utils/pet-sync.test.cjs`

**Interfaces:**
- Consumes: Task 1 的 `createPetLocationPatch(state, sceneInfo)`、现有 `normalizePetStatus` 与 `shouldApplyPetStatus`。
- Produces: 页面方法 `applyAuthoritativePetStatus(status, extraPatch = {})`，HTTP 与 WebSocket 均调用它。

- [x] **Step 1: 为 WebSocket 归一化补充测试** *(已于 2026-07-20 完成)*

在 `utils/pet-sync.test.cjs` 添加：

```javascript
test('normalizes a websocket status payload for the shared apply path', () => {
  const result = normalizePetStatus({
    state: { sceneId: 'classroom', stateVersion: 14 },
    serverTime: 8000,
    updatedAt: 7990,
    stateVersion: 14,
  });

  assert.equal(result.state.sceneId, 'classroom');
  assert.equal(result.stateVersion, 14);
});
```

- [x] **Step 2: 临时加入当前页面行为的静态断言并确认失败** *(已于 2026-07-20 完成红灯验证)*

在测试中读取 `pages/pet/index.js`，断言 WebSocket 处理器调用共享方法，且位置补丁不写
`currentSceneId`：

```javascript
const fs = require('node:fs');
const path = require('node:path');

test('routes websocket pet status through the authoritative apply method', () => {
  const pageSource = fs.readFileSync(
    path.join(__dirname, '..', 'pages', 'pet', 'index.js'),
    'utf8',
  );

  assert.match(pageSource, /applyAuthoritativePetStatus\(status/);
  assert.doesNotMatch(pageSource, /currentSceneId:\s*state\.sceneId/);
});
```

Run:

```powershell
npm run test:pet-sync
```

Expected: FAIL，因为当前 HTTP 路径仍含 `currentSceneId: state.sceneId`，且 WebSocket 处理器未使用共享方法。

- [x] **Step 3: 导入位置补丁并新增共享应用方法** *(已于 2026-07-20 完成)*

在 `pages/pet/index.js` 的同步工具导入中加入 `createPetLocationPatch`，并新增：

```javascript
applyAuthoritativePetStatus(status, extraPatch = {}) {
  if (!shouldApplyPetStatus(this.data.petStateVersion, status.stateVersion)) {
    return false;
  }

  const { state } = status;
  const sceneInfo = this.getSceneInfo(state.sceneId);
  const locationPatch = createPetLocationPatch(state, sceneInfo);

  this.setData({
    mood: typeof state.mood === 'number' ? state.mood : this.data.mood,
    energy: typeof state.energy === 'number' ? state.energy : this.data.energy,
    social: typeof state.social === 'number' ? state.social : this.data.social,
    petStateVersion: status.stateVersion,
    ...locationPatch,
    ...extraPatch,
  }, () => {
    if (locationPatch.petSceneId) {
      this.updatePetMarker();
    }
  });

  return true;
}
```

- [x] **Step 4: 让 WebSocket 使用共享方法** *(已于 2026-07-20 完成)*

将 `pet_status` 监听器替换为归一化完整状态的处理：

```javascript
ws.on('pet_status', (payload) => {
  const { status: state, serverTime, updatedAt, stateVersion } = payload || {};
  if (!state) {
    return;
  }

  const status = normalizePetStatus({
    state,
    serverTime,
    updatedAt,
    stateVersion: Math.max(Number(stateVersion) || 0, Number(state.stateVersion) || 0),
  });
  this.applyAuthoritativePetStatus(status);
});
```

- [x] **Step 5: 让 HTTP 使用共享方法且不改变观察视角** *(已于 2026-07-20 完成)*

在 `syncFromServer()` 中保留帮助事件、背包、日记等现有整理逻辑，把权威实时字段交给
`applyAuthoritativePetStatus`。传入的 `extraPatch` 仅包含非实时扩展数据：

```javascript
const applied = this.applyAuthoritativePetStatus(status, {
  activityLog: state.activityLog || this.data.activityLog,
  coins: typeof state.coins === 'number' ? state.coins : this.data.coins,
  bagItems: this.enrichBagItems(state.bagItems || this.data.bagItems),
  diaryDataMap: state.diaryDataMap || this.data.diaryDataMap,
  helpEvents: syncedHelpEvents.length > 0 ? syncedHelpEvents : this.data.helpEvents,
  hasEvent: syncedHelpEvents.length > 0 || this.data.helpEvents.length > 0,
  helpLoading: false,
});

if (!applied) {
  return;
}
```

删除原来的 `currentSceneId: state.sceneId`、`currentScene` 和 `currentSceneIcon` 服务端覆盖；玩家观察视角保持不变。

- [x] **Step 6: 运行 Pocket 测试和目标 lint** *(已于 2026-07-20 完成；10 项测试通过，lint 保留页面既有 51 项错误)*

Run:

```powershell
npm run test:pet-sync
npx eslint pages/pet/index.js utils/pet-sync.js utils/pet-sync.test.cjs --no-eslintrc -c ./.eslintrc.js
```

Expected: 测试全部 PASS；ESLint 对目标文件无新增错误。若仓库既有规则不支持 `.cjs`，单独记录该既有限制，仍需保证两个 `.js` 文件 lint 通过。

- [ ] **Step 7: 在微信开发者工具手动验收观察视角分离**

1. 用 `demo_pet` 打开心宠页并进入一个与服务端 `sceneId` 不同的观察场景；
2. 让服务端广播新的 `sceneId`；
3. 确认当前背景和 `currentSceneId` 不变；
4. 确认地图标记移动到新位置；
5. 进入新位置后确认心宠精灵出现；
6. 断开 WebSocket，确认下一次 HTTP 轮询仍产生相同行为。

- [ ] **Step 8: 经用户确认后提交 Pocket 页面改动**

```powershell
git add pages/pet/index.js utils/pet-sync.js utils/pet-sync.test.cjs
git commit -m "feat: sync authoritative pet location"
```

### Task 3: Unity HUD 显示原始 sceneId

**Files:**
- Create: `C:/projects/U3DAvatar/Assets/_Project/Scripts/UI/PetStatus/PsyTwin.PetStatus.asmdef`
- Create: `C:/projects/U3DAvatar/Assets/_Project/Tests/EditMode/PsyTwin.PetStatus.EditModeTests.asmdef`
- Create: `C:/projects/U3DAvatar/Assets/_Project/Tests/EditMode/PetStatusSyncPanelTests.cs`
- Modify: `C:/projects/U3DAvatar/Assets/_Project/Scripts/UI/PetStatus/PetStatusSyncPanel.cs`
- Inspect only: `C:/projects/U3DAvatar/Assets/_Project/Scripts/UI/PetStatus/PetStatusPayload.cs`

**Interfaces:**
- Consumes: 现有 `PetState.sceneId` 和 `PetStatusSyncPanel.ApplyState(PetState)`。
- Produces: Inspector 字段 `sceneText: TMP_Text`；HTTP 与 WebSocket 状态应用后显示原始 `sceneId`。

- [x] **Step 1: 建立最小测试程序集** *(已于 2026-07-20 完成)*

`PsyTwin.PetStatus.asmdef`：

```json
{
  "name": "PsyTwin.PetStatus",
  "rootNamespace": "PsyTwin.PetStatus",
  "references": [
    "Unity.TextMeshPro"
  ]
}
```

`PsyTwin.PetStatus.EditModeTests.asmdef`：

```json
{
  "name": "PsyTwin.PetStatus.EditModeTests",
  "rootNamespace": "PsyTwin.PetStatus.Tests",
  "references": [
    "PsyTwin.PetStatus",
    "Unity.TextMeshPro"
  ],
  "includePlatforms": [
    "Editor"
  ],
  "optionalUnityReferences": [
    "TestAssemblies"
  ]
}
```

- [x] **Step 2: 写入失败的 Unity EditMode 测试** *(已于 2026-07-20 完成)*

创建 `PetStatusSyncPanelTests.cs`：

```csharp
using System.Reflection;
using NUnit.Framework;
using TMPro;
using UnityEngine;

namespace PsyTwin.PetStatus.Tests
{
    public class PetStatusSyncPanelTests
    {
        [Test]
        public void ApplyState_WritesRawSceneIdToConfiguredText()
        {
            var panelObject = new GameObject("PetStatusSyncPanel Test");
            var textObject = new GameObject("Scene Text");

            try
            {
                var panel = panelObject.AddComponent<PetStatusSyncPanel>();
                var sceneText = textObject.AddComponent<TextMeshProUGUI>();
                var sceneTextField = typeof(PetStatusSyncPanel).GetField(
                    "sceneText",
                    BindingFlags.Instance | BindingFlags.NonPublic);

                Assert.That(sceneTextField, Is.Not.Null);
                sceneTextField.SetValue(panel, sceneText);

                var applyState = typeof(PetStatusSyncPanel).GetMethod(
                    "ApplyState",
                    BindingFlags.Instance | BindingFlags.NonPublic);
                applyState.Invoke(panel, new object[]
                {
                    new PetState { sceneId = "teaching_building" },
                });

                Assert.That(sceneText.text, Is.EqualTo("teaching_building"));
            }
            finally
            {
                Object.DestroyImmediate(textObject);
                Object.DestroyImmediate(panelObject);
            }
        }
    }
}
```

- [x] **Step 3: 运行 Unity 测试并确认因 `sceneText` 缺失而失败** *(已于 2026-07-20 在当前 Unity Test Runner 完成红灯验证)*

Run（将 Unity.exe 路径替换为本机 Unity 2022.3.62f2c1 的实际安装路径）：

```powershell
Unity.exe -batchmode -quit -projectPath C:\projects\U3DAvatar -runTests -testPlatform EditMode -testResults Logs\EditModeResults.xml
```

Expected: `ApplyState_WritesRawSceneIdToConfiguredText` FAIL，`sceneTextField` 为 null。

- [x] **Step 4: 实现最小 Unity HUD 更新** *(已于 2026-07-20 完成)*

在 `PetStatusSyncPanel.cs` 的“状态显示”字段中添加：

```csharp
[SerializeField] private TMP_Text sceneText;
```

在现有 `ApplyState` 末尾添加：

```csharp
SetText(sceneText, state.sceneId ?? string.Empty);
```

同时把 HTTP 与 WebSocket 成功日志末尾补充：

```csharp
+ $" sceneId={state.sceneId}"
```

`PetStatusPayload.cs` 已包含 `sceneId`，不得重复新增字段或改变 JSON 名称。

- [x] **Step 5: 运行 Unity EditMode 测试并确认通过** *(已于 2026-07-20 在 Unity Test Runner 验证 1/1 通过)*

Run:

```powershell
Unity.exe -batchmode -quit -projectPath C:\projects\U3DAvatar -runTests -testPlatform EditMode -testResults Logs\EditModeResults.xml
```

Expected: `ApplyState_WritesRawSceneIdToConfiguredText` PASS，项目无编译错误。

- [ ] **Step 6: 在 Inspector 配置并手动联调**

1. 在现有 HUD Canvas 新增或选择一个 TextMesh Pro 文本；
2. 选择挂载 `PetStatusSyncPanel` 的对象；
3. 把该文本拖入新增的 `Scene Text` 字段；
4. 保持 `Server Url` 与 Pocket 指向同一个服务端；
5. 保持 `Pet User Id` 与 Pocket 相同，例如 `demo_pet`；
6. 进入 Play Mode，确认文本显示服务端原始值，例如 `teaching_building`；
7. 服务端改变位置后，确认 WebSocket 或下一次 HTTP 轮询更新文本。

- [ ] **Step 7: 经用户确认后提交 Unity 代码和测试**

仅暂存本任务文件，不暂存当前工作区中的场景、字体、对话或其他用户改动：

```powershell
git add Assets/_Project/Scripts/UI/PetStatus/PetStatusSyncPanel.cs Assets/_Project/Scripts/UI/PetStatus/PsyTwin.PetStatus.asmdef Assets/_Project/Tests/EditMode/PsyTwin.PetStatus.EditModeTests.asmdef Assets/_Project/Tests/EditMode/PetStatusSyncPanelTests.cs
git commit -m "Add pet scene id HUD sync"
```

### Task 4: 契约、OpenSpecs 与跨端验收同步

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/PET_CROSS_PLATFORM_SYNC.md`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/PET_WEBSOCKET_SYNC.md`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/docs/api_contract.md`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/superpowers/plans/2026-07-20-pet-location-display-sync.md`

**Interfaces:**
- Consumes: Task 2 和 Task 3 的测试、手动联调结果。
- Produces: 与实际代码一致的权威 API/WebSocket 契约和已完成任务状态。

- [x] **线上旧响应兼容补充** *(已于 2026-07-20 发现线上状态直接位于 `data` 下，完成失败测试、兼容实现并验证 11 项 Pocket 测试通过)*

- [x] **Step 1: 补全 Sentinel 权威契约** *(已于 2026-07-20 完成)*

在 Sentinel `docs/api_contract.md` 记录：

```markdown
### 心宠权威状态

`GET /api/pet/status?userId={userId}` 返回完整 `state`。`state.sceneId` 是心宠真实所在地，
`stateVersion` 是单调递增版本。客户端不得把观察视角作为心宠位置回写。

WebSocket `/ws/pet?userId={userId}&clientType={pocket|unity}` 的 `pet_status` 消息在
`payload.status.sceneId` 返回相同的原始场景 ID。
```

- [x] **Step 2: 统一两份 Pocket 同步文档** *(已于 2026-07-20 完成)*

明确区分“Unity WebSocket 传输已接入”和“Unity 所在地 HUD 已接入”，删除或改写互相矛盾的状态。

- [ ] **Step 3: 执行端到端验收**

1. 服务端、Pocket 和 Unity 都使用 `demo_pet`；
2. 确认服务端已经返回 `data.state`、`stateVersion` 与 `updatedAt`；
3. 记录同一条 `stateVersion` 的 `sceneId`；
4. 确认 Pocket 的 `petSceneId`、地图标记和 Unity HUD 原始字符串一致；
5. Pocket 切换观察场景后，确认 Unity HUD 和 Pocket `petSceneId` 均不改变；
6. 服务端再次切换位置，确认两端更新且 Pocket 观察视角保持不变。

- [ ] **Step 4: 回写 OpenSpecs 状态**

所有验收通过后，将相关条目改为：

```markdown
- [x] 小程序区分玩家观察视角与服务端权威心宠位置。*(已于 2026-07-20 联调通过)*
- [x] 小程序 HTTP 与 WebSocket 共用心宠位置应用逻辑。*(已于 2026-07-20 联调通过)*
- [x] Unity HUD 显示服务端原始 `sceneId`。*(已于 2026-07-20 联调通过)*
```

若任一验收未通过，保持 `- [ ]` 并记录具体阻塞原因，不得提前标记完成。

- [ ] **Step 5: 经用户确认后分别提交文档**

Pocket：

```powershell
git add docs/PET_CROSS_PLATFORM_SYNC.md docs/PET_WEBSOCKET_SYNC.md docs/superpowers/specs/2026-07-20-pet-location-display-sync-design.md docs/superpowers/plans/2026-07-20-pet-location-display-sync.md
git commit -m "docs: document pet location display sync"
```

Sentinel：

```powershell
git add docs/api_contract.md
git commit -m "docs: define authoritative pet location status"
```
