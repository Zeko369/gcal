import db, { CalendarCreateArgs } from "db"
import { Ctx } from "blitz"

type CreateCalendarInput = {
  data: Omit<CalendarCreateArgs["data"], "user" | "group">
  groupId?: number
}
const createCalendar = async ({ data, groupId }: CreateCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()

  let group = await db.group.findFirst({ where: { OR: [{ default: true }, { id: groupId }] } })
  if (!group) {
    group = await db.group.create({
      data: {
        user: { connect: { id: ctx.session!.userId } },
        name: "_default",
        default: true,
      },
    })
  }

  // todo migrate to create or connect
  return await db.calendar.create({
    data: {
      ...data,
      user: { connect: { id: ctx.session!.userId } },
      group: { connect: { id: group.id } },
    },
  })
}

export default createCalendar
