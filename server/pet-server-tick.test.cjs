const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const test = require('node:test');

const serverPath = new URL('./pet-server.js', `file:///${__filename.replace(/\\/g, '/')}`);

test('pet server emits authoritative non-repeating activity every four seconds', async () => {
  const source = await readFile(serverPath, 'utf8');

  assert.match(source, /const TICK_INTERVAL_MS = 4000;/);
  assert.match(source, /}, TICK_INTERVAL_MS\);/);
  assert.match(source, /description !== ctx\.lastEventDescription/);
  assert.match(source, /timestamp: nowMs/);
  assert.match(source, /MAX_ACTIVITY_LOGS_PER_DAY = 500/);
  assert.match(source, /broadcastPetStatus\(userId, state\);/);
});
