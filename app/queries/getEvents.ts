import { google } from "googleapis"
import { SessionContext } from "blitz"
import { getClient } from "app/lib/gcal"
import { beginning, end } from "app/lib/time"
import db from "db"

interface GetEventsInput {
  calendarId: string
  timeMin?: Date
  timeMax?: Date
}

const getEvents = async (input: GetEventsInput, ctx: { session?: SessionContext } = {}) => {
  const userId = ctx.session?.userId as number

  const user = await db.user.findOne({ where: { id: userId } })

  if (!user?.googleToken) {
    return { ok: false }
  }

  const { calendarId, timeMin, timeMax } = input

  const client = getClient()
  client.setCredentials(JSON.parse(user.googleToken))

  const calendar = google.calendar({ version: "v3", auth: client })
  const events = await calendar.events.list({
    calendarId,
    maxResults: 1000,
    timeMin: (timeMin || beginning.month()).toISOString(),
    timeMax: (timeMax || end.month()).toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  })

  const formatted =
    events.data.items?.map((event, i) => {
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

export default getEvents
