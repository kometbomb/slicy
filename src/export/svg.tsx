import { h } from "preact";
import render from "preact-render-to-string";
import { colors } from "../components/colors";
import { baseShapes } from "../components/shapes";
import { isBranch, Node } from "../tree";

const coords = [
  [0, 0],
  [5, 0],
  [0, 5],
  [5, 5],
];

const getSVGNode = (node: Node): h.JSX.Element =>
  isBranch(node) ? (
    <g transform={`scale(.5)`}>
      {node.nodes.map((n, index) => (
        <g
          key={index}
          transform={`translate(${coords[index][0]},${coords[index][1]})`}
        >
          {getSVGNode(n)}
        </g>
      ))}
    </g>
  ) : (
    <g transform={`scale(.5)`}>
      <rect width="10" height="10" fill={colors[node.bg]} />
      {baseShapes[node.shape]({ fill: colors[node.fg] })}
    </g>
  );

export const buildSVG = (root: Node, width?: number, height?: number) =>
  render(
    <svg
      viewBox="0 0 5 5"
      /** Width and height are required by Firefox for canvas rendering */
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
    >
      {getSVGNode(root)}
    </svg>
  );

export const getSVGDataUrl = (node: Node, width?: number, height?: number) => {
  const svg = buildSVG(node, width, height);
  return Promise.resolve(
    `data:image/svg+xml;base64,${btoa(
      `<?xml version="1.0" encoding="UTF-8" ?>${svg}`
    )}`
  );
};
