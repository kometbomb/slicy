import { h } from "preact";
import { useCallback, useContext, useEffect } from "preact/hooks";
import { mirrorShapeH, mirrorShapeV, rotateShape } from "../../util";
import { ColorPalette } from "../color-palette";
import { ExportTools } from "../export-tools";
import { ShapePalette } from "../shape-palette";
import { Tile } from "../tile";
import { ToolPalette } from "../tool-palette";
import { EditorContext } from "./context";

export type Mode = "cut" | "draw" | "color" | "tile";

export const Editor = () => {
  const {
    setMode,
    setBgColor,
    setFgColor,
    bgColor,
    fgColor,
    setEnableGrid,
    enableGrid,
    setShape,
    root,
    setRoot,
  } = useContext(EditorContext);

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
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

  useEffect(() => {
    document.addEventListener("keypress", keyHandler);
    return () => document.removeEventListener("keypress", keyHandler);
  });

  return (
    <div>
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
    </div>
  );
};
