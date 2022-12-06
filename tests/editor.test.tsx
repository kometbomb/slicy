import { h } from "preact";
import { Editor } from "../src/components/editor/editor";
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/preact";
import { useContext } from "preact/hooks";
import { EditorContext } from "../src/components/editor";
import {
  EditorContextProvider,
  EditorContextType,
} from "../src/components/editor/context";

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
      fireEvent.click(screen.getByTestId("mode-color"));
      expect(context.data.mode).toEqual("color");

      fireEvent.click(screen.getByTestId("mode-tile"));
      expect(context.data.mode).toEqual("tile");

      fireEvent.click(screen.getByTestId("mode-cut"));
      expect(context.data.mode).toEqual("cut");

      fireEvent.click(screen.getByTestId("mode-draw"));
      expect(context.data.mode).toEqual("draw");
    });

    it("toggles grid", () => {
      fireEvent.click(screen.getByTestId("toggle-grid"));
      expect(context.data.enableGrid).toBeFalsy();
      fireEvent.click(screen.getByTestId("toggle-grid"));
      expect(context.data.enableGrid).toBeTruthy();
    });

    it("selects colors with buttons", () => {
      fireEvent.click(screen.getByTestId("color-3"));
      expect(context.data.fgColor).toEqual(3);
      expect(context.data.bgColor).toEqual(0);

      fireEvent.click(screen.getByTestId("color-9"));
      expect(context.data.fgColor).toEqual(9);
      expect(context.data.bgColor).toEqual(0);

      fireEvent.contextMenu(screen.getByTestId("color-5"));
      expect(context.data.bgColor).toEqual(5);
      expect(context.data.fgColor).toEqual(9);
    });

    it("selects shapes with buttons", () => {
      fireEvent.click(screen.getByTestId("shape-3"));
      expect(context.data.shape).toEqual(3);

      fireEvent.click(screen.getByTestId("shape-9"));
      expect(context.data.shape).toEqual(9);
    });
  });

  describe("editing", () => {
    let root: HTMLElement;

    beforeEach(() => {
      root = screen.getByTestId("root-node");
    });

    describe("draw", () => {
      beforeEach(() => {
        context.data.setMode("draw");
        context.data.setFgColor(1);
        context.data.setBgColor(2);
        context.data.setShape(4);
      });

      it("sets node attributes when left clicking", async () => {
        await waitFor(() => expect(context.data.mode).toBe("draw"));

        fireEvent.click(within(root).getAllByTestId("node")[0]);

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

        fireEvent.click(within(root).getAllByTestId("node")[0]);

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

        fireEvent.click(within(root).getAllByTestId("node")[0]);

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

        fireEvent.click(within(root).getAllByTestId("node")[0]);
        expect(within(root).getAllByTestId("node").length).toBe(4);
      });

      it("joins nodes when right clicked", async () => {
        await waitFor(() => expect(context.data.mode).toBe("cut"));

        fireEvent.click(within(root).getAllByTestId("node")[0]);
        expect(within(root).getAllByTestId("node").length).toBe(4);

        fireEvent.contextMenu(within(root).getAllByTestId("node")[0]);
        expect(within(root).getAllByTestId("node").length).toBe(1);
      });
    });
  });
});
