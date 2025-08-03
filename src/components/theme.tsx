import { ComponentChildren, createContext, h } from "preact";
import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { safeWindow } from "../ssr";

type ThemeContextType = {
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
  const [mode, setMode] = useState<"dark" | "light">(
    safeWindow?.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );

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

  const value = useMemo(() => ({ setMode, mode }), [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
