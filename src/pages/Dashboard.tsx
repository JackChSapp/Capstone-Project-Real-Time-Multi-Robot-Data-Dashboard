
import CameraFeed from "../components/CameraFeed";
import PositionPanel from "../components/PositionPanel";
import BatteryPanel from "../components/BatteryPanel";
import AccelerationPanel from "../components/AccelerationPanel";
import StatusPanel from "../components/StatusPanel";

export default function Dashboard() {
  return (
    <div>
      <h1>Robot Dashboard</h1>
      <p>Note: Currently experiencing issues with the WebSocket connection to React Dashboard. This is being worked on! --Hayla Turney</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <CameraFeed />
        <BatteryPanel />
        <PositionPanel />
        <AccelerationPanel />
        <StatusPanel />
      </div>
    </div>
  );
}