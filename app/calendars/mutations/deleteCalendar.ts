import db, { CalendarDeleteArgs } from "db"
import { Ctx } from "blitz"

type DeleteCalendarInput = {
  where: CalendarDeleteArgs["where"]
}
const deleteCalendar = async ({ where }: DeleteCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()

  return await db.calendar.delete({ where })
}

export default deleteCalendar
