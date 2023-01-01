import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { safeDocument } from "../../ssr";
import { useEvent } from "../../hooks/event";
import { mirrorShapeH, mirrorShapeV, rotateShape } from "../../util";
import { ColorPalette } from "../color-palette";
import { ExportTools } from "../export-tools";
import { ShapePalette } from "../shape-palette";
import { Tile } from "../tile";
import { ToolPalette } from "../tool-palette";
import { EditorContext } from "./context";
import { Root } from "./root";

export type Mode = "cut" | "draw" | "color" | "tile";

export const Editor = () => {
  const {
    setMode,
    setBgColor,
    setFgColor,
    bgColor,
    fgColor,
    setEnableGrid,
    setShape,
    root,
    setRoot,
    undo,
    redo,
  } = useContext(EditorContext);

  const handleKeypress = useCallback(
    (e: KeyboardEvent) => {
      if (!(e.altKey || e.ctrlKey))
        switch (e.key) {
          /**
           * Set modes
           */
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

          /**
           * Toggle grid visibility
           */
          case "g":
            setEnableGrid((value) => !value);
            break;

          /**
           * Horizontal mirror tile
           */
          case "h":
            setShape((shape) => mirrorShapeH(shape));
            break;

          /**
           * Vertical mirror tile
           */
          case "v":
            setShape((shape) => mirrorShapeV(shape));
            break;

          /**
           * Rotate tile CW
           */
          case "r":
            setShape((shape) => rotateShape(shape));
            break;

          /** Swap selected colors */
          case "x":
            setFgColor(bgColor);
            setBgColor(fgColor);
            break;
        }
    },
    [bgColor, fgColor, setBgColor, setEnableGrid, setFgColor, setMode, setShape]
  );

  /**
   * Handle keydown event for modified + key events
   */
  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey) {
        switch (e.key) {
          case "z":
            undo();
            break;

          case "Z":
            redo();
            break;

          case "y":
            redo();
            break;
        }
      }
    },
    [redo, undo]
  );

  useEvent(safeDocument, "keypress", handleKeypress);
  useEvent(safeDocument, "keydown", handleKeydown);

  return (
    <div>
      <Root>
        <Tile node={root} setNode={setRoot} />
      </Root>
      <ToolPalette root={root} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div className="palettes">
          <ColorPalette />
          <ShapePalette />
        </div>
        <ExportTools setRoot={setRoot} root={root} />
      </div>
    </div>
  );
};
