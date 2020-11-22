import db from "db"
import { Ctx } from "@blitzjs/core"

interface ReorderArguments {
  id: number
  order: number
}

const update = (id: number, order: number) =>
  db.calendar.update({
    where: { id },
    data: {
      order: {
        set: order,
      },
    },
  })

const reorderCalendar = async (args: ReorderArguments, ctx: Ctx) => {
  const { id, order } = args
  let tmpOrder = order

  ctx.session.authorize()

  const calendars = await db.calendar.findMany()
  const orderExists = (orderId) => calendars.find((cal) => cal.order === orderId)

  if (!orderExists(order)) {
    return await update(id, order)
  }

  do {
    await db.calendar.update({
      where: { id: orderExists(tmpOrder)!.id },
      data: {
        order: {
          set: tmpOrder + 1,
        },
      },
    })
  } while (orderExists(++tmpOrder))

  return await update(id, order)
}

export default reorderCalendar
