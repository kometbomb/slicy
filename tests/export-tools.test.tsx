import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { mocked } from "jest-mock";
import { h } from "preact";
import { ExportTools } from "../src/components/export-tools";
import * as clipboard from "../src/export/clipboard";
import { renderPNG } from "../src/export/png";
import { useToast } from "../src/hooks/toast";
import { unpackTree } from "../src/tree/packed";
import { mockClipboard } from "./mockClipboard";
import { defaultPalette } from "../src/components/default-palette";

const copyDataURL = jest.spyOn(clipboard, "copyDataURL");
const copyNode = jest.spyOn(clipboard, "copyNode");
const pasteNode = jest.spyOn(clipboard, "pasteNode");

jest.mock("../src/export/png");
jest.mock("../src/hooks/toast");

beforeEach(() => {
  jest.clearAllMocks();
});

const setRoot = jest.fn();
const setPalette = jest.fn();
const root = unpackTree([7, 4, 8]);

describe("<ExportTools/>", () => {
  const { showToast } = useToast();
  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <ExportTools
        setRoot={setRoot}
        root={root}
        setPalette={setPalette}
        palette={defaultPalette}
      />
    );
    mocked(renderPNG).mockResolvedValue("data:image/png;base64,");
    mockClipboard();
    console.error = jest.fn();
  });

  describe("copy", () => {
    it("copies tree to clipboard", async () => {
      fireEvent.click(screen.getByTestId("export-copy-code"));
      expect(copyNode).toHaveBeenCalledTimes(1);
      expect(copyNode).toHaveBeenCalledWith(root, defaultPalette);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("[7,4,8]");
      await waitFor(() =>
        expect(showToast).toHaveBeenCalledWith(
          expect.stringMatching(new RegExp("copied", "i")),
          "success"
        )
      );
    });

    it("handles copy failure", async () => {
      copyNode.mockRejectedValue(new Error("Failed"));

      fireEvent.click(screen.getByTestId("export-copy-code"));
      await waitFor(() =>
        expect(showToast).toHaveBeenCalledWith(
          expect.stringMatching(new RegExp("failed", "i")),
          "failure"
        )
      );
    });
  });

  describe("paste", () => {
    it("pastes tree from clipboard", async () => {
      fireEvent.click(screen.getByTestId("export-paste-code"));
      expect(pasteNode).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(setRoot).toHaveBeenCalledWith(unpackTree([[1], [2], [3], [4]]))
      );
      expect(console.error).not.toHaveBeenCalled();
      expect(showToast).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp("pasted", "i")),
        "success"
      );
    });

    it("handles invalid input", async () => {
      mocked(navigator.clipboard.readText).mockResolvedValue("foo");
      fireEvent.click(screen.getByTestId("export-paste-code"));
      expect(pasteNode).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(console.error).toHaveBeenCalled());
      await waitFor(() => expect(setRoot).not.toHaveBeenCalled());
      expect(showToast).toHaveBeenCalledWith(
        expect.stringMatching(new RegExp("failed", "i")),
        "failure"
      );
    });
  });

  const checkExport = async (type: string, mimetype: string) => {
    mocked(navigator.clipboard.write).mockClear();
    mocked(navigator.clipboard.write).mockResolvedValue();
    fireEvent.click(screen.getByTestId(`export-${type}`));

    await waitFor(() =>
      expect(screen.getByTestId("export-copy")).not.toBeNull()
    );

    await waitFor(() =>
      expect(screen.getByTestId("export-link").getAttribute("href")).toContain(
        `data:${mimetype};base64,`
      )
    );

    expect(screen.getByTestId(`modal-heading`).textContent).toBe(
      `Export .${type.toLocaleUpperCase()}`
    );

    fireEvent.click(screen.getByTestId("export-copy"));

    await waitFor(() => expect(copyDataURL).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(navigator.clipboard.write).toHaveBeenCalledWith([
        expect.any(ClipboardItem),
      ])
    );

    await waitFor(() => expect(screen.queryByTestId("export-copy")).toBeNull());

    expect(showToast).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp("copied", "i")),
      "success"
    );

    return true;
  };

  const checkExportFail = async (type: string, mimetype: string) => {
    mocked(navigator.clipboard.write).mockClear();
    mocked(navigator.clipboard.write).mockRejectedValue(new Error("Fail"));
    fireEvent.click(screen.getByTestId(`export-${type}`));

    await waitFor(() =>
      expect(screen.getByTestId("export-copy")).not.toBeNull()
    );

    await waitFor(() =>
      expect(screen.getByTestId("export-link").getAttribute("href")).toContain(
        `data:${mimetype};base64,`
      )
    );

    expect(screen.getByTestId(`modal-heading`).textContent).toBe(
      `Export .${type.toLocaleUpperCase()}`
    );

    fireEvent.click(screen.getByTestId("export-copy"));

    await waitFor(() => expect(copyDataURL).toHaveBeenCalledTimes(1));

    expect(showToast).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp("failed", "i")),
      "failure"
    );

    await waitFor(() =>
      expect(screen.queryByTestId("export-copy")).not.toBeNull()
    );

    return true;
  };

  describe("export modal", () => {
    describe("PNG", () => {
      test("success", async () => {
        expect(await checkExport("png", "image/png")).toBeTruthy();
      });
      test("fail", async () => {
        expect(await checkExportFail("png", "image/png")).toBeTruthy();
      });
    });

    describe("SVG", () => {
      test("success", async () => {
        expect(await checkExport("svg", "image/svg+xml")).toBeTruthy();
      });
      test("fail", async () => {
        expect(await checkExportFail("svg", "image/svg+xml")).toBeTruthy();
      });
    });
  });
});

