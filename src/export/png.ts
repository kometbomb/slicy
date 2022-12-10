import { Node } from "../tree";
import { createCanvas, createContext, createImage } from "./createElement";
import { getSVGDataUrl } from "./svg";

const imageWidth = 1024;
const imageHeight = 1024;

export const renderPNG = async (root: Node): Promise<string> => {
  const canvas = createCanvas();
  canvas.width = imageWidth;
  canvas.height = imageHeight;

  const context = createContext(canvas);

  const svgImage = createImage();
  svgImage.width = imageWidth;
  svgImage.height = imageHeight;
  svgImage.src = await getSVGDataUrl(root, imageWidth, imageHeight);

  return new Promise<string>((resolve, reject) => {
    svgImage.onload = () => {
      context.drawImage(svgImage, 0, 0, imageWidth, imageHeight);
      resolve(canvas.toDataURL("image/png"));
    };
    svgImage.onerror = (e) => reject(e);
  });
};
