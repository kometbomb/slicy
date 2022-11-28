import { h } from "preact";
import { useCallback } from "preact/hooks";
import { Branch, Node } from "../../tree";
import { TileProps, Tile } from "./tile";

export const TileBranch = (props: TileProps<Branch>) => {
  const {
    setNode,
    node: { nodes },
  } = props;
  const setChildNode = useCallback(
    (index: number, node: Node) => {
      const newNodes = [...nodes] as Branch["nodes"];
      newNodes[index] = { ...node };
      setNode({ nodes: newNodes });
    },
    [setNode, nodes]
  );

  return (
    <div class="branch" onContextMenu={(e) => e.preventDefault()}>
      {props.node.nodes.map((node, index) => (
        <Tile
          key={index}
          node={node}
          setNode={(node) => setChildNode(index, node)}
        />
      ))}
    </div>
  );
};
