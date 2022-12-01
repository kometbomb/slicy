import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Color } from "../tree";
import { colors } from "./colors";
import { EditorContext } from "./editor";
import { Grid } from "./grid";

export const ColorPalette = () => {
  const { fgColor, bgColor, setFgColor, setBgColor } =
    useContext(EditorContext);
  const handleClick = useCallback(
    (e: MouseEvent, color: Color, button: "left" | "right") => {
      e.preventDefault();
      e.stopPropagation();
      if (button === "left") setFgColor(color);
      else setBgColor(color);
    },
    [setFgColor, setBgColor]
  );
  return (
    <Grid
      cols={5}
      style={{
        width: "240px",
        height: "96px",
        borderWidth: "2px",
        borderColor: "black",
        borderStyle: "solid",
      }}
    >
      {colors.map((color, index) => (
        <div
          key={color}
          style={{
            backgroundColor: color,
            minHeight: "24px",
            minWidth: "24px",
          }}
          onClick={(e) => handleClick(e, index, "left")}
          onContextMenu={(e) => handleClick(e, index, "right")}
        >
          {index === fgColor && "F"}
          {index === bgColor && "B"}
        </div>
      ))}
    </Grid>
  );
};
