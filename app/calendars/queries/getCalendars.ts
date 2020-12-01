import db, { FindManyCalendarArgs } from "db"
import { Ctx } from "@blitzjs/core"

type GetCalendarsInput = {
  where?: FindManyCalendarArgs["where"]
  orderBy?: FindManyCalendarArgs["orderBy"]
  skip?: FindManyCalendarArgs["skip"]
  take?: FindManyCalendarArgs["take"]
}

const getCalendars = async (input: GetCalendarsInput, ctx: Ctx) => {
  ctx.session.authorize()

  const { where, orderBy, skip = 0, take } = input
  const calendars = await db.calendar.findMany({
    where: { ...where, userId: { equals: ctx.session!.userId } },
    orderBy: [...(Array.isArray(orderBy) ? orderBy : orderBy ? [orderBy] : []), { id: "asc" }],
    take,
    skip,
  })

  const count = await db.calendar.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return { calendars, nextPage, hasMore }
}

export default getCalendars
