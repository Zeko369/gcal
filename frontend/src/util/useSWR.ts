import swr, { responseInterface } from "swr";

export const fetcher = async function <JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  return res.json();
};

const useSWR = <Data, Error = any>(url: string): responseInterface<Data, Error> => {
  return swr<Data>(url, fetcher, { suspense: true });
};

export default useSWR;
