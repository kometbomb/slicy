import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Leaf } from "../../tree";
import { EditorContext } from "../editor";
import { TileProps } from "./tile";

export const TileLeaf = (props: TileProps<Leaf>) => {
  const { fgColor, bgColor, shape, mode } = useContext(EditorContext);
  const { node, setNode } = props;
  const handleClick = useCallback(
    (e: MouseEvent) => {
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
            fg: bgColor,
            bg: fgColor,
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
    [node, setNode, fgColor, bgColor, shape, mode]
  );

  return (
    <div
      class="node"
      style={{ backgroundColor: props.node.bg }}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        handleClick(e);
      }}
    >
      <div class="overlay">{node.shape}</div>
    </div>
  );
};
