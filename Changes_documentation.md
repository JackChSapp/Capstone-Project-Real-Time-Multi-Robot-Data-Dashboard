# Changes documentation — React dashboard and Foxglove bridge

This document explains what was changed so the Vite/React dashboard receives **live ROS 2 data** from **foxglove_bridge**, and **why** those changes were necessary from a protocol and application-design perspective.

---

## 1. Critical change: from “socket open” to “live topics”

### What looked broken

The browser could open a WebSocket to the bridge (you might see “connected” or a successful open in the console), but **no camera, odometry, IMU, or clock** appeared in the UI.

### Why that happened (layered view)

A WebSocket connection is only the **transport**. After the HTTP upgrade, the server and client still have to speak the same **application protocol** on top of that socket.

**foxglove_bridge** implements the **Foxglove WebSocket protocol**, not “raw ROS messages as text.” At a high level the sequence is:

1. The bridge sends control messages (for example `serverInfo`, and **`advertise`** with a list of channels: topic name, schema, encoding, numeric channel id).
2. The client must send **`subscribe`** with the channel id it cares about.
3. The bridge then sends **`message`** frames: binary payloads that are **ROS 2 CDR** (Common Data Representation) for that channel, not JSON and not plain JPEG bytes by themselves.

A minimal script that only does `new WebSocket(url, subprotocols)` and `onmessage` never sends `subscribe` and does not parse the Foxglove framing. Even if something arrived at `onmessage`, it would not be a decoded `nav_msgs/Odometry` or `sensor_msgs/CompressedImage` object ready for React.

**Conclusion:** Live data required three capabilities working together:

| Capability | Role |
|------------|------|
| **Foxglove client** (`@foxglove/ws-protocol` → `FoxgloveClient`) | Parses send/receive framing, emits `advertise`, `message`, `close`, etc., and sends `subscribe` / `unsubscribe`. |
| **Subscription logic** | After `advertise`, match topics the dashboard cares about and call `subscribe` for those channel ids. |
| **CDR decoding** (`@foxglove/rosmsg` + `@foxglove/rosmsg2-serialization`) | Turn each `message` payload into a JS-friendly object using the channel’s ROS 2 message definition. |

Implementing this is what `src/services/rosConnection.ts` does inside `useFoxgloveDashboard`.

### How decoding works for each message (deeper)

For each subscribed channel, the bridge includes a **schema** string (the `.msg`-style definition). The code:

1. **`parse(schema, { ros2: true })`** — builds an internal representation of the message layout for ROS 2.
2. **`new MessageReader(definitions)`** — creates a reader that knows how to walk CDR layout (alignment, nested types, arrays).
3. **`reader.readMessage(payload)`** on each `message` event — produces a plain object (e.g. fields for compressed image `data`/`format`, odometry `pose`, IMU `linear_acceleration`, clock `clock`).

If any step is missing, the UI has no structured fields to bind to components.

---

## 2. Critical change: WebSocket subprotocol negotiation

Browsers let you pass a second argument to `WebSocket`: requested subprotocols. The server picks one in the `Sec-WebSocket-Protocol` response. **If client and server do not agree on a subprotocol, the handshake fails** (often reported as an abrupt close, e.g. code `1006`).

Different builds of **foxglove_bridge** may accept:

- **`foxglove.sdk.v1`** (newer SDK-style protocol), and/or  
- **`foxglove.websocket.v1`** (older name, still used by some stacks).

The client therefore requests **both**, in a sensible order (`foxglove.sdk.v1` first), so whichever the bridge supports is selected. That is independent of ROS topics; it only determines whether the wire format the `FoxgloveClient` expects matches the server.

---

## 3. Critical change: default URL `ws://127.0.0.1:8765`

Using **`127.0.0.1`** instead of **`localhost`** avoids a common deployment pitfall: on many systems `localhost` resolves to **IPv6** (`::1`) first, while Docker-published ports on the host are often bound to **IPv4**. The browser then tries the wrong address family and the connection fails even though “the bridge is running.” Pinning IPv4 in the default URL removes that class of failure. The optional env var `VITE_FOXGLOVE_WS_URL` overrides this when the bridge runs elsewhere.

---

## 4. Connection state and errors (why the UI does not flip to “error” too early)

The browser may fire a generic **`error`** event on the WebSocket even when the Foxglove session is actually fine (timing, buffering, or other transport noise). The hook tracks **`hasConfirmedProtocolTraffic`**: once `serverInfo`, `advertise`, or `message` has been seen, transient `error` events no longer force an **error** status for the whole dashboard.

If the socket **closes** before any protocol traffic, the UI treats that as a real failure and surfaces close codes and a reminder to check host, port, and subprotocol support.

**Reconnect:** On close, a timer bumps a `retryToken` so `useEffect` re-runs and opens a fresh connection (useful when the container restarts).

### Intermittent reconnect-loop fix (Apr 2026)

An intermittent issue caused the status to flip between connected/disconnected roughly every 2 seconds. Root cause: the hook scheduled auto-reconnect even during intentional cleanup (`client.close()` in the `useEffect` return). In development, React `StrictMode` mounts/unmounts effects to detect side effects, which made this behavior more visible and could sustain the reconnect loop.

