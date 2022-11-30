import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Shape } from "src/tree";
import { colors } from "./colors";
import { EditorContext } from "./editor";
import { Grid } from "./grid";
import { shapes } from "./shapes";

export const ShapePalette = () => {
  const { shape, setShape, fgColor, bgColor } = useContext(EditorContext);
  const handleClick = useCallback(
    (e: MouseEvent, shape: Shape) => {
      e.preventDefault();
      e.stopPropagation();
      setShape(shape);
    },
    [setShape]
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
          onClick={(e) => handleClick(e, index)}
          style={{
            minWidth: "24px",
            minHeight: "24px",
            backgroundColor: index === shape ? colors[bgColor] : "white",
          }}
        >
          <PaletteShape fill={index === shape ? colors[fgColor] : "grey"} />
        </div>
      ))}
    </Grid>
  );
};
