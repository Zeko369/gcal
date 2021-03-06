import { Ctx } from "blitz"
import db from "db"

const homepageQuery = async ({ showArchived }: { showArchived: boolean }, ctx: Ctx) => {
  ctx.session.authorize()

  const groups = await db.group.findMany({
    orderBy: [{ default: "desc" }, { createdAt: "asc" }],
    include: {
      calendars: {
        orderBy: { id: "asc" },
        where: {
          ...(!showArchived && { archivedAt: null }),
        },
      },
    },
    where: {
      userId: ctx.session.userId,
    },
  })
  return groups
}

export default homepageQuery
