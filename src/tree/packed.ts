import { Shape, Color, isBranch, BranchNodes, Node } from ".";

type PackedLeaf = [Shape, Color, Color?];
type PackedBranch = [PackedNode, PackedNode, PackedNode, PackedNode];

type PackedNode = PackedLeaf | PackedBranch;

export const packTree = (root: Node): PackedNode =>
  isBranch(root)
    ? (root.nodes.map(packTree) as PackedBranch)
    : [root.shape, root.fg, root.bg];

const isPackedBranch = (node: PackedNode): node is PackedBranch =>
  Array.isArray(node[0]) && node.length === 4;

const isPackedLeaf = (node: PackedNode): node is PackedLeaf =>
  Array.isArray(node) && !node.some((element) => typeof element !== "number");

export const validatePackedNode = (node: PackedNode): boolean =>
  isPackedBranch(node) ? node.every(validatePackedNode) : isPackedLeaf(node);

export const unpackTree = (root: PackedNode): Node =>
  isPackedBranch(root)
    ? { nodes: root.map(unpackTree) as BranchNodes }
    : { shape: root[0], fg: root[1], bg: root[2] || 0 };
