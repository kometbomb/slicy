import { h } from "preact";
import "../assets/style.css";
import { Editor, EditorContextProvider } from "./editor";
import { ThemeProvider } from "./theme";
import { ToastProvider } from "./toast";

const App = () => (
  <ThemeProvider>
    <div id="app" data-testid="app">
      <ToastProvider>
        <EditorContextProvider>
          <Editor />
        </EditorContextProvider>
      </ToastProvider>
    </div>
  </ThemeProvider>
);

export default App;
