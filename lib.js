const { google } = require("googleapis");

const { authenticatedWrapper } = require("./gcal");
const listEvents = require("./listEvents");

const getAll = async () => {
  return authenticatedWrapper(listEvents)();
};

/**
 * @param {string | undefined} person
 * @param {boolean | undefined} withEvents
 */
const getPerson = (person, withEvents) => {
  return authenticatedWrapper((auth) => listEvents(auth, person, withEvents))();
};

const getCalendars = async () => {
  return authenticatedWrapper((auth) => {
    const calendar = google.calendar({ version: "v3", auth });
    return calendar.calendarList.list();
  })();
};

module.exports = {
  getAll,
  getPerson,
  getCalendars,
};
