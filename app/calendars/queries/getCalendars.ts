import { Ctx } from "app/ts"
import db, { FindManyCalendarArgs } from "db"

type GetCalendarsInput = {
  where?: FindManyCalendarArgs["where"]
  orderBy?: FindManyCalendarArgs["orderBy"]
  skip?: FindManyCalendarArgs["skip"]
  take?: FindManyCalendarArgs["take"]
}

const getCalendars = async (input: GetCalendarsInput, ctx: Ctx = {}) => {
  ctx.session!.authorize()

  const { where, orderBy, skip = 0, take } = input
  const calendars = await db.calendar.findMany({
    where: { ...where, userId: { equals: ctx.session!.userId } },
    orderBy,
    take,
    skip,
  })

  const count = await db.calendar.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return { calendars, nextPage, hasMore }
}

export default getCalendars
