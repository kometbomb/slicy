import { useRef } from "preact/hooks"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useDebounce = <T extends (...args: any[]) => void>(callback: T, delayMs: number): T => {
  const timer = useRef<NodeJS.Timeout>()
  return function (this: unknown, ...args: unknown[]) {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => callback.apply(this, args), delayMs)
  } as T
}