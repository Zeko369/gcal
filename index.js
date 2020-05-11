// @ts-check

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { getAll, getPerson, people } = require("./lib");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.get("/api/gcal", (req, res) => {
  getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(500).json({ err }));
});

app.get("/api/gcal/:person", (req, res) => {
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

app.get("/api/people", (req, res) => {
  res.json(people);
});

app.listen(5000, () => {
  console.log("Started on http://localhost:5000");
});
