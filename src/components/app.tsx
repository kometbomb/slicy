import { h } from "preact";
import { EditorContextProvider, Editor } from "./editor";
import { ToastProvider } from "./toast";

const App = () => (
  <div id="app" data-testid="app">
    <ToastProvider>
      <EditorContextProvider>
        <Editor />
      </EditorContextProvider>
    </ToastProvider>
  </div>
);

export default App;
