import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { mocked } from "jest-mock";
import { h } from "preact";
import { ExportTools } from "../src/components/export-tools";
import * as clipboard from "../src/export/clipboard";
import { renderPNG } from "../src/export/png";
import { useToast } from "../src/hooks/toast";
import { unpackTree } from "../src/tree/packed";
import { mockClipboard } from "./mockClipboard";

const copyDataURL = jest.spyOn(clipboard, "copyDataURL");
const copyNode = jest.spyOn(clipboard, "copyNode");
const pasteNode = jest.spyOn(clipboard, "pasteNode");

jest.mock("../src/export/png");
jest.mock("../src/hooks/toast");

beforeEach(() => {
  jest.clearAllMocks();
});

const setRoot = jest.fn();
const root = unpackTree([7, 4, 8]);

describe("<ExportTools/>", () => {
  const { showToast } = useToast();
  beforeEach(() => {
    jest.clearAllMocks();

    render(<ExportTools setRoot={setRoot} root={root} />);
    mocked(renderPNG).mockResolvedValue("data:image/png;base64,");
    mockClipboard();
    console.error = jest.fn();
  });

  describe("copy", () => {
    it("copies tree to clipboard", async () => {
      fireEvent.click(screen.getByTestId("export-copy-code"));
      expect(copyNode).toHaveBeenCalledTimes(1);
      expect(copyNode).toHaveBeenCalledWith(root);
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
  it("enables paste button if paste is available", () => {
    Object.assign(navigator, {
      clipboard: {
        readText: jest.fn().mockResolvedValue("[[1],[2],[3],[4]]"),
      },
    });

    render(<ExportTools setRoot={setRoot} root={root} />);
    expect(
      screen.getByTestId("export-paste-code").getAttribute("disabled")
    ).toBeFalsy();
  });

  it("disables paste button if paste is unavailable", () => {
    Object.assign(navigator, {
      clipboard: {
        readText: undefined,
      },
    });

    render(<ExportTools setRoot={setRoot} root={root} />);
    expect(
      screen.getByTestId("export-paste-code").getAttribute("disabled")
    ).toBeDefined();
  });

  it("enables copy button if copy is available", async () => {
    Object.assign(global, {
      ClipboardItem: () => {
        //
      },
    });

    render(<ExportTools setRoot={setRoot} root={root} />);
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

    render(<ExportTools setRoot={setRoot} root={root} />);
    fireEvent.click(screen.getByTestId("export-png"));
    await waitFor(() =>
      expect(
        screen.getByTestId("export-copy").getAttribute("disabled")
      ).toBeDefined()
    );
  });
});
