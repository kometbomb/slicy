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
  const [width, setW] = useState(512);
  const [height, setH] = useState(512);
  const [foo, setFoo] = useState(0);
  const { enableGrid, zoom, setZoom } = useContext(EditorContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        setZoom((zoom) => zoom * 1.1);
        setX((x) => (x - width / 2) * 1.1 + width / 2);
        setY((y) => (y - height / 2) * 1.1 + height / 2);
      }
      if (e.deltaY > 0) {
        setZoom((zoom) => zoom / 1.1);
        setX((x) => (x - width / 2) / 1.1 + width / 2);
        setY((y) => (y - height / 2) / 1.1 + height / 2);
      }
    },
    [setZoom, width, height]
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

  /**
   * Trigger extra render on mount to make sure rootRef is updated (preact bug?)
   */
  useEffect(() => {
    setFoo(1);
  }, []);

  useEffect(() => {
    const ref = rootRef.current;
    if (!ref || !global?.ResizeObserver) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setW(entry.contentRect.width);
        setH(entry.contentRect.width);
      }
    });
    observer.observe(ref);
    return () => observer.unobserve(ref);
  }, [rootRef]);

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
          width: `${zoom * width}px`,
          height: `${zoom * height}px`,
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
