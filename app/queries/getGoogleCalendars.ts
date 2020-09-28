import { google } from "googleapis"
import { getClient } from "app/lib/gcal"
import { SessionContext } from "blitz"
import db from "db"

const getGoogleCalendars = async (input?: any, ctx: { session?: SessionContext } = {}) => {
  const userId = ctx.session?.userId as number

  const user = await db.user.findOne({ where: { id: userId } })

  if (!user?.googleToken) {
    return { ok: false }
  }

  const client = getClient()
  client.setCredentials(JSON.parse(user.googleToken))

  const calendar = google.calendar({ version: "v3", auth: client })
  const calendars = await calendar.calendarList.list()

  return { ok: true, data: calendars }
}

export default getGoogleCalendars
