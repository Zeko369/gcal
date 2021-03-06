import { google } from "googleapis"
import { Ctx } from "blitz"
import { startOfMonth, endOfMonth } from "date-fns"
import db from "db"
import { getClient } from "app/lib/gcal"

interface GetEventsInput {
  calendarId: string
  timeMin?: Date
  timeMax?: Date
}

const getGoogleCalendarEvents = async (input: GetEventsInput, ctx: Ctx) => {
  const userId = ctx.session?.userId as number

  const user = await db.user.findOne({ where: { id: userId } })

  if (!user?.googleToken) {
    return { ok: false }
  }

  const { calendarId, timeMin, timeMax } = input

  const client = getClient()
  client.setCredentials(JSON.parse(user.googleToken))

  const timeMinFull = timeMin || startOfMonth(new Date())
  const timeMaxFull = timeMax || endOfMonth(new Date())

  const calendar = google.calendar({ version: "v3", auth: client })
  const events = await calendar.events.list({
    calendarId,
    maxResults: 1000,
    timeMin: timeMinFull.toISOString(),
    timeMax: timeMaxFull.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  })

  const formatted =
    events.data.items
      ?.filter((event) => {
        if (event.attendees) {
          if (
            event.attendees.find(
              (attendee) => attendee.self && attendee.responseStatus !== "accepted"
            )
          ) {
            return false
          }
        }

        return true
      })
      .filter((event) => {
        if (event.start?.dateTime) {
          const start = new Date(event.start?.dateTime || "")
          if (start) {
            return start.getTime() > timeMinFull.getTime()
          }
        }

        return false
      })
      .map((event, i) => {
        if (event.start?.date) {
          const start = new Date(event.start.date)
          const end = new Date(event.end?.date || "")
          const time = (end.getTime() - start.getTime()) / 1000 / 60
          const days = time / 60 / 24

          return {
            allDay: true,
            summary: event.summary,
            days,
            time,
            event,
            start,
            planned: start.getTime() > Date.now(),
          }
        }

        const start = new Date(event.start?.dateTime || "")
        const end = new Date(event.end?.dateTime || "")
        const time = (end.getTime() - start.getTime()) / 1000 / 60

        return {
          allDay: false,
          summary: event.summary,
          days: undefined,
          time,
          event,
          start,
          planned: start.getTime() > Date.now(),
        }
      }) || []

  const all = formatted.filter((item) => !item.allDay).reduce((prev, curr) => prev + curr.time, 0)

  const soFar = formatted
    .filter((item) => !item.allDay)
    .filter((item) => !item.planned)
    .reduce((prev, curr) => prev + curr.time, 0)

  return { ok: true, data: { formatted, all, soFar } }
}

export default getGoogleCalendarEvents
