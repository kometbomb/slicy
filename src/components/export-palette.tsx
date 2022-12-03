import { h } from "preact";
import { Node } from "../tree";
import { copyNode, pasteNode } from "./clipboard";

export const ExportPalette = ({
  root,
  setRoot,
}: {
  root: Node;
  setRoot: (node: Node) => void;
}) => (
  <div
    className="export"
    style={{
      display: "grid",
      gap: "15px",
      padding: "2px",
      flex: "1",
    }}
  >
    <button
      style={{ flex: "1" }}
      className="button"
      onClick={async (e) => {
        e.preventDefault();
        await copyNode(root);
      }}
    >
      Copy to clipboard
    </button>
    <button
      style={{ flex: "1" }}
      className="button"
      onClick={async (e) => {
        e.preventDefault();
        const node = await pasteNode();
        if (!node) return;
        setRoot(node);
      }}
    >
      Paste from clipboard
    </button>
  </div>
);
