import React, { useState, useEffect, Suspense } from "react";
import { Link, useParams } from "react-router-dom";

import { Person } from "../Home";
import Table from "../../components/Table";
import useSWR from "../../util/useSWR";

interface Response extends Person {
  formatted: { allDay: boolean; summary: string; time: number; start: string; planned: boolean }[];
}

const PersonData: React.FC<{ name: string }> = ({ name }) => {
  const { data } = useSWR<Response>(`http://localhost:5000/api/gcal/p/${name}`);

  return (
    <>
      <h1>{name}</h1>
      <Table>
        <thead>
          <tr>
            <th>
              <i className="material-icons">check</i>
            </th>
            <th>Summary</th>
            <th>Time</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {data && data?.formatted.length > 0 ? (
            data.formatted.map((item) => (
              <tr>
                <td>
                  <i className="material-icons">{`check_box${
                    item.planned ? "_outline_blank" : ""
                  }`}</i>
                </td>
                <td>{item.summary}</td>
                <td>{item.time / 60}h</td>
                <td>{new Date(item.start).toUTCString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td></td>
              <td>
                <h2>No data :(</h2>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

const PersonShow: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <div>
      <Link to="/">Home</Link>
      <Suspense fallback={<h1>Loading...</h1>}>
        <PersonData name={name} />
      </Suspense>
    </div>
  );
};

export default PersonShow;
