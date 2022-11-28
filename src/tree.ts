export type Color = string;
export type Shape = string;

export interface Branch {
  nodes: [Node, Node, Node, Node];
}

export interface Leaf {
  fg: Color;
  bg: Color;
  shape: Shape;
}

export type Node = Branch | Leaf;

export const isBranch = (node: Node): node is Branch =>
  Array.isArray((node as Branch).nodes);

export const isLeaf = (node: Node): node is Leaf =>
  !Array.isArray((node as Branch).nodes);
