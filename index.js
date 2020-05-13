const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { getAll, getPerson, getCalendars } = require("./lib");
const calendars = require("./calendars.json");

const people = Object.keys(calendars);

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.get("/api/gcal", (_req, res) => {
  getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(500).json({ err }));
});

app.get("/api/gcal/list", (_req, res) => {
  getCalendars()
    .then((out) => {
      /**
       * @param {{ summary: any; id: any; }} item
       */
      res.json(
        out.data.items.map((item) => ({ name: item.summary, id: item.id }))
      );
    })
    .catch((err) => {
      res.status(500).json({ err });
    });
});

app.get("/api/gcal/p/:person", (req, res) => {
  const { person } = req.params;
  if (people.includes(person)) {
    return getPerson(person, true)
      .then((data) => {
        if (data.length !== 1) {
          return res.status(500).json({ err: "Error" });
        }

        res.json(data[0]);
      })
      .catch((err) => res.status(500).json({ err }));
  }

  res.status(404).json({ err: "no such person" });
});

app.get("/api/people", (_req, res) => {
  res.json(people);
});

app.listen(5000, () => {
  console.log("Started on http://localhost:5000");
});
