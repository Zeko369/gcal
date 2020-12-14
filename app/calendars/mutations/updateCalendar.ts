import db, { CalendarUpdateArgs } from "db"
import { Ctx } from "blitz"

type UpdateCalendarInput = {
  where: CalendarUpdateArgs["where"]
  data: CalendarUpdateArgs["data"]
}
const updateCalendar = async ({ where, data }: UpdateCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()

  return await db.calendar.update({ where, data })
}

export default updateCalendar
