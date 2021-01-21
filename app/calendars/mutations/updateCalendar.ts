import db, { CalendarUpdateArgs } from "db"
import { Ctx } from "blitz"

type UpdateCalendarInput = {
  where: CalendarUpdateArgs["where"]
  data: CalendarUpdateArgs["data"] & { groupId?: number }
}
const updateCalendar = async ({ where, data }: UpdateCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()
  const { groupId, ...rest } = data

  return await db.calendar.update({ where, data: { ...rest, group: { connect: { id: groupId } } } })
}

export default updateCalendar
