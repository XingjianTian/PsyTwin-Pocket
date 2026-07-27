const { WebSocket } = require('ws');

function addClient(clientMap, userId, socket) {
  let clients = clientMap.get(userId);
  if (!clients) {
    clients = new Set();
    clientMap.set(userId, clients);
  }
  clients.add(socket);
  return clients;
}

function removeClient(clientMap, userId, socket) {
  const clients = clientMap.get(userId);
  if (!clients) return [];

  clients.delete(socket);
  if (clients.size === 0) {
    clientMap.delete(userId);
    return [];
  }

  return Array.from(clients);
}

function sweepConnections(webSocketServer) {
  webSocketServer.clients.forEach((socket) => {
    if (socket.isAlive === false) {
      socket.terminate();
      return;
    }

    socket.isAlive = false;
    if (socket.readyState === WebSocket.OPEN) {
      socket.ping();
    }
  });
}

function startHeartbeat(webSocketServer, intervalMs) {
  webSocketServer.on('connection', (socket) => {
    socket.isAlive = true;
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  const heartbeatTimer = setInterval(() => {
    sweepConnections(webSocketServer);
  }, intervalMs);

  return () => clearInterval(heartbeatTimer);
}

module.exports = {
  addClient,
  removeClient,
  startHeartbeat,
  sweepConnections,
};
