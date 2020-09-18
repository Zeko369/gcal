import React from "react";
import styled from "@emotion/styled";
import { AppProps } from "next/app";
import { SWRConfig } from "swr";

import fetcher from "../util/fetch";
import "../index.css";

const Container = styled.div`
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
`;

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Container>
      <SWRConfig value={{ fetcher, suspense: true }}>
        <Component {...pageProps} />
      </SWRConfig>
    </Container>
  );
};

export default MyApp;
