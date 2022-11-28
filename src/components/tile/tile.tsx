import { h } from "preact";
import { isLeaf, Node } from "../../tree";
import { TileBranch } from "./tile-branch";
import { TileLeaf } from "./tile-leaf";

export interface TileProps<T extends Node> {
  setNode: (node: Node) => void;
  node: T;
}

export const Tile = (props: TileProps<Node>) =>
  isLeaf(props.node) ? (
    <TileLeaf node={props.node} setNode={props.setNode} />
  ) : (
    <TileBranch node={props.node} setNode={props.setNode} />
  );
