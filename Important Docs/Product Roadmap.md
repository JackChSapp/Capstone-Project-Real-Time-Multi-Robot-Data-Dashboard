<h1 align= "center"> Swarm Sense Spring 2026 Project Roadmap (Foxglove Edition)</h1>

## Product Summary
Swarm-Sense is a high-performance, web-based fleet command interface designed to interact directly with ROS 2 robotics systems via **Foxglove Bridge**. This product roadmap outlines the development strategy from February 2026 through the April 15, 2026 conference presentation, prioritizing near-zero latency visualization via WebSockets, multi-robot state monitoring, and a custom Data Export extension to support MATLAB analysis for up to 5 robots simultaneously.

## Product Goals & Success Criteria
### Main Objectives
- **Foxglove Integration**: Deploy `foxglove_bridge` on all robots to serve data over WebSockets (TCP) instead of raw DDS/UDP.
- **Low-Latency Visualization**: Achieve <100ms video latency using hardware-accelerated H.264 streaming (`foxglove_compressed_video_transport`).
- **Multi-Robot Scalability**: Configure a unified Studio layout to monitor 5 robots concurrently.
- **Caching & Export to MATLAB**: Develop a **Custom Foxglove Panel** (React) to buffer telemetry and export to .mat format.
- **Unified Fleet Interface**: Create a shared JSON layout profile that adapts to different robot types (Jackal, JetAuto, myAGV).

### Success Criteria
- **Connection**: Successful WebSocket connection and visualization of telemetry from one robot type by **February 28**.
- **Performance**: Dashboard displays live H.264 video feed with <200ms latency by **March 15**.
- **Caching & Export**: Custom Panel successfully exports a 5-minute telemetry slice to a .mat file by **March 31**.
- **Scalability**: Successful simultaneous connection and visualization of 5 robots in the grid layout by **April 10**.
- **Stability**: Browser interface maintains responsiveness (no crash/lag) during a 30-minute continuous operation test.

## Release Schedule and Milestones
| Milestone | Date | Deliverables | Success Criteria |
|-----------|------|--------------|------------------|
| **M1: Project Kickoff & Architecture** | Feb 11, 2026 | Architecture design, Foxglove Org setup | Team aligned on Bridge/Extension stack |
| **M2: UI Mockups** | Feb 19, 2026 | Dashboard Layout (JSON) and Panel designs | Sponsor approval on layout |
| **M3: Alpha - Core Infrastructure** | Feb 28, 2026 | Bridge deployed, Basic Layout configured | Studio connects to 1 robot & displays live battery |
| **M4: Beta - Dashboard MVP** | Mar 15, 2026 | H.264 Video Pipeline, Custom Panel prototype | Live video (<200ms) displayed in Studio |
| **M5: Data Export Integration** | Mar 31, 2026 | React Extension for MATLAB export | Successful download of .mat file from browser |
| **M6: Multi-Robot Support** | Apr 5, 2026 | Aggregated Layout for 5 robots | 5 concurrent video/data streams without browser crash |
| **M7: Release Candidate** | Apr 10, 2026 | Layout locking, Connection optimization | System stable for 30min+ operation |
| **M8: Conference Presentation** | Apr 15, 2026 | Live demonstration, Documentation | Successful conference demo |

## Feature Roadmap
### Phase 1: Foundation (Feb 11-Feb 28)
- **ROS 2 Env Setup**: Install `foxglove_bridge` and `ros-humble-foxglove-msgs` on dev machines.
- **Simulation**: Launch 1-3 virtual robots in Gazebo and connect via Bridge.
- **Studio Configuration**: Create the initial "Swarm Layout" with standard panels (3D, Plot, Raw Messages).
- **Network Discovery**: Configure Bridge to broadcast over University WiFi (WebSocket Secure if needed).
- **Input Display**: Configure standard gauges for Battery, Position, Status.

### Phase 2: Visualization (Mar 1-Mar 15)
- **Video Pipeline**: Implement `foxglove_compressed_video_transport` (H.264) on robots to replace MJPEG.
- **Dynamic Dashboard**: Utilize Foxglove's "Panel Settings" to map topics dynamically (e.g., `/robot_*/camera`).
- **Latency Optimization**: Tune encoder bitrate and browser hardware acceleration.
- **Error Handling**: Configure "Status Panel" to alert on connection drop or stale topics.

### Phase 3: Data Management (Mar 16-Mar 31)
- **Custom Panel Dev**: Initialize a Foxglove Extension (TypeScript/React).
- **Buffer Logic**: Implement a circular buffer in the extension's State to store N minutes of data.
- **MATLAB Converter**: Use a JS-based library (e.g., `mat4js` or JSON intermediate) to generate the download.
- **Export Verification**: Verify the downloaded file opens correctly in MATLAB.

