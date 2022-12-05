import { createContext, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { mirrorShapeH, mirrorShapeV, rotateShape } from "../util";
import { Color, Node, Shape } from "../tree";
import { ColorPalette } from "./color-palette";
import { ExportTools } from "./export-tools";
import { ShapePalette } from "./shape-palette";
import { Tile } from "./tile";
import { ToolPalette } from "./tool-palette";

export type Mode = "cut" | "draw" | "color" | "tile";

interface EditorContextType {
  mode: Mode;
  fgColor: Color;
  bgColor: Color;
  shape: Shape;
  enableGrid: boolean;
  setMode: (mode: Mode) => void;
  setFgColor: (color: Color) => void;
  setBgColor: (color: Color) => void;
  setShape: (shape: Shape) => void;
  setEnableGrid: (state: boolean) => void;
}

export const EditorContext = createContext<EditorContextType>({
  mode: "draw",
  bgColor: 0,
  fgColor: 1,
  shape: 0,
  enableGrid: true,
  setMode: () => 0,
  setFgColor: () => 0,
  setBgColor: () => 0,
  setShape: () => 0,
  setEnableGrid: () => 0,
});

export const Editor = () => {
  const [root, setRoot] = useState<Node>({
    bg: 0,
    fg: 0,
    shape: 0,
  });
  const [bgColor, setBgColor] = useState<Color>(0);
  const [fgColor, setFgColor] = useState<Color>(1);
  const [shape, setShape] = useState<Shape>(0);
  const [mode, setMode] = useState<Mode>("draw");
  const [enableGrid, setEnableGrid] = useState(true);

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "s":
          setMode("cut");
          break;

        case "d":
          setMode("draw");
          break;

        case "c":
          setMode("color");
          break;

        case "t":
          setMode("tile");
          break;

        case "g":
          setEnableGrid((value) => !value);
          break;

        case "h":
          setShape((shape) => mirrorShapeH(shape));
          break;

        case "v":
          setShape((shape) => mirrorShapeV(shape));
          break;

        case "r":
          setShape((shape) => rotateShape(shape));
          break;

        case "x":
          setFgColor(bgColor);
          setBgColor(fgColor);
          break;
      }
    },
    [bgColor, fgColor]
  );

  useEffect(() => {
    document.addEventListener("keypress", keyHandler);
    return () => document.removeEventListener("keypress", keyHandler);
  });

  return (
    <EditorContext.Provider
      value={{
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
      <div
        id="root-node"
        className={["editor-root", enableGrid ? "enableGrid" : ""].join(" ")}
      >
        <Tile node={root} setNode={setRoot} />
      </div>
      <ToolPalette root={root} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div className="palettes">
          <ColorPalette />
          <ShapePalette />
        </div>
        <ExportTools
          setRoot={setRoot}
          root={root}
          getDomNode={() => document.getElementById("root-node")}
        />
      </div>
    </EditorContext.Provider>
  );
};
