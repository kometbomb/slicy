import { Shape } from "./tree";

/**
 * Return CW rotated shape
 */
export const rotateShape = (shape: Shape): Shape =>
  rotationTable[shape] || shape;

/**
 * Return horizontally mirrored shape
 */
export const mirrorShapeH = (shape: Shape): Shape =>
  mirror(mirrorTableH, shape);

/**
 * Return vertically mirrored shape
 */
export const mirrorShapeV = (shape: Shape): Shape =>
  mirror(mirrorTableV, shape);

const mirrorTableH: Record<number, number> = {
  1: 2,
  6: 7,
  3: 4,
  8: 9,
};

const mirrorTableV: Record<number, number> = {
  1: 6,
  2: 7,
  3: 8,
  4: 9,
};

const rotationTable: Record<number, number> = {
  // Diagonal
  1: 2,
  2: 7,
  7: 6,
  6: 1,
  // Circle
  3: 4,
  4: 9,
  9: 8,
  8: 3,
};

const mirror = (table: Record<number, number>, shape: Shape): Shape =>
  Object.entries(table)
    .map(([k, v]) =>
      k === `${shape}` ? v : v === shape ? parseInt(k, 10) : undefined
    )
    .filter((v) => !!v)[0] || shape;
