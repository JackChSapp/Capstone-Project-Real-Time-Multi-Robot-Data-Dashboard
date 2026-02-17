# Swarm Sense — To-Do

## General (Ongoing)
- [X] Fix ROS package name in `setup.py` and `CMakeLists.txt` — change `'Capstone Robot Dashboard'` to `'swarm_sense_dashboard'` (ROS does not allow spaces in package names)
- [X] Fix `setup.cfg` — replace both `<package-name>` placeholders with `swarm_sense_dashboard`
- [X] Fill in `swarm-sense-extension/package.json` fields: set `publisher`, `description`, and bump `version` to `0.1.0`

---

## Sprint 1 — Week of 2/17

> **Architecture Decision (Confirmed):**
> We are building a **Foxglove Studio custom extension** (TypeScript/React) as our primary dashboard.
> The native PyQt6/Python app remains our **backup plan** if Foxglove proves unworkable.
> All Sprint 1 tasks reflect the Foxglove approach.

---

### 2/17 — Tuesday

- [ ] Install Foxglove Studio on all dev machines (download at https://foxglove.dev/download) → **All**
- [ ] Install ROS 2 Humble on all dev machines if not already done:
  `sudo apt install ros-humble-desktop` → **All**
- [ ] Install foxglove_bridge on all dev machines:
  `sudo apt install ros-humble-foxglove-bridge` → **All**
- [ ] Finalize wireframe design — select one of the 3 designs and confirm with sponsor → **Hayla**
- [ ] Build Foxglove Studio layout with 3 panels (Battery, Position, Status) and export as a `.json` file → **Hayla**
- [ ] Submit wireframe to Dr. Erdemir for sponsor approval → **Jeana**
- [ ] Update architecture docs to reflect Foxglove extension as primary approach, PyQt6 as backup → **Jeana**

---

### 2/18 — Wednesday

- [ ] Install Turtlebot3 Gazebo simulation package:
  `sudo apt install ros-humble-turtlebot3-gazebo` → **Hussam**
- [ ] Launch Gazebo simulation with 1 virtual Turtlebot3 robot and confirm it is publishing ROS 2 topics → **Hussam**
- [ ] Start foxglove_bridge and confirm it connects locally — open Foxglove Studio, connect to `ws://localhost:8765`, and verify the topic list from the simulated robot appears → **Hussam**
- [ ] Scaffold the custom extension — in `swarm-sense-extension/src/ExamplePanel.tsx`, replace the placeholder `/some/topic` subscription with real topic names from the Gazebo robot (e.g. `/battery_state`, `/odom`). Run `npm run local-install` to confirm the extension loads in Foxglove Studio → **Emiliano**

---

### 2/19 — Thursday

- [ ] Mid-sprint sync — team check-in, share progress, surface any blockers → **All**
- [ ] Test foxglove_bridge over University WiFi — run the simulation on one machine and the dashboard on another, connect over WiFi instead of localhost, confirm the WebSocket connection works → **Hussam**
- [ ] Add Battery, Position, and Status panels to the Foxglove layout JSON — configure each panel to point at the correct simulated robot topics, re-export the `.json` → **Hayla**

---

### 2/20 — Friday

- [ ] Implement robot namespace detection — add logic to the extension to group topics by namespace prefix (e.g. `/robot_1/battery_state`, `/robot_2/battery_state`). This is the foundation for multi-robot support → **Hussam / Emiliano**
- [ ] Configure H.264 compressed image transport on the bridge — set the bridge to use `image_transport/compressed` so video is transmitted efficiently over WebSocket → **Hussam**
- [ ] Connect the custom extension to the live bridge — the extension should read real topic data from the Gazebo robot and display it inside the Foxglove panel → **Emiliano**

---

### 2/21 — Saturday (or moved to 2/20 Friday if team prefers)

- [ ] Full end-to-end test — 1 simulated Gazebo robot running, foxglove_bridge active, Foxglove Studio open, custom extension loaded, live Battery/Position/Status data visible on screen → **All**
- [ ] Document all failures and blockers found during the test for follow-up next week → **All**

---

## Sprint 1 — Week of 2/24

- [ ] Fix all issues identified during the end-to-end test → **Hussam**
- [ ] Write unit tests for bridge connection logic and topic discovery → **Jewel**
- [ ] Implement TypeScript circular buffer skeleton in the extension — a simple ring buffer that stores the last N messages per topic in memory (no MATLAB export yet, just the data structure) → **Jack**
- [ ] Write setup documentation — step-by-step instructions for: installing ROS 2, installing the bridge, running the simulation, importing the Foxglove layout, and loading the extension → **Jeana**
- [ ] Final integration test (2/26 — Wednesday) — repeat the end-to-end test with all fixes applied, goal is a clean pass → **All**
- [ ] Buffer day (2/27 — Thursday) — reserved for any remaining fixes or re-testing → **All**
- [ ] Sprint 1 Review with Dr. Erdemir (2/28 — Friday) — live demo of 1 simulated robot with battery/position visible in the Foxglove dashboard, M3 milestone criteria must be met → **All**

---

## Sprint 1 — Definition of Done (M3)

All of the following must be true by 2/28:

- [ ] foxglove_bridge is installed and running on at least one machine
- [ ] Foxglove Studio connects via WebSocket and shows a live topic list from a simulated robot
- [ ] Battery, Position, and Status data from 1 simulated robot are visible in real time in the dashboard
- [ ] Architecture document is finalized and committed to the repo
- [ ] Foxglove layout JSON is committed to the repo
- [ ] Wireframes have received sponsor approval from Dr. Erdemir
- [ ] GitHub repo has CI scaffold in place and all team members have committed at least once

---

## Completed ✅

- [x] Create product roadmap → Jeana (2/10)
- [x] Create product backlog → All (2/11)
- [x] Plan Sprint 1 → All (2/11)
- [x] Create dashboard mockup designs (3 options) → Hayla
- [x] Initialize GitHub repo with Foxglove extension scaffold
- [x] Draft architecture document
