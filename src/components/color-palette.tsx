import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Color } from "src/tree";
import { EditorContext } from "./editor";

const palette = ["black", "white", "red", "blue"];

export const ColorPalette = () => {
  const { color, setColor, setMode } = useContext(EditorContext);
  const handleClick = useCallback(
    (color: Color) => {
      setColor(color);
      setMode("color");
    },
    [setMode, setColor]
  );
  return (
    <div className="palette">
      <div className="palette-selection">
        <div className="bg-color" style={{ backgroundColor: color }} />
      </div>
      <div className="palette-colors">
        {palette.map((color) => (
          <div
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => handleClick(color)}
          />
        ))}
      </div>
    </div>
  );
};
