# Physical Robot Testing Checklist (Today)

This checklist verifies the current dashboard setup with real robots running ROS 2 and `foxglove_bridge`.

## 0) Assumptions

- Robot(s) already run ROS 2 and publish sensor data.
- Dashboard project is this repo.
- Dashboard expects these topics:
  - `/out/compressed` (`sensor_msgs/CompressedImage`)
  - `/robot1/odom`
  - `/robot1/imu`
  - `/clock` (optional but recommended)
- Foxglove bridge WebSocket port is `8765` (default).

---

## 1) Preflight: network + SSH

Run on your laptop:

```bash
ping -c 3 <ROBOT_IP>
ssh <USER>@<ROBOT_IP>
```

If SSH fails, fix networking first (same LAN/VLAN/VPN, credentials, firewall).

---

## 2) On robot: verify ROS 2 environment and topics

SSH into robot, then run:

```bash
printenv | rg "ROS_DOMAIN_ID|RMW_IMPLEMENTATION"
ros2 topic list
ros2 topic type /out/compressed
ros2 topic type /robot1/odom
ros2 topic type /robot1/imu
ros2 topic hz /out/compressed
ros2 topic hz /robot1/odom
ros2 topic hz /robot1/imu
```

Expected:
- The required topics exist.
- Topic rates are non-zero.

If names differ, note them (you will need remaps or dashboard topic-name updates later).

---

## 3) On robot: start foxglove_bridge

If not already running:

```bash
ros2 run foxglove_bridge foxglove_bridge
```

If your setup uses launch files, use your existing launch command instead.

In a second SSH shell on robot, confirm port is listening:

```bash
ss -lntp | rg 8765
```

Optional quick local check on robot:

```bash
python3 -m webbrowser "http://127.0.0.1:8765" 2>/dev/null || true
```

Note: bridge is WebSocket, so browser output may not be meaningful; port-listening check is the key.

---

## 4) On laptop: verify robot bridge is reachable

From laptop:

```bash
nc -vz <ROBOT_IP> 8765
```

If blocked, check:
- Robot firewall (`ufw`/iptables)
- Network ACLs/VLAN segmentation
- Wrong IP/port

---

## 5) Configure dashboard URL for physical robot

In project root on laptop:

```bash
cd /home/emiliano/PycharmProjects/temp/Capstone-Project-Real-Time-Multi-Robot-Data-Dashboard
printf "VITE_FOXGLOVE_WS_URL=ws://<ROBOT_IP>:8765\n" > .env
```

If `foxglove_bridge` is not on default port, change `8765`.

---

## 6) Launch dashboard and validate UI

On laptop:

```bash
npm install
npm run dev
```

Then open the Vite URL shown in terminal.

Expected in dashboard:
- Status goes to `connected` and stays stable.
- Topics discovered > 0.
- Position panel updates.
- Acceleration panel updates.
- Camera feed appears (if `/out/compressed` is published).

---

## 7) If camera is missing

On robot:

```bash
ros2 topic list | rg "out|camera|image"
ros2 topic echo /out/compressed --once
```

If `/out/compressed` does not exist but another camera topic does, either:
- remap/publish to `/out/compressed`, or
- later update dashboard topic target.

---

## 8) If status still flaps connected/disconnected

Run these checks:

On robot:

```bash
ros2 run foxglove_bridge foxglove_bridge
```

Watch for crashes or repeated restarts.

On laptop:

```bash
ping -c 20 <ROBOT_IP>
```

Look for packet loss/latency spikes.

If Wi-Fi is unstable, test on wired Ethernet or isolated AP.

---

## 9) Optional: SSH tunnel fallback (if direct port access blocked)

From laptop:

```bash
ssh -N -L 8765:127.0.0.1:8765 <USER>@<ROBOT_IP>
```

Then set:

```bash
printf "VITE_FOXGLOVE_WS_URL=ws://127.0.0.1:8765\n" > .env
```

Keep tunnel terminal open while testing.

---

## 10) Quick test log template

Copy this for each robot:

- Robot name:
- Robot IP:
- `ROS_DOMAIN_ID`:
- Bridge command used:
- Dashboard URL value:
- Connected stable? (Y/N):
- Camera feed working? (Y/N):
- Odom updating? (Y/N):
- IMU updating? (Y/N):
- Notes/errors:

