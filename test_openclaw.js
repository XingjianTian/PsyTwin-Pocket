/**
 * OpenClaw 余额/可用性测试脚本
 * 运行: node test_openclaw.js
 */

const https = require('https');
const http = require('http');

// 测试配置
const TEST_CONFIGS = [
  {
    name: '本地开发环境 (localhost:3000)',
    url: 'http://localhost:3000/api/openclaw/pocket/chat',
    protocol: http,
  },
  {
    name: '生产环境 (api.psytwin.com)',
    url: 'https://api.psytwin.com/api/openclaw/pocket/chat',
    protocol: https,
  },
];

const TEST_PAYLOAD = JSON.stringify({
  agentId: 'Therapist',
  message: '你好，这是一个余额测试请求。请回复一句简短的话。',
  token: '123456',
});

function testEndpoint(config) {
  return new Promise((resolve) => {
    const url = new URL(config.url);
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(TEST_PAYLOAD),
      },
      timeout: 10000,
    };

    const startTime = Date.now();
    const req = config.protocol.request(options, (res) => {
      const latency = Date.now() - startTime;
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          name: config.name,
          url: config.url,
          status: res.statusCode,
          latency,
          response: data,
          ok: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        name: config.name,
        url: config.url,
        status: 0,
        latency: Date.now() - startTime,
        error: err.message,
        ok: false,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: config.name,
        url: config.url,
        status: 0,
        latency: 10000,
        error: '请求超时',
        ok: false,
      });
    });

    req.write(TEST_PAYLOAD);
    req.end();
  });
}

// 模拟日记 Prompt
function simulateDiaryPrompt() {
  const activityLog = [
    { type: 'scene_change', scene: '图书馆', time: '09:00' },
    { type: 'event', desc: '完成了一份作业', moodDelta: 5, time: '11:30' },
    { type: 'scene_change', scene: '食堂', time: '12:00' },
    { type: 'event', desc: '和朋友聊了会儿天', moodDelta: 3, time: '14:00' },
  ];

  const stats = { mood: 72, energy: 60, social: 55, currentScene: '图书馆' };

  const activities = activityLog.map(a => {
    switch (a.type) {
      case 'scene_change': return `• ${a.time} 来到了${a.scene}`;
      case 'event': return `• ${a.time} ${a.desc}${a.moodDelta > 0 ? '（心情+' + a.moodDelta + '）' : ''}`;
      default: return `• ${a.time} ${a.desc || a.type}`;
    }
  }).join('\n');

  return `你是一只陪伴大学生的心理支持宠物。今天你和主人一起经历了这些：

【今日活动】
${activities}

【当前状态】
心情值: ${stats.mood}/100 | 精力值: ${stats.energy}/100 | 社交值: ${stats.social}/100
当前场景: ${stats.currentScene}

请以第一人称，用温暖、可爱、略带幽默的语气，写一篇150-250字的日记。可以包含小感慨、小期待。只输出日记正文，不要加标题和格式标记。`;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   OpenClaw API & 日记功能 可用性测试');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. 测试 API 端点连通性
  console.log('📡 [1/3] 测试 API 端点连通性...\n');
  for (const cfg of TEST_CONFIGS) {
    const result = await testEndpoint(cfg);
    console.log(`  ▶ ${result.name}`);
    console.log(`    URL: ${result.url}`);
    if (result.ok) {
      console.log(`    ✅ 状态: HTTP ${result.status} (${result.latency}ms)`);
      try {
        const json = JSON.parse(result.response);
        console.log(`    📦 响应预览:`, JSON.stringify(json).slice(0, 200));
      } catch {
        console.log(`    📦 响应:`, result.response.slice(0, 200));
      }
    } else {
      console.log(`    ❌ 失败: ${result.error || `HTTP ${result.status}`}`);
    }
    console.log();
  }

  // 2. 模拟日记 Prompt
  console.log('📝 [2/3] 模拟日记 Prompt 构建...\n');
  const diaryPrompt = simulateDiaryPrompt();
  console.log(`  生成的 Prompt 长度: ${diaryPrompt.length} 字符`);
  console.log(`  预估 Token 数: ~${Math.ceil(diaryPrompt.length / 4)} tokens\n`);
  console.log('  --- Prompt 预览 ---');
  console.log(diaryPrompt.slice(0, 300) + (diaryPrompt.length > 300 ? '...' : ''));
  console.log('  -------------------\n');

  // 3. 项目配置检查
  console.log('⚙️  [3/3] 项目配置检查...\n');
  try {
    const config = require('./config/index.js');
    console.log(`  isMock: ${config.default?.isMock ?? config.isMock}`);
    console.log(`  baseUrl: ${config.default?.baseUrl ?? config.baseUrl}`);
    if ((config.default?.isMock ?? config.isMock)) {
      console.log(`  ✅ Mock 模式已开启，日记功能会使用模拟数据`);
    } else {
      console.log(`  ⚠️ Mock 模式未开启，需要后端服务 (${config.default?.baseUrl ?? config.baseUrl}) 处于运行状态`);
    }
  } catch (e) {
    console.log(`  ⚠️ 无法读取配置: ${e.message}`);
  }

  // 4. 总结
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   测试总结');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('日记功能调用链:');
  console.log('  pages/pet/index.js:generateAiDiary()');
  console.log('    → api/ai.js:sendToTherapist()');
  console.log('      → POST /api/openclaw/pocket/chat');
  console.log('        → OpenClaw 后端服务\n');
  console.log('如 API 无法连通，建议方案:');
  console.log('  1. 启动本地后端服务 (localhost:3000)');
  console.log('  2. 或在 config/index.js 中设置 isMock: true 使用模拟数据');
  console.log('  3. 或修改 baseUrl 为可用的远程服务器地址');
  console.log('\n═══════════════════════════════════════════════════════');
}

main();
