import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Shape } from "src/tree";
import { EditorContext } from "./editor";
import { Grid } from "./grid";
import { shapes } from "./shapes";

export const ShapePalette = () => {
  const { mode, shape, setShape, setMode } = useContext(EditorContext);
  const handleClick = useCallback(
    (shape: Shape) => {
      setShape(shape);
      if (mode !== "set") setMode("shape");
    },
    [setMode, setShape, mode]
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
      {shapes.map((PaletteShape, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className={shape === index ? "selected" : ""}
          style={{ minWidth: "24px", minHeight: "24px" }}
        >
          <PaletteShape fill="black" />
        </div>
      ))}
    </Grid>
  );
};
