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
import { mockClipboard } from "./mockClipboard";
import { complexClick } from "./complexClick";

beforeEach(() => {
  jest.clearAllMocks();

  mockClipboard();

  console.error = jest.fn();
});

describe("<Editor/>", () => {
  const Helper = ({
    callback,
  }: {
    callback: (context: EditorContextType) => void;
  }) => {
    callback(useContext(EditorContext));
    return null;
  };

  const context: { data: EditorContextType } = {} as any;

  beforeEach(() => {
    render(
      <EditorContextProvider>
        <Editor />
        <Helper callback={(editorContext) => (context.data = editorContext)} />
      </EditorContextProvider>
    );
  });

  describe("layout", () => {
    it("selects modes with buttons", () => {
      complexClick(screen.getByTestId("mode-color"));
      expect(context.data.mode).toEqual("color");

      complexClick(screen.getByTestId("mode-tile"));
      expect(context.data.mode).toEqual("tile");

      complexClick(screen.getByTestId("mode-cut"));
      expect(context.data.mode).toEqual("cut");

      complexClick(screen.getByTestId("mode-draw"));
      expect(context.data.mode).toEqual("draw");
    });

    it("triggers undo", async () => {
      const root = screen.getByTestId("root-node");
      context.data.setMode("draw");
      context.data.setFgColor(1);
      context.data.setBgColor(2);
      context.data.setShape(4);
      await waitFor(() => expect(context.data.mode).toBe("draw"));
      complexClick(within(root).getAllByTestId("node")[0]);

      expect(context.data.root).toEqual({ fg: 1, bg: 2, shape: 4 });

      complexClick(screen.getByTestId("tool-undo"));
      expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 });
    });

    it("toggles grid", () => {
      complexClick(screen.getByTestId("toggle-grid"));
      expect(context.data.enableGrid).toBeFalsy();
      complexClick(screen.getByTestId("toggle-grid"));
      expect(context.data.enableGrid).toBeTruthy();
    });

    it("selects colors with buttons", () => {
      complexClick(screen.getByTestId("color-3"));
      expect(context.data.fgColor).toEqual(3);
      expect(context.data.bgColor).toEqual(1);

      complexClick(screen.getByTestId("color-9"));
      expect(context.data.fgColor).toEqual(9);
      expect(context.data.bgColor).toEqual(1);

      fireEvent.contextMenu(screen.getByTestId("color-5"));
      expect(context.data.bgColor).toEqual(5);
      expect(context.data.fgColor).toEqual(9);
    });

    it("selects shapes with buttons", () => {
      complexClick(screen.getByTestId("shape-3"));
      expect(context.data.shape).toEqual(3);

      complexClick(screen.getByTestId("shape-9"));
      expect(context.data.shape).toEqual(9);
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
          context.data.setMode("draw");
          context.data.setFgColor(1);
          context.data.setBgColor(2);
          context.data.setShape(4);
        });

        it("sets node attributes when left clicking", async () => {
          await waitFor(() => expect(context.data.mode).toBe("draw"));

          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.data.root).toEqual({ fg: 1, bg: 2, shape: 4 });
        });

        it("picks node attributes when right clicking", async () => {
          await waitFor(() => expect(context.data.mode).toBe("draw"));

          expect(context.data.fgColor).toBe(1);
          expect(context.data.bgColor).toBe(2);
          expect(context.data.shape).toBe(4);

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);

          expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 });
          expect(context.data.fgColor).toBe(0);
          expect(context.data.bgColor).toBe(0);
          expect(context.data.shape).toBe(0);
        });
      });

      describe("color", () => {
        beforeEach(() => {
          context.data.setMode("color");
          context.data.setFgColor(1);
          context.data.setBgColor(2);
          context.data.setShape(4);
        });

        it("sets foreground color when left clicking", async () => {
          await waitFor(() => expect(context.data.mode).toBe("color"));

          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.data.root).toEqual({ fg: 1, bg: 0, shape: 0 });
        });

        it("sets background color when right clicking", async () => {
          await waitFor(() => expect(context.data.mode).toBe("color"));

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);

          expect(context.data.root).toEqual({ fg: 0, bg: 2, shape: 0 });
        });
      });

      describe("tile", () => {
        beforeEach(() => {
          context.data.setMode("tile");
          context.data.setFgColor(1);
          context.data.setBgColor(2);
          context.data.setShape(4);
        });

        it("sets shape when left clicking", async () => {
          await waitFor(() => expect(context.data.mode).toBe("tile"));

          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 4 });
        });

        it("picks shape when right clicking", async () => {
          await waitFor(() => expect(context.data.mode).toBe("tile"));

          expect(context.data.shape).toBe(4);

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);

          expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 });
          expect(context.data.shape).toBe(0);
        });
      });

      describe("cut", () => {
        beforeEach(() => {
          context.data.setMode("cut");
        });

        it("splits nodes when clicked", async () => {
          await waitFor(() => expect(context.data.mode).toBe("cut"));

          expect(within(root).getAllByTestId("node").length).toBe(1);

          complexClick(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(4);
        });

        it("splits nodes when childnodes clicked", async () => {
          await waitFor(() => expect(context.data.mode).toBe("cut"));

          expect(within(root).getAllByTestId("node").length).toBe(1);

          // Click top-left tile
          complexClick(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(4);

          // Click top-left tile again
          complexClick(within(root).getAllByTestId("node")[0]);

          expect(context.data.root).toEqual({
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
          await waitFor(() => expect(context.data.mode).toBe("cut"));

          complexClick(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(4);

          fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);
          expect(within(root).getAllByTestId("node").length).toBe(1);
        });

        it("should handle joining of root node", async () => {
          await waitFor(() => expect(context.data.mode).toBe("cut"));

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
        context.data.setMode("draw");
        context.data.setFgColor(1);
        context.data.setBgColor(2);
        context.data.setShape(4);
        complexClick(within(root).getAllByTestId("node")[0]);
      });

      describe("cut", () => {
        it("should not split tiles when dragging", async () => {
          context.data.setMode("cut");
          await waitFor(() => expect(context.data.mode).toBe("cut"));
          await waitFor(() =>
            expect(context.data.root).toEqual({
              nodes: [
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
              ],
            })
          );

          doMoves(1);

          expect(context.data.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          });
        });

        it("should not join tiles when dragging", async () => {
          context.data.setMode("cut");
          await waitFor(() => expect(context.data.mode).toBe("cut"));
          await waitFor(() =>
            expect(context.data.root).toEqual({
              nodes: [
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
                { fg: 0, bg: 0, shape: 0 },
              ],
            })
          );

          doMoves(2);

          expect(context.data.root).toEqual({
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
          context.data.setMode("draw");
          await waitFor(() => expect(context.data.mode).toBe("draw"));
          await waitFor(() => expect(context.data.fgColor).toBe(1));

          doMoves(1);

          await waitFor(() =>
            expect(context.data.root).toEqual({
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
          context.data.setMode("draw");
          await waitFor(() => expect(context.data.mode).toBe("draw"));
          await waitFor(() => expect(context.data.fgColor).toBe(1));

          doMoves(2);

          await waitFor(() =>
            expect(context.data.root).toEqual({
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
          context.data.setMode("color");
          await waitFor(() => expect(context.data.mode).toBe("color"));
          await waitFor(() => expect(context.data.fgColor).toBe(1));
          await waitFor(() => expect(context.data.bgColor).toBe(2));

          doMoves(1);

          await waitFor(() =>
            expect(context.data.root).toEqual({
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
          context.data.setMode("color");
          await waitFor(() => expect(context.data.mode).toBe("color"));
          await waitFor(() => expect(context.data.fgColor).toBe(1));
          await waitFor(() => expect(context.data.bgColor).toBe(2));

          doMoves(2);

          await waitFor(() =>
            expect(context.data.root).toEqual({
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

    describe("undo", () => {
      it("handles empty history", () => {
        context.data.undo();
        expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 });
      });

      it("restores earlier state", async () => {
        await waitFor(() =>
          expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );

        complexClick(within(root).getAllByTestId("node")[0]);

        await waitFor(() =>
          expect(context.data.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.data.setMode("draw");
        context.data.setFgColor(1);
        context.data.setBgColor(2);
        context.data.setShape(3);
        await waitFor(() => expect(context.data.mode).toBe("draw"));
        await waitFor(() => expect(context.data.fgColor).toBe(1));
        await waitFor(() => expect(context.data.bgColor).toBe(2));
        await waitFor(() => expect(context.data.shape).toBe(3));

        complexClick(within(root).getAllByTestId("node")[0]);

        await waitFor(() =>
          expect(context.data.root).toEqual({
            nodes: [
              { fg: 1, bg: 2, shape: 3 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.data.undo();

        await waitFor(() =>
          expect(context.data.root).toEqual({
            nodes: [
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
              { fg: 0, bg: 0, shape: 0 },
            ],
          })
        );

        context.data.undo();

        await waitFor(() =>
          expect(context.data.root).toEqual({ fg: 0, bg: 0, shape: 0 })
        );
      });
    });
  });

  describe("key shortcuts", () => {
    test("toggle grid", () => {
      fireEvent.keyPress(document, { key: "g" });
      expect(context.data.enableGrid).toBeFalsy();
      fireEvent.keyPress(document, { key: "g" });
      expect(context.data.enableGrid).toBeTruthy();
    });

    describe("modes", () => {
      test("draw", () => {
        fireEvent.keyPress(document, { key: "d" });
        expect(context.data.mode).toBe("draw");
      });

      test("cut", () => {
        fireEvent.keyPress(document, { key: "s" });
        expect(context.data.mode).toBe("cut");
      });

      test("color", () => {
        fireEvent.keyPress(document, { key: "c" });
        expect(context.data.mode).toBe("color");
      });

      test("tile", () => {
        fireEvent.keyPress(document, { key: "t" });
        expect(context.data.mode).toBe("tile");
      });
    });

    describe("selection", () => {
      beforeEach(() => {
        complexClick(screen.getByTestId("shape-3"));
      });

      describe("tile", () => {
        test("vertical mirror", () => {
          expect(context.data.shape).toBe(3);
          fireEvent.keyPress(document, { key: "v" });
          expect(context.data.shape).toBe(8);
        });

        test("horizontal mirror", () => {
          expect(context.data.shape).toBe(3);
          fireEvent.keyPress(document, { key: "h" });
          expect(context.data.shape).toBe(4);
        });

        test("rotate", () => {
          expect(context.data.shape).toBe(3);
          fireEvent.keyPress(document, { key: "r" });
          fireEvent.keyPress(document, { key: "r" });
          expect(context.data.shape).toBe(9);
        });
      });

      describe("color", () => {
        test("swap colors", () => {
          expect(context.data.fgColor).toBe(0);
          expect(context.data.bgColor).toBe(1);
          fireEvent.keyPress(document, { key: "x" });
          expect(context.data.fgColor).toBe(1);
          expect(context.data.bgColor).toBe(0);
        });
      });
    });

    describe("misc", () => {
      describe("undo", () => {
        beforeEach(async () => {
          context.data.setRoot({ fg: 6, bg: 1, shape: 0 });
          await waitFor(() =>
            // eslint-disable-next-line jest/no-standalone-expect
            expect(context.data.root).toEqual({ fg: 6, bg: 1, shape: 0 })
          );
          context.data.setRoot({ fg: 7, bg: 1, shape: 0 });
          await waitFor(() =>
            // eslint-disable-next-line jest/no-standalone-expect
            expect(context.data.root).toEqual({ fg: 7, bg: 1, shape: 0 })
          );
        });

        it("requires a modifier", async () => {
          await waitFor(() =>
            expect(context.data.root).toEqual({ fg: 7, bg: 1, shape: 0 })
          );
          fireEvent.keyDown(document, { key: "z" });
          await waitFor(() =>
            expect(context.data.root).toEqual({ fg: 7, bg: 1, shape: 0 })
          );
        });

        it("uses alt/meta as the modifier", async () => {
          await waitFor(() =>
            expect(context.data.root).toEqual({ fg: 7, bg: 1, shape: 0 })
          );
          fireEvent.keyDown(document, { key: "z", altKey: true });
          await waitFor(() =>
            expect(context.data.root).toEqual({ fg: 6, bg: 1, shape: 0 })
          );
        });

        it("uses ctrl as the modifier", async () => {
          await waitFor(() =>
            expect(context.data.root).toEqual({ fg: 7, bg: 1, shape: 0 })
          );
          fireEvent.keyDown(document, { key: "z", ctrlKey: true });
          await waitFor(() =>
            expect(context.data.root).toEqual({ fg: 6, bg: 1, shape: 0 })
          );
        });
      });
    });
  });
});
