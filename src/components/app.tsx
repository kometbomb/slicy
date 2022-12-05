import { h } from "preact";
import { Editor } from "./editor";

const App = () => (
  <div id="app">
    <Editor />
    <div id="version">{process.env.PREACT_APP_VERSION}</div>
  </div>
);

export default App;
