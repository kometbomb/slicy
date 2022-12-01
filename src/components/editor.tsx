import { createContext, h } from "preact";
import { useState } from "preact/hooks";
import { Tile } from "./tile";
import { Color, Node, Shape } from "../tree";
import { ColorPalette } from "./color-palette";
import { ShapePalette } from "./shape-palette";
import { ToolPalette } from "./tool-palette";
import { Grid } from "./grid";

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
        className={["editor-root", enableGrid ? "enableGrid" : ""].join(" ")}
      >
        <Tile node={root} setNode={setRoot} />
      </div>
      <ToolPalette />
      <Grid cols={2}>
        <ColorPalette />
        <ShapePalette />
      </Grid>
      <div style={{ margin: "8px", padding: "8px", fontFamily: "courier" }}>
        {JSON.stringify(root)}
      </div>
    </EditorContext.Provider>
  );
};
