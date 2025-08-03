import { h } from "preact";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/preact";
import App from "../src/components/app";
import { ThemeProvider, useTheme } from "../src/components/theme";

const matchMedia = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  window.matchMedia = matchMedia;
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
});
