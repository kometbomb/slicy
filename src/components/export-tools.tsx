import { h, Fragment } from "preact";
import { Node } from "../tree";
import { copyNode, copyPNG, pasteNode } from "../clipboard";
import { getSVGDataUrl } from "../export";
import { useState } from "preact/hooks";

const SavePrompt = ({
  url,
  onClose,
}: {
  url?: string;
  onClose: () => void;
}) => {
  if (!url) return null;

  return (
    <>
      <a className="button" href={url}>
        Link to file...
      </a>
      <button class="button" onClick={onClose} data-testid="close-file-link">
        OK
      </button>
    </>
  );
};

export const ExportTools = ({
  root,
  getDomNode,
  setRoot,
}: {
  root: Node;
  getDomNode: () => HTMLElement | null;
  setRoot: (node: Node) => void;
}) => {
  const [dataUrl, setDataUrl] = useState<string>();

  return (
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
        data-testid="export-copy-code"
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
        data-testid="export-paste-code"
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
      <button
        data-testid="export-copy-png"
        style={{ flex: "1" }}
        className="button"
        onClick={async (e) => {
          e.preventDefault();
          const domNode = getDomNode();
          if (domNode) await copyPNG(domNode);
        }}
      >
        Copy .PNG
      </button>
      <button
        data-testid="export-copy-svg"
        style={{ flex: "1" }}
        className="button"
        onClick={async (e) => {
          e.preventDefault();
          const url = getSVGDataUrl(root);
          setDataUrl(url);
        }}
      >
        Save .SVG
      </button>
      <SavePrompt url={dataUrl} onClose={() => setDataUrl(undefined)} />
    </div>
  );
};
