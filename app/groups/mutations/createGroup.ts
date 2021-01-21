import db, { GroupCreateInput } from "db"
import { Ctx } from "blitz"

type CreateGroupInput = {
  data: Omit<GroupCreateInput, "user">
}
const createGroup = async ({ data }: CreateGroupInput, ctx: Ctx) => {
  ctx.session.authorize()

  let group = await db.group.findFirst({ where: { default: true } })

  return await db.group.create({
    data: {
      ...data,
      default: !group,
      user: { connect: { id: ctx.session!.userId } },
    },
  })
}

export default createGroup
