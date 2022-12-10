import { h } from "preact";
import { useState } from "preact/hooks";
import { copyDataURL, copyNode, pasteNode } from "../export/clipboard";
import { getDataURL } from "../export/export";
import { Node } from "../tree";
import { Grid } from "./grid";
import { Modal, ModalContent, ModalHeader } from "./modal";

const SavePrompt = ({
  format,
  url,
  onClose,
}: {
  format: "svg" | "png";
  url?: string;
  onClose: () => void;
}) => {
  if (!url) return null;

  return (
    <Modal onClose={onClose}>
      <ModalContent>
        <ModalHeader>{`Export .${format.toLocaleUpperCase()}`}</ModalHeader>
        <Grid gap={8}>
          <button
            class="button"
            data-testid="export-copy"
            onClick={async () => {
              await copyDataURL(url);
              onClose();
            }}
          >
            Copy to clipboard
          </button>
          <a
            className="button"
            href={url}
            rel="noreferrer"
            target="_blank"
            data-testid="export-link"
          >
            Link to file...
          </a>
          <hr />
          <button class="button" onClick={onClose} data-testid="export-close">
            OK
          </button>
        </Grid>
      </ModalContent>
    </Modal>
  );
};

export const ExportTools = ({
  root,
  setRoot,
}: {
  root: Node;
  setRoot: (node: Node) => void;
}) => {
  const [dataUrl, setDataUrl] = useState<string>();
  const [format, setFormat] = useState<"svg" | "png">("svg");

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
        data-testid="export-png"
        style={{ flex: "1" }}
        className="button"
        onClick={async (e) => {
          e.preventDefault();
          setDataUrl(await getDataURL(root, "png"));
          setFormat("png");
        }}
      >
        Export .PNG
      </button>
      <button
        data-testid="export-svg"
        style={{ flex: "1" }}
        className="button"
        onClick={async (e) => {
          e.preventDefault();
          setDataUrl(await getDataURL(root, "svg"));
          setFormat("svg");
        }}
      >
        Export .SVG
      </button>
      <SavePrompt
        url={dataUrl}
        onClose={() => setDataUrl(undefined)}
        format={format}
      />
    </div>
  );
};
