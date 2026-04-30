import type { ReactElement } from "react";

import AccelerationPanel from "./AccelerationPanel";
import BatteryPanel from "./BatteryPanel";
import CameraFeed from "./CameraFeed";
import PositionPanel from "./PositionPanel";
import StatusPanel from "./StatusPanel";
import type { FoxgloveDashboardState } from "../types/foxglove";

export type PanelId = "camera" | "position" | "battery" | "acceleration" | "status";

export type PanelDefinition = {
  id: PanelId;
  title: string;
  defaultW: number;
  defaultH: number;
  minW: number;
  minH: number;
  render: (state: FoxgloveDashboardState) => ReactElement;
};

export const panelRegistry: PanelDefinition[] = [
  {
    id: "camera",
    title: "Camera Feed",
    defaultW: 6,
    defaultH: 8,
    minW: 3,
    minH: 4,
    render: (state) => (
      <CameraFeed
        imageSrc={state.imageSrc}
        format={state.imageFormat}
        lastUpdated={state.lastUpdateByTopic["/out/compressed"]}
      />
    ),
  },
  {
    id: "position",
    title: "Position",
    defaultW: 3,
    defaultH: 4,
    minW: 2,
    minH: 3,
    render: (state) => (
      <PositionPanel
        pose={state.pose}
        lastUpdated={state.lastUpdateByTopic["/robot1/odom"]}
      />
    ),
  },
  {
    id: "battery",
    title: "Battery",
    defaultW: 3,
    defaultH: 4,
    minW: 2,
    minH: 3,
    render: (_state) => <BatteryPanel />,
  },
  {
    id: "acceleration",
    title: "Acceleration",
    defaultW: 3,
    defaultH: 4,
    minW: 2,
    minH: 3,
    render: (state) => (
      <AccelerationPanel
        imu={state.imu}
        lastUpdated={state.lastUpdateByTopic["/robot1/imu"]}
      />
    ),
  },
  {
    id: "status",
    title: "Status",
    defaultW: 3,
    defaultH: 4,
    minW: 2,
    minH: 3,
    render: (state) => (
      <StatusPanel
        status={state.status}
        errorMessage={state.errorMessage}
        connectionDetails={state.connectionDetails}
        warningMessage={state.warningMessage}
        clock={state.clock}
        topics={state.discoveredTopics}
        lastUpdated={state.lastUpdateByTopic["/clock"]}
      />
    ),
  },
];
