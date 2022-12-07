import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Leaf } from "../../tree";
import { colors } from "../colors";
import { Mode } from "../editor/editor";
import { EditorContext } from "../editor/context";
import { shapes } from "../shapes";
import { TileProps } from "./tile";

const modeCursor: Record<Mode, string> = {
  cut: "crosshair",
  draw: "pointer",
  color: "pointer",
  tile: "pointer",
};

export const TileLeaf = (props: TileProps<Leaf>) => {
  const { fgColor, bgColor, shape, mode, setBgColor, setFgColor, setShape } =
    useContext(EditorContext);
  const { node, setNode, setParentNode } = props;
  const doDrawAction = useCallback(
    (button: "left" | "right") => {
      switch (mode) {
        case "draw":
          if (button === "left")
            setNode({
              ...node,
              fg: fgColor,
              bg: bgColor,
              shape,
            });
          else {
            setShape(node.shape);
            setFgColor(node.fg);
            setBgColor(node.bg);
          }

          break;

        case "color":
          if (button === "left")
            setNode({
              ...node,
              fg: fgColor,
            });
          else
            setNode({
              ...node,
              bg: bgColor,
            });
          break;

        case "tile":
          if (button === "left")
            setNode({
              ...node,
              shape,
            });
          else setShape(node.shape);
          break;
      }
    },
    [
      bgColor,
      fgColor,
      mode,
      node,
      setBgColor,
      setFgColor,
      setNode,
      setShape,
      shape,
    ]
  );
  const handleEnter = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.buttons & (1 | 2)) doDrawAction(e.buttons & 1 ? "left" : "right");
    },
    [doDrawAction]
  );
  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      doDrawAction(e.buttons & 1 ? "left" : "right");
    },
    [doDrawAction]
  );
  const handleClick = useCallback(
    (e: MouseEvent, button: "left" | "right") => {
      e.preventDefault();
      e.stopPropagation();

      doDrawAction(button);

      switch (mode) {
        case "cut":
          if (button === "left")
            setNode({
              nodes: [{ ...node }, { ...node }, { ...node }, { ...node }],
            });
          else if (setParentNode) setParentNode(node);
          break;
      }

      return false;
    },
    [doDrawAction, mode, setNode, node, setParentNode]
  );

  const Shape = shapes[node.shape];

  return (
    <div
      data-testid="node"
      class="node"
      style={{
        backgroundColor: colors[props.node.bg],
        cursor: modeCursor[mode],
      }}
      onMouseEnter={handleEnter}
      onClick={(e) => handleClick(e, "left")}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => handleClick(e, "right")}
    >
      <div className="overlay">
        <div className="overlay2" />
      </div>
      <Shape fill={colors[node.fg]} />
    </div>
  );
};
