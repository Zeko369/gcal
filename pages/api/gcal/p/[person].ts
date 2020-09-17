import { NextApiHandler } from "next";
import { getPerson } from "../../../../lib/lib";
import { people } from "../../../../lib/people";

const getPersonApi: NextApiHandler = async (req, res) => {
  let { person } = req.query;

  if (!person) {
    return res.status(400).json({ err: "person missing" });
  }

  if (Array.isArray(person)) {
    person = person[0];
  }

  try {
    if (people.includes(person)) {
      const data = await getPerson(person, true);
      if (!data) {
        return res.status(404).json({});
      }

      if (data.length !== 1) {
        return res.status(500).json({ err: "Error" });
      }

      return res.json(data[0]);
    }

    res.status(404).json({ err: "no such person" });
  } catch (err) {
    res.status(500).json({ err });
  }
};

export default getPersonApi;
