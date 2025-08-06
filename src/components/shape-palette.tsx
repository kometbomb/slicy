import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Shape } from "../tree";
import { EditorContext } from "./editor";
import { Grid } from "./grid";
import { shapes } from "./shapes";
import { useTheme } from "./theme";

export const ShapePalette = () => {
  const { mode: themeMode } = useTheme();
  const {
    shape,
    setShape,
    fgColor,
    bgColor,
    mode,
    root: { palette },
    setMode,
  } = useContext(EditorContext);
  const handleClick = useCallback(
    (e: MouseEvent, shape: Shape) => {
      e.preventDefault();
      e.stopPropagation();
      setShape(shape);

      if (mode === "cut") setMode("draw");
    },
    [setShape, mode, setMode]
  );
  const bgCssColor = themeMode === "light" ? "white" : "#222222";
  return (
    <Grid
      cols={5}
      style={{
        background: bgCssColor,
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
            backgroundColor: index === shape ? palette[bgColor] : bgCssColor,
          }}
          className="button"
        >
          <PaletteShape fill={index === shape ? palette[fgColor] : "grey"} />
        </div>
      ))}
    </Grid>
  );
};
