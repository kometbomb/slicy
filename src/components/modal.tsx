import { ComponentChildren, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useEvent } from "../hooks/event";
import "../assets/modal.css";

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
  open: boolean;
  onClose: () => void;
  children: ComponentChildren;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const escHandler = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key == "Escape") onClose();
    },
    [onClose]
  );
  useEvent("keydown", escHandler);
  useEffect(() => {
    setIsOpen(isVisible);
  }, [isVisible]);
  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else
      setTimeout(() => {
        setIsVisible(false);
      }, 220);
  }, [open]);

  if (!isVisible) return null;

  const classes = ["modal", ...(isOpen && open ? ["open"] : [])];

  return <div className={classes.join(" ")}>{children}</div>;
};
