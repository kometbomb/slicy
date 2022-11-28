import { h } from "preact";
import { useContext } from "preact/hooks";
import { EditorContext } from "./editor";

export const ToolPalette = () => {
  const { mode, setMode } = useContext(EditorContext);
  return (
    <div className="tools">
      <div onClick={() => setMode("cut")}>Cut{mode === "cut" ? "v" : "_"}</div>
      <div onClick={() => setMode("color")}>
        Color{mode === "color" ? "v" : "_"}
      </div>
      <div onClick={() => setMode("shape")}>
        Shape{mode === "shape" ? "v" : "_"}
      </div>
    </div>
  );
};
