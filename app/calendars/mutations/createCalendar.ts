import { SessionContext } from "blitz"
import db, { CalendarCreateArgs } from "db"

type CreateCalendarInput = {
  data: CalendarCreateArgs["data"]
}
export default async function createCalendar(
  { data }: CreateCalendarInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const calendar = await db.calendar.create({ data })

  return calendar
}
