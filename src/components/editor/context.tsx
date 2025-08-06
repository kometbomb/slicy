import { ComponentChildren, createContext, h } from "preact";
import {
  Dispatch,
  StateUpdater,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import {
  extractRootNodeAndPalette,
  joinRootNodeAndPalette,
  packTree,
  Palette,
  unpackTree,
  validatePackedNode,
} from "../../tree/packed";
import { useLocalStorage } from "../../hooks/localStorage";
import { useUndo } from "../../hooks/undo";
import { Color, isDefaultNodeState, Node, Shape } from "../../tree";
import { useToast } from "../../hooks/toast";
import { useDebounce } from "../../hooks/debounce";
import { RestoreSavedStateModal } from "./restore-saved-state-modal";
import { defaultPalette, isDefaultPalette } from "../default-palette";

export type Mode = "cut" | "draw" | "color" | "tile";

export type EditFrame = { node: Node; palette: Palette };

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
  root: EditFrame;
  setRoot: (root: EditFrame) => void;
  undo: () => void;
  redo: () => void;
  zoom: number;
  setZoom: StateUpdater<number>;
  hasSavedStateInLocalStorage: boolean;
}

export const EditorContext = createContext<EditorContextType>({} as never);

export const EditorContextProvider = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const {
    current: root,
    set,
    undo,
    redo,
  } = useUndo<EditFrame>({
    node: { bg: 0, fg: 0, shape: 0 },
    palette: [...defaultPalette],
  });
  const { showToast } = useToast();
  const [hasSavedStateInLocalStorage, setHasSavedStateInLocalStorage] =
    useState(false);

  /**
   * Restore backup if found in localStorage
   */
  const localStorage = useLocalStorage();
  const wasInit = useRef(false);

  useEffect(() => {
    // Avoid reinit if deps change as this should happen once only on mount
    if (wasInit.current) return;
    wasInit.current = true;

    try {
      const [data, palette] = extractRootNodeAndPalette(
        JSON.parse(localStorage.getItem("root") || "")
      );

      if (
        validatePackedNode(data) &&
        !(isDefaultNodeState(unpackTree(data)) && isDefaultPalette(palette))
      ) {
        setHasSavedStateInLocalStorage(true);
      }
    } catch (error) {
      // Use the default state instead
    }
  }, [localStorage, wasInit, set, showToast]);

  /** Debounced root node write to localStorage */
  const storeBackup = useDebounce(
    (node: EditFrame) =>
      localStorage.setItem(
        "root",
        JSON.stringify(joinRootNodeAndPalette(node.node, node.palette))
      ),
    1000
  );
  const setRoot = useCallback(
    (root: EditFrame) => {
      set(root);
      storeBackup(root);
    },
    [set, storeBackup]
  );

  const [bgColor, setBgColor] = useState<Color>(1);
  const [fgColor, setFgColor] = useState<Color>(0);
  const [shape, setShape] = useState<Shape>(0);
  const [mode, setMode] = useState<Mode>("cut");
  const [zoom, setZoom] = useState(1);
  const [enableGrid, setEnableGrid] = useState(true);

  const restoreFromLocalStorage = useCallback(
    (e: Event) => {
      e.preventDefault();
      try {
        const [node, palette] = extractRootNodeAndPalette(
          JSON.parse(localStorage.getItem("root") || "")
        );
        setRoot({ node: unpackTree(node), palette: [...palette] });
        showToast("Picture restored");
      } catch (error) {
        // Use the default state instead
        showToast("Restore failed", "failure");
      } finally {
        setHasSavedStateInLocalStorage(false);
      }
    },
    [localStorage, setRoot, showToast]
  );

  const closeRestoreModal = useCallback(() => {
    setHasSavedStateInLocalStorage(false);
    localStorage.setItem("root", "[]");
  }, [localStorage]);

  const value = useMemo(
    () => ({
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
      hasSavedStateInLocalStorage,
    }),
    [
      bgColor,
      enableGrid,
      fgColor,
      hasSavedStateInLocalStorage,
      mode,
      redo,
      root,
      setRoot,
      shape,
      undo,
      zoom,
    ]
  );

  return (
    <EditorContext.Provider value={value}>
      {children}
      <RestoreSavedStateModal
        open={hasSavedStateInLocalStorage}
        onYes={restoreFromLocalStorage}
        onClose={closeRestoreModal}
      />
    </EditorContext.Provider>
  );
};
