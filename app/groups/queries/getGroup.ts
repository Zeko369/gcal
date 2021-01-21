import { Ctx } from "blitz"
import { NotFoundError } from "blitz"
import db, { FindOneGroupArgs } from "db"

type GetGroupInput = {
  where: FindOneGroupArgs["where"]
}

const getGroup = async ({ where }: GetGroupInput, ctx: Ctx) => {
  ctx.session.authorize()

  const group = await db.group.findOne({ where })

  if (!group) throw new NotFoundError()

  return group
}

export default getGroup
