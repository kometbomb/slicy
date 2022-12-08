import { buildSVG } from "./svg";
import { Node } from "./tree";

export const getSVGDataUrl = (node: Node) => {
  const svg = buildSVG(node);
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
