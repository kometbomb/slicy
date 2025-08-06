import { Fragment, h } from "preact";
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "preact/hooks";
import { JSXInternal } from "preact/src/jsx";
import { Color } from "../tree";
import { EditorContext } from "./editor";
import { Grid } from "./grid";
import { useTheme } from "./theme";

export const ColorEdit = ({
  index,
  onClose,
}: {
  index: number | null;
  onClose: () => void;
}) => {
  const {
    setRoot,
    root,
    root: { palette },
  } = useContext(EditorContext);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!index) return;
    ref.current?.click();
  }, [index]);

  const handleChange: JSXInternal.GenericEventHandler<HTMLInputElement> =
    useCallback(
      (event) => {
        if (index === null) return;

        setRoot({
          ...root,
          palette: root.palette.map((oldColor, oldIndex) =>
            index === oldIndex ? event.currentTarget.value : oldColor
          ),
        });
        onClose();
      },
      [index, onClose, root, setRoot]
    );

  return index !== null ? (
    <input
      ref={ref}
      style={{ display: "none" }}
      type="color"
      value={palette[index]}
      onChange={handleChange}
      data-testid="color-input"
    />
  ) : null;
};

export const ColorPalette = () => {
  const { mode: themeMode } = useTheme();
  const [colorEditIndex, setColorEditIndex] = useState<number | null>(null);
  const {
    mode,
    setMode,
    fgColor,
    bgColor,
    setFgColor,
    setBgColor,
    root: { palette },
  } = useContext(EditorContext);
  const handleClick = useCallback(
    (e: MouseEvent, color: Color, button: "left" | "right") => {
      e.preventDefault();
      e.stopPropagation();
      if (button === "left") setFgColor(color);
      else setBgColor(color);

      if (mode === "cut") setMode("draw");
    },
    [setFgColor, setBgColor, mode, setMode]
  );
  const handleEditClose = useCallback(() => {
    setColorEditIndex(null);
  }, []);

  return (
    <Fragment>
      <ColorEdit index={colorEditIndex} onClose={handleEditClose} />
      <Grid
        cols={6}
        gap={1}
        style={{
          background: themeMode === "light" ? "white" : "#222222",
          width: "244px",
          height: "102px",
          borderWidth: "2px",
          borderColor: "black",
          borderStyle: "solid",
          borderRadius: "3px",
          padding: "2px",
        }}
      >
        {palette.map((color, index) => (
          <button
            key={index + color}
            data-testid={`color-${index}`}
            style={{
              border: "none",
              backgroundColor: color,
              minHeight: "24px",
              minWidth: "24px",
              textShadow: "0 0 3px black",
              fontWeight: "bold",
              color: "white",
              fontSize: "16px",
              padding: 0,
            }}
            onClick={(e) => handleClick(e, index, "left")}
            onContextMenu={(e) => handleClick(e, index, "right")}
            onDblClick={() => setColorEditIndex(index)}
            className="button"
          >
            {index === fgColor && "F"}
            {index === bgColor && "B"}
          </button>
        ))}
      </Grid>
    </Fragment>
  );
};
