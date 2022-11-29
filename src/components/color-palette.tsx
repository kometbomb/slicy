import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Color } from "src/tree";
import { colors } from "./colors";
import { EditorContext } from "./editor";
import { Grid } from "./grid";

export const ColorPalette = () => {
  const {
    mode,
    color: selectedColor,
    setColor,
    setMode,
  } = useContext(EditorContext);
  const handleClick = useCallback(
    (color: Color) => {
      setColor(color);
      if (mode !== "set") setMode("color");
    },
    [setMode, setColor, mode]
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
          className={selectedColor === index ? "selected" : ""}
          style={{
            backgroundColor: color,
            minHeight: "24px",
            minWidth: "24px",
          }}
          onClick={() => handleClick(index)}
        />
      ))}
    </Grid>
  );
};
