import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Color } from "src/tree";
import { colors } from "./colors";
import { EditorContext } from "./editor";

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
        <div className="bg-color" style={{ backgroundColor: colors[color] }} />
      </div>
      <div className="palette-colors">
        {colors.map((color, index) => (
          <div
            key={color}
            style={{ backgroundColor: color }}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
