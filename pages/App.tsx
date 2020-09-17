import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { SWRConfig } from "swr";

import Home from "./pages/Home";
import PersonShow from "./pages/person/Show";
import fetcher from "./util/fetch";
import styled from "styled-components";

const Container = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
`;

const App: React.FC = () => {
  return (
    <Container>
      <SWRConfig value={{ fetcher, suspense: true }}>
        <BrowserRouter>
          <Switch>
            <Route path="/person/:name" component={PersonShow} />
            <Route path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </SWRConfig>
    </Container>
  );
};

export default App;
