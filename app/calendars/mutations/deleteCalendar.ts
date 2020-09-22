import { Ctx } from "app/ts"
import db, { CalendarDeleteArgs } from "db"

type DeleteCalendarInput = {
  where: CalendarDeleteArgs["where"]
}
const deleteCalendar = async ({ where }: DeleteCalendarInput, ctx: Ctx = {}) => {
  ctx.session!.authorize()

  const calendar = await db.calendar.delete({ where })
  return calendar
}

export default deleteCalendar
