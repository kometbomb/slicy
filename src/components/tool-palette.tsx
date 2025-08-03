import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { isBranch, Node } from "../tree";
import { EditorContext, Mode } from "./editor/context";
import { Grid } from "./grid";

const Separator = () => (
  <div style={{ border: "1px solid #999", width: "1px" }} />
);

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
      data-testid={`mode-${mode}`}
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
      data-testid="toggle-grid"
      className={["button", ...(enableGrid ? ["selected"] : [])].join(" ")}
      title="Toggle grid (g)"
      style={{ minWidth: "48px", minHeight: "24px", maxWidth: "48px" }}
    >
      #
    </button>
  );
};

const UndoButton = () => {
  const { undo, redo } = useContext(EditorContext);
  const handleUndo = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      undo();
    },
    [undo]
  );
  const handleRedo = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      redo();
    },
    [redo]
  );

  return (
    <button
      onClick={handleUndo}
      onContextMenu={handleRedo}
      data-testid="tool-undo"
      className="button"
      title="Undo/redo (CTRL/CMD-Z, CTRL/CMD/-SHIFT-Y, CTRL/CMD/-Y)"
      style={{ minWidth: "48px", minHeight: "24px", maxWidth: "48px" }}
    >
      ⏪
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
        cols={8}
        gap={4}
        style={{
          height: "48px",
          maxWidth: "508px",
          background: "transparent",
          justifyContent: "space-between",
        }}
      >
        <ToolButton label="Split (s)" mode="cut" icon="✂️" />
        <ToolButton label="Draw (d)" mode="draw" icon="🖌️" />
        <ToolButton label="Color (c)" mode="color" icon="🎨" />
        <ToolButton label="Tile (t)" mode="tile" icon="🔹" />
        <Separator />
        <GridButton />
        <UndoButton />
        <div className="stats" title="Square count" data-testid="cut-counter">
          {calculateCuts(root)}
        </div>
      </Grid>
    </div>
  );
};
