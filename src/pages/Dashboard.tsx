
// npm install --save-dev @types/react @types/react-dom 
//if receiving errors about missing types for React, install the above packages
import { useState } from "react";
import "./appStyle.css"
import "../services/rosConnection";

import CameraFeed from "../components/CameraFeed";
import { PositionPanel } from "../components/PositionPanel";
import BatteryPanel from "../components/BatteryPanel";
import AccelerationPanel from "../components/AccelerationPanel";
import StatusPanel from "../components/StatusPanel";

export default function Dashboard(): React.ReactElement {
  const [selectedRobot, setSelectedRobot] = useState<string>("Robot 1");
  const robots: string[] = ["Export .mat"]; //add different Robot buttons if needed

  return (
    <div className="dashboard-container">
      {/* UTC Logo */}
      <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 10 }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/d/df/University_of_Tennessee_at_Chattanooga_athletics_logo.png"
          alt="UTC Logo" 
          style={{ height: "50px", width: "auto" }}
        />
    </div>
      
      {/* Title */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Multi-Data Robot Dashboard</h1>
      </div>
      
      <p className="dashboard-title" style={{ fontSize: "18px", marginBottom: "20px" }}>
        Hussam Abubakr | Jeana Chapman | Emiliano de la Garza | Jewel Littlefield | Jack Sapp | Hayla Turney
      </p>

      {/* Robot Buttons */} 
      <div className="robot-buttons">
        {robots.map((robot: string) => (
          <button
            key={robot}
            onClick={() => setSelectedRobot(robot)}
            className={`robot-button ${selectedRobot === robot ? "active" : ""}`}
          >
            {robot}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-container">
        <div className="panel large">
          <h3 className="panel-title">Camera Feed</h3>
          <div style={{ flex: 1 }}>
            <CameraFeed />
          </div>
        </div>

        <div className="panel">
          <h3 className="panel-title">Position Panel</h3>
          <PositionPanel />
        </div>

        <div className="panel">
          <h3 className="panel-title">Battery</h3>
          <BatteryPanel />
        </div>

        <div className="panel">
          <h3 className="panel-title">Acceleration</h3>
          <AccelerationPanel />
        </div>

        <div className="panel">
          <h3 className="panel-title">Status</h3>
          <StatusPanel />
        </div>
      </div>
    </div>
  );
}