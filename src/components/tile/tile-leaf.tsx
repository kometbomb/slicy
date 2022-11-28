import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Leaf } from "../../tree";
import { EditorContext } from "../editor";
import { Svg } from "./svg";
import { TileProps } from "./tile";

export const TileLeaf = (props: TileProps<Leaf>) => {
  const { color, shape, mode } = useContext(EditorContext);
  const { node, setNode } = props;
  const handleClick = useCallback(
    (e: MouseEvent, isRightClick: boolean) => {
      e.preventDefault();

      switch (mode) {
        case "cut":
          setNode({
            nodes: [{ ...node }, { ...node }, { ...node }, { ...node }],
          });
          break;
        case "color":
          setNode({
            ...node,
            [isRightClick ? "bg" : "fg"]: color,
          });
          break;
        case "shape":
          setNode({
            ...node,
            shape,
          });
          break;
      }
    },
    [node, setNode, color, shape, mode]
  );

  return (
    <div
      class="node"
      style={{ backgroundColor: props.node.bg }}
      onClick={(e) => handleClick(e, false)}
      onContextMenu={(e) => handleClick(e, true)}
    >
      <Svg fill={node.fg} />
      <div className="overlay" />
    </div>
  );
};
