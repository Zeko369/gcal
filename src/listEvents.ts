import { google } from "googleapis";

import { monday, endOfWeek } from "./helpers";
import calendars from "./calendars.json";

function listEvents(
  auth: any,
  person: string | undefined = undefined,
  withEvents: boolean = false
) {
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

        if (events) {
          const formatted = events.map((event, i) => {
            if (event.start?.date) {
              const start = new Date(event.start.date);
              const end = new Date(event.end?.date || "");
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

            const start = new Date(event.start?.dateTime || "");
            const end = new Date(event.end?.dateTime || "");
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
            all: Math.round((all / 60) * 100) / 100,
            soFar: Math.round((soFar / 60) * 100) / 100,
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

export default listEvents;
