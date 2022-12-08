import { buildSVG } from "../src/svg";
import { unpackTree } from "../src/tree/packed";

describe("buildSVG()", () => {
  it("exports SVG from node tree", () => {
    expect(buildSVG(unpackTree([[], [], [], []]))).toEqual(
      '<svg viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg"><g transform="scale(.5)"><g transform="translate(0,0)"><g transform="scale(.5)"><rect width="10" height="10" fill="#000000"></rect><rect fill="#000000" width="10" height="10" x="0" y="0"></rect></g></g><g transform="translate(5,0)"><g transform="scale(.5)"><rect width="10" height="10" fill="#000000"></rect><rect fill="#000000" width="10" height="10" x="0" y="0"></rect></g></g><g transform="translate(0,5)"><g transform="scale(.5)"><rect width="10" height="10" fill="#000000"></rect><rect fill="#000000" width="10" height="10" x="0" y="0"></rect></g></g><g transform="translate(5,5)"><g transform="scale(.5)"><rect width="10" height="10" fill="#000000"></rect><rect fill="#000000" width="10" height="10" x="0" y="0"></rect></g></g></g></svg>'
    );
  });
});
