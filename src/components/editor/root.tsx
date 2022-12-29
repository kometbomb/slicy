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
import { safeDocument } from "../../ssr";

export const Root = ({ children }: { children: ComponentChildren }) => {
  const [width, setW] = useState(512);
  const [height, setH] = useState(512);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_foo, setFoo] = useState(0);
  const { enableGrid, zoom, setZoom } = useContext(EditorContext);
  const rootRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setZoom((oldZoom) => Math.max(1, oldZoom - e.deltaY / 500));
    },
    [setZoom]
  );

  const scroll = useCallback((dx: number, dy: number, set = false) => {
    const ref = rootRef.current;
    if (!ref) return;

    if (set && (ref.scrollLeft !== dx || ref.scrollTop !== dy)) {
      ref.scrollTo(dx, dy);
      return;
    }

    if (dx === 0 && dy === 0) return;
    ref.scrollTo(ref.scrollLeft - dx, ref.scrollTop - dy);
  }, []);

  useEffect(() => {
    const ref = rootRef.current;
    if (!ref) return;

    const oldZoom = zoomRef.current;
    const newZoom = zoom;
    const x = ((ref.scrollLeft + width / 2) / oldZoom) * newZoom - width / 2;
    const y = ((ref.scrollTop + height / 2) / oldZoom) * newZoom - height / 2;

    scroll(x, y, true);
    zoomRef.current = zoom;
  }, [height, width, zoom, zoomRef, scroll]);

  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (e.buttons & 4) {
        e.preventDefault();
        scroll(e.movementX, e.movementY);
      }
    },
    [scroll]
  );
  const lengthRef = useRef<number>(0);

  /**
   * Initial state when starting zooming
   */
  const startRef = useRef<{
    screenX: number;
    screenY: number;
    scrollLeft: number;
    scrollRight: number;
    zoom: number;
  }>({
    screenX: 0,
    screenY: 0,
    scrollLeft: 0,
    scrollRight: 0,
    zoom: 0,
  });
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const ref = rootRef.current;
      if (!ref) return;
      startRef.current = {
        screenX: e.touches[0].screenX,
        screenY: e.touches[0].screenY,
        scrollLeft: ref.scrollLeft,
        scrollRight: ref.scrollTop,
        zoom,
      };
      if (e.touches.length === 2) {
        e.preventDefault();
        const a = e.touches[0];
        const b = e.touches[1];
        lengthRef.current = Math.hypot(
          a.clientX - b.clientX,
          a.clientY - b.clientY
        );
      }
    },
    [zoom]
  );
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const a = e.touches[0];
        const b = e.touches[1];
        const len = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        setZoom(Math.max(1, (len / lengthRef.current) * startRef.current.zoom));
      } else {
        const { screenX, screenY } = startRef.current;
        scroll(
          screenX - e.touches[0].screenX + startRef.current.scrollLeft,
          screenY - e.touches[0].screenY + startRef.current.scrollRight,
          true
        );
      }
    },
    [scroll, setZoom]
  );

  useEvent(safeDocument, "wheel", handleWheel, {
    passive: false,
  });
  useEvent(rootRef.current, "mousemove", handleMove);
  useEvent(rootRef.current, "touchmove", handleTouchMove);
  useEvent(rootRef.current, "touchstart", handleTouchStart);

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
        className="zoomable"
        style={{
          position: "absolute",
          width: `${zoom * width}px`,
          height: `${zoom * height}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
