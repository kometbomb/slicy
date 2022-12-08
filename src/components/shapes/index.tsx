/* eslint-disable react/display-name */
import { h } from "preact";
import * as svg from "./svg";

const svgWrapper =
  (Shape: (props: svg.SvgProps) => h.JSX.Element) => (props: svg.SvgProps) =>
    (
      <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
        <Shape {...props} />
      </svg>
    );

/**
 * Shapes without the xml root tag
 */
export const baseShapes = [
  svg.Square,
  svg.Sharp1,
  svg.Sharp2,
  svg.Round1,
  svg.Round2,
  svg.Donut,
  svg.Sharp4,
  svg.Sharp3,
  svg.Round4,
  svg.Round3,
];

/**
 * Shapes with the xml root tag
 */
export const shapes: ((props: svg.SvgProps) => h.JSX.Element)[] =
  baseShapes.map(svgWrapper);
