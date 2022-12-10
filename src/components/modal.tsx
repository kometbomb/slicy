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
  /** Requested modal visibility */
  open: boolean;
  onClose: () => void;
  children: ComponentChildren;
}) => {
  // Actual modal mount status
  const [isMounted, setIsMounted] = useState(false);
  // Modal requested state
  const [isOpen, setIsOpen] = useState(false);
  const escHandler = useCallback(
    (e: KeyboardEvent) => {
      if (!isMounted) return;
      e.preventDefault();
      if (e.key == "Escape") onClose();
    },
    [onClose, isMounted]
  );
  useEvent("keydown", escHandler);
  useEffect(() => {
    // Will follow one render cycle after the mount status changes
    setIsOpen(isMounted);
  }, [isMounted]);
  useEffect(() => {
    if (open) {
      // Set mounted status after open request
      setIsMounted(true);
    } else {
      // Unmount after 220 ms (animation is ~200 ms)
      setTimeout(() => {
        setIsMounted(false);
      }, 220);
    }
  }, [open]);

  if (!isMounted) return null;

  const classes = ["modal", ...(isOpen && open ? ["open"] : [])];

  return <div className={classes.join(" ")}>{children}</div>;
};
