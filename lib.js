// @ts-check

const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const { promisify } = require("util");
const calendars = require("./calendars.json");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

const getAll = async () => {
  try {
    const content = await fs.promises.readFile("credentials.json", "utf-8");

    const { client_secret, client_id, redirect_uris } = JSON.parse(
      content
    ).installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    try {
      const token = await fs.promises.readFile(TOKEN_PATH, "utf-8");
      oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
      await getAccessToken(oAuth2Client);
    }

    return listEvents(oAuth2Client);
  } catch (err) {
    console.log(err);
  }
};

const getPerson = async (person, withEvents) => {
  try {
    const content = await fs.promises.readFile("credentials.json", "utf-8");

    const { client_secret, client_id, redirect_uris } = JSON.parse(
      content
    ).installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    try {
      const token = await fs.promises.readFile(TOKEN_PATH, "utf-8");
      oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
      await getAccessToken(oAuth2Client);
    }

    return listEvents(oAuth2Client, person, withEvents);
  } catch (err) {
    console.log(err);
  }
};

const getCalendars = async () => {
  try {
    const content = await fs.promises.readFile("credentials.json", "utf-8");

    const { client_secret, client_id, redirect_uris } = JSON.parse(
      content
    ).installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    try {
      const token = await fs.promises.readFile(TOKEN_PATH, "utf-8");
      oAuth2Client.setCredentials(JSON.parse(token));
    } catch (err) {
      await getAccessToken(oAuth2Client);
    }

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    return calendar.calendarList.list();
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getAll,
  getPerson,
  people: Object.keys(calendars),
  getCalendars,
};

async function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await promisify(rl.question)(
    "Enter the code from that page here: "
  );

  rl.close();

  try {
    const token = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(token);

    await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log("Token stored to", TOKEN_PATH);
  } catch (err) {
    console.error("Error retrieving access token", err);
  }
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

const monday = (date = new Date()) => {
  let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  return new Date(
    date.setDate(diff) - (date.getTime() % (1000 * 60 * 60 * 24))
  );
};

const endOfWeek = (date = new Date()) => {
  return new Date(monday(date).getTime() + 1000 * 60 * 60 * 24 * 7);
};

const formatTime = (time) => {
  let out = "";

  if (time > 60 * 24) {
    const val = Math.floor((time / 60 / 24) % 365);
    out += ` ${val} day${val !== 1 ? "s" : ""}`;
  }

  if (time > 60) {
    const val = Math.floor((time / 60) % 24);
    out += ` ${val} hour${val !== 1 ? "s" : ""}`;
  }

  const val = Math.floor(time % 60);
  out += ` ${val} minute${val !== 1 ? "s" : ""}`;

  return out;
};

function listEvents(auth, person = undefined, withEvents = false) {
  const calendar = google.calendar({ version: "v3", auth });

  return Promise.all(
    Object.entries(calendars)
      .filter(([p]) => {
        if (person) {
          return p === person;
        }

        return true;
      })
      .map(async ([person, cid]) => {
        const res = await calendar.events.list({
          calendarId: cid,
          timeMin: monday().toISOString(),
          timeMax: endOfWeek().toISOString(),
          maxResults: 100,
          singleEvents: true,
          orderBy: "startTime",
        });
        const events = res.data.items;

        if (events.length) {
          const formatted = events.map((event, i) => {
            if (event.start.date) {
              const start = new Date(event.start.date);
              const end = new Date(event.end.date);
              const time = (end.getTime() - start.getTime()) / 1000 / 60;
              const days = time / 60 / 24;

              return {
                allDay: true,
                summary: event.summary,
                days,
                time,
                event,
                start,
                planned: start.getTime() > Date.now(),
              };
            }

            const start = new Date(event.start.dateTime);
            const end = new Date(event.end.dateTime);
            const time = (end.getTime() - start.getTime()) / 1000 / 60;

            return {
              allDay: false,
              summary: event.summary,
              days: undefined,
              time,
              event,
              start,
              planned: start.getTime() > Date.now(),
            };
          });

          const all = formatted
            .filter((item) => !item.allDay)
            .reduce((prev, curr) => prev + curr.time, 0);

          const soFar = formatted
            .filter((item) => !item.allDay)
            .filter((item) => !item.planned)
            .reduce((prev, curr) => prev + curr.time, 0);

          // formatted.forEach((item) => {
          //   console.log(item.summary, formatTime(item.time));
          // });

          // console.log(formatTime(all));
          return {
            person,
            all: all / 60,
            soFar: soFar / 60,
            ...(withEvents
              ? {
                  formatted: formatted.map((item) => ({
                    ...item,
                    event: undefined,
                  })),
                }
              : {}),
          };
        } else {
          return {
            person,
            all: 0,
            soFar: 0,
            ...(withEvents ? { formatted: [] } : {}),
          };
        }
      })
  );
}
