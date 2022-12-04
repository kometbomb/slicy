import { h } from "preact";
import { Editor } from "../src/components/editor";
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { render, screen } from "@testing-library/preact";

describe("<Editor/>", () => {
  it("renders the tool buttons", () => {
    render(<Editor />);
    expect(screen.getByTitle("Cut")).toBeDefined();
    expect(screen.getByTitle("Draw")).toBeDefined();
    expect(screen.getByTitle("Color")).toBeDefined();
    expect(screen.getByTitle("Tile")).toBeDefined();
  });
});
