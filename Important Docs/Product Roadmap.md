
<h1 align= "center"> Swarm Sense Spring 2026 Project Roadmap</h1>

## Product Summary
Swarm-Sense is a centralized visualization platform designed to connect robotics systems on a local network and synchronize their sensor data into a single, intuitive dashboard. This product roadmap outlines the development strategy from February 2026 through the April 15, 2026 conference presentation, with key milestones for sensor integration, data recording, MATLAB export capabilities, and scalability to support up to 5 robots simultaneously.

## Product Goals & Success Criteria
### Main Objectives
- Enable connection to all UTC Robotics Lab robots with multi-brand robot support
- Provide real-time visualization of sensor data with low latency (<100ms)
- Support concurrent monitoring of up to 5 robots
- Implement data recording and export to MATLAB format
- Create an intuitive dashboard interface
### Success Criteria
- Successful connection and data streaming frmo at least one robot type by Ferbuary 28
- Dashboard displays real-time sensor data with visual clarity by March 15
- Data export to MATLAB verified and funcitonal by March 31
- Support for 5 simultaneous robot connections demonstrated by April 10
- System remains stable during 30-minute continuous operation

## Release Schedule and Milestones
| Milestone | Date | Deliverables | Success Criteria |
|-----------|------|--------------|------------------|
| **M1: Project Kickoff & Architecture** | Feb 11, 2026 | Architecture design, initial repo setup | Team aligned on tech stack |
| **M2: UI Mockups** | Feb 19, 2026 | Dashboard wireframes and mockups | Sponsor approval on design |
| **M3: Alpha - Core Infrastructure** | Feb 28, 2026 | Robot connection, basic data pipeline | Single robot streaming data |
| **M4: Beta - Dashboard MVP** | Mar 15, 2026 | Real-time visualization, data recording | Dashboard displays live sensor data |
| **M5: Data Export Integration** | Mar 31, 2026 | MATLAB export functionality | Successful data export verified |
| **M6: Multi-Robot Support** | Apr 5, 2026 | Support for 5 concurrent robots | 5 robots connected simultaneously |
| **M7: Release Candidate** | Apr 10, 2026 | Bug fixes, performance optimization | System stable for 30min+ operation |
| **M8: Conference Presentation** | Apr 15, 2026 | Live demonstration, documentation | Successful conference demo |

## Feature Roadmap
### Phase 1: Foundation (Feb 11-Feb 28)
- Network discovery and robot connection protocol
- Basic data ingestion pipeline for single robot
- Core databse for sensor data storage
- Simple command line interface for testing
- Initial CI/CD pipeline setup
### Phase 2: Visualization (Mar 1-Mar 15)
- Real-time dashboard UI
- Sensor data visualization components
- Basic data playback funcitonality
- Connection status monitoring
- Error logging and debugging interface
### Phase 3: Data Management (Mar 16-Mar 31)
- MATLAB export module (.mat file generation)
- Data recording and session management
- Time series data compression
- Data retension policies
- Export format configuration
### Phase 4: Scale & Polish (Apr 1-Apr10)
- Multi-robot connection manager (up to 5 displayed/connected at a time, but more on standby/saved in the system)
- Performance optimization for concurrent streams
- Dashboard layout customization
- Comprehensive user documentation
- System stability and stress testing

## Software Architecture
The Swarm Sense system architecture is designed for modularity, scalability, and ease of maintenance. The following sections describe the key architectural decisions across five critical areas: Database, Platform, Server, Open-source components, and Development tools
### Dattabase Architecture
- Primary Database TBD
- Secondary Storage: TBD
- Data Outline:
  - Measurements: Robot data readings organized by sensor type
  - Tags: Robot ID, sensor ID, session ID for efficient filtering
  - Fields: Sensor-specific data
  - Retention: Configurable data retention policies (possible defaultL 30 days for raw data)
### Platform Architecture
- Framework: TBD
- UI Library: TBD
- Visualizatoin: TBD
- Key Platform Features:
  - Responsive dashboard layout with drag-and-drop widget positioning (have default positioning based on last save/new robot)
  - Real-time data streaming (specifics TBD)
  - Component-based architecture for sensor visualizations
  - State management TBD
  - (Possible Idea) Progressive Web App capabilities for tablet deployment
- Deployment: The dashboard will be deployed as a containerized application for easy installation on lab servers
### Server Architecture
- Backend:
  - Language: Python
  - Framework: TBD
  - Robot Communication: ROS2 integration
- Server Components:
  - Specifics TBD
### Open-Source Components and Licensing
| Component | License | Purpose |
|-----------|---------|---------|
| TBD | TBD | TBD |

- Licensing Strategy:
  - TBD
- Contribution Guidelines:
  - TBD
### Development Tools and Workflow
- Version Control:
  - System: Git with GitHub repository
  - Branching Strategy: GitFlow
  - Pull Request Policy: all code changes require peer review and passing CI checks before merge
- CI/CD Pipeline:
  - GitHub actions for automated testing and deployment
  - Unit tests: TBD
  - Integration tests: TBD
- Development Environment:
  - IDE: VS code
  - Local Setup: TBD
  - Documentation: TBD
- Project Management
  - Tool: GitHub Projects
  - Sprint Planning: 2-week sprints with daily EOD standups
  - Communication: GroupMe for team communication, Email/Zoom for sponsor meetings

## Risk Management
| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| TBD | TBD | TBD | TBD |

## Appendix
### Team Rules & Responsibilites 
- Jeana Chapman: Scrum Master and POC
  - Responsibilities: Sprint planning, communication, documentation, cross-functional technical support, timeline management
- Hussam Abubakr: Backend Developer
  - Responsibilities: FastAPI implementation, data pipeline, ROS2 integration
- Emiliano de la Garza: Full Stack Developer
  - Responsibilities: End-to-end features, API integration, testing
- Jewel Littlefield: DevOps Developer
  - Responsibilities: CI/CD pipeline: Docker containers, deployment
- Jack Sapp: Data Storage Developer
  - Responsibilities: Database outline, Optimization, MATLAB export
- Hayla Turney: UI/UX Developer
  - Responsibilities: Dashboard design, react components, user experience



