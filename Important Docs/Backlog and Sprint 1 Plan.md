# Swarm Sense – Spring 2026
## Product Backlog & Sprint 1 Plan

**Team:** Jeana Chapman · Hussam Abubakr · Emiliano de la Garza · Jewel Littlefield · Jack Sapp · Hayla Turney

---

## Part 1: Product Backlog

The product backlog lists everything required to finish the final Swarm Sense conference demo. We built it based on the full project roadmap (M1–M8) and cover the complete set of features, infrastructure tasks, and quality requirements. We have written each item as a user story, prioritized, linked to a milestone, and assigned to a primary owner.

### Final Deliverables (Conference Goals)

- A native desktop dashboard that connects to up to 5 ROS 2 robots over WebSockets and displays live telemetry (Battery, Position, Status).
- Live H.264 video streams from all connected robots rendered at <200ms latency.
- A custom MATLAB export panel that records a session and downloads a timestamped `.mat` file.
- Stable 30-minute continuous operation with no UI freezes or crashes.
- Full documentation and packaged installer/Docker image for easy deployment.

### Backlog Items

| ID | User Story | Priority | Milestone | Assigned To |
|----|------------|----------|-----------|-------------|
| PB-01 | As the team, we need the ROS 2 + foxglove_bridge environment configured on all dev machines so development can begin. | High | M1 | Jewel Littlefield |
| PB-02 | As the team, we need an initial architecture document and GitHub repo, so everyone is aligned on the tech stack. | High | M1 | Jeana Chapman |
| PB-03 | As an operator, I want a dashboard wireframe approved by the sponsor, so UI work has a clear direction. | High | M2 | Hayla Turney |
| PB-04 | As an operator, I want the foxglove_bridge deployed on a robot and connected to the dashboard so I can see live telemetry. | High | M3 | Hussam Abubakr |
| PB-05 | As an operator, I want to see Battery, Position, and Status data for a connected robot in the dashboard. | High | M3 | Hayla Turney |
| PB-06 | As an operator, I want a live H.264 video feed displayed with <200ms latency so I can monitor the robot visually. | High | M4 | Emiliano de la Garza |
| PB-07 | As an operator, I want new robots to appear automatically in the dashboard when they connect to the network. | High | M4 | Emiliano de la Garza |
| PB-08 | As an operator, I want connection-loss and stale-data alerts, so I know when a robot feed is unreliable. | Medium | M4 | Emiliano de la Garza |
| PB-09 | As an operator, I want to start and stop recording sessions so I can capture a specific window of telemetry. | High | M5 | Jack Sapp |
| PB-10 | As a researcher, I want to export a recorded session as a `.mat` file so I can open it directly in MATLAB. | High | M5 | Jack Sapp |
| PB-11 | As a researcher, I want the exported `.mat` file verified by automated tests so I can trust its integrity. | Medium | M5 | Jack Sapp |
| PB-12 | As an operator, I want the dashboard to display 5 robots simultaneously without crashing. | High | M6 | Emiliano de la Garza |
| PB-13 | As an operator, I want the bridge to tune for high-bandwidth multi-robot scenarios, so video quality is maintained. | High | M6 | Hussam Abubakr |
| PB-14 | As an operator, I want the application to run stably for 30+ minutes under full load, so it is reliable for the conference. | High | M7 | Jewel Littlefield |
| PB-15 | As the team, I want a packaged installer/Docker image so the system can be deployed on physical robots without manual setup. | Medium | M7 | Jewel Littlefield |
| PB-16 | As an operator, I want a complete user/operator guide so any team member can set up and run the system. | Medium | M7 | Jeana Chapman |
| PB-17 | As the team, we need a successful live conference demonstration of all features, so the project is considered complete. | High | M8 | All |

---

## Part 2: Sprint 1 Plan

**Sprint Duration:** February 11, 2026 – February 28, 2026 (2 weeks)

**Sprint Goal:** Establish the full development environment, deploy the Foxglove Bridge on a simulated robot, and demonstrate live telemetry (Battery, Position, Status) visible in the dashboard by February 28 — satisfying Milestone M3.

### Sprint Backlog (Priorities for This Sprint)

