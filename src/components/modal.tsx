import { ComponentChildren, h } from "preact";
import { useCallback } from "preact/hooks";
import "../assets/modal.css";
import { useEvent } from "../hooks/event";
import { useMountable } from "../hooks/mountable";

export const ModalContent = ({ children }: { children: ComponentChildren }) => (
  <div className="content">{children}</div>
);

export const ModalHeader = ({ children }: { children: ComponentChildren }) => (
  <h5 data-testid="modal-heading" className="heading">
    {children}
  </h5>
);

export const Modal = ({
  open,
  onClose,
  children,
}: {
  /** Requested modal visibility */
  open: boolean;
  onClose: () => void;
  children: ComponentChildren;
}) => {
  const { isMounted, isOpen } = useMountable(open);
  const escHandler = useCallback(
    (e: KeyboardEvent) => {
      if (!isMounted) return;
      e.preventDefault();
      if (e.key == "Escape") onClose();
    },
    [onClose, isMounted]
  );
  useEvent(document, "keydown", escHandler);

  if (!isMounted) return null;

  const classes = ["modal", ...(isOpen && open ? ["open"] : [])];

  return <div className={classes.join(" ")}>{children}</div>;
};
