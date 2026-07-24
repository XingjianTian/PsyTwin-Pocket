# demo_pet Scene Hotkey Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 按下本地服务器 F9 后，让 `demo_pet` 立即同步到野餐草坪，3 秒后同步到心理咨询室，并让小程序观察视角与 Unity 实际场景一起切换。

**Architecture:** 新建可独立测试的服务端演示控制器，临时覆盖 `demo_pet` 的内存位置并复用标准 `pet_status` 广播。Pocket 在共享权威状态入口为两个演示位置生成强制观察视角补丁。Unity 在初始 Scene 显式挂载 `PetSceneSyncReceiver`，通过 Inspector 拖入两个 Scene 资源和配置服务器地址；接收器跨场景常驻、保存最后一个待切换目标并按资源路径异步加载。既有 HUD 两个脚本与 `SceneController` 均不修改。

**Tech Stack:** Node.js、Express、ws、`node:test`、微信小程序 JavaScript、Unity 2022.3.62f2c1、C#、Unity Test Framework。

## Global Constraints

- 快捷键固定为 F9，且仅影响 `demo_pet`。
- 演示序列固定为 `picnic_lawn`，3 秒后 `psychological_room`，第二阶段不自动恢复。
- 小程序收到演示位置时必须切到游戏视图和对应二级场景；其他状态仍保持“心宠位置与玩家观察视角分离”。
- 小程序刷新、Unity 停止运行或任一 `demo_pet` WebSocket 断开时结束整次演示并恢复首次快照。
- 复用 `pet_status`，不增加客户端控制接口或 Unity 专用网络协议。
- 演示上下文只保存在内存，不写入持久化 JSON。
- Pocket 只使用 JavaScript；缩进 2 空格；单引号、分号和尾随逗号。
- 不覆盖 Pocket、Unity 工作区中与本功能无关的现有修改。
- Git commit/push 必须在全部工作完成后单独获得用户确认；本计划中的提交信息仅作为建议，不自动执行。

---

### Task 1: 可测试的服务端演示控制器

**Files:**
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/server/pet-demo-scene.js`
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/server/pet-demo-scene.test.cjs`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/package.json`

**Interfaces:**
- Consumes: `getState(userId)`, `getClientCount(userId)`, `broadcast(userId, state)`, `getActivity(sceneId)` 依赖注入函数。
- Produces: `createPetDemoSceneController(options)`，返回 `{ trigger(), stop(reason), isActive(), isLocationLocked(userId), getPersistableState(userId, state) }`。

- [x] **Step 1: 为固定序列、版本递增和保持状态编写失败测试** *(已于 2026-07-21 完成)*

在 `server/pet-demo-scene.test.cjs` 创建带假时钟的测试夹具：

```javascript
const test = require('node:test');
const assert = require('node:assert/strict');
const { createPetDemoSceneController } = require('./pet-demo-scene');

function createFixture() {
  const state = {
    userId: 'demo_pet',
    sceneId: 'library',
    activity: '阅读',
    activityStartTime: 100,
    activityDuration: 20,
    stateVersion: 7,
    updatedAt: 100,
  };
  const broadcasts = [];
  const timers = [];
  let now = 1000;
  const controller = createPetDemoSceneController({
    getState: (userId) => (userId === 'demo_pet' ? state : null),
    getClientCount: () => 2,
    broadcast: (userId, nextState) => broadcasts.push({ userId, sceneId: nextState.sceneId }),
    getActivity: (sceneId) => `activity:${sceneId}`,
    now: () => now,
    setTimer: (callback, delay) => {
      const timer = { callback, delay, cancelled: false };
      timers.push(timer);
      return timer;
    },
    clearTimer: (timer) => { timer.cancelled = true; },
  });
  return { state, broadcasts, timers, controller, setNow: (value) => { now = value; } };
}

