import { Ctx } from "blitz"
import db from "db"

const getGroups = async (_ = undefined, ctx: Ctx) => {
  ctx.session.authorize()

  const groups = await db.group.findMany({
    orderBy: [{ default: "desc" }, { createdAt: "asc" }],
  })
  return groups
}

export default getGroups
