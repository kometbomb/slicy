import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { copyNode, pasteNode } from "../export/clipboard";
import { getDataURL } from "../export/export";
import { useToast } from "../hooks/toast";
import { extractRootNodeAndPalette, unpackTree } from "../tree/packed";
import { EditFrame } from "./editor/context";
import { ImportModal } from "./import-modal";
import { SavePrompt } from "./save-prompt";
import { defaultPalette } from "./default-palette";

export const ExportTools = ({
  root,
  setRoot,
}: {
  root: EditFrame;
  setRoot: (node: EditFrame) => void;
}) => {
  const { showToast } = useToast();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string>("");
  const [format, setFormat] = useState<"svg" | "png">("svg");
  const exportImage = useCallback(
    async (type: "svg" | "png") => {
      setDataUrl(await getDataURL(root.node, root.palette, type));
      setFormat(type);
    },
    [root]
  );
  const resetPalette = useCallback(() => {
    setRoot({ ...root, palette: [...defaultPalette] });
  }, [root, setRoot]);
  const resetImage = useCallback(() => {
    setRoot({ ...root, node: { fg: 0, bg: 0, shape: 0 } });
  }, [root, setRoot]);
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
        await copyNode(root.node, root.palette);
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
      const [node, palette] = extractRootNodeAndPalette(JSON.parse(code));
      setRoot({ node: unpackTree(node), palette: [...palette] });
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

      const image = await pasteNode();
      if (!image) {
        showToast("Paste failed", "failure");
        return;
      }
      const [node, palette] = image;

      setRoot({ node, palette: [...palette] });
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
      <div style={{ display: "flex", direction: "row", gap: 16 }}>
        <button
          data-testid="reset-palette"
          style={{ flex: "1" }}
          className="button"
          onClick={resetPalette}
        >
          Reset palette
        </button>
        <button
          data-testid="reset-image"
          style={{ flex: "1" }}
          className="button"
          onClick={resetImage}
        >
          Clear image
        </button>
      </div>
      <ImportModal
        open={isImportModalOpen}
        onOk={handleImport}
        onClose={handleImportClose}
      />
      <SavePrompt url={dataUrl} onClose={handlePromptClose} format={format} />
    </div>
  );
};
