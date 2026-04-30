import { useRef, useState } from "react";

import type { FoxgloveDashboardState } from "../types/foxglove";

const WS_URL_STORAGE_KEY = "swarmSenseWsUrl_v1";

export function loadSavedWsUrl(defaultUrl: string): string {
  try {
    return localStorage.getItem(WS_URL_STORAGE_KEY) ?? defaultUrl;
  } catch {
    return defaultUrl;
  }
}

type ConnectionConfigProps = {
  currentUrl: string;
  connectionStatus: FoxgloveDashboardState["status"];
  onConnect: (url: string) => void;
};

export default function ConnectionConfig({
  currentUrl,
  connectionStatus,
  onConnect,
}: ConnectionConfigProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpen() {
    setDraft(currentUrl);
    setOpen(true);
    setTimeout(() => inputRef.current?.select(), 30);
  }

  function handleConnect() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(WS_URL_STORAGE_KEY, trimmed);
    } catch {
      // ignore
    }
    onConnect(trimmed);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleConnect();
    if (e.key === "Escape") setOpen(false);
  }

  const statusDot = (
    {
      connected:    { color: "#2ecc71", label: "Connected" },
      connecting:   { color: "#f1c40f", label: "Connecting..." },
      disconnected: { color: "#e74c3c", label: "Disconnected" },
      error:        { color: "#e74c3c", label: "Error" },
    } as Record<string, { color: string; label: string }>
  )[connectionStatus] ?? { color: "#f1c40f", label: connectionStatus };

  return (
    <div style={{ position: "relative" }}>
      <button
        className="record-btn"
        onClick={open ? () => setOpen(false) : handleOpen}
        title="Configure WebSocket connection"
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: statusDot.color,
            flexShrink: 0,
            display: "inline-block",
          }}
        />
        {"⚙"} Connection
      </button>

      {open && (
        <div
          className="record-dropdown"
          style={{ minWidth: 320, right: "auto", left: 0 }}
        >
          <div className="record-dropdown-header">
            <span>WebSocket Bridge URL</span>
            <button
              className="record-toggle-all"
              onClick={() => setOpen(false)}
              title="Close"
            >
              &#x2715;
            </button>
          </div>

          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>
            Current status:{" "}
            <span style={{ color: statusDot.color, fontWeight: "bold" }}>
              {statusDot.label}
            </span>
          </div>

          <input
            ref={inputRef}
            className="conn-url-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ws://127.0.0.1:8765"
            spellCheck={false}
          />

          <button
            className="record-start-btn"
            onClick={handleConnect}
            disabled={!draft.trim()}
          >
            Connect
          </button>
        </div>
      )}
    </div>
  );
}
