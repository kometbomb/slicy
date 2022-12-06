import { h } from "preact";
import { EditorContextProvider, Editor } from "./editor";

const App = () => (
  <div id="app">
    <EditorContextProvider>
      <Editor />
    </EditorContextProvider>
    <div id="version">{process.env.PREACT_APP_VERSION}</div>
  </div>
);

export default App;
