import db, { CalendarUpdateArgs } from "db"
import { Ctx, NotFoundError } from "blitz"

type ArchiveCalendarInput = {
  where: CalendarUpdateArgs["where"]
}
const archiveCalendar = async ({ where }: ArchiveCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()

  const calendar = await db.calendar.findOne({ where })
  if (!calendar) {
    throw new NotFoundError()
  }

  return db.calendar.update({
    where,
    data: { archivedAt: calendar.archivedAt ? null : new Date() },
  })
}

export default archiveCalendar
