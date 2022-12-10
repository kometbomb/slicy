import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { h } from "preact";
import { Modal } from "../src/components/modal";

describe("<Modal/>", () => {
  it("closes the dialog when escape is pressed", () => {
    const onClose = jest.fn();
    render(
      <Modal onClose={onClose} open={true}>
        Content
      </Modal>
    );

    fireEvent.keyDown(document, { key: "k" });
    expect(onClose).toHaveBeenCalledTimes(0);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("unmounts when animation is finished", async () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <Modal onClose={onClose} open={true}>
        Content
      </Modal>
    );
    await waitFor(() => expect(screen.queryByText("Content")).not.toBeNull());
    rerender(
      <Modal onClose={onClose} open={false}>
        Content
      </Modal>
    );
    await waitFor(() => expect(screen.queryByText("Content")).toBeNull());
  });
});
