import { google } from "googleapis"
import { getClient } from "app/lib/new/gcal"
import { SessionContext } from "blitz"
import db from "db"
import { endOfWeek, monday } from "app/lib/helpers"

const getEvents = async (
  { calendarId }: { calendarId: string },
  ctx: { session?: SessionContext } = {}
) => {
  const userId = ctx.session?.userId as number

  const user = await db.user.findOne({ where: { id: userId } })

  if (!user?.googleToken) {
    return { ok: false }
  }

  const client = getClient()
  client.setCredentials(JSON.parse(user.googleToken))

  const calendar = google.calendar({ version: "v3", auth: client })
  const events = await calendar.events.list({
    calendarId,
    maxResults: 100,
    timeMin: monday().toISOString(),
    timeMax: endOfWeek().toISOString(),
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