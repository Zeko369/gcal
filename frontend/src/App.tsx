import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import PersonShow from "./pages/person/Show";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/person/:name" component={PersonShow} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
