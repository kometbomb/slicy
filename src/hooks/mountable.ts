import { useState, useEffect, useRef } from "preact/hooks";

export const useMountable = (open: boolean, onFinished?: () => void) => {
  // Actual modal mount status
  const [isMounted, setIsMounted] = useState(open);
  // Modal requested state
  const [isOpen, setIsOpen] = useState(open);
  const closeTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Will follow one render cycle after the mount status changes
    setIsOpen(isMounted);
  }, [isMounted, setIsOpen]);
  useEffect(() => {
    if (open) {
      // Set mounted status after open request
      setIsMounted(true);
    } else {
      // Unmount after 220 ms (animation is ~200 ms)
      closeTimerRef.current = setTimeout(() => {
        setIsMounted(false);
        if (onFinished) onFinished();
      }, 220);
    }

    return () => clearTimeout(closeTimerRef.current);
  }, [open, setIsMounted, onFinished]);

  return { isMounted, setIsMounted, isOpen, setIsOpen };
};
