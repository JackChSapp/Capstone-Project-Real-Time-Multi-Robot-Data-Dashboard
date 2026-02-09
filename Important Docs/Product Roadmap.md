
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

