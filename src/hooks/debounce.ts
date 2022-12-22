import { useRef } from "preact/hooks"

export const useDebounce = <T extends (...args: any[]) => void>(callback: T, delayMs: number): T => {
  const timer = useRef<NodeJS.Timeout>()
  return function (this: any, ...args: any[]) {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => callback.apply(this, args), delayMs)
  } as T
}