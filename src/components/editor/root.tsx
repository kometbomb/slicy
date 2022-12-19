import { ComponentChildren, h } from "preact";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";
import { useEvent } from "../../hooks/event";
import { EditorContext } from "./context";
import "../../assets/canvas.css";

export const Root = ({ children }: { children: ComponentChildren }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const { enableGrid, zoom, setZoom } = useContext(EditorContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        setZoom((zoom) => zoom * 1.1);
        setX((x) => (x - 256) * 1.1 + 256);
        setY((y) => (y - 256) * 1.1 + 256);
      }
      if (e.deltaY > 0) {
        setZoom((zoom) => zoom / 1.1);
        setX((x) => (x - 256) / 1.1 + 256);
        setY((y) => (y - 256) / 1.1 + 256);
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
        style={{
          position: "relative",
          width: `${zoom * 512}px`,
          height: `${zoom * 512}px`,
          transform: `translate(-50%,-50%)`,
        }}
      >
        <div
          className="root-node-inner"
          style={{
            left: `${x}px`,
            top: `${y}px`,
            width: `100%`,
            height: `100%`,
            transform: `translate(50%,50%)`,
            position: "relative",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
