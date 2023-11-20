import { h } from "preact";
import { copyDataURL } from "../export/clipboard";
import { Grid } from "./grid";
import { Modal, ModalContent, ModalHeader } from "./modal";
import { useToast } from "../hooks/toast";

export const SavePrompt = ({
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
