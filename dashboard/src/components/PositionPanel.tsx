import type { RobotPose } from "../types/foxglove";
import { formatFloat } from "../utils/foxglove";

type PositionPanelProps = {
  pose: RobotPose | null;
  lastUpdated?: string;
};

export default function PositionPanel({ pose, lastUpdated }: PositionPanelProps) {
  return (
    <>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "0 0 8px" }}>
        Odometry: <code style={{ color: "#E0AA0F" }}>/robot1/odom</code>
      </p>
      <div className="live-metric-grid">
        <div className="live-metric">
          <span>X</span>
          <strong>{formatFloat(pose?.x ?? null)}</strong>
        </div>
        <div className="live-metric">
          <span>Y</span>
          <strong>{formatFloat(pose?.y ?? null)}</strong>
        </div>
        <div className="live-metric">
          <span>Z</span>
          <strong>{formatFloat(pose?.z ?? null)}</strong>
        </div>
        <div className="live-metric">
          <span>Qw</span>
          <strong>{formatFloat(pose?.qw ?? null)}</strong>
        </div>
      </div>
      <p className="live-footnote">
        Last update: {lastUpdated ?? "No odometry yet"}
      </p>
    </>
  );
}
