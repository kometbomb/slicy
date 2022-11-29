import * as svg from "./svg";

export const shapes: ((props: svg.SvgProps) => JSX.Element)[] = [
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
