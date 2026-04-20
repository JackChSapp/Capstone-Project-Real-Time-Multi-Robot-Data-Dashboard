<p align = "center">
  <img src="assets and links/readmeBanner.png" width="100%" />
</p>

<h1 align= "center"> A Real-Time Multi-Robot Data Dashboard for the UTC Robotics Lab </h1>

### Project Members
Hussam Abubakr: Backend Developer

Jeana Chapman: Scrum Master & POC

Emiliano de la Garza: Full Stack Developer

Jewel Littlefield: DevOps Developer

Jack Sapp: Data Storage Developer

Hayla Turney: UI/UX Developer

### Project Sponsor:
Dr. Gokhan Erdemir

---

## Product Vision
**FOR** robotics research groups, autonomous system developers, and warehouse operators **WHO** are looking for ways to see all the data their machines are sensing in one central place. **THE** Swarm-Sense system is a centralized visualization platform **THAT** connects to robotics on a local network and synchronizes their sensor data (LiDAR, Vision, IMU, etc.) into a single, intuitive dashboard.

**UNLIKE** common visualization tools that center around a single sensor or proprietary software that is locked behind a specific brand, Swarm-Sense allows users to understand connect any robot regardless of manufacturer, visualize the sensor data in real-time in a low-latency system, and export this data for further behavior and anomalies analysis. 

Academic researchers and automated technology managers are the target customers for Swarm-Sense, as it will significantly facilitate monitoring and udnerstanding the data of multiple robots at the same time. It will provide "black box" recording capability for fleets increasing the efficiency with which failures in the robot and sensors can be solved. 

---

## Development Environment Setup

This project uses [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) to create a consistent and portable development environment. Please install them before proceeding.

### 1. Start all services

From the project root, build and start the simulation, dashboard, and recorder in one command:

```bash
docker compose up --build gazebo dashboard mcap-recorder
```

This starts three services:

| Service | Port | Description |
|---|---|---|
| `gazebo` | `8765` | Headless Gazebo simulation + Foxglove WebSocket bridge |
| `dashboard` | `5173` | React dashboard |
| `mcap-recorder` | `8000` | MCAP recording API |

### 2. Open the dashboard

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser. The dashboard will connect automatically to the simulation and begin displaying live sensor data.

### 3. Record sensor data

Click the **● Record** button in the top-right corner of the dashboard. A dropdown will appear listing all topics currently advertised by the simulation — all are selected by default. Choose the topics you want to capture and click **Start Recording**.

Click **■ Stop** to finalize the recording. The output `.mcap` file is saved to the `recordings/` directory at the project root.

To record via the API directly:

```bash
# Start recording all topics
curl -X POST http://localhost:8000/start \
  -H "Content-Type: application/json" \
  -d '{"ws_url": "ws://localhost:8765"}'

# Start recording specific topics
curl -X POST http://localhost:8000/start \
  -H "Content-Type: application/json" \
  -d '{"ws_url": "ws://localhost:8765", "topics": ["/robot1/odom", "/robot1/imu", "/clock"]}'

# Check recording status
curl http://localhost:8000/status

# Stop recording
curl -X POST http://localhost:8000/stop
```

---

### Supplemental: Connecting with Foxglove Studio

Recorded `.mcap` files and the live WebSocket bridge can both be opened in [Foxglove Studio](https://app.foxglove.dev) for deeper inspection.

**Live connection:**
1. Open Foxglove Studio (browser or desktop app)
2. Click **Open connection** → **Foxglove WebSocket**
3. Enter `ws://localhost:8765` and click **Open**

**Replay a recording:**
1. Click **Open local file**
2. Select any `.mcap` file from the `recordings/` directory

