import { useCallback, useRef, useState } from "preact/hooks";

export const useUndo = <T>(initialValue: T) => {
  const [current, setCurrent] = useState<T>(initialValue);
  const history = useRef<T[]>([initialValue]);
  const head = useRef(0);

  const undo = useCallback(() => {
    const prev = history.current[head.current - 1];
    if (!prev) return;
    --head.current;
    setCurrent(history.current[head.current]);
  }, []);

  const redo = useCallback(() => {
    const next = history.current[head.current + 1];
    if (!next) return;
    ++head.current;
    setCurrent(history.current[head.current]);
  }, []);

  const set = useCallback((value: T) => {
    history.current = history.current.slice(0, head.current + 1);
    history.current.push(value);
    ++head.current;
    setCurrent(history.current[head.current]);
  }, []);

  return { current, set, undo, redo };
};
