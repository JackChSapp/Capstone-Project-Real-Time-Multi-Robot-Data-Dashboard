import { useEffect, useRef, useState } from "react";

import type { FoxgloveDashboardState } from "../types/foxglove";

const WS_URL_STORAGE_KEY = "swarmSenseWsUrl_v1";

export function loadSavedWsUrl(defaultUrl: string): string {
  try {
    return localStorage.getItem(WS_URL_STORAGE_KEY) ?? defaultUrl;
  } catch {
    return defaultUrl;
  }
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type SettingsPanelProps = {
  currentUrl: string;
  connectionStatus: FoxgloveDashboardState["status"];
  onConnect: (url: string) => void;
};

function isElectron(): boolean {
  return navigator.userAgent.includes("Electron");
}

function isStandalone(): boolean {
  return (
    isElectron() ||
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      (navigator as { standalone?: boolean }).standalone === true)
  );
}

function detectBrowser(): "chrome" | "edge" | "firefox" | "other" {
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Firefox/")) return "firefox";
  if (ua.includes("Chrome/")) return "chrome";
  return "other";
}

export default function SettingsPanel({
  currentUrl,
  connectionStatus,
  onConnect,
}: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [showInstructions, setShowInstructions] = useState(false);

  const browser = detectBrowser();

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    }
    function onAppInstalled() {
      setInstalled(true);
      setInstallPrompt(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  function handleOpen() {
    setDraft(currentUrl);
    setShowInstructions(false);
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

  async function handleInstall() {
    if (installPrompt) {
      await installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        setInstallPrompt(null);
      }
    } else {
      setShowInstructions((prev) => !prev);
    }
  }

  const statusDot = (
    {
      connected:    { color: "#2ecc71", label: "Connected" },
      connecting:   { color: "#f1c40f", label: "Connecting..." },
      disconnected: { color: "#e74c3c", label: "Disconnected" },
      error:        { color: "#e74c3c", label: "Error" },
    } as Record<string, { color: string; label: string }>
  )[connectionStatus] ?? { color: "#f1c40f", label: connectionStatus };

  const instructions: Record<string, string> = {
    firefox:
      'In Firefox: click the install icon in the address bar, or go to the menu and select "Install page as app".',
    edge:
      'In Edge: click the install icon in the address bar, or go to the menu > Apps > "Install this site as an app".',
    other:
      "Open this page in Chrome or Edge for the best install experience.",
  };

  function renderInstallSection() {
    if (installed) {
      return (
        <div className="settings-hint">
          {isElectron()
            ? "Running as a desktop app."
            : "Swarm Sense is already installed on this device."}
        </div>
      );
    }
    return (
      <>
        <button className="record-start-btn" onClick={handleInstall}>
          {installPrompt ? "Install Swarm Sense" : "How to Install"}
        </button>
        {showInstructions && !installPrompt && (
          <div className="settings-hint" style={{ marginTop: 6 }}>
            {instructions[browser] ?? instructions["other"]}
          </div>
        )}
      </>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        className="record-btn"
        onClick={open ? () => setOpen(false) : handleOpen}
        title="Settings"
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
        {"⚙"} Settings
      </button>

      {open && (
        <div
          className="record-dropdown"
          style={{ minWidth: 300, right: "auto", left: 0 }}
        >
          <div className="record-dropdown-header">
            <span>Settings</span>
            <button
              className="record-toggle-all"
              onClick={() => setOpen(false)}
              title="Close"
            >
              &#x2715;
            </button>
          </div>

          <div className="settings-section-label">Install App</div>
          {renderInstallSection()}

          <div className="settings-section-label" style={{ marginTop: 10 }}>
            Connection
            <span style={{ marginLeft: 8, color: statusDot.color, fontSize: 11 }}>
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
            style={{ marginTop: 6 }}
          >
            Connect
          </button>

          <div className="settings-section-label" style={{ marginTop: 10 }}>
            About
          </div>
          <div className="settings-hint" style={{ lineHeight: 1.7 }}>
            <strong style={{ color: "white" }}>Swarm Sense</strong> — Real-Time Multi-Robot Data Dashboard
            <br />
            UTC Robotics Lab &middot; Spring 2025
            <br />
            <span style={{ opacity: 0.75 }}>
              Hussam Abubakr &middot; Jeana Chapman &middot; Emiliano de la Garza
              <br />
              Jewel Littlefield &middot; Jack Sapp &middot; Hayla Turney
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
