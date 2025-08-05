import { defaultPalette } from "../components/default-palette";
import { Shape, Color, isBranch, BranchNodes, Node, Leaf } from ".";

export type Palette = string[];
export type Image = PackedNode | [Palette, PackedNode];

/**
 * fg, shape, bg
 */
type PackedLeaf = [Color?, Shape?, Color?];
type PackedBranch = [PackedNode, PackedNode, PackedNode, PackedNode];

export type PackedNode = PackedLeaf | PackedBranch;

const trimZeros = (array: (number | undefined)[]) => {
  let index;
  for (index = array.length - 1; index >= 0; --index) if (array[index]) break;

  return array.slice(0, index + 1);
};

export const packLeaf = (node: Leaf): PackedLeaf =>
  node.fg === node.bg || node.shape === 0
    ? [node.fg]
    : [node.fg, node.shape, node.bg];

export const packTree = (root: Node): PackedNode =>
  isBranch(root)
    ? (root.nodes.map(packTree) as PackedBranch)
    : // Filter out zero values from the end of the array
      (trimZeros(packLeaf(root)) as PackedLeaf);

const isPackedBranch = (node: PackedNode): node is PackedBranch =>
  Array.isArray(node[0]) && node.length === 4;

const isPackedLeaf = (node: PackedNode): node is PackedLeaf =>
  Array.isArray(node) &&
  node.length <= 3 &&
  !node.some((element) => typeof element !== "number");

export const validatePackedNode = (node: PackedNode): boolean =>
  node
    ? isPackedBranch(node)
      ? node.every(validatePackedNode)
      : isPackedLeaf(node)
    : false;

export const unpackTree = (root: PackedNode): Node =>
  isPackedBranch(root)
    ? { nodes: root.map(unpackTree) as BranchNodes }
    : { shape: root[1] || 0, fg: root[0] || 0, bg: root[2] || 0 };

export const hasPalette = (image: Image): image is [Palette, PackedNode] => {
  if (!Array.isArray(image)) return false;

  const palette = image[0];
  if (!Array.isArray(palette)) return false;

  // return palette.every((el) => typeof el === "string");
  return typeof palette[0] === "string";
};

// Image ops

export const extractRootNodeAndPalette = (
  image: Image
): [PackedNode, Palette] =>
  hasPalette(image)
    ? [
        image[1],
        // Also return colors from the default if custom palette is not full length
        defaultPalette.map((_, index) =>
          image[0][index] ? image[0][index] : defaultPalette[index]
        ),
      ]
    : [image, defaultPalette];

export const joinRootNodeAndPalette = (
  node: Node,
  palette: Palette
): [Palette, PackedNode] | PackedNode => {
  const tree = packTree(node);
  let finalPalette = palette.map((color, index) =>
    color === defaultPalette[index] ? "" : color
  );
  finalPalette = finalPalette.slice(
    0,
    finalPalette.findLastIndex((color) => color !== "") + 1
  );

  if (finalPalette.length === 0) return tree;

  return [finalPalette, tree];
};
