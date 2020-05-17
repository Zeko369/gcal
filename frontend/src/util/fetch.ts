export const fetcher = async function <JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);
  // throw new Error(`Error fetching ${input}`);
  if (!res.ok) {
  }
  return res.json();
};

export default fetcher;
