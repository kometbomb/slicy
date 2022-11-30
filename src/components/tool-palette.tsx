import { h } from "preact";
import { useContext } from "preact/hooks";
import { EditorContext, Mode } from "./editor";
import { Grid } from "./grid";

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
      style={{ minWidth: "24px", minHeight: "24px" }}
    >
      {icon}
    </div>
  );
};

export const ToolPalette = () => {
  return (
    <Grid cols={4} style={{ height: "48px", width: "240px" }}>
      <ToolButton label="Set" mode="cut" icon="✂️" />
      <ToolButton label="Cut" mode="draw" icon="🖌️" />
      <ToolButton label="Color" mode="color" icon="c" />
      <ToolButton label="Tile" mode="tile" icon="🔹" />
    </Grid>
  );
};
