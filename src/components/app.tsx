import { h } from "preact";
import { EditorContextProvider, Editor } from "./editor";
import { ToastProvider } from "./toast";
import { ThemeProvider, useTheme } from "./theme";
import "../assets/style.css";

const InnerApp = () => {
  const { mode } = useTheme();
  return (
    <div id="app" data-testid="app" className={`theme-${mode}`}>
      <ToastProvider>
        <EditorContextProvider>
          <Editor />
        </EditorContextProvider>
      </ToastProvider>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <InnerApp />
  </ThemeProvider>
);

export default App;
