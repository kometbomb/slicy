import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Color } from "../tree";
import { colors } from "./colors";
import { EditorContext } from "./editor";
import { Grid } from "./grid";

export const ColorPalette = () => {
  const { mode, setMode, fgColor, bgColor, setFgColor, setBgColor } =
    useContext(EditorContext);
  const handleClick = useCallback(
    (e: MouseEvent, color: Color, button: "left" | "right") => {
      e.preventDefault();
      e.stopPropagation();
      if (button === "left") setFgColor(color);
      else setBgColor(color);

      if (mode === "cut") setMode("draw");
    },
    [setFgColor, setBgColor, mode, setMode]
  );
  return (
    <Grid
      cols={6}
      gap={1}
      style={{
        width: "244px",
        height: "102px",
        borderWidth: "2px",
        borderColor: "black",
        borderStyle: "solid",
        borderRadius: "3px",
        padding: "2px",
      }}
    >
      {colors.map((color, index) => (
        <button
          key={color}
          data-testid={`color-${index}`}
          style={{
            border: "none",
            backgroundColor: color,
            minHeight: "24px",
            minWidth: "24px",
            textShadow: "0 0 3px black",
            fontWeight: "bold",
            color: "white",
            fontSize: "16px",
            padding: 0,
          }}
          onClick={(e) => handleClick(e, index, "left")}
          onContextMenu={(e) => handleClick(e, index, "right")}
          className="button"
        >
          {index === fgColor && "F"}
          {index === bgColor && "B"}
        </button>
      ))}
    </Grid>
  );
};
