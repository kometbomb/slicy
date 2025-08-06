import { Palette } from "src/tree/packed";

export const defaultPalette: Readonly<Palette> = [
  "#000000",
  "#ffffff",
  "#baaaff",
  "#3f32ae",
  "#057fc1",
  "#32c1c3",
  "#ff949d",
  "#e80200",
  "#7a243d",
  "#6a8927",
  "#c98f4c",
  "#efe305",
  "#16ed75",
  "#6e4e23",
  "#195648",
  "#e30ec2",
] as const;

export const isDefaultPalette = (palette: Readonly<Palette>) =>
  defaultPalette.every((_, index) => palette[index] === defaultPalette[index]);
