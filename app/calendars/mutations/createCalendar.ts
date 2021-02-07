import db, { CalendarCreateArgs } from "db"
import { Ctx } from "blitz"

type CreateCalendarInput = {
  data: Omit<CalendarCreateArgs["data"], "user" | "group">
  groupId?: number
}
const createCalendar = async ({ data, groupId }: CreateCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()

  // get by id
  let group = await db.group.findOne({ where: { id: groupId } })

  // if not found get default
  if (!group) group = await db.group.findFirst({ where: { default: true } })

  // if no default create one
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
