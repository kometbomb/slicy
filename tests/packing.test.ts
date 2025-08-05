import { defaultPalette } from "../src/components/default-palette";
import {
  packLeaf,
  packTree,
  unpackTree,
  validatePackedNode,
  PackedNode,
  extractRootNodeAndPalette,
  joinRootNodeAndPalette,
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

describe("extractRootNodeAndPalette()", () => {
  it("returns default palette if no palette given", () => {
    expect(extractRootNodeAndPalette([1, 2, 3])).toEqual([
      [1, 2, 3],
      defaultPalette,
    ]);
  });

  it("returns custom palette if palette given", () => {
    expect(
      extractRootNodeAndPalette([
        ["#abc", "#123", "", "#010"],
        [1, 2, 3],
      ])
    ).toEqual([
      [1, 2, 3],
      [
        "#abc",
        "#123",
        "#baaaff",
        "#010",
        "#057fc1",
        "#32c1c3",
        "#ff949d",
        "#e80200",
        "#7a243d",
        "#6a8927",
        "#c98f4c",
        "#efe305",
        "#16ed75",
        "#6e4e23",
        "#195648",
        "#e30ec2",
      ],
    ]);
  });
});

describe("joinRootNodeAndPalette()", () => {
  it("returns only tree if using default palette", () => {
    expect(
      joinRootNodeAndPalette({ fg: 1, bg: 2, shape: 3 }, defaultPalette)
    ).toEqual([1, 3, 2]);
  });

  it("returns new palette if not using default palette", () => {
    const custom = [...defaultPalette];
    custom[2] = "#123456";
    expect(joinRootNodeAndPalette({ fg: 1, bg: 2, shape: 3 }, custom)).toEqual([
      ["", "", "#123456"],
      [1, 3, 2],
    ]);
  });
});
