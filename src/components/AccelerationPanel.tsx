import type { ImuSnapshot } from "../types/foxglove";
import { formatFloat } from "../utils/foxglove";

type AccelerationPanelProps = {
  imu: ImuSnapshot | null;
  lastUpdated?: string;
};

export default function AccelerationPanel({
  imu,
  lastUpdated,
}: AccelerationPanelProps) {
  return (
    <>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "0 0 8px" }}>
        Linear acceleration: <code style={{ color: "#E0AA0F" }}>/robot1/imu</code>
      </p>
      <div className="live-metric-grid">
        <div className="live-metric">
          <span>Ax</span>
          <strong>{formatFloat(imu?.x ?? null)}</strong>
        </div>
        <div className="live-metric">
          <span>Ay</span>
          <strong>{formatFloat(imu?.y ?? null)}</strong>
        </div>
        <div className="live-metric">
          <span>Az</span>
          <strong>{formatFloat(imu?.z ?? null)}</strong>
        </div>
      </div>
      <p className="live-footnote">
        Last update: {lastUpdated ?? "No IMU yet"}
      </p>
    </>
  );
}
