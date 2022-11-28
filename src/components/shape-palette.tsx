import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Shape } from "src/tree";
import { EditorContext } from "./editor";
import { shapes } from "./shapes";

export const ShapePalette = () => {
  const { shape, setShape, setMode } = useContext(EditorContext);
  const handleClick = useCallback(
    (shape: Shape) => {
      setShape(shape);
      setMode("shape");
    },
    [setMode, setShape]
  );
  return (
    <div className="shapes">
      {shapes.map((PaletteShape, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          className={shape === index ? "selected" : ""}
        >
          <PaletteShape fill="black" />
        </div>
      ))}
    </div>
  );
};
