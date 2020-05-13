import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";

import Table from "../components/Table";
import useSWR from "../util/useSWR";

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

const Home: React.FC = () => {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <HomeData />
    </Suspense>
  );
};

export default Home;
