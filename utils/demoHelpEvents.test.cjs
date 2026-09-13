const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

const { createDemoHelpEvent, mergeHelpEvents } = require('./demoHelpEvents');

test('demo help event is independent from pet state and marked as demo', () => {
  const event = createDemoHelpEvent('medium');

  assert.equal(event.source, 'demo');
  assert.equal(event.severity, 'medium');
  assert.equal(event.status, 'pending');
  assert.equal(event.category, 'study');
  assert.ok(event.id.startsWith('demo_medium_'));
});

test('unknown demo severity falls back to a high-risk event', () => {
  const event = createDemoHelpEvent('unknown');

  assert.equal(event.source, 'demo');
  assert.equal(event.severity, 'high');
});

test('keeps local demo events when authoritative events refresh', () => {
  const serverEvent = { id: 'server_1', source: 'server', title: '服务端事件' };
  const demoEvent = { id: 'demo_high_1', source: 'demo', title: '演示事件' };
  const staleServerEvent = { id: 'server_old', source: 'server', title: '旧事件' };

  assert.deepEqual(mergeHelpEvents([serverEvent], [demoEvent, staleServerEvent]), [serverEvent, demoEvent]);
});

test('deduplicates demo events already returned by the server', () => {
  const demoEvent = { id: 'demo_high_1', source: 'demo', title: '演示事件' };

  assert.deepEqual(mergeHelpEvents([demoEvent], [demoEvent]), [demoEvent]);
});

test('demo help action requests the sad pet expression', () => {
  const pageSource = fs.readFileSync(path.join(__dirname, '..', 'pages', 'pet', 'index.js'), 'utf8');
  const apiSource = fs.readFileSync(path.join(__dirname, '..', 'api', 'pet-expression.js'), 'utf8');

  assert.match(pageSource, /onDemoHelpTap\(\)[\s\S]*?success: async \(res\) =>/);
  assert.match(pageSource, /await triggerSadPetExpression\(\)/);
  assert.match(apiSource, /request\('\/pet\/expression', 'POST', \{ expression: 'sad' \}\)/);
});

test('renders low-severity server events as warm notifications with an offline relaxation invitation', () => {
  const markup = fs.readFileSync(path.join(__dirname, '..', 'pages', 'pet', 'index.wxml'), 'utf8');
  const pageSource = fs.readFileSync(path.join(__dirname, '..', 'pages', 'pet', 'index.js'), 'utf8');

  assert.match(markup, /item\.severity === 'low' \? '温馨通知'/);
  assert.match(markup, /'前往线下体验放松 →'/);
  assert.match(pageSource, /title: '💚 温馨通知'/);
  assert.match(pageSource, /wx\.switchTab\(\{ url: '\/pages\/appointment\/index' \}\)/);
});

test('demo help events use independent storage and are re-merged at authoritative apply time', () => {
  const pageSource = fs.readFileSync(path.join(__dirname, '..', 'pages', 'pet', 'index.js'), 'utf8');

  assert.match(pageSource, /DEMO_HELP_EVENTS_STORAGE_KEY = 'petDemoHelpEvents'/);
  assert.match(pageSource, /this\.demoHelpEvents = \[demoEvent, \.\.\.\(this\.demoHelpEvents \|\| \[\]\)\]/);
  // 权威状态应用时重新合并 demo 事件，并写回带 timeText / unread 的装饰结果
  assert.match(
    pageSource,
    /const mergedHelpEvents = mergeHelpEvents\([\s\S]*?this\.demoHelpEvents \|\| \[\]/,
  );
  assert.match(pageSource, /authoritativePatch\.helpEvents = decoratedHelpEvents/);
});

test('help events show a timestamp and use a plain dot instead of a count badge', () => {
  const markup = fs.readFileSync(path.join(__dirname, '..', 'pages', 'pet', 'index.wxml'), 'utf8');
  const pageSource = fs.readFileSync(path.join(__dirname, '..', 'pages', 'pet', 'index.js'), 'utf8');

  // 通知时间显示在事件卡片头部
  assert.match(markup, /class="event-time"/);
  assert.match(pageSource, /formatHelpEventTime\(timestamp\)/);
  // 只认 createdAt：deadline 是截止时间，拿来当"发生时间"会显示未来时刻
  assert.match(pageSource, /timeText: event\.createdAt \? this\.formatHelpEventTime\(event\.createdAt\) : ''/);
  assert.doesNotMatch(pageSource, /timeText: this\.formatHelpEventTime\(event\.createdAt \|\| event\.deadline\)/);

  // 底部求助入口只显示一个红点，不再显示数量
  assert.match(markup, /wx:if="\{\{hasUnreadEvent\}\}" class="event-dot"/);
  assert.doesNotMatch(markup, /class="event-badge"/);

  // 未读事件在卡片右上角显示红点，点击后清除
  assert.match(markup, /class="event-unread-dot"/);
  assert.match(pageSource, /HELP_EVENT_READ_STORAGE_KEY = 'petReadHelpEventIds'/);
  assert.match(pageSource, /unread: event\.status !== 'resolved' && !readIds\.has\(event\.id\)/);
  assert.match(pageSource, /this\.markHelpEventRead\(event\.id\)/);
});
