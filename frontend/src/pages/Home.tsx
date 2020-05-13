import React, { useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { mutate, cache } from "swr";

import Table from "../components/Table";
import useSWR, { fetcher } from "../util/useSWR";
import { Response } from "./person/Show";
import ErrorBoundary from "../components/ErrorBoundary";

export interface Person {
  person: string;
  all: number;
  soFar: number;
}
type Data = Person[];

const HomeData: React.FC = () => {
  const { data } = useSWR<Data>("http://localhost:5000/api/gcal");

  return data ? (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Done</th>
          <th>Planned whole week</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.person}>
            <td>
              <Link to={`/person/${item.person}`}>{item.person}</Link>
            </td>
            <td>{item.soFar}</td>
            <td>({item.all})</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <h2>No data...</h2>
  );
};

const apiUrl = (path: string) => `http://localhost:5000/api/${path}`;
const prefetch = () => {
  return fetcher<string[]>(apiUrl("people")).then((data) =>
    Promise.all(
      data
        .filter((name) => !cache.keys().includes(apiUrl(`gcal/p/${name}`)))
        .map((name) =>
          fetcher<Response>(apiUrl(`gcal/p/${name}`)).then((person) => {
            mutate(apiUrl(`gcal/p/${name}`), person, false);
          })
        )
    )
  );
};

const Home: React.FC = () => {
  useEffect(() => {
    prefetch()
      .then(() => console.log("Prefetched"))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <ErrorBoundary fallback={<h1>Error...</h1>}>
        <HomeData />
      </ErrorBoundary>
    </Suspense>
  );
};

export default Home;
