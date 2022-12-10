import { fireEvent, render } from "@testing-library/preact";
import { h } from "preact";
import { Modal } from "../src/components/modal";

describe("<Modal/>", () => {
  it("closes the dialog when escape is pressed", () => {
    const onClose = jest.fn();
    render(<Modal onClose={onClose}>Content</Modal>);

    fireEvent.keyDown(document, { key: "k" });
    expect(onClose).toHaveBeenCalledTimes(0);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
