import { ComponentChildren, createContext, h } from "preact";
import { StateUpdater, useCallback, useEffect, useRef, useState } from "preact/hooks";
import { packTree, unpackTree, validatePackedNode } from "../../tree/packed";
import { useLocalStorage } from "../../hooks/localStorage";
import { useUndo } from "../../hooks/undo";
import { Color, Node, Shape } from "../../tree";
import { useToast } from "../../hooks/toast";
import { useDebounce } from "../../hooks/debounce";

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
  const localStorage = useLocalStorage()
  const {
    current: root,
    set,
    undo,
    redo,
  } = useUndo<Node>({ bg: 0, fg: 0, shape: 0 });
  const { showToast } = useToast()
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("root") || "")
      if (validatePackedNode(data)) {
        set(unpackTree(data))
        showToast("Picture restored")
      }
    } catch (error) {
      // 
    }
  }, [])
  const storeBackup = useDebounce((node: Node) => localStorage.setItem("root", JSON.stringify(packTree(node))), 1000)
  const setRoot = useCallback((node: Node) => {
    storeBackup(node)
    set(node)
  }, [localStorage, storeBackup])
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
        root: root || { bg: 0, fg: 0, shape: 0 },
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
