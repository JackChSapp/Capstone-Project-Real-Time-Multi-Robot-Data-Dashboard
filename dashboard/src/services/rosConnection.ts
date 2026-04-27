import { FoxgloveClient, type Channel, type IWebSocket } from "@foxglove/ws-protocol";
import { parse } from "@foxglove/rosmsg";
import { MessageReader } from "@foxglove/rosmsg2-serialization";
import { useEffect, useState } from "react";

import type { FoxgloveDashboardState, TopicDetails } from "../types/foxglove";
import {
  bytesToDataUrl,
  inferCompressedImageMimeType,
} from "../utils/foxglove";

export const DEFAULT_FOXGLOVE_WS_URL = "ws://127.0.0.1:8765";
const SDK_SUBPROTOCOL = "foxglove.sdk.v1";
const LEGACY_SUBPROTOCOL = FoxgloveClient.SUPPORTED_SUBPROTOCOL;
const SUPPORTED_SUBPROTOCOLS = [SDK_SUBPROTOCOL, LEGACY_SUBPROTOCOL];

// ROS topics we subscribe to over foxglove_bridge (CDR). Camera: primary is
// `/out/compressed` (sensor_msgs/CompressedImage). We do not subscribe to
// `/out/foxglove` here—that path is a possible simulator backup but would need
// a separate foxglove-compressed-video decoder in the browser if we ever use it.
const TARGET_TOPICS = new Set([
  "/out/compressed",
  "/robot1/odom",
  "/robot1/imu",
  "/clock",
]);
const RECONNECT_DELAY_MS = 2000;

const INITIAL_STATE: FoxgloveDashboardState = {
  status: "connecting",
  errorMessage: null,
  connectionDetails: null,
  warningMessage: null,
  imageSrc: null,
  imageFormat: null,
  pose: null,
  imu: null,
  clock: null,
  discoveredTopics: [],
  lastUpdateByTopic: {},
};

type ReaderCacheEntry = {
  channel: Channel;
  reader: MessageReader;
};

function buildReader(channel: Channel) {
  const definitions = parse(channel.schema, { ros2: true });
  return new MessageReader(definitions);
}

function toUint8Array(data: unknown) {
  if (data instanceof Uint8Array) {
    return data;
  }

  if (Array.isArray(data)) {
    return Uint8Array.from(data);
  }

  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }

  return null;
}

function updateLastSeen() {
  return new Date().toLocaleTimeString();
}

function formatCloseReason(event: CloseEvent) {
  const reason = event.reason ? ` Reason: ${event.reason}` : "";
  return `Socket closed with code ${event.code}.${reason}`.trim();
}

function buildTopicWarning(topics: TopicDetails[]) {
  const advertisedTopics = new Set(topics.map((topic) => topic.topic));

  if (
    !advertisedTopics.has("/out/compressed") &&
    advertisedTopics.has("/out/foxglove")
  ) {
    return "Camera uses /out/compressed (primary). The bridge is only advertising /out/foxglove right now, so this dashboard will not show a feed until compressed is published—or until we add an optional foxglove-transport decoder for /out/foxglove.";
  }

  return null;
}

export function getFoxgloveWebSocketUrl() {
  return import.meta.env.VITE_FOXGLOVE_WS_URL ?? DEFAULT_FOXGLOVE_WS_URL;
}

