import { ComponentChildren, createContext, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import "../assets/toast.css";
import { useMountable } from "../hooks/mountable";

type ToastId = string;

interface ToastItem {
  id: ToastId;
  status: "success" | "failure" | "info";
  message: string;
}

export interface ToastContextType {
  showToast: (message: string, status?: ToastItem["status"]) => ToastId;
}

export const ToastContext = createContext<ToastContextType>({} as never);

const Toast = ({
  toast,
  onFinished,
}: {
  toast: ToastItem;
  onFinished: () => void;
}) => {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setTimeout(() => setOpen(false), 5000);
  }, []);
  const { isMounted, isOpen } = useMountable(open, onFinished);

  if (!isMounted) return null;

  const classes = [
    "toast-item",
    toast.status,
    ...(isOpen && open ? ["open"] : []),
  ];
  return (
    <div className={classes.join(" ")}>
      <div>{toast.message}</div>
    </div>
  );
};

export const ToastProvider = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = useCallback(
    (message: string, status: ToastItem["status"] = "info") => {
      const toast = { id: `${Math.random()}`, message, status };
      setToasts((toasts) => [...toasts, toast]);
      return toast.id;
    },
    []
  );
  const removeToast = useCallback((id: ToastId) => {
    setToasts((toasts) => toasts.filter((oldToast) => oldToast.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onFinished={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
