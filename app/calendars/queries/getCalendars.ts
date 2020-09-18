import { SessionContext } from "blitz"
import db, { FindManyCalendarArgs } from "db"

type GetCalendarsInput = {
  where?: FindManyCalendarArgs["where"]
  orderBy?: FindManyCalendarArgs["orderBy"]
  skip?: FindManyCalendarArgs["skip"]
  take?: FindManyCalendarArgs["take"]
  // Only available if a model relationship exists
  // include?: FindManyCalendarArgs['include']
}

export default async function getCalendars(
  { where, orderBy, skip = 0, take }: GetCalendarsInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const calendars = await db.calendar.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.calendar.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    calendars,
    nextPage,
    hasMore,
  }
}
