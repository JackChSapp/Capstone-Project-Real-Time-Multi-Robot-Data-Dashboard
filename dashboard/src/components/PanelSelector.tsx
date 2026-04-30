import { useEffect, useRef, useState } from "react";

import { panelRegistry, type PanelId } from "./panelRegistry";

type PanelSelectorProps = {
  activePanelIds: PanelId[];
  onAdd: (id: PanelId) => void;
  onRemove: (id: PanelId) => void;
};

export default function PanelSelector({
  activePanelIds,
  onAdd,
  onRemove,
}: PanelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function handleToggle(id: PanelId, isActive: boolean) {
    if (isActive) {
      onRemove(id);
    } else {
      onAdd(id);
    }
  }

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button
        className="record-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        ⊞ Panels
      </button>

      {isOpen && (
        <div
          className="record-dropdown"
          style={{ left: 0, right: "auto", minWidth: "200px" }}
        >
          <div className="record-dropdown-header">
            <span>Data Panels</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
            {panelRegistry.map((panel) => {
              const isActive = activePanelIds.includes(panel.id);
              return (
                <label key={panel.id} className="record-topic-row">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => handleToggle(panel.id, isActive)}
                  />
                  <span>{panel.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
