import "./appStyle.css";

import CameraFeed from "../components/CameraFeed";
import PositionPanel from "../components/PositionPanel";
import BatteryPanel from "../components/BatteryPanel";
import AccelerationPanel from "../components/AccelerationPanel";
import StatusPanel from "../components/StatusPanel";
import RecordButton from "../components/RecordButton";
import {
  getFoxgloveWebSocketUrl,
  useFoxgloveDashboard,
} from "../services/rosConnection";

export default function Dashboard(): React.ReactElement {
  const foxgloveUrl = getFoxgloveWebSocketUrl();
  const foxglove = useFoxgloveDashboard(foxgloveUrl);

  return (
    <div className="dashboard-container">
      <div style={{ position: "absolute", top: "24px", right: "24px", zIndex: 10 }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/df/University_of_Tennessee_at_Chattanooga_athletics_logo.png"
          alt="UTC Logo"
          style={{ height: "50px", width: "auto" }}
        />
      </div>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Multi-Data Robot Dashboard</h1>
      </div>

      <p className="dashboard-title" style={{ fontSize: "18px", marginBottom: "20px" }}>
        Hussam Abubakr | Jeana Chapman | Emiliano de la Garza | Jewel Littlefield | Jack Sapp | Hayla Turney
      </p>

      <div className="toolbar">
        <RecordButton topics={foxglove.discoveredTopics} wsUrl={foxgloveUrl} />
      </div>

      <div className="grid-container">
        <div className="panel large">
          <h3 className="panel-title">Camera Feed</h3>
          <div style={{ flex: 1 }}>
            <CameraFeed
              imageSrc={foxglove.imageSrc}
              format={foxglove.imageFormat}
              lastUpdated={foxglove.lastUpdateByTopic["/out/compressed"]}
            />
          </div>
        </div>

        <div className="panel">
          <h3 className="panel-title">Position Panel</h3>
          <PositionPanel
            pose={foxglove.pose}
            lastUpdated={foxglove.lastUpdateByTopic["/robot1/odom"]}
          />
        </div>

        <div className="panel">
          <h3 className="panel-title">Battery</h3>
          <BatteryPanel />
        </div>

        <div className="panel">
          <h3 className="panel-title">Acceleration</h3>
          <AccelerationPanel
            imu={foxglove.imu}
            lastUpdated={foxglove.lastUpdateByTopic["/robot1/imu"]}
          />
        </div>

        <div className="panel">
          <h3 className="panel-title">Status</h3>
          <StatusPanel
            status={foxglove.status}
            errorMessage={foxglove.errorMessage}
            connectionDetails={foxglove.connectionDetails}
            warningMessage={foxglove.warningMessage}
            clock={foxglove.clock}
            topics={foxglove.discoveredTopics}
            lastUpdated={foxglove.lastUpdateByTopic["/clock"]}
          />
        </div>
      </div>
    </div>
  );
}
