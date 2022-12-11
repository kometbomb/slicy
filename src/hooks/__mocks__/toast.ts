import { ToastContextType } from "src/components/toast";

const context: ToastContextType = {
  showToast: jest.fn(),
};

export const useToast = () => context;
