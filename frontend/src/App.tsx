import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { SWRConfig } from "swr";

import Home from "./pages/Home";
import PersonShow from "./pages/person/Show";
import fetcher from "./util/fetch";

const App: React.FC = () => {
  return (
    <SWRConfig value={{ fetcher, suspense: true }}>
      <BrowserRouter>
        <Switch>
          <Route path="/person/:name" component={PersonShow} />
          <Route path="/" component={Home} />
        </Switch>
      </BrowserRouter>
    </SWRConfig>
  );
};

export default App;
