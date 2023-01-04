import { h } from "preact";
import { Grid } from "../grid";
import { Modal, ModalContent, ModalHeader } from "../modal";

export const RestoreSavedStateModal = ({
  open,
  onYes,
  onClose,
}: {
  open: boolean;
  onYes: (event: Event) => void;
  onClose: () => void;
}) => (
  <Modal open={open} onClose={onClose}>
    <ModalContent>
      <ModalHeader>Restore state?</ModalHeader>
      <div className="confirm-buttons">
        <Grid gap={8}>
          <button class="button" onClick={onYes}>
            Yes
          </button>
          <button
            class="button"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            No
          </button>
        </Grid>
      </div>
    </ModalContent>
  </Modal>
);
