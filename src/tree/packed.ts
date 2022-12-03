import { Shape, Color, isBranch, BranchNodes, Node } from ".";

/**
 * fg, shape, bg
 */
type PackedLeaf = [Color?, Shape?, Color?];
type PackedBranch = [PackedNode, PackedNode, PackedNode, PackedNode];

type PackedNode = PackedLeaf | PackedBranch;

const trimZeros = (array: number[]) => {
  let index;
  for (index = array.length - 1; index >= 0; --index)
    if (array[index] > 0) break;

  return array.slice(0, index + 1);
};

export const packTree = (root: Node): PackedNode =>
  isBranch(root)
    ? (root.nodes.map(packTree) as PackedBranch)
    : // Filter out zero values from the end of the array
      (trimZeros([root.fg, root.shape, root.bg]) as PackedLeaf);

const isPackedBranch = (node: PackedNode): node is PackedBranch =>
  Array.isArray(node[0]) && node.length === 4;

const isPackedLeaf = (node: PackedNode): node is PackedLeaf =>
  Array.isArray(node) && !node.some((element) => typeof element !== "number");

export const validatePackedNode = (node: PackedNode): boolean =>
  isPackedBranch(node) ? node.every(validatePackedNode) : isPackedLeaf(node);

export const unpackTree = (root: PackedNode): Node =>
  isPackedBranch(root)
    ? { nodes: root.map(unpackTree) as BranchNodes }
    : { shape: root[1] || 0, fg: root[0] || 0, bg: root[2] || 0 };
