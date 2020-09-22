import { Ctx } from "app/ts"
import db, { CalendarCreateArgs } from "db"

type CreateCalendarInput = {
  data: Omit<CalendarCreateArgs["data"], "user">
}
const createCalendar = async ({ data }: CreateCalendarInput, ctx: Ctx = {}) => {
  ctx.session!.authorize()

  const calendar = await db.calendar.create({
    data: { ...data, user: { connect: { id: ctx.session!.userId } } },
  })
  return calendar
}

export default createCalendar