describe("clipboard availability", () => {
  it("uses paste button directly if paste is available", () => {
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn().mockResolvedValue("[[1],[2],[3],[4]]"),
      },
    });

    render(
      <ExportTools
        setRoot={setRoot}
        root={root}
        palette={defaultPalette}
        setPalette={setPalette}
      />
    );
    expect(
      screen.getByTestId("export-paste-code").getAttribute("disabled")
    ).toBeFalsy();
    fireEvent.click(screen.getByTestId("export-paste-code"));
    expect(screen.queryByTestId("modal-import")).toBeNull();
    expect(pasteNode).toHaveBeenCalledTimes(1);
  });

  describe("paste via textbox", () => {
    beforeEach(() => {
      Object.assign(navigator, {
        clipboard: {
          readText: undefined,
        },
      });

      render(
        <ExportTools
          setRoot={setRoot}
          root={root}
          palette={defaultPalette}
          setPalette={setPalette}
        />
      );
    });

    it("uses paste button to open a textbox modal if paste is unavailable", async () => {
      expect(
        screen.getByTestId("export-paste-code").getAttribute("disabled")
      ).toBeFalsy();
      fireEvent.click(screen.getByTestId("export-paste-code"));
      expect(screen.queryByTestId("import-paste-textbox")).not.toBeNull();

      fireEvent.change(screen.getByTestId("import-paste-textbox"), {
        target: { value: "[5]" },
      });
      fireEvent.click(screen.getByTestId("import-paste-ok"));

      expect(setRoot).toHaveBeenCalledTimes(1);
      expect(setRoot).toHaveBeenCalledWith({ fg: 5, shape: 0, bg: 0 });
      expect(setPalette).toHaveBeenCalledTimes(1);
      expect(setPalette.mock.lastCall[0]).toEqual(defaultPalette);

      await waitFor(() =>
        expect(screen.queryByTestId("import-paste-textbox")).toBeNull()
      );
    });

    it("closes the dialog when canceling", async () => {
      fireEvent.click(screen.getByTestId("export-paste-code"));
      expect(screen.queryByTestId("import-paste-textbox")).not.toBeNull();
      fireEvent.click(screen.getByText("Cancel"));
      await waitFor(() =>
        expect(screen.queryByTestId("import-paste-textbox")).toBeNull()
      );
    });
  });

  it("enables copy button if copy is available", async () => {
    Object.assign(global, {
      ClipboardItem: () => {
        //
      },
    });

    render(
      <ExportTools
        setRoot={setRoot}
        root={root}
        palette={defaultPalette}
        setPalette={setPalette}
      />
    );
    fireEvent.click(screen.getByTestId("export-png"));
    await waitFor(() =>
      expect(
        screen.getByTestId("export-copy").getAttribute("disabled")
      ).toBeFalsy()
    );
  });

  it("disables copy button if copy is unavailable", async () => {
    Object.assign(global, {
      ClipboardItem: undefined,
    });

    render(
      <ExportTools
        setRoot={setRoot}
        root={root}
        palette={defaultPalette}
        setPalette={setPalette}
      />
    );
    fireEvent.click(screen.getByTestId("export-png"));
    await waitFor(() =>
      expect(
        screen.getByTestId("export-copy").getAttribute("disabled")
      ).toBeDefined()
    );
  });
});
