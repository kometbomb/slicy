import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { copyNode, pasteNode } from "../export/clipboard";
import { getDataURL } from "../export/export";
import { Node } from "../tree";
import { useToast } from "../hooks/toast";
import { SavePrompt } from "./save-prompt";
import { ImportModal } from "./import-modal";
import { unpackTree } from "../tree/packed";
import { DarkMode } from "./theme";

export const ExportTools = ({
  root,
  setRoot,
}: {
  root: Node;
  setRoot: (node: Node) => void;
}) => {
  const { showToast } = useToast();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
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
  const handleImportClose = useCallback(() => {
    setIsImportModalOpen(false);
  }, []);
  const handleImport = useCallback(
    (code: string) => {
      setRoot(unpackTree(JSON.parse(code)));
      setIsImportModalOpen(false);
    },
    [setRoot]
  );
  const handlePasteFromClipboard = useCallback(
    async (e: MouseEvent) => {
      e.preventDefault();

      if (typeof window !== "undefined" && !navigator.clipboard?.readText) {
        setIsImportModalOpen(true);
        return;
      }

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
      <ImportModal
        open={isImportModalOpen}
        onOk={handleImport}
        onClose={handleImportClose}
      />
      <SavePrompt url={dataUrl} onClose={handlePromptClose} format={format} />
    </div>
  );
};
