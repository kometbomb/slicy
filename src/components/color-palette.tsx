import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Color } from "src/tree";
import { EditorContext } from "./editor";

const palette = ["black", "white", "red", "blue"];

export const ColorPalette = () => {
  const { bgColor, fgColor, setBgColor, setFgColor, setMode } =
    useContext(EditorContext);
  const handleClick = useCallback(
    (color: Color) => {
      setBgColor(color);
      setFgColor(color);
      setMode("color");
    },
    [setMode, setBgColor, setFgColor]
  );
  return (
    <div className="palette">
      <div className="palette-selection">
        <div className="bg-color" style={{ backgroundColor: bgColor }} />
        <div className="fg-color" style={{ backgroundColor: fgColor }} />
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