test('broadcasts picnic lawn immediately and counseling room after three seconds', () => {
  const fixture = createFixture();
  assert.equal(fixture.controller.trigger(), true);
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  assert.equal(fixture.timers[0].delay, 3000);

  fixture.setNow(4000);
  fixture.timers[0].callback();
  assert.equal(fixture.state.sceneId, 'psychological_room');
  assert.deepEqual(fixture.broadcasts.map((entry) => entry.sceneId), [
    'picnic_lawn',
    'psychological_room',
  ]);
  assert.equal(fixture.controller.isActive(), true);
});
```

- [x] **Step 2: 为恢复、F9 连按和用户隔离编写失败测试** *(已于 2026-07-21 完成)*

追加测试，明确首次快照不能被第二次 F9 覆盖：

```javascript
test('restarts the sequence without replacing the original snapshot', () => {
  const fixture = createFixture();
  fixture.controller.trigger();
  const firstTimer = fixture.timers[0];
  fixture.controller.trigger();

  assert.equal(firstTimer.cancelled, true);
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  fixture.controller.stop('client_disconnected');
  assert.equal(fixture.state.sceneId, 'library');
  assert.equal(fixture.state.activity, '阅读');
});

test('locks only the demo pet while active', () => {
  const fixture = createFixture();
  fixture.controller.trigger();
  assert.equal(fixture.controller.isLocationLocked('demo_pet'), true);
  assert.equal(fixture.controller.isLocationLocked('another_user'), false);
});

test('persists the original location while the in-memory demo override is active', () => {
  const fixture = createFixture();
  fixture.controller.trigger();
  const persisted = fixture.controller.getPersistableState('demo_pet', fixture.state);
  assert.equal(persisted.sceneId, 'library');
  assert.equal(fixture.state.sceneId, 'picnic_lawn');
  assert.notEqual(persisted, fixture.state);
});
```

- [x] **Step 3: 运行测试并确认因模块缺失而失败** *(已于 2026-07-21 确认失败)*

Run:

```powershell
node --test server/pet-demo-scene.test.cjs
```

Expected: FAIL，提示找不到 `./pet-demo-scene`。

- [x] **Step 4: 实现最小演示控制器** *(已于 2026-07-21 完成)*

在 `server/pet-demo-scene.js` 实现：

```javascript
const DEMO_USER_ID = 'demo_pet';
const OUTDOOR_SCENE_ID = 'picnic_lawn';
const COUNSELING_SCENE_ID = 'psychological_room';
const DEMO_DELAY_MS = 3000;

const LOCATION_FIELDS = [
  'sceneId',
  'activity',
  'activityStartTime',
  'activityDuration',
];

function createPetDemoSceneController(options) {
  const {
    getState,
    getClientCount,
    broadcast,
    getActivity,
    now = Date.now,
    setTimer = setTimeout,
    clearTimer = clearTimeout,
  } = options;
  let snapshot = null;
  let timer = null;

  const applyScene = (state, sceneId) => {
    const timestamp = now();
    state.sceneId = sceneId;
    state.activity = getActivity(sceneId);
    state.activityStartTime = timestamp;
    state.activityDuration = sceneId === COUNSELING_SCENE_ID ? 30 : 10;
    state.stateVersion = (state.stateVersion || 0) + 1;
    state.updatedAt = timestamp;
    broadcast(DEMO_USER_ID, state);
  };

  const trigger = () => {
    const state = getState(DEMO_USER_ID);
    if (!state || getClientCount(DEMO_USER_ID) === 0) return false;
    if (!snapshot) {
      snapshot = Object.fromEntries(LOCATION_FIELDS.map((field) => [field, state[field]]));
    }
    if (timer) clearTimer(timer);
    applyScene(state, OUTDOOR_SCENE_ID);
    timer = setTimer(() => {
      timer = null;
      if (!snapshot) return;
      applyScene(state, COUNSELING_SCENE_ID);
    }, DEMO_DELAY_MS);
    return true;
  };

  const stop = () => {
    if (!snapshot) return false;
    const state = getState(DEMO_USER_ID);
    if (timer) clearTimer(timer);
    timer = null;
    if (state) {
      Object.assign(state, snapshot);
      state.stateVersion = (state.stateVersion || 0) + 1;
      state.updatedAt = now();
      broadcast(DEMO_USER_ID, state);
    }
    snapshot = null;
    return true;
  };

  return {
    trigger,
    stop,
    isActive: () => snapshot !== null,
    isLocationLocked: (userId) => userId === DEMO_USER_ID && snapshot !== null,
    getPersistableState: (userId, state) => {
      if (userId !== DEMO_USER_ID || !snapshot) return state;
      return { ...state, ...snapshot };
    },
  };
}

