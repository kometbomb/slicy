import { useEffect } from "preact/hooks";

export const useEvent = (
  event: "keypress" | "keydown",
  handler: (event: KeyboardEvent) => void
) => {
  useEffect(() => {
    document.addEventListener(event, handler);
    return () => document.removeEventListener(event, handler);
  }, [event, handler]);
};
