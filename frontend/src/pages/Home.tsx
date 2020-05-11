import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../components/Table";

export interface Person {
  person: string;
  all: number;
  soFar: number;
}
type Data = Person[];

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Data>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/gcal")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
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
      )}
    </div>
  );
};

export default Home;
