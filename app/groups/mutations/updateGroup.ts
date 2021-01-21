import db, { GroupUpdateInput } from "db"
import { Ctx } from "blitz"

type UpdateGroupInput = {
  id: number
  data: Omit<GroupUpdateInput, "user">
}
const updateGroup = async ({ id, data }: UpdateGroupInput, ctx: Ctx) => {
  ctx.session.authorize()

  return await db.group.update({ where: { id }, data })
}

export default updateGroup
