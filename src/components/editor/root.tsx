import { ComponentChildren, h } from "preact";
import { useCallback, useContext, useRef, useState } from "preact/hooks";
import { useEvent } from "../../hooks/event";
import { EditorContext } from "./context";

export const Root = ({ children }: { children: ComponentChildren }) => {
  const [x, setX] = useState(256);
  const [y, setY] = useState(256);
  const { enableGrid, zoom, setZoom } = useContext(EditorContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        setZoom((zoom) => zoom * 1.1);
      }
      if (e.deltaY > 0) {
        setZoom((zoom) => zoom / 1.1);
      }
    },
    [setZoom]
  );
  const handleMove = (e: MouseEvent) => {
    if (e.buttons & 4) {
      e.preventDefault();
      setX((x) => x + e.movementX / zoom);
      setY((y) => y + e.movementY / zoom);
    }
  };

  useEvent(rootRef.current, "wheel", handleWheel, {
    passive: false,
  });
  useEvent(rootRef.current, "mousemove", handleMove);

  return (
    <div
      id="root-node"
      data-testid="root-node"
      className={["editor-root", enableGrid ? "enableGrid" : ""].join(" ")}
      ref={rootRef}
    >
      <div
        style={{
          left: "256px",
          top: "256px",
          width: `${512 * zoom}px`,
          height: `${512 * zoom}px`,
          position: "relative",
        }}
      >
        <div
          className="root-node-inner"
          style={{
            left: `${x * zoom}px`,
            top: `${y * zoom}px`,
            transform: `translate(-100%,-100%)`,
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
