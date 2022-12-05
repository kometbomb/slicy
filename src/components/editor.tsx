import { createContext, h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
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
