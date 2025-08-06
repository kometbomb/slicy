import { h } from "preact";
import render from "preact-render-to-string";
import { Palette } from "src/tree/packed";
import { baseShapes } from "../components/shapes";
import { isBranch, Node } from "../tree";

const coords = [
  [0, 0],
  [5, 0],
  [0, 5],
  [5, 5],
];

const getSVGNode = (node: Node, palette: Palette): h.JSX.Element =>
  isBranch(node) ? (
    <g transform={`scale(.5)`}>
      {node.nodes.map((n, index) => (
        <g
          key={index}
          transform={`translate(${coords[index][0]},${coords[index][1]})`}
        >
          {getSVGNode(n, palette)}
        </g>
      ))}
    </g>
  ) : (
    <g transform={`scale(.5)`}>
      <rect width="10" height="10" fill={palette[node.bg]} />
      {baseShapes[node.shape]({ fill: palette[node.fg] })}
    </g>
  );

export const buildSVG = (
  root: Node,
  palette: Palette,
  width?: number,
  height?: number
) =>
  render(
    <svg
      viewBox="0 0 5 5"
      /** Width and height are required by Firefox for canvas rendering */
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      {getSVGNode(root, palette)}
    </svg>
  );

export const getSVGDataUrl = (
  node: Node,
  palette: Palette,
  width?: number,
  height?: number
) => {
  const svg = buildSVG(node, palette, width, height);
  return Promise.resolve(
    `data:image/svg+xml;base64,${btoa(
      `<?xml version="1.0" encoding="UTF-8" ?>${svg}`
    )}`
  );
};
