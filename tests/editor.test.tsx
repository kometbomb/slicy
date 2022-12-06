import { h } from "preact";
import { Editor } from "../src/components/editor/editor";
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { fireEvent, render, screen } from "@testing-library/preact";
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

  let context: EditorContextType = {} as any;

  beforeEach(() => {
    render(
      <EditorContextProvider>
        <Editor />
        <Helper callback={(editorContext) => (context = editorContext)} />
      </EditorContextProvider>
    );
  });

  describe("layout", () => {
    it("selects modes with buttons", () => {
      fireEvent.click(screen.getByTestId("mode-color"));
      expect(context.mode).toEqual("color");

      fireEvent.click(screen.getByTestId("mode-tile"));
      expect(context.mode).toEqual("tile");

      fireEvent.click(screen.getByTestId("mode-cut"));
      expect(context.mode).toEqual("cut");

      fireEvent.click(screen.getByTestId("mode-draw"));
      expect(context.mode).toEqual("draw");
    });

    it("toggles grid", () => {
      fireEvent.click(screen.getByTestId("toggle-grid"));
      expect(context.enableGrid).toBeFalsy();
      fireEvent.click(screen.getByTestId("toggle-grid"));
      expect(context.enableGrid).toBeTruthy();
    });

    it("selects colors with buttons", () => {
      fireEvent.click(screen.getByTestId("color-3"));
      expect(context.fgColor).toEqual(3);
      expect(context.bgColor).toEqual(0);

      fireEvent.click(screen.getByTestId("color-9"));
      expect(context.fgColor).toEqual(9);
      expect(context.bgColor).toEqual(0);

      fireEvent.contextMenu(screen.getByTestId("color-5"));
      expect(context.bgColor).toEqual(5);
      expect(context.fgColor).toEqual(9);
    });

    it("selects shapes with buttons", () => {
      fireEvent.click(screen.getByTestId("shape-3"));
      expect(context.shape).toEqual(3);

      fireEvent.click(screen.getByTestId("shape-9"));
      expect(context.shape).toEqual(9);
    });
  });

  describe("editing", () => {
    //
  });
});
