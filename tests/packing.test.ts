import {
  packLeaf,
  packTree,
  unpackTree,
  validatePackedNode,
  PackedNode,
} from "../src/tree/packed";
import { mockTree } from "./fixtures/mockTree";

describe("packTree()", () => {
  it("packs tree and unpacks to the same result", () => {
    expect(unpackTree(packTree(mockTree))).toEqual(mockTree);
  });
});

describe("packLeaf()", () => {
  it("sets to the empty tile if fg and bg are the same", () => {
    expect(
      unpackTree(
        packLeaf({
          bg: 2,
          fg: 2,
          shape: 3,
        })
      )
    ).toEqual({
      bg: 0,
      fg: 2,
      shape: 0,
    });
  });

  it("assumes zeros for default values", () => {
    expect(unpackTree([])).toEqual({
      bg: 0,
      fg: 0,
      shape: 0,
    });

    expect(unpackTree([7])).toEqual({
      bg: 0,
      fg: 7,
      shape: 0,
    });

    expect(unpackTree([7, 1])).toEqual({
      bg: 0,
      fg: 7,
      shape: 1,
    });

    expect(unpackTree([7, 1, 4])).toEqual({
      bg: 4,
      fg: 7,
      shape: 1,
    });
  });
});

describe("validatePackedNode()", () => {
  it("checks for valid leafs", () => {
    expect(validatePackedNode([])).toBeTruthy();
    expect(validatePackedNode([0])).toBeTruthy();
    expect(validatePackedNode([1, 2])).toBeTruthy();
    expect(validatePackedNode([1, 2, 0])).toBeTruthy();
  });

  it("checks for valid branches", () => {
    expect(validatePackedNode([[], [], [], []])).toBeTruthy();
  });

  it("checks for invalid leafs", () => {
    // Wrong types
    expect(validatePackedNode(["2"] as unknown as PackedNode)).toBeFalsy();
    expect(validatePackedNode(null as unknown as PackedNode)).toBeFalsy();
    expect(
      validatePackedNode("[2, 3, 4, 5]" as unknown as PackedNode)
    ).toBeFalsy();
    // Too many values
    expect(
      validatePackedNode([2, 3, 4, 5] as unknown as PackedNode)
    ).toBeFalsy();
  });

  it("checks for invalid branches", () => {
    expect(
      validatePackedNode([[], [], []] as unknown as PackedNode)
    ).toBeFalsy();
    expect(
      validatePackedNode([[], [], [], [], []] as unknown as PackedNode)
    ).toBeFalsy();
  });
});
