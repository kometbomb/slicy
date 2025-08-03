import { h } from "preact";
import { EditorContextProvider, Editor } from "./editor";
import { ToastProvider } from "./toast";
import { ThemeProvider, useTheme } from "./theme";
import "../assets/style.css";

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