module.exports = {
  COUNSELING_SCENE_ID,
  DEMO_DELAY_MS,
  DEMO_USER_ID,
  OUTDOOR_SCENE_ID,
  createPetDemoSceneController,
};
```

- [x] **Step 5: 将新测试纳入统一命令并验证** *(已于 2026-07-21 完成)*

把 `package.json` 的脚本改为：

```json
"test:pet-sync": "node --test server/pet-state.test.cjs server/pet-demo-scene.test.cjs utils/pet-sync.test.cjs"
```

Run: `npm run test:pet-sync`

Expected: 所有测试 PASS，退出码 0。

### Task 2: F9、tick 锁定与断开恢复集成

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/server/pet-server.js`
- Test: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/server/pet-demo-scene.test.cjs`

**Interfaces:**
- Consumes: Task 1 的 `createPetDemoSceneController`。
- Produces: 本地终端 F9 触发、演示期间位置锁定、`demo_pet` WebSocket 断开恢复。

- [x] **Step 1: 增加服务器集成源码断言** *(已于 2026-07-21 完成)*

在 `server/pet-demo-scene.test.cjs` 读取 `pet-server.js` 并断言存在以下接线：

```javascript
const fs = require('node:fs');
const path = require('node:path');

test('server wires F9, tick locking, and disconnect cleanup', () => {
  const source = fs.readFileSync(path.join(__dirname, 'pet-server.js'), 'utf8');
  assert.match(source, /key\.name === 'f9'/);
  assert.match(source, /isLocationLocked\(userId\)/);
  assert.match(source, /demoSceneController\.stop\('client_disconnected'\)/);
});
```

- [x] **Step 2: 运行测试并确认集成断言失败** *(已于 2026-07-21 确认失败)*

Run: `node --test server/pet-demo-scene.test.cjs`

Expected: FAIL，指出 F9、位置锁或断开恢复尚未接线。

- [x] **Step 3: 在服务器创建控制器并保护正常调度** *(已于 2026-07-21 完成)*

在 `pet-server.js` 导入 `node:readline` 与控制器，在 `broadcastPetStatus` 后创建：

```javascript
const readline = require('node:readline');
const { createPetDemoSceneController } = require('./pet-demo-scene');

demoSceneController = createPetDemoSceneController({
  getState: (userId) => petData.get(userId),
  getClientCount: (userId) => petClients.get(userId)?.size || 0,
  broadcast: broadcastPetStatus,
  getActivity: getActivityByScene,
});
```

在 `saveData` 所在作用域预先声明 `let demoSceneController = null`，创建时赋值；序列化每个用户前使用：

```javascript
const persistableState = demoSceneController
  ? demoSceneController.getPersistableState(userId, state)
  : state;