- **PB-01:** Configure ROS 2 + bridge environment on all dev machines.
- **PB-02:** Produce architecture document and initialize GitHub repo.
- **PB-03:** Create initial Foxglove Studio Layout (JSON) and receive Sponsor approval.
- **PB-04:** Configure the IP/Connection and Deploy bridge on a simulated robot and establish a WebSocket connection.
- **PB-05:** Display live Battery, Position, and Status data in the dashboard for 1 robot.

### Team Meeting Days

The team will meet synchronously on the following days each week:

- **Tuesday** — full team standup and task assignment (start of week).
- **Thursday / Friday** — mid-to-end-of-week integration check and blocker resolution.
- **Ad-hoc** async communication via GroupMe daily; Zoom with sponsor as needed.

### Sprint 1 Timetable

| Date | Task | Owner | Status |
|------|------|-------|--------|
| Feb 11 (Tue) | Kickoff meeting — align on tech stack, assign roles, create GitHub org & repo | All | To Do |
| Feb 11 (Tue) | Draft architecture document (Foxglove Bridge deployment diagram, data flow) | Hussam Abubakr | To Do |
| Feb 12 (Wed) | Install ROS 2 Humble + foxglove_bridge package on all dev machines | Jewel Littlefield | To Do |
| Feb 12 (Wed) | Set up GitHub repo: branch structure, CI scaffold (GitHub Actions), README | Jewel Littlefield | To Do |
| Feb 13 (Thu) | Launch Gazebo simulation with 1 virtual robot; verify bridge connection | Hussam Abubakr | To Do |
| Feb 13 (Thu) | Prototype Layout in Foxglove Studio | Hayla Turney | To Do |
| Feb 14 (Fri) | Architecture doc review — team feedback round | All | To Do |
| Feb 17 (Mon) | Finalize dashboard wireframes and layout JSON prototype | Hayla Turney | To Do |
| Feb 17 (Mon) | Submit wireframes for sponsor review/approval | Jeana Chapman | To Do |
| Feb 18 (Tue) | Configure bridge to broadcast over University WiFi; test WebSocket connection | Hussam Abubakr | To Do |
| Feb 18 (Tue) | Scaffold custom extension (TypeScript/React) in repo; confirm build pipeline | Emiliano de la Garza | To Do |
| Feb 19 (Wed) | Mid-sprint sync — review progress, unblock issues | All | To Do |
| Feb 19 (Wed) | Add standard telemetry panels (Battery, Position, Status) to layout | Hayla Turney | To Do |
| Feb 20 (Thu) | Implement robot namespace detection logic; group topics by `/robot_*` prefix; Configure H.264 Encoding | Hussam Abubakr | To Do |
| Feb 20 (Thu) | Connect custom extension skeleton to live bridge data; confirm message receipt | Emiliano de la Garza | To Do |
| Feb 21 (Fri) | Sprint 1 demo prep — run full connection test with 1 simulated robot end-to-end | All | To Do |
| Feb 24 (Mon) | Fix issues identified in Feb 21 test; finalize namespace detection | Hussam Abubakr | To Do |
| Feb 24 (Mon) | Write unit tests for bridge connection and topic discovery logic | Jewel Littlefield | To Do |
| Feb 24 (Mon) | Buffer Logic (TypeScript) | Jack Sapp | To Do |
| Feb 25 (Tue) | Document setup steps: ROS 2 install, bridge config, layout import | Jeana Chapman | To Do |
| Feb 26 (Wed) | Final integration test: 1 robot, live battery/position displayed in dashboard | All | To Do |
| Feb 27 (Thu) | Buffer for remaining issues / re-testing | All | To Do |
| Feb 28 (Fri) | Sprint 1 Review — verify M3 success criteria met; demo to sponsor | All | To Do |

### Definition of Done – Sprint 1

- The bridge is installed and running on at least one machine/simulation.
- The dashboard successfully connects via WebSocket and displays a live topic list.
- Battery, Position, and Status data for 1 simulated robot are visible in real time.
- The architecture document is finalized and committed to the repository.
- Dashboard wireframes have received sponsor approval.
- GitHub repo has CI scaffold in place, and all team members have committed at least one branch.
