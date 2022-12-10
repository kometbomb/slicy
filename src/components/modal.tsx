import { ComponentChildren, h } from "preact";
import { useCallback } from "preact/hooks";
import { useEvent } from "../hooks/event";

export const ModalContent = ({ children }: { children: ComponentChildren }) => (
  <div className="content">{children}</div>
);

export const ModalHeader = ({ children }: { children: ComponentChildren }) => (
  <h5>{children}</h5>
);

export const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ComponentChildren;
}) => {
  const escHandler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key == "Escape") onClose();
    },
    [onClose]
  );
  useEvent("keydown", escHandler);

  return <div className="modal">{children}</div>;
};
