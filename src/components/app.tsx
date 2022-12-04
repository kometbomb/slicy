import { h } from "preact";
import { Route } from "preact-router";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";
import { SubdirRouter } from "./router";

const NotFound = () => <div>404 Not Found</div>;

const App = () => (
  <div id="app">
    <SubdirRouter>
      <Route path="/" component={Home} />
      <Route default component={NotFound} />
    </SubdirRouter>
  </div>
);

export default App;
