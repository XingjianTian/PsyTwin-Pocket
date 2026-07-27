const assert = require('node:assert/strict');
const test = require('node:test');

const {
  addClient,
  removeClient,
  sweepConnections,
} = require('./pet-connections');

test('removes the user entry after its final socket disconnects', () => {
  const clients = new Map();
  const first = {};
  const second = {};

  addClient(clients, 'demo_pet', first);
  addClient(clients, 'demo_pet', second);
  assert.equal(clients.size, 1);

  assert.deepEqual(removeClient(clients, 'demo_pet', first), [second]);
  assert.equal(clients.has('demo_pet'), true);

  assert.deepEqual(removeClient(clients, 'demo_pet', second), []);
  assert.equal(clients.has('demo_pet'), false);
});

test('heartbeat terminates sockets that fail to respond', () => {
  const webSocketServer = {};
  const socket = {};
  socket.readyState = 1;
  socket.pingCount = 0;
  socket.terminateCount = 0;
  socket.ping = () => { socket.pingCount += 1; };
  socket.terminate = () => { socket.terminateCount += 1; };
  webSocketServer.clients = new Set([socket]);

  sweepConnections(webSocketServer);
  assert.equal(socket.pingCount, 1);
  assert.equal(socket.terminateCount, 0);

  sweepConnections(webSocketServer);
  assert.equal(socket.pingCount, 1);
  assert.equal(socket.terminateCount, 1);
});
