import { h } from "preact";
import { useCallback, useContext } from "preact/hooks";
import { Leaf } from "../../tree";
import { colors } from "../colors";
import { EditorContext } from "../editor";
import { shapes } from "../shapes";
import { TileProps } from "./tile";

export const TileLeaf = (props: TileProps<Leaf>) => {
  const { fgColor, bgColor, shape, mode, setBgColor, setFgColor, setShape } =
    useContext(EditorContext);
  const { node, setNode, setParentNode } = props;
  const handleClick = useCallback(
    (e: MouseEvent, button: "left" | "right") => {
      e.preventDefault();
      e.stopPropagation();

      switch (mode) {
        case "draw":
          if (button === "left")
            setNode({
              ...node,
              fg: fgColor,
              bg: bgColor,
              shape,
            });
          else {
            setShape(node.shape);
            setFgColor(node.fg);
            setBgColor(node.bg);
          }

          break;

        case "cut":
          if (button === "left")
            setNode({
              nodes: [{ ...node }, { ...node }, { ...node }, { ...node }],
            });
          else if (setParentNode) setParentNode(node);
          break;

        case "color":
          if (button === "left")
            setNode({
              ...node,
              fg: fgColor,
            });
          else
            setNode({
              ...node,
              bg: bgColor,
            });
          break;

        case "tile":
          setNode({
            ...node,
            shape,
          });
          break;
      }

      return false;
    },
    [
      node,
      setNode,
      fgColor,
      bgColor,
      shape,
      mode,
      setBgColor,
      setFgColor,
      setShape,
    ]
  );

  const Shape = shapes[node.shape];

  return (
    <div
      class="node"
      style={{ backgroundColor: colors[props.node.bg] }}
      onClick={(e) => handleClick(e, "left")}
      onContextMenu={(e) => handleClick(e, "right")}
    >
      <Shape fill={colors[node.fg]} />
      <div className="overlay" />
    </div>
  );
};
