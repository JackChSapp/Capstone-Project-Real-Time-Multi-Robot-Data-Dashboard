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

### 1. Initial Configuration

The project uses an environment file to manage configuration.

```bash
# Create a local environment file from the example template.
cp .env.example .env
```

You can customize variables in the `.env` file as needed.

### 2. Building the Foxglove Extension

The `swarm-sense-extension` is the custom panel for the Foxglove dashboard. To build it, run the following command from the project root:

```bash
# This will build the extension and place the .foxe file in swarm-sense-extension/dist/
docker-compose run --rm extension-builder
```

Drag and drop the generated `.foxe` file into the Foxglove Studio application to install it.

### 3. Running Backend Services

The backend services (like ROS) are defined in separate compose files. To start the ROS simulation environment, run:

```bash
# The -d flag runs the containers in the background (detached mode).
docker compose -f docker-compose.yml -f docker-compose.ros.yml up --build -d
```

```bash
# Verify the Foxglove Bridge is Alive
docker logs foxglove_bridge
```

```bash
# Verify ROS 2 is Working in the Sim
docker exec -it robot_sim bash -c "source /opt/ros/jazzy/setup.bash && ros2 topic list"
```

```bash
# Send Test Data to your Dashboard
docker exec -it robot_sim bash -c "source /opt/ros/jazzy/setup.bash && ros2 topic pub /test_topic std_msgs/msg/String 'data: \"Capstone Connection Success\"' -1"
```
