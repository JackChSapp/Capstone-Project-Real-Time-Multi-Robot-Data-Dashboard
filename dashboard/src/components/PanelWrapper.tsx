import type { ReactNode } from "react";

import type { PanelId } from "./panelRegistry";

type PanelWrapperProps = {
  id: PanelId;
  title: string;
  onClose: (id: PanelId) => void;
  children: ReactNode;
};

export default function PanelWrapper({
  id,
  title,
  onClose,
  children,
}: PanelWrapperProps) {
  return (
    <div className="dynamic-panel">
      <div className="dynamic-panel-header panel-drag-handle">
        <span className="dynamic-panel-title">{title}</span>
        <button
          className="dynamic-panel-close"
          onClick={() => onClose(id)}
          onMouseDown={(e) => e.stopPropagation()}
          title="Close panel"
          aria-label={`Close ${title} panel`}
        >
          &#x2715;
        </button>
      </div>
      <div className="dynamic-panel-body">{children}</div>
    </div>
  );
}
