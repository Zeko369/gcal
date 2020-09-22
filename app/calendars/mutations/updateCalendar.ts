import { Ctx } from "app/ts"
import db, { CalendarUpdateArgs } from "db"

type UpdateCalendarInput = {
  where: CalendarUpdateArgs["where"]
  data: CalendarUpdateArgs["data"]
}
const updateCalendar = async ({ where, data }: UpdateCalendarInput, ctx: Ctx = {}) => {
  ctx.session!.authorize()

  const calendar = await db.calendar.update({ where, data })
  return calendar
}

export default updateCalendar
