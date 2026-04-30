import { useCallback, useState } from "react";
import type { Layout, Layouts } from "react-grid-layout";

import { panelRegistry, type PanelId } from "../components/panelRegistry";

const STORAGE_KEY = "swarmSensePanelLayout_v1";

export type PanelLayoutState = {
  activePanelIds: PanelId[];
  layouts: Layouts;
};

const defaultPanelIds: PanelId[] = [
  "camera",
  "position",
  "battery",
  "acceleration",
  "status",
];

function buildDefaultLayouts(ids: PanelId[]): Layouts {
  const positionMap: Record<PanelId, { x: number; y: number }> = {
    camera:       { x: 0, y: 0 },
    position:     { x: 6, y: 0 },
    battery:      { x: 9, y: 0 },
    acceleration: { x: 6, y: 4 },
    status:       { x: 9, y: 4 },
  };

  const lgItems: Layout[] = ids.map((id) => {
    const def = panelRegistry.find((p) => p.id === id)!;
    const pos = positionMap[id] ?? { x: 0, y: Infinity };
    return {
      i: id,
      x: pos.x,
      y: pos.y,
      w: def.defaultW,
      h: def.defaultH,
      minW: def.minW,
      minH: def.minH,
      isBounded: true,
    };
  });

  return { lg: lgItems, md: lgItems, sm: lgItems };
}

function loadFromStorage(): PanelLayoutState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PanelLayoutState;
  } catch (e) {
    void e;
  }
  return null;
}

function saveToStorage(state: PanelLayoutState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    void e;
  }
}

export function usePanelLayout() {
  const [layoutState, setLayoutState] = useState<PanelLayoutState>(() => {
    return (
      loadFromStorage() ?? {
        activePanelIds: defaultPanelIds,
        layouts: buildDefaultLayouts(defaultPanelIds),
      }
    );
  });

  const updateState = useCallback((next: PanelLayoutState) => {
    setLayoutState(next);
    saveToStorage(next);
  }, []);

  const addPanel = useCallback(
    (id: PanelId) => {
      if (layoutState.activePanelIds.includes(id)) return;
      const def = panelRegistry.find((p) => p.id === id);
      if (!def) return;

      const newItem: Layout = {
        i: id,
        x: 0,
        y: Infinity,
        w: def.defaultW,
        h: def.defaultH,
        minW: def.minW,
        minH: def.minH,
        isBounded: true,
      };

      updateState({
        activePanelIds: [...layoutState.activePanelIds, id],
        layouts: {
          lg: [...(layoutState.layouts.lg ?? []), newItem],
          md: [...(layoutState.layouts.md ?? []), newItem],
          sm: [...(layoutState.layouts.sm ?? []), newItem],
        },
      });
    },
    [layoutState, updateState]
  );

  const removePanel = useCallback(
    (id: PanelId) => {
      updateState({
        activePanelIds: layoutState.activePanelIds.filter((pid) => pid !== id),
        layouts: {
          lg: (layoutState.layouts.lg ?? []).filter((l: Layout) => l.i !== id),
          md: (layoutState.layouts.md ?? []).filter((l: Layout) => l.i !== id),
          sm: (layoutState.layouts.sm ?? []).filter((l: Layout) => l.i !== id),
        },
      });
    },
    [layoutState, updateState]
  );

  const onLayoutChange = useCallback(
    (_currentLayout: Layout[], allLayouts: Layouts) => {
      updateState({ ...layoutState, layouts: allLayouts });
    },
    [layoutState, updateState]
  );

  return { layoutState, addPanel, removePanel, onLayoutChange };
}
