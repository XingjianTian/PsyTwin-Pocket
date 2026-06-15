# Pet Diary Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace AI-generated pet diary entries with database-backed random diary templates, including online trigger, test button, and offline backfill.

**Architecture:** Sentinel owns PostgreSQL models, seed data, and diary generation APIs. Pocket keeps `petSyncUrl` for state sync, but calls Sentinel through `baseUrl` to create/read diary entries.

**Tech Stack:** Next.js App Router, Prisma/PostgreSQL, WeChat Mini Program JavaScript/LESS.

---

### Task 1: Sentinel Diary Core

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/prisma/schema.prisma`
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/lib/pet-diary.ts`
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/lib/pet-diary.test.mjs`
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/prisma/pet-diary-templates.ts`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/package.json`

- [x] Write failing node tests for `shouldTriggerDiary`, `getMissingDiaryDates`, and template count. *(已于 2026-06-15 在 Sentinel 侧核对测试文件存在)*
- [x] Add Prisma `PetDiaryTemplate` model mapped to `pet_diary_templates`. *(已于 2026-06-15 在 Sentinel schema 中落地)*
- [x] Add 200 generic template records. *(已于 2026-06-15 通过 `npm run test:pet-diary` 校验 200 条模板)*
- [x] Implement pure diary helpers. *(已于 2026-06-15 在 Sentinel lib 中落地)*
- [x] Run `npm run test:pet-diary`. *(已于 2026-06-15 通过，5/5)*

### Task 2: Sentinel Pocket APIs

**Files:**
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/docs/api_contract.md`
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/app/api/pocket/pet/diary/route.ts`
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/app/api/pocket/pet/diary/test/route.ts`
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Sentinel/app/api/pocket/pet/diary/backfill/route.ts`

- [x] Document `GET /api/pocket/pet/diary`, `POST /api/pocket/pet/diary/test`, and `POST /api/pocket/pet/diary/backfill`. *(已于 2026-06-15 在 Sentinel API 契约中核对)*
- [x] Implement authenticated pet lookup/creation using the current Pocket token user. *(已于 2026-06-15 在 Sentinel diary service 中落地)*
- [x] Implement random template selection and `PetDiaryEntry` creation. *(已于 2026-06-15 在 Sentinel diary service 中落地)*
- [x] Implement offline date backfill with a bounded day count. *(已于 2026-06-15 在 Sentinel backfill 路由中落地)*

### Task 3: Pocket Integration

**Files:**
- Create: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/api/pet-diary.js`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/pages/pet/index.js`
- Modify: `C:/Users/txj12/Desktop/PsyTwin/PsyTwin-Pocket/pages/pet/index.wxml`

- [x] Add Sentinel diary API wrapper through `config.baseUrl`. *(已于 2026-06-15 在 `api/pet-diary.js` 落地)*
- [x] Replace test diary button behavior with Sentinel test API. *(已于 2026-06-15 在心情日记测试按钮落地)*
- [x] Replace local AI diary trigger with Sentinel trigger API. *(已于 2026-06-15 在心宠页日记触发逻辑落地)*
- [x] Call Sentinel backfill after `petSyncUrl` pull succeeds and refresh local diary map. *(已于 2026-06-15 在同步完成后落地)*

### Task 4: Verification

- [x] Run Sentinel unit tests. *(已于 2026-06-15 执行 `npm run test:pet-diary`，5/5 通过)*
- [ ] Run Sentinel build or lint where feasible. *(2026-06-15 尝试 `npm run lint`，因项目缺少 `eslint` 可执行文件未通过)*
- [ ] Run Pocket lint where feasible. *(2026-06-15 尝试全量 lint，因项目既有 260 个 ESLint 错误未通过；新增 `api/pet-diary.js` 单文件 lint 通过)*
- [x] Report how to use and configure the new feature. *(已于 2026-06-15 在任务汇报中说明)*
