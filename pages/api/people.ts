import { NextApiHandler } from "next";
import { people } from "../../lib/people";

const getPeople: NextApiHandler = async (req, res) => {
  res.json(people);
};

export default getPeople;
