import { h } from "preact";
import { Editor } from "../src/components/editor/editor";
// See: https://github.com/preactjs/enzyme-adapter-preact-pure
import { render, screen } from "@testing-library/preact";

describe("<Editor/>", () => {
  it("renders the tool buttons", () => {
    render(<Editor />);
    expect(screen.getByTitle("Split (s)")).toBeDefined();
    expect(screen.getByTitle("Draw (d)")).toBeDefined();
    expect(screen.getByTitle("Color (c)")).toBeDefined();
    expect(screen.getByTitle("Tile (t)")).toBeDefined();
  });
});
