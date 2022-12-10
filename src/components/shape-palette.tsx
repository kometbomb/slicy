import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Shape } from "../tree";
import { colors } from "./colors";
import { EditorContext } from "./editor";
import { Grid } from "./grid";
import { shapes } from "./shapes";

export const ShapePalette = () => {
  const { shape, setShape, fgColor, bgColor, mode, setMode } =
    useContext(EditorContext);
  const handleClick = useCallback(
    (e: MouseEvent, shape: Shape) => {
      e.preventDefault();
      e.stopPropagation();
      setShape(shape);

      if (mode === "cut") setMode("draw");
    },
    [setShape, mode, setMode]
  );
  return (
    <Grid
      cols={5}
      style={{
        background: "white",
        minWidth: "244px",
        height: "102px",
        borderRadius: "3px",
        borderWidth: "2px",
        borderColor: "black",
        borderStyle: "solid",
        padding: "2px",
        gap: "1px",
      }}
    >
      {shapes.map((PaletteShape, index) => (
        <div
          key={index}
          onClick={(e) => handleClick(e, index)}
          data-testid={`shape-${index}`}
          style={{
            minWidth: "16px",
            minHeight: "16px",
            backgroundColor: index === shape ? colors[bgColor] : "white",
          }}
          className="button"
        >
          <PaletteShape fill={index === shape ? colors[fgColor] : "grey"} />
        </div>
      ))}
    </Grid>
  );
};
