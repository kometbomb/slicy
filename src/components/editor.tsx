import { createContext, h } from "preact";
import { useState } from "preact/hooks";
import { Tile } from "./tile";
import { Color, Node, Shape } from "../tree";
import { ColorPalette } from "./color-palette";
import { ShapePalette } from "./shape-palette";
import { ToolPalette } from "./tool-palette";

type Mode = "color" | "shape" | "cut";

interface EditorContextType {
  mode: Mode;
  bgColor: Color;
  fgColor: Color;
  shape: Shape;
  setMode: (mode: Mode) => void;
  setFgColor: (color: Color) => void;
  setBgColor: (color: Color) => void;
  setShape: (shape: Shape) => void;
}

export const EditorContext = createContext<EditorContextType>({
  mode: "color",
  bgColor: "red",
  fgColor: "red",
  shape: "meh",
  setMode: () => 0,
  setBgColor: () => 0,
  setFgColor: () => 0,
  setShape: () => 0,
});

export const Editor = () => {
  const [root, setRoot] = useState<Node>({
    bg: "red",
    fg: "red",
    shape: "meh",
  });
  const [bgColor, setBgColor] = useState<Color>("red");
  const [fgColor, setFgColor] = useState<Color>("red");
  const [shape, setShape] = useState<Shape>("meh");
  const [mode, setMode] = useState<Mode>("color");

  return (
    <EditorContext.Provider
      value={{
        bgColor,
        setBgColor,
        fgColor,
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
      <ColorPalette />
      <ShapePalette />
    </EditorContext.Provider>
  );
};
