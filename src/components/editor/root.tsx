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
      if (!e.ctrlKey && !e.altKey) return;
      if (e.deltaY < 0) {
        setZoom((zoom) => zoom * 1.1);
        setX((x) => x / 1.1);
        setY((y) => y / 1.1);
      }
      if (e.deltaY > 0) {
        setZoom((zoom) => zoom * (1 / 1.1));
        setX((x) => x / (1 / 1.1));
        setY((y) => y / (1 / 1.1));
      }
    },
    [setZoom]
  );
  const handleMove = (e: MouseEvent) => {
    if (e.buttons & 4) {
      e.preventDefault();
      setX((x) => x + e.movementX);
      setY((y) => y + e.movementY);
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
        className="root-node-inner"
        style={{
          position: "relative",
          width: `${512 * zoom}px`,
          height: `${512 * zoom}px`,
          top: `${y - 256 * zoom}px`,
          left: `${x - 256 * zoom}px`,
          transfor: "translate(-50%,-50%)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
