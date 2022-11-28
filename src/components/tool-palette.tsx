import { h } from "preact";
import { useContext } from "preact/hooks";
import { EditorContext, Mode } from "./editor";

const ToolButton = ({
  mode,
  icon,
  label,
}: {
  label: string;
  icon: string;
  mode: Mode;
}) => {
  const { mode: editorMode, setMode } = useContext(EditorContext);
  return (
    <div
      onClick={() => setMode(mode)}
      className={editorMode === mode ? "selected" : ""}
      title={label}
    >
      {icon}
    </div>
  );
};

export const ToolPalette = () => {
  return (
    <div className="tools">
      <ToolButton label="Cut" mode="cut" icon="✂️" />
      <ToolButton label="Color" mode="color" icon="🖌️" />
      <ToolButton label="Shape" mode="shape" icon="🔹" />
    </div>
  );
};
