import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { copyDataURL, copyNode, pasteNode } from "../export/clipboard";
import { getDataURL } from "../export/export";
import { Node } from "../tree";
import { Grid } from "./grid";
import { Modal, ModalContent, ModalHeader } from "./modal";
import { useToast } from "../hooks/toast";

const SavePrompt = ({
  format,
  url,
  onClose,
}: {
  format: "svg" | "png";
  url: string;
  onClose: () => void;
}) => {
  const { showToast } = useToast();
  return (
    <Modal onClose={onClose} open={!!url}>
      <ModalContent>
        <ModalHeader>{`Export .${format.toLocaleUpperCase()}`}</ModalHeader>
        <Grid gap={8}>
          <button
            class="button"
            data-testid="export-copy"
            onClick={async () => {
              try {
                await copyDataURL(url);
                onClose();
                showToast("File copied to clipboard", "success");
              } catch (error) {
                showToast("Copy to clipboard failed", "failure");
              }
            }}
            disabled={!global.ClipboardItem}
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
  const { showToast } = useToast();
  const [dataUrl, setDataUrl] = useState<string>("");
  const [format, setFormat] = useState<"svg" | "png">("svg");
  const exportImage = useCallback(
    async (type: "svg" | "png") => {
      setDataUrl(await getDataURL(root, type));
      setFormat(type);
    },
    [root]
  );
  const exportPNG = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      await exportImage("png");
    },
    [exportImage]
  );
  const exportSVG = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      await exportImage("svg");
    },
    [exportImage]
  );
  const handleCopyToClipboard = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      try {
        await copyNode(root);
        showToast("Pic copied to clipboard", "success");
      } catch (error) {
        showToast("Copy failed", "failure");
      }
    },
    [root, showToast]
  );
  const handlePasteFromClipboard = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();
      const node = await pasteNode();
      if (!node) {
        showToast("Paste failed", "failure");
        return;
      }
      setRoot(node);
      showToast("Pic pasted from clipboard", "success");
    },
    [setRoot, showToast]
  );
  const handlePromptClose = useCallback(() => setDataUrl(""), []);

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
        onClick={handleCopyToClipboard}
      >
        Copy to clipboard
      </button>
      <button
        disabled={
          typeof window !== "undefined" && !navigator.clipboard?.readText
        }
        data-testid="export-paste-code"
        style={{ flex: "1" }}
        className="button"
        onClick={handlePasteFromClipboard}
      >
        Paste from clipboard
      </button>
      <button
        data-testid="export-png"
        style={{ flex: "1" }}
        className="button"
        onClick={exportPNG}
      >
        Export .PNG
      </button>
      <button
        data-testid="export-svg"
        style={{ flex: "1" }}
        className="button"
        onClick={exportSVG}
      >
        Export .SVG
      </button>
      <SavePrompt url={dataUrl} onClose={handlePromptClose} format={format} />
    </div>
  );
};
