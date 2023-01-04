import { render, screen, waitFor, fireEvent } from "@testing-library/preact";
import { mocked } from "jest-mock";
import { h } from "preact";
import { useContext } from "preact/hooks";
import {
  EditorContext,
  EditorContextProvider,
  Editor,
} from "../src/components/editor";
import { EditorContextType } from "../src/components/editor/context";
import { ToastProvider } from "../src/components/toast";
import { useLocalStorage } from "../src/hooks/localStorage";
import { useToast } from "../src/hooks/toast";

jest.mock("../src/hooks/localStorage");
jest.mock("../src/hooks/toast");

beforeEach(() => {
  jest.clearAllMocks();

  jest.useFakeTimers();
});

describe("localStorage", () => {
  const Helper = ({
    callback,
  }: {
    callback: (context: EditorContextType) => void;
  }) => {
    callback(useContext(EditorContext));
    return null;
  };

  const context: { data: EditorContextType } = {} as any;

  const renderEditor = () =>
    render(
      <ToastProvider>
        <EditorContextProvider>
          <Editor />
          <Helper
            callback={(editorContext) => (context.data = editorContext)}
          />
        </EditorContextProvider>
      </ToastProvider>
    );

  let localStorage: Storage;
  beforeEach(() => {
    localStorage = useLocalStorage();
  });

  describe("modal", () => {
    it("loads root node from localstorage on init if modal Yes clicked", async () => {
      const { showToast } = useToast();
      mocked(localStorage.getItem).mockReturnValue("[5,1,2]");

      renderEditor();

      jest.advanceTimersByTime(1000);

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem).toHaveBeenCalledWith("root");

      expect(screen.getByTestId("modal-content").textContent).toMatch(
        "Restore state?"
      );

      fireEvent.click(screen.getByText("Yes"));

      await waitFor(() =>
        expect(context.data.root).toEqual({ fg: 5, bg: 2, shape: 1 })
      );

      expect(showToast).toHaveBeenCalledWith("Picture restored");
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it("handles invalid root node", async () => {
      const { showToast } = useToast();

      mocked(localStorage.getItem).mockReturnValue("invalid");

      renderEditor();

      jest.advanceTimersByTime(1000);

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem).toHaveBeenCalledWith("root");

      expect(screen.queryByTestId("modal-content")).toBeNull();

      expect(showToast).toHaveBeenCalledTimes(0);
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it("doesn't open restore modal if saved state is default state", async () => {
      const { showToast } = useToast();

      mocked(localStorage.getItem).mockReturnValue("[]");

      renderEditor();

      jest.advanceTimersByTime(1000);

      expect(localStorage.getItem).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem).toHaveBeenCalledWith("root");

      expect(screen.queryByTestId("modal-content")).toBeNull();

      expect(showToast).toHaveBeenCalledTimes(0);
      expect(localStorage.setItem).toHaveBeenCalledTimes(0);
    });

    it("closes dialog and does not restore state if No clicked", async () => {
      const { showToast } = useToast();

      mocked(localStorage.getItem).mockReturnValue("[5,1,2]");

      renderEditor();

      jest.advanceTimersByTime(1000);

      fireEvent.click(screen.getByText("No"));

      await waitFor(() =>
        expect(screen.queryByTestId("modal-content")).toBeNull()
      );

      await waitFor(() =>
        expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 })
      );

      expect(showToast).toHaveBeenCalledTimes(0);
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith("root", "[]");
    });

    it("handles data being invalidated before dialog closes", async () => {
      const { showToast } = useToast();
      mocked(localStorage.getItem).mockReturnValue("[5,1,2]");

      renderEditor();
      jest.advanceTimersByTime(1000);

      mocked(localStorage.getItem).mockReturnValue(null);

      fireEvent.click(screen.getByText("Yes"));

      await waitFor(() =>
        expect(screen.queryByTestId("modal-content")).toBeNull()
      );

      await waitFor(() =>
        expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 })
      );

      expect(showToast).toHaveBeenCalledWith("Restore failed", "failure");
    });
  });

  it("saves root node to localstorage 1000 ms after last edit", async () => {
    renderEditor();

    context.data.setRoot({ fg: 4, bg: 5, shape: 5 });
    await waitFor(() =>
      expect(context.data.root).toEqual({ fg: 4, bg: 5, shape: 5 })
    );
    context.data.setRoot({ fg: 4, bg: 5, shape: 6 });
    await waitFor(() =>
      expect(context.data.root).toEqual({ fg: 4, bg: 5, shape: 6 })
    );
    context.data.setRoot({ fg: 4, bg: 5, shape: 1 });
    await waitFor(() =>
      expect(context.data.root).toEqual({ fg: 4, bg: 5, shape: 1 })
    );

    jest.advanceTimersByTime(10000);

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.setItem).toHaveBeenCalledWith("root", "[4,1,5]");
  });
});