`src/services/rosConnection.ts` now uses an `isShuttingDown` guard so shutdown-triggered `error`/`close` events do not update UI state or schedule reconnects. Unexpected bridge disconnects still trigger retries. The reconnect timer is also reset after it fires, preventing stale timer state.

---

## 5. Subscriptions, topics, and camera path

**`TARGET_TOPICS`** lists ROS topic names the dashboard subscribes to **if** the bridge advertises them with **`encoding === "cdr"`** (what this decoder stack supports).

- **Camera (primary):** `/out/compressed` — expected type is compressed image data the UI turns into a `data:` URL for an `<img>`.
- **Odometry:** `/robot1/odom`
- **IMU:** `/robot1/imu`
- **Clock:** `/clock`

**`/out/foxglove`:** Some simulators publish camera data on a Foxglove-specific compressed-video channel instead of `sensor_msgs/CompressedImage`. That format is **not** decoded in this app. If the bridge advertises `/out/foxglove` but not `/out/compressed`, a **warning** explains that the camera panel stays empty until `/out/compressed` exists or a dedicated foxglove-video decoder is added.

When the bridge **unadvertises** a channel, the client calls **`unsubscribe`** for the matching subscription ids before dropping local maps, so the session stays consistent with the protocol.

**`buildReader`:** If parsing the schema or constructing the reader throws (unexpected definition), that channel is skipped and the error is logged so one bad topic does not break the entire connection.

---

## 6. React integration

**`useFoxgloveDashboard(url)`** runs the Foxglove client lifecycle inside **`useEffect`**, keyed by `url` and `retryToken`. Cleanup closes the client when the component unmounts or dependencies change.

**`Dashboard`** reads URL from **`getFoxgloveWebSocketUrl()`** (`import.meta.env.VITE_FOXGLOVE_WS_URL` or default), calls the hook once, and passes slices of state into **CameraFeed**, **PositionPanel**, **AccelerationPanel**, and **StatusPanel**. That replaces the old pattern of importing `rosConnection` only for side effects, which connected once without feeding React state.

**Bug fix:** `PositionPanel` is a **default** export; it must be imported as `import PositionPanel from "..."`, not as a named `{ PositionPanel }` import.

---

## 7. Tooling and project files

### `package.json`

Restored a full application manifest (React, Vite, TypeScript, Foxglove packages, scripts). A manifest that only listed type packages does not match a runnable dashboard or the lockfile.

### Build configuration

- **`index.html`** — Vite entry (root div + module script to `main.tsx`).
- **`vite.config.ts`** — React plugin; dev server on `0.0.0.0:5173`.
- **`tsconfig.json`** / **`tsconfig.app.json`** / **`tsconfig.node.json`** — `tsc -b` project references; app code uses `moduleResolution: "Bundler"` for Vite compatibility.
- **`src/vite-env.d.ts`** — Types for `import.meta.env`, including `VITE_FOXGLOVE_WS_URL`.

### Removed

- **`vite.config.js`** and stale **`vite.config.d.ts`** — replaced by the single TypeScript Vite config.

### `.env.example`

Documents optional `VITE_FOXGLOVE_WS_URL` for non-default bridge hosts.

---

## 8. UI files

| File | Change summary |
|------|----------------|
| `src/components/CameraFeed.tsx` | Accepts `imageSrc`, `format`, `lastUpdated` from hook state. |
| `src/components/PositionPanel.tsx` | Accepts `pose`, `lastUpdated`. |
| `src/components/AccelerationPanel.tsx` | Accepts `imu`, `lastUpdated`. |
| `src/components/StatusPanel.tsx` | Accepts connection status, diagnostics, topic list, clock. |
| `src/pages/appStyle.css` | Styles for live metrics, camera frame, status badge. |
| `src/App.tsx` | Renders `Dashboard` only (no side-effect connection import). |
| `src/main.tsx` | Imports `App` without `.tsx` extension (required for `tsc` with default options). |

**Unchanged on purpose:** `BatteryPanel.tsx` remains a placeholder if the simulator does not publish a battery topic.

---

## 9. Known limitations

- Topic names are centered on **`robot1`** and the fixed list above; more robots require extending targets and UI state.
- Target topics advertised with **non-CDR** encoding are skipped (no subscription); the UI does not yet warn per-topic for that case.
- **`README.md`** may still be extended with `npm install` / `npm run dev` next to Docker instructions for new contributors.

---

## 10. How to run

```bash
npm install
npm run dev
```

Ensure **foxglove_bridge** is reachable (default `ws://127.0.0.1:8765`). Override with `VITE_FOXGLOVE_WS_URL` in `.env` if needed (Vite only exposes variables prefixed with `VITE_`).

```bash
npm run build
npm run preview
```

---

## 11. Verification

`npm run build` (`tsc -b && vite build`) completes successfully with the current `rosConnection` implementation (including unsubscribe-on-unadvertise, guarded `buildReader`, and shutdown-safe reconnect logic).
