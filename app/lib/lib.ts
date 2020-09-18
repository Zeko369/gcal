import { google } from "googleapis";

import listEvents from "./listEvents";
import { authenticatedWrapper } from "./gcal";

export const getAll = async () => {
  return authenticatedWrapper(listEvents)();
};

export const getPerson = (person?: string, withEvents?: boolean) => {
  return authenticatedWrapper((auth) => listEvents(auth, person, withEvents))();
};

export const getCalendars = async () => {
  return authenticatedWrapper((auth) => {
    const calendar = google.calendar({ version: "v3", auth });
    return calendar.calendarList.list();
  })();
};