export function useFoxgloveDashboard(url: string) {
  const [state, setState] = useState<FoxgloveDashboardState>(INITIAL_STATE);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    setState(INITIAL_STATE);

    const subscriptionToChannel = new Map<number, Channel>();
    const readers = new Map<number, ReaderCacheEntry>();
    const advertisedChannels = new Map<number, Channel>();
    let hasConfirmedProtocolTraffic = false;
    let socketOpened = false;
    let reconnectTimeout: number | undefined;
    let isShuttingDown = false;

    const scheduleReconnect = () => {
      if (isShuttingDown) {
        return;
      }

      if (reconnectTimeout != null) {
        return;
      }

      reconnectTimeout = window.setTimeout(() => {
        reconnectTimeout = undefined;
        setRetryToken((current) => current + 1);
      }, RECONNECT_DELAY_MS);
    };

    const markConnectionHealthy = () => {
      hasConfirmedProtocolTraffic = true;

      setState((current) => ({
        ...current,
        status: "connected",
        errorMessage: null,
        connectionDetails: "Foxglove protocol handshake succeeded.",
      }));
    };

    const socket = new WebSocket(url, SUPPORTED_SUBPROTOCOLS);
    socket.binaryType = "arraybuffer";

    const client = new FoxgloveClient({ ws: socket as unknown as IWebSocket });

    client.on("open", () => {
      socketOpened = true;

      setState((current) => ({
        ...current,
        status: "connecting",
        errorMessage: null,
        connectionDetails:
          `Socket opened with subprotocol ${socket.protocol || "pending"}. Waiting for Foxglove bridge metadata and topic advertisements...`,
      }));
    });

    client.on("serverInfo", () => {
      markConnectionHealthy();
    });

    client.on("error", (error) => {
      if (isShuttingDown) {
        return;
      }

      if (hasConfirmedProtocolTraffic) {
        return;
      }

      setState((current) => ({
        ...current,
        status: socketOpened ? "connecting" : "error",
        errorMessage: socketOpened
          ? current.errorMessage
          : error.message || "Failed to connect to foxglove_bridge.",
        connectionDetails: socketOpened
          ? "Browser reported a transport error while waiting for the bridge response. Waiting for the socket close event for more detail..."
          : current.connectionDetails,
      }));
    });

    client.on("close", (event) => {
      if (isShuttingDown) {
        return;
      }

      setState((current) => ({
        ...current,
        status: hasConfirmedProtocolTraffic ? "disconnected" : "error",
        errorMessage: hasConfirmedProtocolTraffic
          ? "Bridge connection lost. Retrying automatically..."
          : `Unable to complete the Foxglove WebSocket connection. ${formatCloseReason(event)} Check that foxglove_bridge is running on ${url}, that the browser can reach that host/port, and that the bridge supports one of: ${SUPPORTED_SUBPROTOCOLS.join(", ")}.`,
        connectionDetails: hasConfirmedProtocolTraffic
          ? formatCloseReason(event)
          : "The socket closed before any Foxglove protocol traffic was received.",
      }));

      scheduleReconnect();
    });

    client.on("advertise", (channels) => {
      markConnectionHealthy();

      for (const channel of channels) {
        advertisedChannels.set(channel.id, channel);

        if (
          TARGET_TOPICS.has(channel.topic) &&
          channel.encoding === "cdr" &&
          !readers.has(channel.id)
        ) {
          let reader: MessageReader;
          try {
            reader = buildReader(channel);
          } catch (err) {
            console.error(
              `[foxglove] Failed to build CDR reader for ${channel.topic}:`,
              err,
            );
            continue;
          }

          readers.set(channel.id, {
            channel,
            reader,
          });

          const subscriptionId = client.subscribe(channel.id);
          subscriptionToChannel.set(subscriptionId, channel);
        }
      }

      setState((current) => {
        const mergedTopics = [...current.discoveredTopics];

        for (const channel of channels) {
          if (
            !mergedTopics.some(
              (existingTopic) =>
                existingTopic.topic === channel.topic &&
                existingTopic.schemaName === channel.schemaName,
            )
          ) {
            mergedTopics.push({
              topic: channel.topic,
              schemaName: channel.schemaName,
              encoding: channel.encoding,
            });
          }
        }

        mergedTopics.sort((left, right) => left.topic.localeCompare(right.topic));

        return {
          ...current,
          discoveredTopics: mergedTopics,
          warningMessage: buildTopicWarning(mergedTopics),
        };
      });
    });

    client.on("unadvertise", (channelIds) => {
      const removedTopics = new Set<string>();

      for (const channelId of channelIds) {
        const channel = advertisedChannels.get(channelId);

        if (channel) {
          removedTopics.add(channel.topic);
        }

        advertisedChannels.delete(channelId);
        readers.delete(channelId);
      }

      const subscriptionIdsToRemove: number[] = [];
      for (const [subscriptionId, channel] of subscriptionToChannel) {
        if (channelIds.includes(channel.id)) {
          subscriptionIdsToRemove.push(subscriptionId);
        }
      }
      for (const subscriptionId of subscriptionIdsToRemove) {
        client.unsubscribe(subscriptionId);
        subscriptionToChannel.delete(subscriptionId);
      }

      setState((current) => ({
        ...current,
        discoveredTopics: current.discoveredTopics.filter(
          (topicDetails) => !removedTopics.has(topicDetails.topic),
        ),
        warningMessage: buildTopicWarning(
          current.discoveredTopics.filter(
            (topicDetails) => !removedTopics.has(topicDetails.topic),
          ),
        ),
      }));
    });

    client.on("message", (event) => {
      markConnectionHealthy();

      const channel = subscriptionToChannel.get(event.subscriptionId);

      if (!channel) {
        return;
      }

      const readerEntry = readers.get(channel.id);

      if (!readerEntry) {
        return;
      }

      const decodedMessage = readerEntry.reader.readMessage<Record<string, unknown>>(
        event.data,
      );

      setState((current) => {
        const nextState: FoxgloveDashboardState = {
          ...current,
          lastUpdateByTopic: {
            ...current.lastUpdateByTopic,
            [channel.topic]: updateLastSeen(),
          },
        };

        if (channel.topic === "/out/compressed") {
          const imageBytes = toUint8Array(decodedMessage.data);

          if (imageBytes) {
            nextState.imageSrc = bytesToDataUrl(
              imageBytes,
              inferCompressedImageMimeType(
                typeof decodedMessage.format === "string"
                  ? decodedMessage.format
                  : undefined,
              ),
            );
            nextState.imageFormat =
              typeof decodedMessage.format === "string"
                ? decodedMessage.format
                : null;
          }
        } else if (channel.topic === "/robot1/odom") {
          const pose = decodedMessage.pose as
            | { pose?: { position?: Record<string, number>; orientation?: Record<string, number> } }
            | undefined;

          nextState.pose = {
            x: Number(pose?.pose?.position?.x ?? 0),
            y: Number(pose?.pose?.position?.y ?? 0),
            z: Number(pose?.pose?.position?.z ?? 0),
            qx: Number(pose?.pose?.orientation?.x ?? 0),
            qy: Number(pose?.pose?.orientation?.y ?? 0),
            qz: Number(pose?.pose?.orientation?.z ?? 0),
            qw: Number(pose?.pose?.orientation?.w ?? 1),
          };
        } else if (channel.topic === "/robot1/imu") {
          const acceleration = decodedMessage.linear_acceleration as
            | Record<string, number>
            | undefined;

          nextState.imu = {
            x: Number(acceleration?.x ?? 0),
            y: Number(acceleration?.y ?? 0),
            z: Number(acceleration?.z ?? 0),
          };
        } else if (channel.topic === "/clock") {
          const clock = decodedMessage.clock as
            | { sec?: number; nanosec?: number }
            | undefined;

          nextState.clock = {
            sec: Number(clock?.sec ?? 0),
            nanosec: Number(clock?.nanosec ?? 0),
          };
        }

        return nextState;
      });
    });

    return () => {
      isShuttingDown = true;

      if (reconnectTimeout != null) {
        window.clearTimeout(reconnectTimeout);
        reconnectTimeout = undefined;
      }

      client.close();
    };
  }, [url, retryToken]);

  return state;
}
