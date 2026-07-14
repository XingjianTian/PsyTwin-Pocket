# 每日日记随机时间线 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Pocket diary view automatically show a persisted set of random template-library diary entries for every selected date.

**Architecture:** Sentinel owns random selection, time generation, persistence, and the API contract. Pocket calls the existing diary GET endpoint with `ensure=true` when opening the diary view or selecting a date, then renders the returned `diaryDataMap`.

**Tech Stack:** WeChat Mini Program JavaScript/LESS, Sentinel Next.js/TypeScript, Prisma, Node test runner.

## Global Constraints

- Pocket uses JavaScript only; no TypeScript is added to Pocket.
- Pocket consumes Sentinel APIs and does not add server or Prisma logic.
- Network fields and response structures follow `docs/api_contract.md`.
- Random diary content comes only from the existing Sentinel template library.
- Generated diary entries do not use mood, energy, social, scene, current hour, or trigger probability.
- Existing files use 2-space indentation, single quotes in Pocket, and semicolons where the project style requires them.

---

### Task 1: Add failing Sentinel core tests

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/lib/pet-diary.test.mjs`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/lib/pet-diary-core.mjs`

- [x] **Step 1: Add tests for batch quantity and unique daily times.** *(已于 2026-07-14 添加并验证)*

  Test that a generated schedule contains 4—8 entries, sorted `HH:MM` times, no duplicate times, and every time is between `08:00` and `23:00`.

- [x] **Step 2: Run the focused test and verify it fails for the missing helper.** *(已于 2026-07-14 观察到缺少导出导致失败)*

  Run `npm run test:pet-diary` from `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel`.

- [x] **Step 3: Implement the minimal pure helpers.** *(已于 2026-07-14 在 Sentinel core 中落地)*

  Add deterministic-testable helpers for selecting a count and building unique random times without reading pet state.

- [x] **Step 4: Run the focused tests and verify they pass.** *(已于 2026-07-14 通过 7/7)*

  Run `npm run test:pet-diary`.

### Task 2: Add Sentinel batch generation service

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/lib/pet-diary-service.ts`

- [x] **Step 1: Add a service test case for idempotent ensure behavior.** *(已于 2026-07-14 通过真实接口双次调用验证幂等；项目现有测试未建立 Prisma service mock)*

  Specify that an empty date creates one schedule and a date with existing entries returns those entries without creating more.

- [x] **Step 2: Implement `ensurePetDiarySchedule`.** *(已于 2026-07-14 在 Sentinel service 中落地)*

  Query the selected date first. If entries exist, return them unchanged. Otherwise select 4—8 distinct active templates, assign unique random times, create entries with `mood: null`, `energy: null`, `sceneId: 'daily'`, and return the date map.

- [x] **Step 3: Run Sentinel diary tests.** *(已于 2026-07-14 通过 7/7)*

  Run `npm run test:pet-diary` and verify all tests pass.

### Task 3: Extend the Sentinel GET contract and route

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/app/api/pocket/pet/diary/route.ts`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/docs/api_contract.md`

- [x] **Step 1: Document `ensure=true`.** *(已于 2026-07-14 同步 Sentinel API 契约)*

  Document that `GET /api/pocket/pet/diary?date=YYYY-MM-DD&ensure=true` creates a 4—8 item random timeline only when the date has no entries.

- [x] **Step 2: Route the flag to the ensure service.** *(已于 2026-07-14 完成 GET 路由接入)*

  Parse `ensure=true`; call `ensurePetDiarySchedule` when set and retain the existing read-only behavior when omitted.

- [x] **Step 3: Verify the route with the existing Sentinel test/build tooling.** *(日记测试通过；全量 TypeScript 被既有备份 seed 语法错误阻断，Sentinel ESLint 因依赖缺失未执行)*

  Run `npm run test:pet-diary`; run `npm run lint` if available and report unrelated existing failures separately.

### Task 4: Make Pocket open and date selection ensure content

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/api/pet-diary.js`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/pages/pet/index.js`

- [x] **Step 1: Add the failing Pocket API expectation.** *(已通过接口请求路径和响应解包行为核对；Pocket 未配置独立单元测试框架)*

  Verify that the diary GET request can pass `ensure=true` without changing the response unwrapping behavior.

- [x] **Step 2: Implement `fetchPetDiary(date, { ensure = false } = {})`.** *(已于 2026-07-14 完成)*

  Append `ensure=true` only when requested.

- [x] **Step 3: Pass `ensure: true` from `onDiaryTap` and `onDiaryDateSelect`.** *(已于 2026-07-14 完成)*

  Keep server data as the source of truth and retain local storage fallback on request failure.

- [x] **Step 4: Run Pocket lint for touched files and inspect the diff.** *(差异检查通过；局部 lint 仍受页面既有 54 个错误影响)*

  Run `npx eslint api/pet-diary.js pages/pet/index.js --no-eslintrc -c ./.eslintrc.js` from the Pocket root, then inspect `git diff`.

### Task 5: End-to-end verification and documentation sync

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/docs/superpowers/plans/2026-06-13-pet-diary-library.md`

- [x] **Step 1: Verify the Sentinel endpoint returns multiple entries for an empty date.** *(首次返回 7 条，均为 template_library，时间唯一且升序)*

  Call the endpoint with `ensure=true`, confirm 4—8 entries, unique sorted times, and `source: 'template_library'`.

- [x] **Step 2: Verify the same date is idempotent.** *(第二次仍返回 7 条且 ID 完全一致)*

  Call the endpoint twice and confirm the entry IDs are unchanged on the second call.

- [x] **Step 3: Verify Pocket date selection uses the ensure path.** *(已核对打开日记和日期选择均传 `ensure: true`)*

  Inspect request logs and confirm opening/selecting dates sends `ensure=true`.

- [x] **Step 4: Mark the related OpenSpecs task complete with a dated note.** *(已于 2026-07-14 回写本计划状态)*

- [x] **Step 5: Report usage and configuration.** *(已在任务汇报中说明)*

  Explain that Sentinel must be running, the template seed must exist, and Pocket `config.baseUrl` must point to Sentinel.
