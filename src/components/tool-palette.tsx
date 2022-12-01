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

const GridButton = () => {
  const { enableGrid, setEnableGrid } = useContext(EditorContext);
  return (
    <div
      onClick={() => setEnableGrid(!enableGrid)}
      title="Toggle grid"
      style={{ minWidth: "24px", minHeight: "24px" }}
    >
      #
    </div>
  );
};

export const ToolPalette = () => {
  return (
    <div>
      <Grid cols={4} style={{ height: "48px", width: "240px" }}>
        <ToolButton label="Set" mode="cut" icon="✂️" />
        <ToolButton label="Cut" mode="draw" icon="🖌️" />
        <ToolButton label="Color" mode="color" icon="c" />
        <ToolButton label="Tile" mode="tile" icon="🔹" />
      </Grid>
      <Grid cols={1} style={{ height: "48px", width: "240px" }}>
        <GridButton />
      </Grid>
    </div>
  );
};
