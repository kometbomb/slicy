import { h } from "preact";
import { useCallback, useState } from "preact/hooks";
import { useToast } from "../hooks/toast";
import { Grid } from "./grid";
import { Modal, ModalContent, ModalHeader } from "./modal";

const Inner = ({ onOk }: { onOk: (image: string) => void }) => {
  const [code, setCode] = useState("");
  const { showToast } = useToast();
  const handleOk = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      try {
        onOk(code);
      } catch (error) {
        showToast("Import failed", "failure");
      }
    },
    [code, onOk, showToast]
  );
  const handleChange: h.JSX.GenericEventHandler<HTMLTextAreaElement> =
    useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (e.currentTarget) {
        setCode(e.currentTarget.value);
      }
    }, []);
  const eatKeyevents: h.JSX.GenericEventHandler<HTMLTextAreaElement> =
    useCallback((e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }, []);

  return (
    <ModalContent>
      <ModalHeader>Import picture</ModalHeader>
      <Grid gap={8}>
        <p>Paste code in the text box</p>
        <textarea
          data-testid="import-paste-textbox"
          onChange={handleChange}
          onKeyDown={eatKeyevents}
          onKeyPress={eatKeyevents}
          value={code}
          style={{ resize: "none" }}
        />
        <button class="button" onClick={handleOk} data-testid="import-paste-ok">
          Import
        </button>
      </Grid>
    </ModalContent>
  );
};

export const ImportModal = ({
  open,
  onOk,
  onClose,
}: {
  open: boolean;
  onOk: (image: string) => void;
  onClose: () => void;
}) => {
  return (
    <Modal onClose={onClose} open={open}>
      <Inner onOk={onOk} />
    </Modal>
  );
};
