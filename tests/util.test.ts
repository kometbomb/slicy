import { mirrorShapeH, mirrorShapeV, rotateShape } from "../src/util";

describe("rotateShape()", () => {
  it("returns rotated shape index", () => {
    expect(rotateShape(0)).toBe(0);

    expect(rotateShape(1)).toBe(2);
    expect(rotateShape(2)).toBe(7);
    expect(rotateShape(7)).toBe(6);
    expect(rotateShape(6)).toBe(1);

    expect(rotateShape(3)).toBe(4);
    expect(rotateShape(4)).toBe(9);
    expect(rotateShape(9)).toBe(8);
    expect(rotateShape(8)).toBe(3);
  });

  it("returns vertically mirrored shape index", () => {
    expect(mirrorShapeV(0)).toBe(0);

    expect(mirrorShapeV(1)).toBe(6);
    expect(mirrorShapeV(6)).toBe(1);

    expect(mirrorShapeV(2)).toBe(7);
    expect(mirrorShapeV(7)).toBe(2);

    expect(mirrorShapeV(3)).toBe(8);
    expect(mirrorShapeV(8)).toBe(3);

    expect(mirrorShapeV(4)).toBe(9);
    expect(mirrorShapeV(9)).toBe(4);
  });

  it("returns horizontally mirrored shape index", () => {
    expect(mirrorShapeH(0)).toBe(0);

    expect(mirrorShapeH(1)).toBe(2);
    expect(mirrorShapeH(2)).toBe(1);

    expect(mirrorShapeH(6)).toBe(7);
    expect(mirrorShapeH(7)).toBe(6);

    expect(mirrorShapeH(3)).toBe(4);
    expect(mirrorShapeH(4)).toBe(3);

    expect(mirrorShapeH(8)).toBe(9);
    expect(mirrorShapeH(9)).toBe(8);
  });
});
