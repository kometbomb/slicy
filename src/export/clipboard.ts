import { Node } from "../tree";
import {
  extractRootNodeAndPalette,
  joinRootNodeAndPalette,
  Palette,
  unpackTree,
  validatePackedNode,
} from "../tree/packed";

export const copyNode = async (node: Node, palette: string[]) => {
  await navigator.clipboard.writeText(
    JSON.stringify(joinRootNodeAndPalette(node, palette))
  );
};

export const pasteNode = async (): Promise<[Node, Palette] | null> => {
  try {
    const dataText = await navigator.clipboard.readText();
    if (dataText) {
      const [node, palette] = extractRootNodeAndPalette(JSON.parse(dataText));

      if (validatePackedNode(node)) {
        return [unpackTree(node), palette];
      }
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

function dataURItoBlob(dataURI: string): [Blob, string] {
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
  return [blob, mimeString];
}

export const copyDataURL = async (dataUrl: string) => {
  const [blob, mimetype] = dataURItoBlob(dataUrl);
  await navigator.clipboard.write([
    new ClipboardItem({
      [mimetype]: blob,
    }),
  ]);
};
