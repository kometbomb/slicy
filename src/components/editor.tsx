import { createContext, h } from "preact";
import { useState } from "preact/hooks";
import { Tile } from "./tile";
import { Node } from "../tree";
import { Palette } from "./palette";

interface EditorContextType {
  color: string;
  setColor: (color: string) => void;
}

export const EditorContext = createContext<EditorContextType>({
  color: "red",
  setColor: () => 0,
});

export const Editor = () => {
  const [root, setRoot] = useState<Node>({
    color: "red",
  });
  const [color, setColor] = useState("red");

  return (
    <EditorContext.Provider value={{ color, setColor }}>
      <div className="editor-root">
        <Tile node={root} setNode={setRoot} />
      </div>
      <Palette />
    </EditorContext.Provider>
  );
};
