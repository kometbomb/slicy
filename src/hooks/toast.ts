import { useContext } from "preact/hooks";
import { ToastContext } from "../components/toast";

export const useToast = () => useContext(ToastContext);
