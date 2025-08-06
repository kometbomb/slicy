import { ComponentChildren, createContext, h } from "preact";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "preact/hooks";
import { useLocalStorage } from "../hooks/localStorage";
import { safeWindow } from "../ssr";

export type ThemeContextType = {
  setMode: (mode: "dark" | "light") => void;
  mode: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType>({} as never);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({
  children,
}: {
  children: ComponentChildren;
}) => {
  const localStorage = useLocalStorage();
  const storedMode = localStorage.getItem("theme") as "light" | "dark" | null;
  const [mode, setMode] = useState<"dark" | "light">(() =>
    typeof storedMode === "string"
      ? storedMode
      : safeWindow?.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  const innerSet = useCallback(
    (mode: "dark" | "light") => {
      setMode(mode);
      localStorage.setItem("theme", mode);
    },
    [localStorage]
  );

  useEffect(() => {
    document.body.className = `theme-${mode}`;
  }, [mode]);

  useEffect(() => {
    if (!safeWindow?.matchMedia) return;

    const listener = (event: MediaQueryListEvent) => {
      setMode(event.matches ? "dark" : "light");
    };

    safeWindow
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", listener);

    return () =>
      safeWindow
        ?.matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", listener);
  }, [setMode]);

  const value = useMemo(() => ({ setMode: innerSet, mode }), [innerSet, mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const DarkMode = () => {
  const { setMode, mode } = useTheme();
  const handleClick = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [setMode, mode]);

  return (
    <span class="text-button" onClick={handleClick}>
      {mode === "light" ? "dark mode" : "light mode"} (m)
    </span>
  );
};
