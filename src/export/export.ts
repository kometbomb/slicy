import { getSVGDataUrl } from "./svg";
import { Node } from "../tree";
import { renderPNG } from "./png";
import { Palette } from "src/tree/packed";

const exporters = {
  png: renderPNG,
  svg: getSVGDataUrl,
};

export const getDataURL = (
  root: Node,
  palette: Palette,
  type: "png" | "svg"
) => {
  return exporters[type](root, palette);
};
