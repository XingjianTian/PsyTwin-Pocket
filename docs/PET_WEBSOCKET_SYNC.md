# Pet WebSocket Sync

The server is the only state authority. Every five-second server tick updates the state and broadcasts the complete status to all clients connected with the same `userId`.

## Endpoint

```text
ws://localhost:13002/ws/pet?userId=demo_pet&clientType=unity
```

Clients replace their displayed state when receiving `pet_status` and ignore older `stateVersion` values. HTTP status remains the initial snapshot and reconnect fallback.

- [x] Server broadcasts after every tick.
- [x] WeChat mini program connects with `demo_pet` and receives `pet_status`.
- [x] Unity connects with `demo_pet` and receives `pet_status`.
- [x] Clients reconnect automatically and keep the last displayed state during outages.
