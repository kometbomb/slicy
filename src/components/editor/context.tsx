import { ComponentChildren, createContext, h } from "preact";
import { StateUpdater, useCallback, useRef, useState } from "preact/hooks";
import { useUndo } from "../../hooks/undo";
import { Color, Node, Shape } from "../../tree";

export type Mode = "cut" | "draw" | "color" | "tile";

export interface EditorContextType {
  mode: Mode;
  fgColor: Color;
  bgColor: Color;
  shape: Shape;
  enableGrid: boolean;
  setMode: StateUpdater<Mode>;
  setFgColor: StateUpdater<Color>;
  setBgColor: StateUpdater<Color>;
  setShape: StateUpdater<Shape>;
  setEnableGrid: StateUpdater<boolean>;
  root: Node;
  setRoot: (root: Node) => void;
  undo: () => void;
  redo: () => void;
  zoom: number;
  setZoom: StateUpdater<number>;
}

export const EditorContext = createContext<EditorContextType>({} as never);

export const EditorContextProvider = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const {
    current: root,
    set: setRoot,
    undo,
    redo,
  } = useUndo<Node>({
    bg: 0,
    fg: 0,
    shape: 0,
  });
  const [bgColor, setBgColor] = useState<Color>(1);
  const [fgColor, setFgColor] = useState<Color>(0);
  const [shape, setShape] = useState<Shape>(0);
  const [mode, setMode] = useState<Mode>("cut");
  const [zoom, setZoom] = useState(1);
  const [enableGrid, setEnableGrid] = useState(true);

  return (
    <EditorContext.Provider
      value={{
        zoom,
        setZoom,
        undo,
        redo,
        root,
        setRoot,
        bgColor,
        fgColor,
        setBgColor,
        setFgColor,
        shape,
        setShape,
        mode,
        setMode,
        enableGrid,
        setEnableGrid,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
