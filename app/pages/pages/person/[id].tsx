import React, { Suspense } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";

import { Person } from "../index";
import Table from "../../components/Table";

export interface Response extends Person {
  formatted: {
    allDay: boolean;
    summary: string;
    time: number;
    start: string;
    planned: boolean;
  }[];
}

const PersonData: React.FC<{ name: string }> = ({ name }) => {
  const { data } = useSWR<Response>(`/api/gcal/p/${name}`);

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
            data.formatted.map((item, index) => (
              <tr key={`${index}-item.summary`}>
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

const wrap = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] : param;

const PersonShow: React.FC = () => {
  const router = useRouter();
  const name = wrap(router.query.id);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div>
      <Link href="/">Home</Link>
      {name ? (
        <Suspense fallback={<h1>Loading...</h1>}>
          <PersonData name={name} />
        </Suspense>
      ) : (
        <h1>Name missing</h1>
      )}
    </div>
  );
};

export default PersonShow;
