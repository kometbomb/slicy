import { getSVGDataUrl } from "./svg";
import { Node } from "../tree";
import { renderPNG } from "./png";

const exporters = {
  png: renderPNG,
  svg: getSVGDataUrl,
};

export const getDataURL = (root: Node, type: "png" | "svg") => {
  return exporters[type](root);
};
