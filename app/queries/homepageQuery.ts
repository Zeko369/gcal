import { Ctx } from "blitz"
import db from "db"

const homepageQuery = async ({ showArchived }: { showArchived: boolean }, ctx: Ctx) => {
  ctx.session.authorize()

  const groups = await db.group.findMany({
    orderBy: [{ default: "desc" }, { createdAt: "asc" }],
    include: {
      calendars: {
        where: {
          ...(!showArchived && { archivedAt: null }),
        },
      },
    },
  })
  return groups
}

export default homepageQuery
