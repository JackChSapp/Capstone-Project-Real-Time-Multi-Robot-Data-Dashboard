import "./appStyle.css";

import { useState } from "react";

import PanelGrid from "../components/PanelGrid";
import PanelSelector from "../components/PanelSelector";
import RecordButton from "../components/RecordButton";
import SettingsPanel, { loadSavedWsUrl } from "../components/SettingsPanel";
import { usePanelLayout } from "../hooks/usePanelLayout";
import {
  DEFAULT_FOXGLOVE_WS_URL,
  useFoxgloveDashboard,
} from "../services/rosConnection";

export default function Dashboard(): React.ReactElement {
  const [wsUrl, setWsUrl] = useState<string>(() =>
    loadSavedWsUrl(DEFAULT_FOXGLOVE_WS_URL)
  );

  const foxglove = useFoxgloveDashboard(wsUrl);
  const { layoutState, addPanel, removePanel, onLayoutChange } = usePanelLayout();

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
        <h1 className="dashboard-title" style={{ margin: 0 }}>Swarm Sense</h1>
      </div>

      <div className="toolbar" style={{ marginTop: "16px", paddingRight: "72px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <PanelSelector
            activePanelIds={layoutState.activePanelIds}
            onAdd={addPanel}
            onRemove={removePanel}
          />
          <SettingsPanel
            currentUrl={wsUrl}
            connectionStatus={foxglove.status}
            onConnect={setWsUrl}
          />
        </div>
        <RecordButton topics={foxglove.discoveredTopics} wsUrl={wsUrl} />
      </div>

      <PanelGrid
        dashboardState={foxglove}
        layoutState={layoutState}
        onLayoutChange={onLayoutChange}
        onRemovePanel={removePanel}
      />
    </div>
  );
}
