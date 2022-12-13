import { fireEvent } from "@testing-library/preact";

export const complexClick = (
  element: HTMLElement,
  button: "left" | "right" = "left"
) => {
  const options =
    button === "left" ? { button: 0, buttons: 1 } : { button: 1, buttons: 2 };
  fireEvent.mouseDown(element, options);
  fireEvent.mouseUp(element, options);

  if (button === "left") fireEvent.click(element);
  else fireEvent.contextMenu(element);
};
