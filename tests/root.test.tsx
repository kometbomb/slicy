import { render } from "@testing-library/preact";
import { createEvent, fireEvent, screen, waitFor } from "@testing-library/dom";
import { h } from "preact";
import { useContext } from "preact/hooks";
import { EditorContext, EditorContextProvider } from "../src/components/editor";
import { EditorContextType } from "../src/components/editor/context";
import { Root } from "../src/components/editor/root";

beforeAll(() => {
  HTMLElement.prototype.scrollTo = jest.fn();
});

describe("<Root/>", () => {
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
    jest.clearAllMocks();

    render(
      <EditorContextProvider>
        <Root>
          <Helper
            callback={(editorContext) => (context.data = editorContext)}
          />
        </Root>
      </EditorContextProvider>
    );

    fireEvent.wheel(screen.getByTestId("root-node"), { deltaY: -500 });
  });

  describe("pan", () => {
    it("pans with mouse drag", async () => {
      await waitFor(() => expect(context.data.zoom).toBe(2));

      jest.clearAllMocks();

      fireEvent.mouseMove(screen.getByTestId("root-node"), { buttons: 4 });
      await waitFor(() =>
        expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(1)
      );
    });

    it("pans with touch drag", async () => {
      await waitFor(() => expect(context.data.zoom).toBe(2));

      jest.clearAllMocks();

      fireEvent.touchStart(screen.getByTestId("root-node"), {
        touches: [{ screenX: 100, screenY: 100 }],
      });
      fireEvent.touchMove(screen.getByTestId("root-node"), {
        touches: [{ screenX: 200, screenY: 100 }],
      });
      await waitFor(() =>
        expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledTimes(1)
      );

      expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledWith(-100, 0);
    });
  });

  describe("zoom", () => {
    it("zooms in with mousewheel", async () => {
      await waitFor(() => expect(context.data.zoom).toBe(2));

      const zoom = context.data.zoom;

      fireEvent.wheel(screen.getByTestId("root-node"), { deltaY: -500 });
      await waitFor(() => expect(context.data.zoom).toBeGreaterThan(zoom));
    });

    it("zooms out with mousewheel", async () => {
      await waitFor(() => expect(context.data.zoom).toBe(2));
      const zoom = context.data.zoom;

      fireEvent.wheel(screen.getByTestId("root-node"), { deltaY: 500 });
      await waitFor(() => expect(context.data.zoom).toBeLessThan(zoom));
    });

    it("zooms with pinch", async () => {
      await waitFor(() => expect(context.data.zoom).toBe(2));

      // First finger
      fireEvent.touchStart(screen.getByTestId("root-node"), {
        touches: [{ screenX: 100, screenY: 100 }],
      });

      // Second finger
      fireEvent.touchStart(screen.getByTestId("root-node"), {
        touches: [
          { screenX: 100, screenY: 100 },
          { screenX: 150, screenY: 150 },
        ],
      });

      // Second finger moves
      fireEvent.touchMove(screen.getByTestId("root-node"), {
        touches: [
          { screenX: 100, screenY: 100 },
          { screenX: 180, screenY: 180 },
        ],
      });

      await waitFor(() => expect(context.data.zoom).toBeCloseTo(3.2));

      // Second finger moves
      fireEvent.touchMove(screen.getByTestId("root-node"), {
        touches: [
          { screenX: 100, screenY: 100 },
          { screenX: 160, screenY: 160 },
        ],
      });

      await waitFor(() => expect(context.data.zoom).toBeCloseTo(2.4));
    });
  });
});
