import { NextApiHandler } from "next";
import { getAll } from "../../../lib/lib";

const gcalIndex: NextApiHandler = async (req, res) => {
  try {
    const data = await getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ err });
  }
};

export default gcalIndex;
