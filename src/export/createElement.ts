export const createCanvas = () => document.createElement("canvas");
export const createImage = () => document.createElement("img");
export const createContext = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create context");

  return context;
};
