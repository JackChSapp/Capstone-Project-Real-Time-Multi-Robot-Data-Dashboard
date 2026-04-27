export type BridgeStatus = "connecting" | "connected" | "disconnected" | "error";

export type RobotPose = {
  x: number;
  y: number;
  z: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
};

export type ImuSnapshot = {
  x: number;
  y: number;
  z: number;
};

export type ClockSnapshot = {
  sec: number;
  nanosec: number;
};

export type TopicDetails = {
  topic: string;
  schemaName: string;
  encoding: string;
};

export type FoxgloveDashboardState = {
  status: BridgeStatus;
  errorMessage: string | null;
  connectionDetails: string | null;
  warningMessage: string | null;
  imageSrc: string | null;
  imageFormat: string | null;
  pose: RobotPose | null;
  imu: ImuSnapshot | null;
  clock: ClockSnapshot | null;
  discoveredTopics: TopicDetails[];
  lastUpdateByTopic: Record<string, string>;
};
