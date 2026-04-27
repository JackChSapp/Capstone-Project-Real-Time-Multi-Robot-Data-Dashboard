import type { BridgeStatus, ClockSnapshot, TopicDetails } from "../types/foxglove";
import { formatClockStamp } from "../utils/foxglove";

type StatusPanelProps = {
  status: BridgeStatus;
  errorMessage: string | null;
  connectionDetails: string | null;
  warningMessage: string | null;
  clock: ClockSnapshot | null;
  topics: TopicDetails[];
  lastUpdated?: string;
};

export default function StatusPanel({
  status,
  errorMessage,
  connectionDetails,
  warningMessage,
  clock,
  topics,
  lastUpdated,
}: StatusPanelProps) {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
          Foxglove bridge (live)
        </span>
        <span className={`status-badge status-${status}`}>{status}</span>
      </div>

      <div className="live-status-rows">
        <div className="live-status-row">
          <span>Topics discovered</span>
          <strong>{topics.length}</strong>
        </div>
        <div className="live-status-row">
          <span>Simulation clock</span>
          <strong>
            {clock ? formatClockStamp(clock.sec, clock.nanosec) : "—"}
          </strong>
        </div>
        <div className="live-status-row">
          <span>Clock last seen</span>
          <strong>{lastUpdated ?? "—"}</strong>
        </div>
      </div>

      {connectionDetails ? (
        <p className="live-footnote">{connectionDetails}</p>
      ) : null}
      {warningMessage ? (
        <p className="live-footnote" style={{ color: "#f1c40f" }}>
          {warningMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="live-footnote" style={{ color: "#e74c3c" }}>
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
