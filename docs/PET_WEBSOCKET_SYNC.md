# Pet WebSocket Sync

The server is the only state authority. Every four-second server tick updates the state, writes one non-repeating activity log, and broadcasts the complete status to all clients connected with the same `userId`.

## Endpoint

```text
ws://localhost:13002/ws/pet?userId=demo_pet&clientType=unity
```

Clients replace their displayed state when receiving `pet_status` and ignore older `stateVersion` values. HTTP status remains the initial snapshot and reconnect fallback.

- [x] Server broadcasts after every tick.
- [x] Server activity logs and terminal summaries refresh every four seconds, include precise timestamps, and avoid consecutive duplicate event text. *(Implemented and Sentinel-linked on 2026-07-24.)*
- [x] WeChat mini program connects with `demo_pet` and receives `pet_status`.
- [x] Unity connects with `demo_pet` and receives `pet_status`.
- [x] Clients reconnect automatically and keep the last displayed state during outages.
- [x] Pocket applies `payload.status.sceneId` to the pet location without changing the observer scene. *(Implemented and tested on 2026-07-20.)*
- [x] Unity writes the raw `payload.status.sceneId` to its configured HUD text. *(Implemented and EditMode-tested on 2026-07-20.)*
- [x] The demo F9 sequence broadcasts `picnic_lawn`, then `psychological_room` after three seconds. *(Implemented and tested on 2026-07-21.)*
- [x] Unity's independent `PetSceneSyncReceiver` consumes those standard messages and maps them to `Outdoor` and `CounselingRoom`. *(Compiled and EditMode-tested on 2026-07-21.)*
- [ ] Pocket and Unity have displayed the same `sceneId` and `stateVersion` in an end-to-end runtime test. *(Awaiting runtime verification.)*
