import { h } from "preact";
import { Route, Router } from "preact-router";

// Code-splitting is automated for `routes` directory
import Home from "../routes/home";

const NotFound = () => <div>404 Not Found</div>;

const App = () => (
  <div id="app">
    <Router>
      <Route path="/" component={Home} />
      <Route default component={NotFound} />
    </Router>
  </div>
);

export default App;
