import { Ctx } from "blitz"
import { NotFoundError } from "blitz"
import db, { FindOneCalendarArgs } from "db"

type GetCalendarInput = {
  where: FindOneCalendarArgs["where"]
}

const getCalendar = async ({ where }: GetCalendarInput, ctx: Ctx) => {
  ctx.session.authorize()

  const calendar = await db.calendar.findOne({ where })

  if (!calendar) throw new NotFoundError()

  return calendar
}

export default getCalendar
