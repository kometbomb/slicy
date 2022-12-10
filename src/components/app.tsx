import { h } from "preact";
import { EditorContextProvider, Editor } from "./editor";

const App = () => (
  <div id="app" data-testid="app">
    <EditorContextProvider>
      <Editor />
    </EditorContextProvider>
    <div id="version" data-testid="version-info">
      {process.env.PREACT_APP_VERSION}
    </div>
  </div>
);

export default App;
