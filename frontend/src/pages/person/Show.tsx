import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { Person } from "../Home";
import Table from "../../components/Table";

interface Response extends Person {
  formatted: { allDay: boolean; summary: string; time: number; start: string; planned: boolean }[];
}

const PersonShow: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Response>();

  useEffect(() => {
    fetch(`http://localhost:5000/api/gcal/p/${name}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Link to="/">Home</Link>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
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
      )}
    </div>
  );
};

export default PersonShow;
