import { render, waitFor, screen, fireEvent } from "@testing-library/preact";
import { h } from "preact";
import { mocked } from "jest-mock";
import * as clipboard from "../src/export/clipboard";
import { ExportTools } from "../src/components/export-tools";
import { unpackTree } from "../src/tree/packed";
import { renderPNG } from "../src/export/png";
import { mockClipboard } from "./mockClipboard";

const copyDataURL = jest.spyOn(clipboard, "copyDataURL");
const copyNode = jest.spyOn(clipboard, "copyNode");
const pasteNode = jest.spyOn(clipboard, "pasteNode");

jest.mock("../src/export/png");

beforeEach(() => {
  jest.clearAllMocks();
});

const setRoot = jest.fn();
const root = unpackTree([7, 4, 8]);

describe("<ExportTools/>", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ExportTools setRoot={setRoot} root={root} />);
    mocked(renderPNG).mockResolvedValue("data:image/png;base64,");
    mockClipboard();
    console.error = jest.fn();
  });

  it("copies tree to clipboard", () => {
    fireEvent.click(screen.getByTestId("export-copy-code"));
    expect(copyNode).toHaveBeenCalledTimes(1);
    expect(copyNode).toHaveBeenCalledWith(root);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("[7,4,8]");
  });

  describe("paste", () => {
    it("pastes tree from clipboard", async () => {
      fireEvent.click(screen.getByTestId("export-paste-code"));
      expect(pasteNode).toHaveBeenCalledTimes(1);
      await waitFor(() =>
        expect(setRoot).toHaveBeenCalledWith(unpackTree([[1], [2], [3], [4]]))
      );
      expect(console.error).not.toHaveBeenCalled();
    });

    it("handles invalid input", async () => {
      mocked(navigator.clipboard.readText).mockResolvedValue("foo");
      fireEvent.click(screen.getByTestId("export-paste-code"));
      expect(pasteNode).toHaveBeenCalledTimes(1);
      await waitFor(() => expect(console.error).toHaveBeenCalled());
      await waitFor(() => expect(setRoot).not.toHaveBeenCalled());
    });
  });

  const checkExport = async (type: string, mimetype: string) => {
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

    expect(copyDataURL).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(navigator.clipboard.write).toHaveBeenCalledWith([
        expect.any(ClipboardItem),
      ])
    );
    expect(console.error).not.toHaveBeenCalled();

    await waitFor(() => expect(screen.queryByTestId("export-copy")).toBeNull());

    return true;
  };

  describe("export modal", () => {
    it("PNG", async () => {
      expect(await checkExport("png", "image/png")).toBeTruthy();
    });

    it("SVG", async () => {
      expect(await checkExport("svg", "image/svg+xml")).toBeTruthy();
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
