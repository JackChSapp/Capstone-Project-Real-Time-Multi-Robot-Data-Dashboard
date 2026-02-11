
<h1 align= "center"> Swarm Sense Spring 2026 Project Roadmap</h1>

## Product Summary
Swarm-Sense is a high-performance, native desktop application designed to designed to interface directly with ROS 2 robotics systems on a local network and synchronize their sensor data into a single, intuitive dashboard. This product roadmap outlines the development strategy from February 2026 through the April 15, 2026 conference presentation, prioritizing near-zero latency visualization, multi-robot state monitoring, Caching & Export to MATLAB, and scalability to support up to 5 robots simultaneously.

## Product Goals & Success Criteria
### Main Objectives
- **Native ROS 2 Integration**: Develop a standalone desktop application (Qt/Python) that interfaces directly with robot topics via DDS.
- **Low-Latency Visualization**: Provide real-time visualization of sensor data with low latency (<100ms)
- **Multi-Robot Scalability**: Support concurrent state monitoring and video streaming for up to 5 robots.
- **Caching & Export MATLAB**: Implement data recording and export to MATLAB format
- **Unified Fleet Interface**: Create a single, adaptive dashboard that automatically handles different robot types (Jackal, JetAuto, myAGV).
### Success Criteria
- **Connection**: Successful discovery and visualization of telemetry (Battery, Position) from one robot type by **February 28**.
- **Performance**: Dashboard displays live compressed video feed with <200ms latency by **March 15**.
- **Caching & Export**: Data export to MATLAB verified and functional by **March 31**
- **Scalability**: Successful simultaneous connection and visualization of 5 robots by **April 10**.
- **Stability**: Application maintains responsive UI (no freezing) during a 30-minute continuous operation test with full video load **Before Conference**.

## Release Schedule and Milestones
| Milestone | Date | Deliverables | Success Criteria |
|-----------|------|--------------|------------------|
| **M1: Project Kickoff & Architecture** | Feb 11, 2026 | Architecture design, initial repo setup | Team aligned on tech stack |
| **M2: UI Mockups** | Feb 19, 2026 | Dashboard wireframes and mockups | Sponsor approval on design |
| **M3: Alpha - Core Infrastructure** | Feb 28, 2026 | Basic GUI, Discovery logic, Telemetry display | App discovers 1 robot & displays live battery/status |
| **M4: Beta - Dashboard MVP** | Mar 15, 2026 | Low-latency video pipeline, UI layout | Live video (<200ms latency) from 1 robot displayed in App |
| **M5: Data Export Integration** | Mar 31, 2026 | In-memory data buffering, .mat file generation | Successful export of a 5-min session to MATLAB format |
| **M6: Multi-Robot Support** | Apr 5, 2026 | Dynamic UI generation for 5 robots | 5 concurrent video/data streams (Sim or Physical) without crashing |
| **M7: Release Candidate** | Apr 10, 2026 | Bug fixes, performance optimization | System stable for 30min+ operation |
| **M8: Conference Presentation** | Apr 15, 2026 | Live demonstration, documentation | Successful conference demo |

## Feature Roadmap
### Phase 1: Foundation (Feb 11-Feb 28)
- **ROS 2 Env Setup**: Dev machines should have Ubuntu and ROS2
- **Simulation**: Understand Simulation tools, launch 1-3 virtual robots for testing.
- **Native App Skeleton**: Setup basic PyQt6 window with ROS 2 node initialization (rclpy).
- **Discover Robots in a Network**: With Scanner thread list all the actuve ROS Nodes.
- **Input Display**: Create UI widgets for basic robot data like Battery, Position, Status.
### Phase 2: Visualization (Mar 1-Mar 15)
- **Video Pipeline**: Showcase video data into the UI
- **Dynamic Dashboard**: Whenever a new robot is discovered in the wifi a "widget" should be created for said robot.
- **Latency Optimizatio**: Optimize the latency.
- **Error handling**: Error logging and debugging interface, connction lost, stale data, etc.
### Phase 3: Data Management (Mar 16-Mar 31)
- **Buffer**: Implement a buffer to store N minutes of stream.
- **Session Recording Manager**: Start/Stop button for data presenvation.
- **MATLAB Converter**: Dump the buffer into .mat files.
- **Policies**: Data retension policies
- **Export Verification**: Unit tests, make sure .mat file opens correctly.
### Phase 4: Scale & Polish (Apr 1-Apr10)
- **Stress Test**: Check how many robots the system can manage, goal is 5 showing in the dashboard.
- **Network Tuning**: Many robots on the internet will cause high-bandwidth, create cyclonedds.xml
- **Final UI touches**: Dashboard layout customization
- **Documentation**: Comprehensive user documentation
- **Installer Creation** Package the python app into an executable for easy deployment.

## Software Architecture
The Swarm-Sense system architecture is designed for high-performance, low-latency execution. Unlike traditional web-based dashboards, Swarm Sense operates as a native ROS 2 node, allowing it to interface directly with the Data Distribution Service (DDS) middleware used by the robots. The following sections describe the key architectural decisions.
### Data Management & Caching
**Since the application prioritizes real-time performance, persistent storage is replaced by an efficient in-memory caching system.**
- **Runtime Data Structure**:
  - **Circular Buffer**: A RAM-based ring buffer stores the last 'N' minutes of telemetry for each active robot (configurable, default: 5 minutes).
  - **Data Types**: sensor_msgs/BatteryState, nav_msgs/Odometry, sensor_msgs/CompressedImage
