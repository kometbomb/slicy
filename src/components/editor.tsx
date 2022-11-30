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
  setMode: (mode: Mode) => void;
  setFgColor: (color: Color) => void;
  setBgColor: (color: Color) => void;
  setShape: (shape: Shape) => void;
}

export const EditorContext = createContext<EditorContextType>({
  mode: "color",
  bgColor: 0,
  fgColor: 1,
  shape: 0,
  setMode: () => 0,
  setFgColor: () => 0,
  setBgColor: () => 0,
  setShape: () => 0,
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
  const [mode, setMode] = useState<Mode>("color");

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
      }}
    >
      <div className="editor-root">
        <Tile node={root} setNode={setRoot} />
      </div>
      <ToolPalette />
      <Grid cols={2}>
        <ColorPalette />
        <ShapePalette />
      </Grid>
    </EditorContext.Provider>
  );
};
