import { h } from "preact";
import { EditorContextProvider, Editor } from "./editor";
import { ToastProvider } from "./toast";

const App = () => (
  <div id="app" data-testid="app">
    <ToastProvider>
      <EditorContextProvider>
        <Editor />
      </EditorContextProvider>
      <div id="version" data-testid="version-info">
        {process.env.PREACT_APP_VERSION}
      </div>
    </ToastProvider>
  </div>
);

export default App;
