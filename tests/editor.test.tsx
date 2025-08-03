import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/preact";
import { h } from "preact";
import { useContext } from "preact/hooks";
import { EditorContext } from "../src/components/editor";
import {
  EditorContextProvider,
  EditorContextType,
} from "../src/components/editor/context";
import { Editor } from "../src/components/editor/editor";
import { ToastProvider } from "../src/components/toast";
import { complexClick } from "./complexClick";
import { mockClipboard } from "./mockClipboard";
import {
  ThemeContextType,
  ThemeProvider,
  useTheme,
} from "../src/components/theme";

jest.mock("../src/hooks/localStorage");
jest.mock("../src/hooks/toast");

beforeEach(() => {
  jest.clearAllMocks();

  mockClipboard();

  console.error = jest.fn();
});

describe("<Editor/>", () => {
  const Helper = ({
    callback,
  }: {
    callback: (params: {
      editorContext: EditorContextType;
      themeContext: ThemeContextType;
    }) => void;
  }) => {
    callback({
      editorContext: useContext(EditorContext),
      themeContext: useTheme(),
    });
    return null;
  };

  const context: {
    editorContext: EditorContextType;
    themeContext: ThemeContextType;
  } = {} as any;

  beforeEach(() => {
    render(
      <ThemeProvider>
        <ToastProvider>
          <EditorContextProvider>
            <Editor />
            <Helper
              callback={({ editorContext, themeContext }) => {
                context.editorContext = editorContext;
                context.themeContext = themeContext;
              }}
            />
          </EditorContextProvider>
        </ToastProvider>
      </ThemeProvider>
    );
  });

  describe("layout", () => {
    it("selects modes with buttons", () => {
      complexClick(screen.getByTestId("mode-color"));
      expect(context.editorContext.mode).toEqual("color");

      complexClick(screen.getByTestId("mode-tile"));
      expect(context.editorContext.mode).toEqual("tile");

      complexClick(screen.getByTestId("mode-cut"));
      expect(context.editorContext.mode).toEqual("cut");

      complexClick(screen.getByTestId("mode-draw"));
      expect(context.editorContext.mode).toEqual("draw");
    });

    it("triggers undo", async () => {
      const root = screen.getByTestId("root-node");
      context.editorContext.setMode("draw");
      context.editorContext.setFgColor(1);
      context.editorContext.setBgColor(2);
      context.editorContext.setShape(4);
      await waitFor(() => expect(context.editorContext.mode).toBe("draw"));
      complexClick(within(root).getAllByTestId("node")[0]);

      expect(context.editorContext.root).toEqual({ fg: 1, bg: 2, shape: 4 });

      complexClick(screen.getByTestId("tool-undo"));
      expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 });
    });

    it("triggers redo", async () => {
      const root = screen.getByTestId("root-node");
      context.editorContext.setMode("draw");
      context.editorContext.setFgColor(1);
      context.editorContext.setBgColor(2);
      context.editorContext.setShape(4);
      await waitFor(() => expect(context.editorContext.mode).toBe("draw"));
      complexClick(within(root).getAllByTestId("node")[0]);

      expect(context.editorContext.root).toEqual({ fg: 1, bg: 2, shape: 4 });

      complexClick(screen.getByTestId("tool-undo"));
      expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 });
    });

    it("toggles grid", () => {
      complexClick(screen.getByTestId("toggle-grid"));
      expect(context.editorContext.enableGrid).toBeFalsy();
      complexClick(screen.getByTestId("toggle-grid"));
      expect(context.editorContext.enableGrid).toBeTruthy();
    });

    it("selects colors with buttons", () => {
      complexClick(screen.getByTestId("color-3"));
      expect(context.editorContext.fgColor).toEqual(3);
      expect(context.editorContext.bgColor).toEqual(1);

      complexClick(screen.getByTestId("color-9"));
      expect(context.editorContext.fgColor).toEqual(9);
      expect(context.editorContext.bgColor).toEqual(1);

      fireEvent.contextMenu(screen.getByTestId("color-5"));
      expect(context.editorContext.bgColor).toEqual(5);
      expect(context.editorContext.fgColor).toEqual(9);
    });

    it("selects shapes with buttons", () => {
      complexClick(screen.getByTestId("shape-3"));
      expect(context.editorContext.shape).toEqual(3);

      complexClick(screen.getByTestId("shape-9"));
      expect(context.editorContext.shape).toEqual(9);
    });
  });

  describe("editing", () => {
    let root: HTMLElement;

    beforeEach(() => {
      root = screen.getByTestId("root-node");
    });

    describe("click", () => {
      describe("draw", () => {
        beforeEach(() => {
          context.editorContext.setMode("draw");
          context.editorContext.setFgColor(1);
          context.editorContext.setBgColor(2);
          context.editorContext.setShape(4);
        });

        it("sets node attributes when left clicking", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("draw"));

          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.editorContext.root).toEqual({
            fg: 1,
            bg: 2,
            shape: 4,
          });
        });

        it("picks node attributes when right clicking", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("draw"));

          expect(context.editorContext.fgColor).toBe(1);
          expect(context.editorContext.bgColor).toBe(2);
          expect(context.editorContext.shape).toBe(4);

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);

          expect(context.editorContext.root).toEqual({
            fg: 0,
            bg: 0,
            shape: 0,
          });
          expect(context.editorContext.fgColor).toBe(0);
          expect(context.editorContext.bgColor).toBe(0);
          expect(context.editorContext.shape).toBe(0);
        });
      });

      describe("color", () => {
        beforeEach(() => {
          context.editorContext.setMode("color");
          context.editorContext.setFgColor(1);
          context.editorContext.setBgColor(2);
          context.editorContext.setShape(4);
        });

        it("sets foreground color when left clicking", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("color"));

          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.editorContext.root).toEqual({
            fg: 1,
            bg: 0,
            shape: 0,
          });
        });

        it("sets background color when right clicking", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("color"));

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);

          expect(context.editorContext.root).toEqual({
            fg: 0,
            bg: 2,
            shape: 0,
          });
        });
      });

      describe("tile", () => {
        beforeEach(() => {
          context.editorContext.setMode("tile");
          context.editorContext.setFgColor(1);
          context.editorContext.setBgColor(2);
          context.editorContext.setShape(4);
        });

        it("sets shape when left clicking", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("tile"));

          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.editorContext.root).toEqual({
            fg: 0,
            bg: 0,
            shape: 4,
          });
        });

        it("picks shape when right clicking", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("tile"));

          expect(context.editorContext.shape).toBe(4);

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);

          expect(context.editorContext.root).toEqual({
            fg: 0,
            bg: 0,
            shape: 0,
          });
          expect(context.editorContext.shape).toBe(0);
        });
      });

      describe("cut", () => {
        beforeEach(() => {
          context.editorContext.setMode("cut");
        });

        it("splits nodes when clicked", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("cut"));

          expect(within(root).getAllByTestId("node").length).toBe(1);

          complexClick(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(4);
        });

        it("splits nodes when childnodes clicked", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("cut"));

          expect(within(root).getAllByTestId("node").length).toBe(1);

          // Click top-left tile
          complexClick(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(4);

          // Click top-left tile again
          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.editorContext.root).toEqual({
            nodes: [
              {
                nodes: [
                  { fg: 0, bg: 0, shape: 0 },
                  { fg: 0, bg: 0, shape: 0 },
                  { fg: 0, bg: 0, shape: 0 },
                  { fg: 0, bg: 0, shape: 0 },
                ],
              },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          });
        });

        it("joins nodes when right clicked", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("cut"));

          complexClick(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(4);

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(1);
        });

        it("should handle joining of root node", async () => {
          await waitFor(() => expect(context.editorContext.mode).toBe("cut"));

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(1);
        });
      });
    });

    describe("drag", () => {
      const doMoves = (buttons = 1) => {
        fireEvent.mouseDown(within(root).getAllByTestId("node")[0], {
          buttons,
        });
        fireEvent.mouseEnter(within(root).getAllByTestId("node")[1], {
          buttons,
        });
        fireEvent.mouseEnter(within(root).getAllByTestId("node")[3], {
          buttons,
        });
        fireEvent.mouseUp(within(root).getAllByTestId("node")[3], {
          buttons,
        });
      };
      beforeEach(() => {
        context.editorContext.setMode("draw");
        context.editorContext.setFgColor(1);
        context.editorContext.setBgColor(2);
        context.editorContext.setShape(4);
        complexClick(within(root).getAllByTestId("node")[0]);
      });

      describe("cut", () => {
        it("should not split tiles when dragging", async () => {
          context.editorContext.setMode("cut");
          await waitFor(() => expect(context.editorContext.mode).toBe("cut"));
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              nodes: [
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
              ],
            })
          );

          doMoves(1);

          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          });
        });

        it("should not join tiles when dragging", async () => {
          context.editorContext.setMode("cut");
          await waitFor(() => expect(context.editorContext.mode).toBe("cut"));
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              nodes: [
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
              ],
            })
          );

          doMoves(2);

          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          });
        });
      });

      describe("draw", () => {
        it("should modify tiles if left button dragging", async () => {
          context.editorContext.setMode("draw");
          await waitFor(() => expect(context.editorContext.mode).toBe("draw"));
          await waitFor(() => expect(context.editorContext.fgColor).toBe(1));

          doMoves(1);

          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              nodes: [
                { fg: 1, bg: 2, shape: 4 },
                { fg: 1, bg: 2, shape: 4 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 1, bg: 2, shape: 4 },
              ],
            })
          );
        });

        it("should not modify tiles if right button dragging", async () => {
          context.editorContext.setMode("draw");
          await waitFor(() => expect(context.editorContext.mode).toBe("draw"));
          await waitFor(() => expect(context.editorContext.fgColor).toBe(1));

          doMoves(2);

          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              nodes: [
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
              ],
            })
          );
        });
      });

      describe("color", () => {
        it("should modify foreground color if left button dragging", async () => {
          context.editorContext.setMode("color");
          await waitFor(() => expect(context.editorContext.mode).toBe("color"));
          await waitFor(() => expect(context.editorContext.fgColor).toBe(1));
          await waitFor(() => expect(context.editorContext.bgColor).toBe(2));

          doMoves(1);

          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              nodes: [
                { fg: 1, bg: 0, shape: 0 },
                { fg: 1, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 1, bg: 0, shape: 0 },
              ],
            })
          );
        });

        it("should modify background color if right button dragging", async () => {
          context.editorContext.setMode("color");
          await waitFor(() => expect(context.editorContext.mode).toBe("color"));
          await waitFor(() => expect(context.editorContext.fgColor).toBe(1));
          await waitFor(() => expect(context.editorContext.bgColor).toBe(2));

          doMoves(2);

          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              nodes: [
                { fg: 0, bg: 2, shape: 0 },
                { fg: 0, bg: 2, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 2, shape: 0 },
              ],
            })
          );
        });
      });
    });

    describe("redo", () => {
      it("handles empty future", () => {
        context.editorContext.redo();
        expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 });
      });

      it("restores future state", async () => {
        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );

        complexClick(within(root).getAllByTestId("node")[0]);

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.editorContext.undo();

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );

        context.editorContext.redo();

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );
      });

      it("empties future if new edit is done", async () => {
        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );

        complexClick(within(root).getAllByTestId("node")[0]);

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.editorContext.undo();

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );

        context.editorContext.setRoot({ fg: 9, bg: 9, shape: 9 });

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 9, bg: 9, shape: 9 })
        );

        context.editorContext.redo();

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 9, bg: 9, shape: 9 })
        );
      });
    });

    describe("undo", () => {
      it("handles empty history", () => {
        context.editorContext.undo();
        expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 });
      });

      it("restores earlier state", async () => {
        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );

        complexClick(within(root).getAllByTestId("node")[0]);

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.editorContext.setMode("draw");
        context.editorContext.setFgColor(1);
        context.editorContext.setBgColor(2);
        context.editorContext.setShape(3);
        await waitFor(() => expect(context.editorContext.mode).toBe("draw"));
        await waitFor(() => expect(context.editorContext.fgColor).toBe(1));
        await waitFor(() => expect(context.editorContext.bgColor).toBe(2));
        await waitFor(() => expect(context.editorContext.shape).toBe(3));

        complexClick(within(root).getAllByTestId("node")[0]);

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 1, bg: 2, shape: 3 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.editorContext.undo();

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.editorContext.undo();

        await waitFor(() =>
          expect(context.editorContext.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );
      });
    });
  });

  describe("key shortcuts", () => {
    test("toggle dark mode", () => {
      fireEvent.keyPress(document, { key: "m" });
      expect(context.themeContext.mode).toBe("dark");
      fireEvent.keyPress(document, { key: "m" });
      expect(context.themeContext.mode).toBe("light");
    });

    test("toggle grid", () => {
      fireEvent.keyPress(document, { key: "g" });
      expect(context.editorContext.enableGrid).toBeFalsy();
      fireEvent.keyPress(document, { key: "g" });
      expect(context.editorContext.enableGrid).toBeTruthy();
    });

    describe("modes", () => {
      test("draw", () => {
        fireEvent.keyPress(document, { key: "d" });
        expect(context.editorContext.mode).toBe("draw");
      });

      test("cut", () => {
        fireEvent.keyPress(document, { key: "s" });
        expect(context.editorContext.mode).toBe("cut");
      });

      test("color", () => {
        fireEvent.keyPress(document, { key: "c" });
        expect(context.editorContext.mode).toBe("color");
      });

      test("tile", () => {
        fireEvent.keyPress(document, { key: "t" });
        expect(context.editorContext.mode).toBe("tile");
      });
    });

    describe("selection", () => {
      beforeEach(() => {
        complexClick(screen.getByTestId("shape-3"));
      });

      describe("tile", () => {
        test("vertical mirror", () => {
          expect(context.editorContext.shape).toBe(3);
          fireEvent.keyPress(document, { key: "v" });
          expect(context.editorContext.shape).toBe(8);
        });

        test("horizontal mirror", () => {
          expect(context.editorContext.shape).toBe(3);
          fireEvent.keyPress(document, { key: "h" });
          expect(context.editorContext.shape).toBe(4);
        });

        test("rotate", () => {
          expect(context.editorContext.shape).toBe(3);
          fireEvent.keyPress(document, { key: "r" });
          fireEvent.keyPress(document, { key: "r" });
          expect(context.editorContext.shape).toBe(9);
        });
      });

      describe("color", () => {
        test("swap colors", () => {
          expect(context.editorContext.fgColor).toBe(0);
          expect(context.editorContext.bgColor).toBe(1);
          fireEvent.keyPress(document, { key: "x" });
          expect(context.editorContext.fgColor).toBe(1);
          expect(context.editorContext.bgColor).toBe(0);
        });
      });
    });

    describe("misc", () => {
      describe("undo", () => {
        beforeEach(async () => {
          context.editorContext.setRoot({ fg: 6, bg: 1, shape: 0 });
          await waitFor(() =>
            // eslint-disable-next-line jest/no-standalone-expect
            expect(context.editorContext.root).toEqual({
              fg: 6,
              bg: 1,
              shape: 0,
            })
          );
          context.editorContext.setRoot({ fg: 7, bg: 1, shape: 0 });
          await waitFor(() =>
            // eslint-disable-next-line jest/no-standalone-expect
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );
        });

        it("requires a modifier", async () => {
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );
          fireEvent.keyDown(document, { key: "z" });
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );
        });

        it("uses alt/meta as the modifier", async () => {
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );
          fireEvent.keyDown(document, { key: "z", altKey: true });
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 6,
              bg: 1,
              shape: 0,
            })
          );
        });

        it("uses ctrl as the modifier", async () => {
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );
          fireEvent.keyDown(document, { key: "z", ctrlKey: true });
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 6,
              bg: 1,
              shape: 0,
            })
          );
        });

        it("does redo with shift", async () => {
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );

          fireEvent.keyDown(document, {
            key: "z",
            ctrlKey: true,
            shiftKey: false,
          });
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 6,
              bg: 1,
              shape: 0,
            })
          );

          fireEvent.keyDown(document, {
            key: "Z",
            ctrlKey: true,
            shiftKey: true,
          });
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );
        });

        it("does redo with y", async () => {
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );

          fireEvent.keyDown(document, {
            key: "y",
            ctrlKey: true,
          });
          await waitFor(() =>
            expect(context.editorContext.root).toEqual({
              fg: 7,
              bg: 1,
              shape: 0,
            })
          );
        });
      });
    });
  });
});
