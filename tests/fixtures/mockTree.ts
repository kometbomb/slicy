import { Node } from "../../src/tree";

export const mockTree: Node = {
  nodes: [
    {
      fg: 0,
      bg: 1,
      shape: 2,
    },
    {
      fg: 0,
      bg: 0,
      shape: 0,
    },
    {
      nodes: [
        {
          nodes: [
            {
              fg: 0,
              bg: 1,
              shape: 2,
            },
            {
              fg: 0,
              bg: 1,
              shape: 2,
            },
            {
              fg: 0,
              bg: 1,
              shape: 2,
            },
            {
              fg: 0,
              bg: 1,
              shape: 2,
            },
          ],
        },
        {
          fg: 0,
          bg: 1,
          shape: 2,
        },
        {
          fg: 0,
          bg: 1,
          shape: 2,
        },
        {
          fg: 0,
          bg: 1,
          shape: 7,
        },
      ],
    },
    {
      fg: 7,
      bg: 0,
      shape: 0,
    },
  ],
};
