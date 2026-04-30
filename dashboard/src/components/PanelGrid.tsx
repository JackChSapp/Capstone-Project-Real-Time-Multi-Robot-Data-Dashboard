import { Responsive, WidthProvider } from "react-grid-layout";
import type { Layout, Layouts } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import { panelRegistry, type PanelId } from "./panelRegistry";
import PanelWrapper from "./PanelWrapper";
import type { FoxgloveDashboardState } from "../types/foxglove";

const ResponsiveGrid = WidthProvider(Responsive);

type PanelGridProps = {
  dashboardState: FoxgloveDashboardState;
  layoutState: { activePanelIds: PanelId[]; layouts: Layouts };
  onLayoutChange: (layout: Layout[], allLayouts: Layouts) => void;
  onRemovePanel: (id: PanelId) => void;
};

export default function PanelGrid({
  dashboardState,
  layoutState,
  onLayoutChange,
  onRemovePanel,
}: PanelGridProps) {
  return (
    <div style={{ flex: 1 }}>
      <ResponsiveGrid
        className="layout"
        layouts={layoutState.layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={{ lg: 12, md: 10, sm: 6 }}
        rowHeight={50}
        draggableHandle=".panel-drag-handle"
        resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
        onLayoutChange={onLayoutChange}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
      >
        {layoutState.activePanelIds.map((id) => {
          const def = panelRegistry.find((p) => p.id === id);
          if (!def) return null;
          return (
            <div key={id}>
              <PanelWrapper id={id} title={def.title} onClose={onRemovePanel}>
                {def.render(dashboardState)}
              </PanelWrapper>
            </div>
          );
        })}
      </ResponsiveGrid>
    </div>
  );
}