- **Export Pipeline**:
  - **Trigger**: User decides to "Record" or "Export Session" via GUI.
  - **Process**: The in-memory buffer is serialized into a dictionary and converted to .mat format by using scipy.io
  - **Output**: Timestamped .mat files.

### Application Framework
- **Language**: Python 3.10+
- **GUI Framework**: Qt 6 (via PySide6)
  - **Why**: Allows use of native C++ tools that are used for rendering stream videos with low-latency.
- **Visualization Engine**:
  - **Video**: Custom QLabel widget with multi-threaded QImage decoding.
  - **Telemetry**: Qt Charts or pyqtgraph for real-time battery/velocity plotting.
- **Concurrency Model**:
  - **Main Thread**: Handles UI events and user interaction only.
  - **Worker Threads (QThread)**: Dedicated threads for ROS 2 callbacks and image decompression to prevent UI freezing.

### ROS 2 Middleware & Network
- **Middleware**: ROS 2 Humble
- **Communication Protocol**: DDS (Data Distribution Service) – likely CycloneDDS for best WiFi performance.
- **Discovery Mechanism**:
  - **How**: The application utilizes the ROS 2 Daemon to query the active node_list and topic_list.
  - **Namespace Detection**: Automatically groups topics by robot namespace (e.g., /jackal_1/..., /jetauto_2/...).
- **Video Transport**:
  - Uses image_transport/compressed (JPEG/H.264) to maintain <100ms latency on wireless networks.

### Open-Source Components and Licensing
| Component | License | Purpose |
|-----------|---------|---------|
| ROS 2 (rclpy) | Apache 2.0 | Core robot communication and node management |
| PySide6 (Qt) | LGPL v3 | Graphical User Interface framework |
| SciPy | BSD | MATLAB (.mat) file generation |
| cv_bridge | BSD | Converting ROS images to OpenCV/Qt formats |

Note: PySide6 (LGPL) allows use in proprietary/open software as long as the library is dynamically linked (not modified)

- **Licensing Strategy**:
  - Open-Sourced under **MIT License**
- **Contribution Guidelines**:
  - Check you code before contributing.
  - All ROS nodes must have their launch file for testing.

### Development Tools and Workflow
- **Version Control**:
  - System: Git with GitHub repository
  - Branching Strategy: GitFlow
  - Pull Request Policy: all code changes require peer review and passing CI checks before merge
- **CI/CD Pipeline**:
  - GitHub actions for automated testing and deployment
  - Unit tests: pytest for logic verification.
  - Integration tests: launch_testing (ROS 2) to verify node startup and communication.
- Development Environment:
  - **IDE**: VS Code with Python and ROS extensions.
  - **OS**: Ubuntu 22.04 LTS (Required for ROS 2 Humble).
  - **Local Setup**: TBD
  - **Documentation**: TBD
- Project Management
  - Tool: GitHub Projects
  - Sprint Planning: 2-week sprints with daily EOD standups
  - Communication: GroupMe for team communication, Email/Zoom for sponsor meetings

## Risk Management
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Network Saturation** | 5 video streams pver the network will strain the connections. | High | **Adaptive downsampling**: Lower resolution to 320x240 and 15 FPS at the robot level. Use cyclonedds tuning for WiFi. |
| **UI Freezing** | Having too many streams running overloads the Interface, making the app unresponsive. | High | **Threading**: Using QThread workers, never on the main GUI thread. |
| **Robot Availability** | Physical robots are broken, charging, or in use by other teams. | Medium | **Simulation-First Development**: Ensure the app works 100% with simulation software so that robot's availability does not stop deployment. |
| **ROS Version Mismatch** | Older robots (Jackal) might run ROS 1, breaking communication. | Medium | **Dockerized Bridges**: If a robot cannot be upgraded to ROS 2 Humble, deploy a localized ros1_bridge container on that specific robot. |

## Appendix
### Team Rules & Responsibilites 
- Jeana Chapman: Scrum Master and POC
  - Responsibilities: Sprint planning, communication, documentation, cross-functional technical support, timeline management
- Hussam Abubakr: Backend / ROS 2 Engineer
  - Responsibilities: ROS 2 Node architecture, DDS configuration, Network discovery logic, Telemetry data structuring.
- Emiliano de la Garza: Application Integration (Full Stack)
  - Responsibilities: Connecting UI to ROS backend, Thread management (preventing UI freezes), Main application logic, End-to-end testing.
- Jewel Littlefield: DevOps & Release Engineer
  - Responsibilities: CI/CD pipeline: CI/CD pipeline (GitHub Actions), Simulation environment setup, Application packaging (PyInstaller for executable generation).
- Jack Sapp: Data Engineer
  - Responsibilities: In-memory circular buffer implementation, Session caching logic, MATLAB (.mat) file generation and verification.
- Hayla Turney: UI/UX Developer
  - Responsibilities: Dashboard visual design, PyQt/PySide6 widget implementation, User experience flow, Custom visualization widgets.



