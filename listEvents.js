// @ts-check

const { google } = require("googleapis");

const { monday, endOfWeek } = require("./helpers");
const calendars = require("./calendars.json");

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {any} auth An authorized OAuth2 client.
 * @param {string | undefined} person
 * @param {boolean} withEvents
 */
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

module.exports = listEvents;
