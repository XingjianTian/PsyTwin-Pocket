# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-03-06

### Added
- 心墙动态详情页（pages/post-detail）
- 点赞功能：详情页支持点赞/取消点赞，状态实时更新
- 评论功能：详情页支持查看评论列表和发表评论
- Mock 接口：动态详情、点赞、评论相关接口
- 卡片点击跳转：点击卡片可进入详情页
- 状态同步：详情页返回后首页点赞状态同步

### Changed
- 首页完成度从 70% 提升至 85%

## [1.0.0] - 2026-02-27

### Added
- 初始化 PsyTwin-Pocket 微信小程序 - 学生端心墙功能
- TDesign 组件库升级到 v1.11.2
- 首页、发布页样式调整
- 统一的 page 页面配置
- 统一的 mock 路径配置

### Changed
- 使用 Prettier 格式化代码
- 更新 appid 配置
- 首页样式优化
- 迁移 service 到 mock

### Fixed
- 修复图片路径问题
- 统一搜索页、聊天页页面配置
- 修复 eventBus 问题

### Refactored
- 个人信息编辑页面重构
- 个人中心页面重构
- 登录页面重构
- 数据中心页面重构
- 设置页面重构
- 所有页面统一使用 t-navbar 导航栏

### Docs
- 更新 README 文档

---

## 项目历史 (2026-02-27 之前)

> 以下为从原模板项目继承的变更记录

### 功能新增
- 完成【首页 & 目录导航】
- 完成【个人中心】
- 完成【数据图表页】和【设置页】
- 完成【搜索】功能
- 完成【个人信息页】
- 完成【登录相关页面】及 mock 配置
- 完成【消息】功能
- 发布页面开发完成

### 架构优化
- 分包配置
- 图片压缩
- t-design 组件库版本升级 (1.8.5 → 1.8.6)
- 调用基础库更新到 3.7.8
- 抽象三个 tabbar 的 topbar 为公共组件
- 统一页面结构

### 代码质量
- 完整的 ESLint 配置
- 代码格式化
- resolveAlias 路径别名配置
- 事件总线 (eventBus) 优化