persistent[userId] = serializeState(persistableState);
```

这样 HTTP 与 WebSocket 使用内存中的演示位置，但每 5 秒保存时仍写入 F9 前的位置。

把整点位置切换条件改为：

```javascript
if (!demoSceneController.isLocationLocked(userId) && hour !== ctx.lastTickHour) {
```

情绪、精力、社交和版本 tick 保持原行为。

- [x] **Step 4: 注册 F9 并保留 Ctrl+C** *(已于 2026-07-21 完成)*

新增 `registerDemoHotkey()`：

```javascript
function registerDemoHotkey() {
  if (!process.stdin.isTTY) {
    console.log('[PetDemo] 标准输入不是 TTY，已跳过 F9 快捷键');
    return;
  }
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('keypress', (input, key = {}) => {
    if (key.ctrl && key.name === 'c') {
      process.kill(process.pid, 'SIGINT');
      return;
    }
    if (key.name === 'f9') {
      const started = demoSceneController.trigger();
      console.log(started
        ? '[PetDemo] F9：demo_pet → 野餐草坪 → 3秒后心理咨询室'
        : '[PetDemo] F9 未触发：请先连接 demo_pet');
    }
  });
}
```

在服务器成功监听回调中调用 `registerDemoHotkey()`，并打印 F9 使用说明。

- [x] **Step 5: 在身份切换和 socket close 时终止演示** *(已于 2026-07-21 完成，并适配 Unity 多连接)*

在从 `demo_pet` 切换到其他 userId 之前，以及 `socket.on('close')` 删除连接前调用：

```javascript
if (userId === 'demo_pet') {
  demoSceneController.stop('client_disconnected');
}
```

控制器的 `stop` 必须幂等，第二个连接随后关闭时不得重复恢复或广播。

- [x] **Step 6: 运行服务端测试和语法检查** *(已于 2026-07-21 通过)*

Run:

```powershell
npm run test:pet-sync
node --check server/pet-demo-scene.js
node --check server/pet-server.js
```

Expected: 全部退出码 0。

### Task 3: 小程序强制演示观察视角

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/utils/pet-sync.js`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/utils/pet-sync.test.cjs`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/pages/pet/index.js`

**Interfaces:**
- Consumes: `userId`、服务端 `state.sceneId` 和 `sceneInfo`。
- Produces: `createDemoObserverPatch(userId, state, sceneInfo)`；只为 `demo_pet` 的两个演示场景返回强制视角补丁。

- [x] **Step 1: 编写强制视角映射失败测试** *(已于 2026-07-21 完成)*

在 `utils/pet-sync.test.cjs` 导入 `createDemoObserverPatch` 并添加：

```javascript
test('forces demo_pet to the picnic lawn game view', () => {
  assert.deepEqual(
    createDemoObserverPatch(
      'demo_pet',
      { sceneId: 'picnic_lawn' },
      { name: '野餐草坪', icon: '🧺' },
    ),
    {
      currentView: 'game',
      currentSceneId: 'picnic_lawn',
      currentScene: '野餐草坪',
      currentSceneIcon: '🧺',
      mapLevel: 'secondary',
      activePrimarySceneId: 'open_wilderness',
    },
  );
});

test('forces demo_pet to the school counseling room game view', () => {
  const patch = createDemoObserverPatch(
    'demo_pet',
    { sceneId: 'psychological_room' },
    { name: '心理咨询室', icon: '💬' },
  );
  assert.equal(patch.currentSceneId, 'psychological_room');
  assert.equal(patch.activePrimarySceneId, 'school');
  assert.equal(patch.currentView, 'game');
});

test('does not force the observer for normal users or normal scenes', () => {
  assert.deepEqual(createDemoObserverPatch('another_user', { sceneId: 'picnic_lawn' }), {});
  assert.deepEqual(createDemoObserverPatch('demo_pet', { sceneId: 'library' }), {});
});
```

- [x] **Step 2: 运行测试并确认函数缺失** *(已于 2026-07-21 确认失败)*

Run: `node --test utils/pet-sync.test.cjs`

Expected: FAIL，提示 `createDemoObserverPatch` 未定义。

- [x] **Step 3: 实现演示视角补丁** *(已于 2026-07-21 完成)*

在 `utils/pet-sync.js` 增加：

```javascript
const DEMO_OBSERVER_SCENES = {
  picnic_lawn: 'open_wilderness',
  psychological_room: 'school',
};

function createDemoObserverPatch(userId, state = {}, sceneInfo = null) {
  const parentSceneId = DEMO_OBSERVER_SCENES[state.sceneId];
  if (userId !== 'demo_pet' || !parentSceneId) return {};
  return {
    currentView: 'game',
    currentSceneId: state.sceneId,
    currentScene: sceneInfo ? sceneInfo.name : state.sceneId,
    currentSceneIcon: sceneInfo ? sceneInfo.icon : '🌲',
    mapLevel: 'secondary',
    activePrimarySceneId: parentSceneId,
  };
}
```

并把它加入 `module.exports`。

- [x] **Step 4: 在共享权威状态入口合并补丁** *(已于 2026-07-21 完成)*

在 `pages/pet/index.js` 导入函数，并在 `applyAuthoritativePetStatus` 中使用：

```javascript
const userId = this.getPetUserId();
const observerPatch = createDemoObserverPatch(userId, state, sceneInfo);

this.setData({
  mood: typeof state.mood === 'number' ? state.mood : this.data.mood,
  energy: typeof state.energy === 'number' ? state.energy : this.data.energy,
  social: typeof state.social === 'number' ? state.social : this.data.social,
  petStateVersion: status.stateVersion,
  ...locationPatch,
  ...observerPatch,
  ...extraPatch,
}, () => {
  if (locationPatch.petSceneId) this.updatePetMarker();
});
```

HTTP 与 WebSocket 已共用此方法，不新增第二套处理逻辑。

- [x] **Step 5: 更新旧的“永不修改观察视角”源码断言** *(已于 2026-07-21 完成)*

将旧测试改为验证只有 `createDemoObserverPatch` 能提供演示补丁，并保留普通场景返回空对象的断言；禁止在 WebSocket 或 HTTP 处理器中直接写死 `currentSceneId`。

- [x] **Step 6: 运行测试与目标 lint** *(已于 2026-07-21 通过)*

Run:

```powershell
npm run test:pet-sync
npx eslint utils/pet-sync.js utils/pet-sync.test.cjs server/pet-demo-scene.js server/pet-demo-scene.test.cjs
```

Expected: 测试全部 PASS；目标 lint 退出码 0。

### Task 4: Unity 原始 sceneId 驱动实际场景

**Files:**
- Create: `C:/projects/U3DAvatar/Assets/_Project/Scripts/Scene/PetSceneSyncReceiver.cs`
- Create: `C:/projects/U3DAvatar/Assets/_Project/Tests/EditMode/PetSceneSyncReceiverTests.cs`
- Do not modify: `PetStatusPayload.cs`、`PetStatusSyncPanel.cs`、`SceneController.cs`

**Interfaces:**
- Produces: 独立 WebSocket 接收、`sceneId` 映射、Scene 资源路径配置、跨 Scene 常驻和最后目标排队。
- Consumes: Inspector 配置的 `UnityEditor.SceneAsset`（仅编辑器）、持久化 Scene 路径及 `SceneManager.LoadSceneAsync(string)`。

> 2026-07-21 用户将 Unity 实现调整为“既有两个 HUD 脚本不动，另写独立接收脚本”。以下步骤名称保留原计划轨迹，其实现结论以括号内的需求变更备注和上述 Files 为准，旧代码示例未写入生产代码。

> 2026-07-21 二次确认采用 Inspector 显式配置：移除运行时自动创建，初始 Scene 手动挂载接收器并拖入户外、咨询室两个 Scene 资源；接收器不再依赖 `SceneController.sceneConfigs`。

- [x] **Step 8: 先更新 EditMode 测试，要求两个 SceneAsset 字段、服务器地址字段且禁止自动启动** *(已于 2026-07-21 完成)*
- [x] **Step 9: 运行 EditMode 测试并确认因当前自动启动/SceneType 映射实现而失败** *(已于 2026-07-21 确认 2 项预期失败)*
- [x] **Step 10: 改为 SceneAsset + 隐藏路径配置，并使用 SceneManager 异步排队加载** *(已于 2026-07-21 完成)*
- [x] **Step 11: 在 Unity 编译并运行全部 EditMode 测试** *(已于 2026-07-21 编译成功并通过 6/6 测试)*
- [x] **Step 12: 更新 Unity 配置文档和 OpenSpecs 状态** *(已于 2026-07-21 完成)*

- [x] **Step 13: 诊断 Unity 本地 HTTP 与未加入 Build Settings 的 Scene 异常** *(已于 2026-07-21 根据完整堆栈确认根因)*
- [x] **Step 14: 增加明文 HTTP 与 Scene 自动加入 Build Settings 的回归测试** *(已于 2026-07-21 完成；当前 Unity Scene 未保存导致 Test Runner 运行提示被安全取消)*
- [x] **Step 15: 允许本地 HTTP，并在接收器校验/启用时自动维护 Build Settings** *(已于 2026-07-21 完成并编译)*

- [x] **Step 1: 编写 Unity 映射和调用失败测试** *(已于 2026-07-21 按独立接收器方案完成)*

在 EditMode 测试中增加：

```csharp
private sealed class FakeSceneSwitcher : MonoBehaviour, IPetSceneSwitcher
{
    public string LastSceneKey { get; private set; }
    public void SwitchToPetScene(string sceneKey) => LastSceneKey = sceneKey;
}

[TestCase("picnic_lawn", "Outdoor")]
[TestCase("psychological_room", "CounselingRoom")]
public void ApplyState_RequestsMappedUnityScene(string sceneId, string expectedSceneKey)
{
    var panelObject = new GameObject("Panel");
    var switcherObject = new GameObject("Switcher");
    try
    {
        var panel = panelObject.AddComponent<PetStatusSyncPanel>();
        var switcher = switcherObject.AddComponent<FakeSceneSwitcher>();
        typeof(PetStatusSyncPanel)
            .GetField("sceneSwitcherBehaviour", BindingFlags.Instance | BindingFlags.NonPublic)
            .SetValue(panel, switcher);
        typeof(PetStatusSyncPanel)
            .GetMethod("ApplyState", BindingFlags.Instance | BindingFlags.NonPublic)
            .Invoke(panel, new object[] { new PetState { sceneId = sceneId } });
        Assert.That(switcher.LastSceneKey, Is.EqualTo(expectedSceneKey));
    }
    finally
    {
        Object.DestroyImmediate(switcherObject);
        Object.DestroyImmediate(panelObject);
    }
}
```

- [x] **Step 2: 运行 Unity EditMode 测试并确认失败** *(已于 2026-07-21 确认失败)*

在 Unity Test Runner 运行 `PsyTwin.PetStatus.Tests.PetStatusSyncPanelTests`。

Expected: FAIL，因为接口、映射和字段尚不存在。

- [x] **Step 3: 实现无场景程序集依赖的映射接口** *(需求变更后由单一 `PetSceneSyncReceiver` 内部映射替代，已于 2026-07-21 完成)*

`IPetSceneSwitcher.cs`：

```csharp
namespace PsyTwin.PetStatus
{
    public interface IPetSceneSwitcher
    {
        void SwitchToPetScene(string sceneKey);
    }
}
```

`PetSceneMapping.cs`：

```csharp
namespace PsyTwin.PetStatus
{
    internal static class PetSceneMapping
    {
        internal static bool TryGetSceneKey(string sceneId, out string sceneKey)
        {
            switch (sceneId)
            {
                case "picnic_lawn":
                    sceneKey = "Outdoor";
                    return true;
                case "psychological_room":
                    sceneKey = "CounselingRoom";
                    return true;
                default:
                    sceneKey = null;
                    return false;
            }
        }
    }
}
```

- [x] **Step 4: 让状态面板调用配置的场景切换器** *(需求变更后取消修改状态面板，已由独立接收器替代)*

在 `PetStatusSyncPanel` 增加：

```csharp
[Header("场景同步")]
[SerializeField] private MonoBehaviour sceneSwitcherBehaviour;

private IPetSceneSwitcher SceneSwitcher => sceneSwitcherBehaviour as IPetSceneSwitcher;
```

由于同步面板与持久化 `SceneController` 可能来自不同 Scene，增加自动发现回退：

```csharp
private IPetSceneSwitcher ResolveSceneSwitcher()
{
    if (sceneSwitcherBehaviour is IPetSceneSwitcher configured) return configured;
    foreach (var candidate in FindObjectsOfType<MonoBehaviour>(true))
    {
        if (candidate is IPetSceneSwitcher switcher)
        {
            sceneSwitcherBehaviour = candidate;
            return switcher;
        }
    }
    return null;
}
```

在 `ApplyState` 写入文字后追加：

```csharp
if (PetSceneMapping.TryGetSceneKey(state.sceneId, out var sceneKey))
{
    ResolveSceneSwitcher()?.SwitchToPetScene(sceneKey);
}
```

未知 `sceneId` 只更新文字，不切换 Unity Scene。

同时保证状态面板跨 Unity Scene 保持连接。在 `PetStatusSyncPanel` 增加默认开启的 `persistAcrossScenes` 与单例保护；运行时将面板从原 Canvas 脱离、补齐独立 Canvas 并持久化：

```csharp
[SerializeField] private bool persistAcrossScenes = true;
private static PetStatusSyncPanel instance;

private void Awake()
{
    if (!Application.isPlaying || !persistAcrossScenes) return;
    if (instance != null && instance != this)
    {
        Destroy(gameObject);
        return;
    }
    instance = this;
    transform.SetParent(null, false);
    var canvas = GetComponent<Canvas>() ?? gameObject.AddComponent<Canvas>();
    canvas.renderMode = RenderMode.ScreenSpaceOverlay;
    if (GetComponent<UnityEngine.UI.CanvasScaler>() == null)
        gameObject.AddComponent<UnityEngine.UI.CanvasScaler>();
    if (GetComponent<UnityEngine.UI.GraphicRaycaster>() == null)
        gameObject.AddComponent<UnityEngine.UI.GraphicRaycaster>();
    DontDestroyOnLoad(gameObject);
}
```

`OnDestroy` 仅在 `instance == this` 时清空单例。这样从更衣室切到户外后 WebSocket 不会中断，仍能接收 3 秒后的咨询室状态。

- [x] **Step 5: 让 SceneController 实现排队切换** *(需求变更后取消修改 `SceneController`，排队逻辑已移入独立接收器)*

在 `SceneController.cs` 添加 `using PsyTwin.PetStatus;`，让 `SceneController` 实现 `IPetSceneSwitcher`，增加 `SceneType? pendingPetScene`，并实现：

```csharp
public void SwitchToPetScene(string sceneKey)
{
    if (!Enum.TryParse(sceneKey, out SceneType targetScene)
        || (targetScene != SceneType.Outdoor && targetScene != SceneType.CounselingRoom))
    {
        Debug.LogWarning($"[SceneController] 不支持心宠场景键: {sceneKey}");
        return;
    }
    pendingPetScene = targetScene;
    TryLoadPendingPetScene();
}

private void TryLoadPendingPetScene()
{
    if (isTransitioning || !pendingPetScene.HasValue) return;
    var targetScene = pendingPetScene.Value;
    pendingPetScene = null;
    if (targetScene != currentScene) LoadScene(targetScene);
}
```

在 `LoadSceneCoroutine` 完成并把 `isTransitioning` 设为 `false` 后调用 `TryLoadPendingPetScene()`。这样咨询室消息在户外仍加载时到达也会被保留。

- [x] **Step 6: 配置面板引用并验证场景资源** *(需求变更后无需配置面板；接收器可自动启动并复用现有场景配置)*

在 Unity Inspector 中把持久化的 `SceneController` 组件拖到 `PetStatusSyncPanel.sceneSwitcherBehaviour`。确认 Build Settings 已包含：

同时确认 `persistAcrossScenes` 已勾选；运行后 Hierarchy 的 `DontDestroyOnLoad` 区域只保留一个 `PetStatusSyncPanel`。

```text
Assets/_Project/Scenes/户外.unity
Assets/_Project/Scenes/咨询室.unity
```

并确认 `SceneController.sceneConfigs` 中 `Outdoor` 和 `CounselingRoom` 的 `sceneName` 分别指向这两个场景。

- [x] **Step 7: 运行 Unity 测试** *(已于 2026-07-21 通过 4 项 EditMode 测试)*

在 Unity Test Runner 运行全部 EditMode tests。

Expected: `PetStatusSyncPanelTests` 全部 PASS，Console 无编译错误。

### Task 5: 文档状态回写与三端验收

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/superpowers/specs/2026-07-21-pet-demo-scene-hotkey-design.md`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/PET_CROSS_PLATFORM_SYNC.md`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/PET_WEBSOCKET_SYNC.md`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/superpowers/plans/2026-07-21-pet-demo-scene-hotkey.md`
- Modify: `C:/projects/U3DAvatar/Assets/_Project/Docs/PET_STATUS_SYNC.md`

**Interfaces:**
- Consumes: Tasks 1–4 的测试结果和手动联调结果。
- Produces: 与实际代码状态一致的 OpenSpecs 任务清单和配置说明。

- [x] **Step 1: 更新使用与配置文档** *(已于 2026-07-21 完成)*

记录：启动 `node server/pet-server.js`、Pocket 使用 `localhost:13002`、Unity 使用用户自行配置的局域网 IP、两端 userId 都是 `demo_pet`、终端聚焦后按 F9、Unity Inspector 绑定 `SceneController`。

- [x] **Step 2: 执行 Pocket 最终验证** *(已于 2026-07-21 完成：22 项测试、目标 lint、语法与 Pocket diff 检查通过；全仓 lint 仍有 181 个既有错误)*

Run:

```powershell
npm run test:pet-sync
node --check server/pet-server.js
npx eslint utils/pet-sync.js utils/pet-sync.test.cjs server/pet-demo-scene.js server/pet-demo-scene.test.cjs
git diff --check
```

Expected: 测试、语法检查、目标 lint 和 diff 检查退出码均为 0。若完整页面 lint 仍包含既有问题，只报告与本次改动相关的新增错误，不宣称全仓 lint 通过。

- [ ] **Step 3: 执行三端手动验收**

1. 启动本地服务器并保持终端窗口聚焦；
2. 启动 Pocket 和 Unity，均使用 `demo_pet`；
3. 按 F9，确认服务器立即记录 `picnic_lawn` 广播；
4. 确认 Pocket 自动显示自由旷野的野餐草坪，Unity 加载“户外”；
5. 3 秒后确认服务器广播 `psychological_room`；
6. 确认 Pocket 自动显示学校的心理咨询室，Unity 最终加载“咨询室”；
7. 等待至少 10 秒，确认没有自动恢复；
8. 刷新小程序或停止 Unity，确认服务器恢复 F9 前的位置；
9. 重新连接，确认客户端读取正常位置而不是演示位置。

- [x] **Step 4: 回写 OpenSpecs 状态** *(已于 2026-07-21 按实际自动化验证结果回写)*

仅对实际通过的项目把 `- [ ]` 改为：

```markdown
- [x] F9 仅改变 `demo_pet`，不改变其他用户。*(已于 2026-07-21 测试通过)*
```

未手动验证的 Unity 或三端条目必须继续保留 `- [ ]` 并注明阻塞原因。

- [ ] **Step 5: 请求用户确认 Git 操作**

工作完成后汇报 Pocket 与 Unity 两个工作区的精确变更和测试结果，再询问是否按以下建议提交并推送：

```text
feat: add demo pet scene hotkey sync
```

未获得确认前不得执行 `git add`、`git commit` 或 `git push`。
