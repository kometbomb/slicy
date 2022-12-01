import { Node } from "../tree";
import { packTree, unpackTree, validatePackedNode } from "../tree/packed";

export const copyNode = async (node: Node) => {
  try {
    await window.navigator.clipboard.writeText(JSON.stringify(packTree(node)));
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const pasteode = async () => {
  try {
    const dataText = await window.navigator.clipboard.readText();
    if (dataText) {
      const data = JSON.parse(dataText);

      if (validatePackedNode(data)) {
        return unpackTree(data);
      }
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
