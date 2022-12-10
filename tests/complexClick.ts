import { fireEvent } from "@testing-library/preact";

export const complexClick = (element: HTMLElement) => {
  fireEvent.mouseDown(element, { button: 0, buttons: 1 });
  fireEvent.mouseUp(element, { button: 0, buttons: 1 });
  fireEvent.click(element);
};
