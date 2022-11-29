import { h } from "preact";

export interface SvgProps {
  fill: string;
}

export const Circle = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <rect fill={fill} width="10" height="10" x="0" y="0" ry="5" />
  </svg>
);

export const Empty = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <rect fill={fill} stroke={fill} x="2" y="2" width="6" height="6" />
  </svg>
);

export const Donut = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path
      fill={fill}
      d="M 5 0 C 2.23 0 0 2.23 0 5 C 0 7.77 2.23 10 5 10 C 7.77 10 10 7.77 10 5 C 10 2.23 7.77 0 5 0 z M 5 2.5 C 6.385 2.5 7.5 3.615 7.5 5 C 7.5 6.385 6.385 7.5 5 7.5 C 3.615 7.5 2.5 6.385 2.5 5 C 2.5 3.615 3.615 2.5 5 2.5 z "
    />
  </svg>
);

export const Square = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <rect fill={fill} width="10" height="10" x="0" y="0" />
  </svg>
);

export const Round1 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 10,0 V 10 H 0 C 0,5 5,0 10,0 Z" />
  </svg>
);

export const Round2 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 0,0 V 10 H 10 C 10,5 5,0 0,0 Z" />
  </svg>
);

export const Round3 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 0,10 V 0 H 10 C 10,5 5,10 0,10 Z" />
  </svg>
);

export const Round4 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 10,10 V 0 H 0 c 0,5 5,10 10,10 z" />
  </svg>
);

export const Sharp1 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 10,0 V 10 H 0 Z" />
  </svg>
);

export const Sharp2 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 0,0 V 10 H 10 Z" />
  </svg>
);

export const Sharp3 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 0,10 V 0 h 10 z" />
  </svg>
);

export const Sharp4 = ({ fill }: SvgProps) => (
  <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <path fill={fill} d="M 10,10 V 0 H 0 Z" />
  </svg>
);
