import { h } from "preact";
import { useContext } from "preact/hooks";
import { EditorContext } from "./editor";

const palette = ["black", "white", "red", "blue"];

export const Palette = () => {
  const { color, setColor } = useContext(EditorContext);
  return (
    <div className="palette">
      {palette.map((color) => (
        <div
          key={color}
          style={{ backgroundColor: color }}
          onClick={() => setColor(color)}
        />
      ))}
    </div>
  );
};
