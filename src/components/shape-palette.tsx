import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Shape } from "src/tree";
import { EditorContext } from "./editor";

const shapes: Shape[] = ["🐈", "💩", "🤖", "💀"];

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
      {shapes.map((paletteShape) => (
        <div key={paletteShape} onClick={() => handleClick(paletteShape)}>
          {paletteShape}
          {shape === paletteShape ? "v" : "_"}
        </div>
      ))}
    </div>
  );
};
