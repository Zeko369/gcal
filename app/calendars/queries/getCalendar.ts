import { NotFoundError, SessionContext } from "blitz"
import db, { FindOneCalendarArgs } from "db"

type GetCalendarInput = {
  where: FindOneCalendarArgs["where"]
  // Only available if a model relationship exists
  // include?: FindOneCalendarArgs['include']
}

export default async function getCalendar(
  { where /* include */ }: GetCalendarInput,
  ctx: { session?: SessionContext } = {}
) {
  ctx.session!.authorize()

  const calendar = await db.calendar.findOne({ where })

  if (!calendar) throw new NotFoundError()

  return calendar
}
