import { NextApiHandler } from "next";
import { getCalendars } from "../../../lib/lib";

const gcalIndex: NextApiHandler = async (req, res) => {
  try {
    const out = await getCalendars();
    if (out?.data.items) {
      res.json(
        out.data.items.map((item) => ({ name: item.summary, id: item.id }))
      );
    }
  } catch (err) {
    res.status(500).json({ err });
  }
};

export default gcalIndex;
