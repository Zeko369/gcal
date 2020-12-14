import db, { CalendarCreateArgs } from "db"
import { Ctx } from "blitz"

type CreateCalendarInput = {
  data: Omit<CalendarCreateArgs["data"], "user">
}
const createCalendar = async ({ data }: CreateCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()

  return await db.calendar.create({
    data: { ...data, user: { connect: { id: ctx.session!.userId } } },
  })
}

export default createCalendar
