import { useEffect } from "preact/hooks";

export const useEvent = <E extends Event>(
  target: Document | Element | null,
  event: E["type"],
  handler: (event: E) => void,
  options?: AddEventListenerOptions
) => {
  useEffect(() => {
    if (!target) return;

    target.addEventListener(event, handler as EventListener, options);
    return () =>
      target.removeEventListener(event, handler as EventListener, options);
  }, [target, event, handler, options]);
};
