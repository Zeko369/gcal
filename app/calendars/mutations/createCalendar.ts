import { Ctx } from "app/ts"
import db, { CalendarCreateArgs } from "db"

type CreateCalendarInput = {
  data: CalendarCreateArgs["data"]
}
const createCalendar = async ({ data }: CreateCalendarInput, ctx: Ctx = {}) => {
  ctx.session!.authorize()

  const calendar = await db.calendar.create({ data })
  return calendar
}

export default createCalendar
