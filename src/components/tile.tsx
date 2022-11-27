import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Branch, isLeaf, Node, Leaf } from "../tree";
import { EditorContext } from "./editor";

interface TileProps<T extends Node> {
  setNode: (node: Node) => void;
  node: T;
}

const TileLeaf = (props: TileProps<Leaf>) => {
  const { color } = useContext(EditorContext);
  const { node, setNode } = props;
  const handleClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      if (e.button === 2)
        setNode({
          nodes: [{ ...node }, { ...node }, { ...node }, { ...node }],
        });
      else
        setNode({
          color,
        });
    },
    [node, setNode, color]
  );

  return (
    <div
      class="node"
      style={{ backgroundColor: props.node.color }}
      onClick={handleClick}
      onContextMenu={(e) => {
        e.preventDefault();
        handleClick(e);
      }}
    >
      <div class="overlay">.</div>
    </div>
  );
};

const TileBranch = (props: TileProps<Branch>) => {
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

export const Tile = (props: TileProps<Node>) =>
  isLeaf(props.node) ? (
    <TileLeaf node={props.node} setNode={props.setNode} />
  ) : (
    <TileBranch node={props.node} setNode={props.setNode} />
  );
