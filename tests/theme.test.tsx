import { h } from "preact";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/preact";
import { ThemeProvider, useTheme } from "../src/components/theme";
import { useLocalStorage } from "../src/hooks/localStorage";
import { mocked } from "jest-mock";
import { act } from "preact/test-utils";
import App from "../src/components/app";

jest.mock("../src/hooks/localStorage");

const matchMedia = jest.fn();

let localStorage: Storage;
const addEventListener = jest.fn();
const removeEventListener = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  localStorage = useLocalStorage();
  window.matchMedia = matchMedia;
  matchMedia.mockReturnValue({
    matches: false,
    addEventListener,
    removeEventListener,
  });
});

it("switches modes according to media query", async () => {
  const addEventListener = jest.fn();
  const removeEventListener = jest.fn();
  matchMedia.mockReturnValue({
    matches: false,
    addEventListener,
    removeEventListener,
  });
  const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
  expect(result.current.mode).toBe("light");

  expect(matchMedia).toBeCalledWith("(prefers-color-scheme: dark)");
  expect(addEventListener.mock.lastCall).toEqual([
    "change",
    expect.any(Function),
  ]);

  const event: MediaQueryListEvent = {
    matches: true,
  } as MediaQueryListEvent;
  addEventListener.mock.lastCall[1](event);

  await waitFor(() => expect(result.current.mode).toBe("dark"));
  expect(localStorage.setItem).not.toHaveBeenCalledWith(
    "theme",
    expect.anything()
  );
});

it("respects stored mode", () => {
  mocked(localStorage.getItem).mockReturnValue("dark");
  const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
  expect(result.current.mode).toBe("dark");
});

it("stores explicitly set mode", () => {
  const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
  expect(result.current.mode).toBe("light");

  act(() => {
    result.current.setMode("dark");
  });

  expect(result.current.mode).toBe("dark");
  expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
});

it("toggles from clicks", () => {
  render(<App />);

  expect(document.querySelector("body")?.getAttribute("class")).toBe(
    "theme-light"
  );

  fireEvent.click(screen.getByText("dark mode"));
  expect(screen.queryByText("light mode")).toBeTruthy();
  expect(screen.queryByText("dark mode")).toBeFalsy();
  expect(document.querySelector("body")?.getAttribute("class")).toBe(
    "theme-dark"
  );
});
