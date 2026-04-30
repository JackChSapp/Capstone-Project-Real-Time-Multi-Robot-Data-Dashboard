<p align="center">
  <img src="assets and links/readmeBanner.png" width="100%" />
</p>

<h1 align="center">Swarm Sense — Real-Time Multi-Robot Data Dashboard</h1>

<p align="center">
  A centralized visualization platform for the UTC Robotics Lab that connects to multiple robots on a local network and streams their live sensor data into a single, intuitive dashboard.
</p>

---

## Download

> **Pre-built Windows installer (.exe) is available on the [Releases page](../../releases/latest).**

1. Go to [Releases](../../releases/latest)
2. Under **Assets**, download `Swarm Sense Setup.exe`
3. Run the installer — no additional setup required
4. Launch **Swarm Sense** from your Start Menu or Desktop shortcut
5. Click **⚙ Settings → Connection** and enter your robot's Foxglove WebSocket URL (e.g. `ws://192.168.1.42:8765`)

> **No Docker required** to run the dashboard or connect to a real robot. Docker is only needed if you want to run the built-in Gazebo simulation or use the MCAP recording feature — see below.

---

## Project Members

| Name | Role |
|---|---|
| Hussam Abubakr | Backend Developer |
| Jeana Chapman | Scrum Master & POC |
| Emiliano de la Garza | Full Stack Developer |
| Jewel Littlefield | DevOps Developer |
| Jack Sapp | Data Storage Developer |
| Hayla Turney | UI/UX Developer |

**Project Sponsor:** Dr. Gokhan Erdemir

---

## Product Vision

**FOR** robotics research groups and autonomous system developers **WHO** need to monitor multiple robots simultaneously, **THE** Swarm Sense system is a centralized visualization platform **THAT** connects to any ROS 2 robot on a local network and streams their sensor data — LiDAR, camera, IMU, odometry — into a single, real-time dashboard.

**UNLIKE** single-sensor tools or proprietary vendor software, Swarm Sense is open, hardware-agnostic, and ships as a native desktop application with built-in data recording.

---

## Features

- **Live sensor panels** — Camera feed, position/odometry, IMU acceleration, battery status, connection status
- **Dynamic layout** — Drag, resize, open, and close panels freely; layout saves between sessions
- **MCAP recording** — Record any combination of ROS 2 topics to `.mcap` files for later replay in Foxglove Studio
- **Configurable connection** — Change the Foxglove WebSocket bridge URL at any time via Settings without restarting
- **Desktop app** — Ships as a native Windows `.exe` installer (macOS `.dmg` build also supported)
- **PWA support** — Installable as a browser app on Chrome/Edge when running the web version

---

## What Requires Docker?

| Feature | Requires Docker? |
|---|---|
| Running the dashboard (.exe) | ❌ No |
| Connecting to a real robot | ❌ No |
| Gazebo simulation (development/testing) | ✅ Yes |
| MCAP recording (Record button) | ✅ Yes — the recorder service must be running on your dashboard PC |

For most real-robot use, you only need the `.exe` and the Foxglove bridge running on each robot.

---

## Connecting a Real Robot

Swarm Sense connects to any ROS robot running the **Foxglove WebSocket bridge**. Install the bridge on the robot (not your dashboard PC), then point Swarm Sense at the robot's IP.

### ROS 2

**Install:**
```bash
sudo apt install ros-$ROS_DISTRO-foxglove-bridge
```

**Run:**
```bash
ros2 run foxglove_bridge foxglove_bridge
```

By default the bridge listens on port `8765`. To change the port:
```bash
ros2 run foxglove_bridge foxglove_bridge --ros-args -p port:=8765
```

### ROS 1

**Install:**
```bash
sudo apt install ros-$ROS_DISTRO-foxglove-bridge
```

**Run:**
```bash
roslaunch foxglove_bridge foxglove_bridge.launch
```

To change the port:
```bash
roslaunch foxglove_bridge foxglove_bridge.launch port:=8765
```

### Connect Swarm Sense to the Robot

Once the bridge is running on the robot:

1. Find the robot's IP address — run `hostname -I` on the robot (e.g. `192.168.1.42`)
2. Open **⚙ Settings → Connection** in Swarm Sense
3. Enter `ws://<robot-ip>:8765` (e.g. `ws://192.168.1.42:8765`)
4. Click **Connect**

> **Tip:** Both the dashboard PC and the robot must be on the **same local network** (lab WiFi or Ethernet).

### Firewall Note

If the connection fails, make sure port `8765` is open on the robot:
```bash
sudo ufw allow 8765/tcp
```

---

## Development Environment Setup

This section covers running the Gazebo simulation and MCAP recorder locally for development and testing. This requires [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/).

### Start All Services

From the project root:

```bash
docker compose up --build gazebo dashboard mcap-recorder
```

| Service | Port | Description |
|---|---|---|
| `gazebo` | `8765` | Headless Gazebo simulation + Foxglove WebSocket bridge |
| `dashboard` | `5173` | React dashboard (web version) |
| `mcap-recorder` | `8000` | MCAP recording API |

### Open the Dashboard

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## Building the Desktop App (.exe / .dmg)

Requirements: [Node.js 18+](https://nodejs.org/)

```bash
cd dashboard
npm install --legacy-peer-deps
npm run electron:build
```

The installer is output to `dashboard/electron-dist/`:
- **Windows:** `Swarm Sense Setup.exe`
- **macOS:** `Swarm Sense.dmg`

To run the desktop app locally without building an installer:

```bash
npm run electron:dev
```

---

## Recording Sensor Data

Click **● Record** in the top-right corner of the dashboard. Select the topics to capture and click **Start Recording**. Click **■ Stop** to finalize — the `.mcap` file is saved to `recordings/`.

> **Note:** The MCAP recorder requires the `mcap-recorder` Docker service to be running (`docker compose up mcap-recorder`). This applies whether you are using the simulation or a real robot.

To record via the API directly:

```bash
# Start recording all topics
curl -X POST http://localhost:8000/start \
  -H "Content-Type: application/json" \
  -d '{"ws_url": "ws://localhost:8765"}'

# Stop recording
curl -X POST http://localhost:8000/stop

# Check status
curl http://localhost:8000/status
```

---

## Replaying Recordings in Foxglove Studio

1. Open [Foxglove Studio](https://app.foxglove.dev) (browser or desktop)
2. Click **Open local file** and select any `.mcap` file from `recordings/`

For a live connection: **Open connection → Foxglove WebSocket → `ws://localhost:8765`**
