import React, { useEffect, Suspense, useState } from "react";
import useSWR, { mutate, cache } from "swr";
import { NextPage } from "next";
import Link from "next/link";

import Table from "../components/Table";
import fetcher from "../util/fetch";
import { Response } from "./person/[id]";
import ErrorBoundary from "../components/ErrorBoundary";

enum SortEnum {
  doneAsc,
  doneDesc,
  allAsc,
  allDesc,
}

export interface Person {
  person: string;
  all: number;
  soFar: number;
}
type Data = Person[];

const sortFunction = (sort?: SortEnum | undefined) => (
  a: Person,
  b: Person
) => {
  if (sort === undefined) {
    return 0;
  }

  if (sort === SortEnum.allAsc || sort === SortEnum.allDesc) {
    return (a.all > b.all ? 1 : -1) * (sort === SortEnum.allAsc ? 1 : -1);
  }

  return (a.soFar > b.soFar ? 1 : -1) * (sort === SortEnum.doneAsc ? 1 : -1);
};

const HomeData: React.FC<{ onlyMe: boolean; sort?: SortEnum }> = ({
  onlyMe,
  sort,
}) => {
  const { data } = useSWR<Data>("/api/gcal");

  const rows = (data || [])
    .filter((row) => row.person.startsWith(onlyMe ? "me" : ""))
    .sort(sortFunction(sort));

  console.log(sort, rows, SortEnum.allAsc, sort === SortEnum.allAsc);

  return rows.length > 0 ? (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Done</th>
          <th>Week</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((item) => (
          <tr key={item.person}>
            <td>
              <Link href="/person/[id]" as={`/person/${item.person}`}>
                {item.person}
              </Link>
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

const prefetch = async (): Promise<void[]> => {
  const data = await fetcher<string[]>("/api/people");
  return await Promise.all(
    data
      .filter((name) => !cache.keys().includes(`/api/gcal/p/${name}`))
      .map((name_1) =>
        fetcher<Response>(`/api/gcal/p/${name_1}`).then((person) => {
          mutate(`/api/gcal/p/${name_1}`, person, false);
        })
      )
  );
};

const Home: NextPage = () => {
  const [onlyMe, setOnlyMe] = useState(true);
  const [sort, setSort] = useState<number | undefined>(SortEnum.allDesc);

  useEffect(() => {
    prefetch()
      .then(() => console.log("Prefetched"))
      .catch((err) => console.error(err));
  }, []);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <nav>
        <h1>Calendar app</h1>
      </nav>
      <main>
        <button
          style={{ fontSize: `1em` }}
          onClick={() => setOnlyMe((v) => !v)}
        >
          {onlyMe ? "Me" : "All"}
        </button>
        <select
          onChange={(e) => setSort(parseInt(e.target.value) as any)}
          value={sort}
        >
          <option value={undefined}></option>
          {Object.keys(SortEnum)
            .filter((a) => Number.isNaN(parseInt(a)))
            .map((a) => SortEnum[a as any] as any)
            .map((a) => (
              <option value={a}>{SortEnum[a]}</option>
            ))}
        </select>
        <ErrorBoundary fallback={<h1>Error...</h1>}>
          <HomeData onlyMe={onlyMe} sort={sort} />
        </ErrorBoundary>
      </main>
    </Suspense>
  );
};

export default Home;
