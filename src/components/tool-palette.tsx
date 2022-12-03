import { h } from "preact";
import { useContext } from "preact/hooks";
import { EditorContext, Mode } from "./editor";
import { Grid } from "./grid";
import { isBranch, Node } from "../tree";

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
    <button
      onClick={() => setMode(mode)}
      className={["button", ...(editorMode === mode ? ["selected"] : [])].join(
        " "
      )}
      title={label}
      style={{ minWidth: "48px", minHeight: "24px", maxWidth: "48px" }}
    >
      {icon}
    </button>
  );
};

const GridButton = () => {
  const { enableGrid, setEnableGrid } = useContext(EditorContext);
  return (
    <button
      onClick={() => setEnableGrid(!enableGrid)}
      className={["button", ...(enableGrid ? ["selected"] : [])].join(" ")}
      title="Grid"
      style={{ minWidth: "48px", minHeight: "24px", maxWidth: "48px" }}
    >
      #
    </button>
  );
};

const calculateCuts = (node: Node): number =>
  isBranch(node)
    ? node.nodes.reduce((total, node) => calculateCuts(node) + total, 0)
    : 1;

export const ToolPalette = ({ root }: { root: Node }) => {
  return (
    <div className="toolbar">
      <Grid
        cols={6}
        gap={4}
        style={{
          height: "48px",
          maxWidth: "508px",
          background: "transparent",
          justifyContent: "space-between",
        }}
      >
        <ToolButton label="Cut" mode="cut" icon="✂️" />
        <ToolButton label="Draw" mode="draw" icon="🖌️" />
        <ToolButton label="Color" mode="color" icon="🎨" />
        <ToolButton label="Tile" mode="tile" icon="🔹" />
        <GridButton />
        <div className="stats" title="Square count">
          {calculateCuts(root)}
        </div>
      </Grid>
    </div>
  );
};
