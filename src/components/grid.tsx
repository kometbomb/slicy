import { h } from "preact";
import { JSXInternal } from "preact/src/jsx";

export const Grid = ({
  children,
  gap = 0,
  cols = 1,
  style = {},
}: {
  gap?: number;
  cols?: number;
  style?: JSXInternal.CSSProperties;
  children: JSX.Element[];
}) => (
  <div
    style={{
      background: "white",
      ...style,
      display: "grid",
      gap,
      gridTemplateColumns: `repeat(${cols}, auto)`,
    }}
  >
    {children}
  </div>
);
