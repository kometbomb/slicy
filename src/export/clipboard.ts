import { Node } from "../tree";
import { packTree, unpackTree, validatePackedNode } from "../tree/packed";
import { getDataURL } from "./export";
import { renderPNG } from "./png";

export const copyNode = async (node: Node) => {
  try {
    await navigator.clipboard.writeText(JSON.stringify(packTree(node)));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const pasteNode = async () => {
  try {
    const dataText = await navigator.clipboard.readText();
    if (dataText) {
      const data = JSON.parse(dataText);
      if (validatePackedNode(data)) {
        return unpackTree(data);
      }
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });
  return blob;
}

export const copyDataURL = async (root: Node, type: "svg" | "png") => {
  const mimetypes: Record<typeof type, string> = {
    svg: "image/svg+xml",
    png: "image/png",
  };
  try {
    const dataUrl = await getDataURL(root, type);
    await navigator.clipboard.write([
      new ClipboardItem({
        [mimetypes[type]]: dataURItoBlob(dataUrl),
      }),
    ]);
  } catch (error) {
    console.error(error);
  }
};
