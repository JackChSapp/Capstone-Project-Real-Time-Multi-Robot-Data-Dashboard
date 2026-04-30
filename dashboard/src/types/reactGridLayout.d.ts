declare module "react-grid-layout" {
  import type * as React from "react";

  export type ResizeHandle =
    | "s"
    | "w"
    | "e"
    | "n"
    | "sw"
    | "nw"
    | "se"
    | "ne";

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    isBounded?: boolean;
    moved?: boolean;
    resizeHandles?: ResizeHandle[];
  }

  export type Layouts = { [breakpoint: string]: Layout[] };

  export interface ResponsiveProps {
    className?: string;
    style?: React.CSSProperties;
    layouts?: Layouts;
    breakpoints?: { [breakpoint: string]: number };
    cols?: { [breakpoint: string]: number };
    rowHeight?: number;
    draggableHandle?: string;
    draggableCancel?: string;
    resizeHandles?: ResizeHandle[];
    onLayoutChange?: (currentLayout: Layout[], allLayouts: Layouts) => void;
    onBreakpointChange?: (newBreakpoint: string, newCols: number) => void;
    margin?: [number, number];
    containerPadding?: [number, number];
    useCSSTransforms?: boolean;
    children?: React.ReactNode;
  }

  export function WidthProvider<P extends object>(
    ComposedComponent: React.ComponentType<P>
  ): React.ComponentType<Omit<P, "width"> & { measureBeforeMount?: boolean }>;

  export class Responsive extends React.Component<ResponsiveProps> {}
}
