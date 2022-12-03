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
      className={["button", ...(editorMode === mode ? ["selected"] : [])].join(
        " "
      )}
      title={label}
      style={{ minWidth: "48px", minHeight: "24px", maxWidth: "48px" }}
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
      className={["button", ...(enableGrid ? ["selected"] : [])].join(" ")}
      title="Toggle grid"
      style={{ minWidth: "48px", minHeight: "24px", maxWidth: "48px" }}
    >
      #
    </div>
  );
};

export const ToolPalette = () => {
  return (
    <div className="toolbar">
      <Grid
        cols={5}
        gap={4}
        style={{
          height: "48px",
          width: "508px",
          background: "transparent",
          justifyContent: "space-between",
        }}
      >
        <ToolButton label="Set" mode="cut" icon="✂️" />
        <ToolButton label="Cut" mode="draw" icon="🖌️" />
        <ToolButton label="Color" mode="color" icon="🎨" />
        <ToolButton label="Tile" mode="tile" icon="🔹" />
        <GridButton />
      </Grid>
    </div>
  );
};