### Phase 4: Scale & Polish (Apr 1-Apr 10)
- **Stress Test**: Connect 5 simulated robots and monitor Chrome memory usage.
- **Network Tuning**: Adjust `foxglove_bridge` parameters (send_buffer_limit) for high bandwidth.
- **Final UI Touches**: Lock the Studio layout to prevent accidental user changes.
- **Documentation**: Write a "Operator Guide" for connecting via the web interface.
- **Deployment**: Dockerize the Bridge for easy install on physical robots.

## Software Architecture
The Swarm-Sense system shifts from a custom desktop app to a **Server-Client architecture**. The "Backend" is now the **Foxglove Bridge** running on the robots, and the "Frontend" is **Foxglove Studio** running on the operator's laptop.

### Data Management & Caching
**Persistent storage is handled by browser-side extensions or native MCAP recording.**
- **Runtime Data Structure**:
  - **Custom Extension**: A React component running inside Foxglove Studio.
  - **Circular Buffer**: A TypeScript array storing the last 'N' minutes of incoming messages.
- **Export Pipeline**:
  - **Trigger**: User clicks "Export to MATLAB" on the custom panel.
  - **Process**: The TypeScript buffer is serialized and downloaded as a client-side file blob.
  - **Output**: Timestamped .mat files (or .json parsable by MATLAB).

### Application Framework
- **Frontend**: Foxglove Studio (Web/Desktop)
  - **Why**: Industry standard, effectively handles rendering of multiple high-bandwidth streams.
- **Custom Logic**: TypeScript + React (Foxglove Extensions SDK)
  - **Why**: Allows creation of the specific "MATLAB Export" button not found in standard Foxglove.
- **Visualization Engine**:
  - **Video**: Foxglove Image Panel (Hardware Accelerated H.264).
  - **Telemetry**: Foxglove Plot Panel (Canvas-based).

### ROS 2 Middleware & Network
- **Middleware**: ROS 2 Humble
- **Communication Protocol**: **WebSockets** (TCP) via `foxglove_bridge`.
  - **Why**: TCP is far more reliable than UDP multicast on restrictive University WiFi.
- **Discovery Mechanism**:
  - **How**: The Bridge aggregates all topics and advertises them to the connecting Studio instance.
- **Video Transport**:
  - Uses `foxglove_compressed_video_transport` (H.264) for max efficiency.

### Open-Source Components and Licensing
| Component | License | Purpose |
|-----------|---------|---------|
| Foxglove Bridge | MIT | WebSocket server for ROS 2 data |
| Foxglove Studio | MPL 2.0 | Dashboard Interface |
| React/TypeScript | MIT | Custom Extension Development |
| ffmpeg | LGPL | H.264 Encoding/Decoding |

### Development Tools and Workflow
- **Version Control**:
  - **Repo**: Includes Bridge launch files and the Custom Extension source code.
- **CI/CD Pipeline**:
  - **Extension Build**: npm build / yarn package for the custom panel.
- **Development Environment**:
  - **IDE**: VS Code (React/TS extensions).
  - **OS**: Ubuntu 22.04 (Robots), Any (Operator Laptop).

## Risk Management
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Browser Memory Leak** | Chrome crashes after 20 mins of 5 video streams. | Medium | **Downsampling**: Configure bridge to drop frames if client is slow. Use H.264 (lower RAM than MJPEG). |
| **Extension Complexity** | Team struggles with React/TypeScript for the export button. | Medium | **Fallback**: Use Foxglove's native **MCAP recording** and write a simple Python script to convert MCAP -> MAT post-session. |
| **Network Bandwidth** | 5 robots saturate the WiFi AP. | High | **Bitrate Cap**: Enforce a strict bitrate limit (e.g., 500kbps) in the H.264 encoder settings. |

## Appendix
### Team Rules & Responsibilites (Updated)
- Jeana Chapman: Scrum Master and POC
  - Responsibilities: Sprint planning, alignment on Foxglove features vs. Custom work.
- Hussam Abubakr: Backend / ROS 2 Engineer
  - Responsibilities: **Foxglove Bridge** deployment, Network/WebSocket tuning, H.264 Encoder configuration on robots.
- Emiliano de la Garza: Application Integration (Full Stack)
  - Responsibilities: **Foxglove Custom Extension** development (React), Main dashboard layout configuration, End-to-end testing.
- Jewel Littlefield: DevOps & Release Engineer
  - Responsibilities: Dockerizing the Bridge, Automating Extension builds, Simulation environment setup.
- Jack Sapp: Data Engineer
  - Responsibilities: **TypeScript Buffer Logic** (inside the extension), ensuring Data-to-MATLAB formatting is correct.
- Hayla Turney: UI/UX Developer
  - Responsibilities: Dashboard visual design (JSON Layouts), CSS styling for the Custom Extension, User experience flow.